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

// Shared ocean-blue input/textarea classes
const oceanInput =
  "border border-[rgba(0,180,255,0.15)] bg-[rgba(0,20,50,0.6)] text-[rgba(200,235,255,0.95)] placeholder:text-[rgba(100,180,220,0.4)] focus-visible:ring-2 focus-visible:ring-[rgba(0,180,255,0.35)] focus-visible:ring-offset-0 transition-all duration-200 rounded-xl backdrop-blur-sm";

const oceanLabel = "text-base font-medium leading-[22.4px] text-[rgba(120,200,255,0.85)]";

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
        toast({ title: "Invalid meeting code", description: "Meeting code must be 8 characters" });
        return;
      }
      const { calls } = await client.queryCalls({
        filter_conditions: { "custom.meetingCode": normalizedCode },
        limit: 1,
      });
      if (calls.length === 0) {
        toast({ title: "Meeting not found", description: "No meeting found with this code" });
        return;
      }
      const call = calls[0];
      if (call.state.endedAt) {
        toast({ title: "Meeting has ended", description: "This meeting has already ended" });
        return;
      }
      navigate(`/meeting/${call.id}`);
      toast({ title: "Joining meeting..." });
    } catch (error) {
      console.error("Error joining meeting by code:", error);
      toast({
        title: "Failed to join meeting",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const createMeeting = async () => {
    if (!client || !user) return;
    const isInstantMeeting = meetingState === "isInstantMeeting";
    const isScheduledMeeting = meetingState === "isScheduleMeeting";
    try {
      if (isScheduledMeeting && (!values.dateTime || !values.dateTime.getTime)) {
        toast({ title: "Please select a date and time" });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create call object");
      const startsAt = isInstantMeeting ? new Date().toISOString() : values.dateTime.toISOString();
      const description = values.description || (isInstantMeeting ? "Instant Meeting" : "Scheduled Meeting");
      const heading = values.heading || (isInstantMeeting ? "Instant Meeting" : "Scheduled Meeting");
      const subheading = values.subheading || "";
      const meetingCode = generateMeetingCode();
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: { description, heading, subheading, meetingCode },
        },
      });
      if (isInstantMeeting) {
        navigate(`/meeting/${call.id}`);
        toast({ title: "Meeting Created" });
        return;
      }
      if (isScheduledMeeting) {
        setCallDetail(call);
        toast({ title: "Meeting Created" });
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast({
        title: "Failed to create Meeting",
        description: error instanceof Error ? error.message : "Failed to create meeting",
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
        className="from-[#001830] to-[#003060]"
        handleClick={() => setMeetingState("isInstantMeeting")}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="by code or link"
        className="from-[#001020] to-[#002550]"
        handleClick={() => setMeetingState("isJoiningMeeting")}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="from-[#001830] to-[#003060]"
        handleClick={() => setMeetingState("isScheduleMeeting")}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="from-[#001830] to-[#003060]"
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
            <label className={oceanLabel}>Meeting Heading</label>
            <Input
              className={oceanInput}
              placeholder="Enter meeting heading (e.g., Team Standup)"
              value={values.heading}
              onChange={(e) => setValues({ ...values, heading: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className={oceanLabel}>Meeting Subheading</label>
            <Input
              className={oceanInput}
              placeholder="Enter meeting subheading (optional)"
              value={values.subheading}
              onChange={(e) => setValues({ ...values, subheading: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className={oceanLabel}>Add a description</label>
            <Textarea
              className={oceanInput}
              placeholder="Enter meeting description (optional)"
              onChange={(e) => setValues({ ...values, description: e.target.value })}
            />
          </div>
          <div className="flex w-full flex-col gap-3">
            <label className={oceanLabel}>Select Date and Time</label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded-xl border border-[rgba(0,180,255,0.15)] bg-[rgba(0,20,50,0.6)] text-[rgba(200,235,255,0.95)] placeholder:text-[rgba(100,180,220,0.4)] p-3 focus:outline-none focus:ring-2 focus:ring-[rgba(0,180,255,0.35)] transition-all duration-200 backdrop-blur-sm"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => { setMeetingState(undefined); setCallDetail(undefined); }}
          title="Meeting Created"
          handleClick={() => { navigator.clipboard.writeText(meetingLink); toast({ title: "Link Copied" }); }}
          image={"/icons/checked.svg"}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Meeting Link"
        >
          <div className="flex flex-col gap-4">
            {meetingCode && (
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-[rgba(120,200,255,0.85)]">Meeting Code</label>
                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 px-4 py-4 rounded-xl"
                    style={{
                      background: "rgba(0,20,50,0.7)",
                      border: "1px solid rgba(0,180,255,0.2)",
                      boxShadow: "0 0 20px rgba(0,100,200,0.12), inset 0 1px 0 rgba(0,200,255,0.08)",
                    }}
                  >
                    <p
                      className="text-2xl font-bold tracking-widest text-center uppercase"
                      style={{
                        background: "linear-gradient(135deg, #ffffff, #7dd3fc, #0ea5e9)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 0 12px rgba(14,165,233,0.5))",
                      }}
                    >
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
                    style={{
                      background: "rgba(0,20,50,0.7)",
                      border: "1px solid rgba(0,180,255,0.2)",
                    }}
                    className="hover:border-[rgba(0,200,255,0.4)] transition-all duration-200"
                  >
                    <img src="/icons/copy.svg" alt="copy" width={16} height={16} />
                  </Button>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-[rgba(120,200,255,0.85)]">Meeting Link</label>
              <div
                className="flex-1 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(0,20,50,0.7)",
                  border: "1px solid rgba(0,180,255,0.15)",
                }}
              >
                <p className="text-sm truncate" style={{ color: "rgba(147,210,255,0.9)" }}>
                  {meetingLink}
                </p>
              </div>
            </div>
          </div>
        </MeetingModal>
      )}

      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => { setMeetingState(undefined); setValues({ ...initialValues }); }}
        title="Join Meeting"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={async () => {
          const code = values.meetingCode.trim().toUpperCase();
          const link = values.link.trim();
          if (code) {
            await joinMeetingByCode(code);
          } else if (link) {
            navigate(link);
          } else {
            toast({ title: "Please enter a meeting code or link" });
          }
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <label className={oceanLabel}>Enter Meeting Code (8 characters)</label>
            <Input
              placeholder="ABCD-1234"
              value={values.meetingCode}
              onChange={(e) => {
                const input = e.target.value.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 8);
                const formatted = input.length > 4 ? `${input.slice(0, 4)}-${input.slice(4)}` : input;
                setValues({ ...values, meetingCode: formatted });
              }}
              maxLength={9}
              className={`${oceanInput} text-center text-2xl font-bold tracking-widest uppercase`}
              style={{ letterSpacing: "0.2em" }}
            />
          </div>
          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t border-[rgba(0,150,255,0.15)]"></div>
            <span className="text-sm font-medium" style={{ color: "rgba(100,170,220,0.6)" }}>OR</span>
            <div className="flex-1 border-t border-[rgba(0,150,255,0.15)]"></div>
          </div>
          <div className="flex flex-col gap-3">
            <label className={oceanLabel}>Enter Meeting Link</label>
            <Input
              placeholder="Meeting link"
              value={values.link}
              onChange={(e) => setValues({ ...values, link: e.target.value })}
              className={oceanInput}
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
            <label className={oceanLabel}>Meeting Heading</label>
            <Input
              className={oceanInput}
              placeholder="Enter meeting heading (e.g., Quick Team Sync)"
              value={values.heading}
              onChange={(e) => setValues({ ...values, heading: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className={oceanLabel}>Meeting Subheading</label>
            <Input
              className={oceanInput}
              placeholder="Enter meeting subheading (optional)"
              value={values.subheading}
              onChange={(e) => setValues({ ...values, subheading: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className={oceanLabel}>Add a description</label>
            <Textarea
              className={oceanInput}
              placeholder="Enter meeting description (optional)"
              onChange={(e) => setValues({ ...values, description: e.target.value })}
            />
          </div>
        </div>
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;