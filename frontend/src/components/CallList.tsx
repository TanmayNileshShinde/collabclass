import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import Loader from "./Loader";
import { useGetCalls } from "@/hooks/useGetCalls";
import MeetingCard from "./MeetingCard";
import { useToast } from "./ui/use-toast";
import AttendanceModal from "./AttendanceModal";

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getToken } = useAuth();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [attendanceModal, setAttendanceModal] = useState<{
    isOpen: boolean;
    meetingId: string;
    meetingTitle: string;
  }>({
    isOpen: false,
    meetingId: '',
    meetingTitle: ''
  });

  const handleViewAttendance = (meetingId: string, meetingTitle: string) => {
    setAttendanceModal({
      isOpen: true,
      meetingId,
      meetingTitle
    });
  };

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "upcoming":
        return "No Upcoming Calls";
      case "recordings":
        return "No Recordings";
      default:
        return "";
    }
  };

  const handleDeleteRecording = async (recording: CallRecording) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this recording? This action cannot be undone.",
      );
      if (!confirmed) return;

      const recordingId = recording.filename || recording.url;
      console.log("Attempting to delete recording:", recordingId);

      const token = await getToken();
      console.log("Token obtained:", token ? "Yes" : "No");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `/api/stream/recordings/${encodeURIComponent(recordingId)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log("Error data:", errorData);
        throw new Error(errorData.error || "Failed to delete recording");
      }

      setRecordings((prev) =>
        prev.filter(
          (r) => r.filename !== recording.filename && r.url !== recording.url,
        ),
      );

      toast({
        title: "Recording deleted successfully",
        description: "The recording has been permanently deleted.",
      });
    } catch (error) {
      console.error("Error deleting recording:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete recording. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
      );

      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(recordings);
    };

    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();
  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;

  return (
    <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">      {calls && calls.length > 0 ? (
      calls.map((meeting: Call | CallRecording) => (
        <MeetingCard
          key={
            (meeting as Call).id ||
            (meeting as CallRecording).filename ||
            (meeting as CallRecording).url
          }
          icon={
            type === "ended"
              ? "/icons/previous.svg"
              : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
          }
          title={
            (meeting as Call).state?.custom?.description ||
            (meeting as CallRecording).filename?.substring(0, 20) ||
            "No Description"
          }
          date={
            (meeting as Call).state?.startsAt?.toLocaleString() ||
            (meeting as CallRecording).start_time?.toLocaleString()
          }
          isPreviousMeeting={type === "ended"}
          link={
            type === "recordings"
              ? (meeting as CallRecording).url
              : `${baseUrl}/meeting/${(meeting as Call).id}`
          }
          buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
          buttonText={type === "recordings" ? "Play" : "Start"}
          handleClick={
            type === "recordings"
              ? () => window.open((meeting as CallRecording).url, "_blank")
              : () => navigate(`/meeting/${(meeting as Call).id}`)
          }
          showDeleteButton={type === "recordings"}
          showAttendees={type !== "recordings"}
          meetingId={(meeting as Call)?.id}
          onViewAttendance={type === "ended" ? handleViewAttendance : undefined}
          onDelete={() =>
            type === "recordings" ? handleDeleteRecording(meeting as CallRecording) : undefined
          }
        />
      ))
    ) : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
      )}
      
      {/* Attendance Modal */}
      {type === "ended" && (
        <AttendanceModal
          isOpen={attendanceModal.isOpen}
          onClose={() => setAttendanceModal(prev => ({ ...prev, isOpen: false }))}
          meetingId={attendanceModal.meetingId}
          meetingTitle={attendanceModal.meetingTitle}
        />
      )}
    </div>
  );
}
export default CallList;
