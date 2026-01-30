import { useState } from "react";
import { useNavigate } from "react-router-dom";

import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/clerk-react";
import Loader from "./Loader";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { useToast } from "./ui/use-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { generateMeetingCode } from "@/lib/meetingUtils";
import "react-datepicker/dist/react-datepicker.css";

const initialValues = {
  dateTime: new Date(),
  description: "",
  heading: "",
  subheading: "",
  link: "",
  meetingCode: "",
};

const MeetingTypeList = () => {
  const navigate = useNavigate();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();

  const resetForm = () => {
    setValues(initialValues);
    setMeetingState(undefined);
  };

  const joinMeetingByCode = async (code: string) => {
    if (!client) return;

    try {
      const normalizedCode = code.replace(/[^A-Z0-9]/gi, "").toUpperCase();

      if (normalizedCode.length !== 8) {
        toast({
          title: "Invalid meeting code",
          description: "Meeting code must be 8 characters",
        });
        return;
      }

      // Query Stream.io for calls with matching meeting code
      const { calls } = await client.queryCalls({
        filter_conditions: {
          "custom.meetingCode": normalizedCode,
        },
        limit: 1,
      });

      if (calls.length === 0) {
        toast({
          title: "Meeting not found",
          description: "No meeting found with this code",
        });
        return;
      }

      const call = calls[0];

      // Check if meeting has ended
      if (call.state.endedAt) {
        toast({
          title: "Meeting has ended",
          description: "This meeting has already ended",
        });
        return;
      }

      // Navigate to the meeting
      navigate(`/meeting/${call.id}`);
      toast({
        title: "Joining meeting...",
      });
    } catch (error) {
      console.error("Error joining meeting by code:", error);
      toast({
        title: "Failed to join meeting",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const createMeeting = async () => {
    if (!client || !user) return;

    const isInstantMeeting = meetingState === "isInstantMeeting";
    const isScheduledMeeting = meetingState === "isScheduleMeeting";

    try {
      // For scheduled meetings, validate date and time
      if (
        isScheduledMeeting &&
        (!values.dateTime || !values.dateTime.getTime)
      ) {
        toast({
          title: "Please select a date and time",
        });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) {
        throw new Error("Failed to create call object");
      }

      // Use current time for instant meetings, selected time for scheduled meetings
      const startsAt = isInstantMeeting
        ? new Date().toISOString()
        : values.dateTime.toISOString();

      const description =
        values.description ||
        (isInstantMeeting ? "Instant Meeting" : "Scheduled Meeting");

      const heading =
        values.heading ||
        (isInstantMeeting ? "Instant Meeting" : "Scheduled Meeting");
      const subheading = values.subheading || "";

      // Generate unique 8-character meeting code
      const meetingCode = generateMeetingCode();

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
            heading,
            subheading,
            meetingCode,
          },
        },
      });

      // For instant meetings, navigate immediately
      if (isInstantMeeting) {
        navigate(`/meeting/${call.id}`);
        toast({
          title: "Meeting Created",
        });
        return;
      }

      // For scheduled meetings, show success modal with link to copy
      if (isScheduledMeeting) {
        setCallDetail(call);
        toast({
          title: "Meeting Created",
        });
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create meeting";
      toast({
        title: "Failed to create Meeting",
        description: errorMessage,
      });
    }
  };

  if (!client || !user) return <Loader />;

  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
  const meetingLink = `${baseUrl}/meeting/${callDetail?.id}`;
  const meetingCode = callDetail?.state.custom?.meetingCode || "";

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        className="from-gray-400 to-gray-700"
        handleClick={() => setMeetingState("isInstantMeeting")}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="by code or link"
        className="from-gray-300 to-gray-500"
        handleClick={() => setMeetingState("isJoiningMeeting")}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="from-gray-400 to-gray-700"
        handleClick={() => setMeetingState("isScheduleMeeting")}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="from-gray-400 to-gray-700"
        handleClick={() => navigate("/recordings")}
      />

      {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={resetForm}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-3">
            <label className="text-base font-medium leading-[22.4px] text-white/80">
              Meeting Heading
            </label>
            <Input
              className="glassmorphism-button border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0 transition-all duration-200"
              placeholder="Enter meeting heading (e.g., Team Standup)"
              value={values.heading}
              onChange={(e) =>
                setValues({ ...values, heading: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-base font-medium leading-[22.4px] text-white/80">
              Meeting Subheading
            </label>
            <Input
              className="glassmorphism-button border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0 transition-all duration-200"
              placeholder="Enter meeting subheading (optional)"
              value={values.subheading}
              onChange={(e) =>
                setValues({ ...values, subheading: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-base font-medium leading-[22.4px] text-white/80">
              Add a description
            </label>
            <Textarea
              className="glassmorphism-button border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0 transition-all duration-200"
              placeholder="Enter meeting description (optional)"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-3">
            <label className="text-base font-medium leading-[22.4px] text-white/80">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded-xl glassmorphism-button border-white/10 bg-white/5 text-white placeholder:text-white/50 p-3 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => {
            setMeetingState(undefined);
            setCallDetail(undefined);
          }}
          title="Meeting Created"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link Copied" });
          }}
          image={"/icons/checked.svg"}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Meeting Link"
        >
          <div className="flex flex-col gap-4">
            {meetingCode && (
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-white/80">
                  Meeting Code
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 px-4 py-4 glassmorphism-button border-white/10 rounded-xl">
                    <p className="text-2xl font-bold tracking-widest text-center text-white uppercase">
                      {meetingCode.length === 8
                        ? `${meetingCode.slice(0, 4)}-${meetingCode.slice(4)}`
                        : meetingCode}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(meetingCode);
                      toast({ title: "Meeting Code Copied" });
                    }}
                    className="glassmorphism-button border-white/10 hover:glassmorphism-button-hover"
                  >
                    <img
                      src="/icons/copy.svg"
                      alt="copy"
                      width={16}
                      height={16}
                    />
                  </Button>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-white/80">
                Meeting Link
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 glassmorphism-button border-white/10 rounded-xl">
                  <p className="text-sm text-white truncate">{meetingLink}</p>
                </div>
              </div>
            </div>
          </div>
        </MeetingModal>
      )}

      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => {
          setMeetingState(undefined);
          setValues({ ...initialValues });
        }}
        title="Join Meeting"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={async () => {
          // Try to join by code first, then by link
          const code = values.meetingCode.trim().toUpperCase();
          const link = values.link.trim();

          if (code) {
            await joinMeetingByCode(code);
          } else if (link) {
            navigate(link);
          } else {
            toast({
              title: "Please enter a meeting code or link",
            });
          }
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <label className="text-base font-medium leading-[22.4px] text-white/80">
              Enter Meeting Code (8 characters)
            </label>
            <Input
              placeholder="ABCD-1234"
              value={values.meetingCode}
              onChange={(e) => {
                // Auto-format code with hyphen, max 8 chars (excluding hyphen)
                const input = e.target.value
                  .replace(/[^A-Z0-9]/gi, "")
                  .toUpperCase()
                  .slice(0, 8);
                const formatted =
                  input.length > 4
                    ? `${input.slice(0, 4)}-${input.slice(4)}`
                    : input;
                setValues({ ...values, meetingCode: formatted });
              }}
              maxLength={9}
              className="glassmorphism-button border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0 transition-all duration-200 text-center text-2xl font-bold tracking-widest uppercase"
            />
          </div>
          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="text-sm text-white/60 font-medium">OR</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-base font-medium leading-[22.4px] text-white/80">
              Enter Meeting Link
            </label>
            <Input
              placeholder="Meeting link"
              value={values.link}
              onChange={(e) => setValues({ ...values, link: e.target.value })}
              className="glassmorphism-button border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0 transition-all duration-200"
            />
          </div>
        </div>
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={resetForm}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <label className="text-base font-medium leading-[22.4px] text-white/80">
              Meeting Heading
            </label>
            <Input
              className="glassmorphism-button border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0 transition-all duration-200"
              placeholder="Enter meeting heading (e.g., Quick Team Sync)"
              value={values.heading}
              onChange={(e) =>
                setValues({ ...values, heading: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-base font-medium leading-[22.4px] text-white/80">
              Meeting Subheading
            </label>
            <Input
              className="glassmorphism-button border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0 transition-all duration-200"
              placeholder="Enter meeting subheading (optional)"
              value={values.subheading}
              onChange={(e) =>
                setValues({ ...values, subheading: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-base font-medium leading-[22.4px] text-white/80">
              Add a description
            </label>
            <Textarea
              className="glassmorphism-button border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0 transition-all duration-200"
              placeholder="Enter meeting description (optional)"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
        </div>
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
