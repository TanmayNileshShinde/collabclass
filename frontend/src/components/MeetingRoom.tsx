import { useState } from "react";
import {
  CallControls,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import { useSearchParams } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import Chatbot from "./Chatbot";
import AggressiveVideoOverlay from "./AggressiveVideoOverlay";
import CustomParticipantsList from "./CustomParticipantsList";
import MeetingChat from "./MeetingChat";
import GithubRepoImporter from "./GithubRepoImporter";
import Whiteboard from "./Whiteboard";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import {
  Users,
  MessageSquare,
  Github,
  Bot,
  Edit,
  Copy,
  Info,
  LayoutList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import Loader from "./Loader";
import EndCallButton from "./EndCallButton";
import { formatMeetingCode } from "@/lib/meetingUtils";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const [searchParams] = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const navigate = useNavigate();
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showGithubImporter, setShowGithubImporter] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const call = useCall();
  const { toast } = useToast();

  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const meetingCode = call?.state.custom?.meetingCode;
  const meetingHeading = call?.state.custom?.heading || "Meeting";
  const meetingSubheading = call?.state.custom?.subheading;
  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
  const meetingLink = call ? `${baseUrl}/meeting/${call.id}` : "";

  const copyMeetingCode = () => {
    if (meetingCode) {
      navigator.clipboard.writeText(meetingCode);
      toast({ title: "Meeting Code Copied" });
    }
  };

  const copyMeetingLink = () => {
    if (meetingLink) {
      navigator.clipboard.writeText(meetingLink);
      toast({ title: "Meeting Link Copied" });
    }
  };

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      {/* Video Tile Profile Picture Enhancement */}
      <AggressiveVideoOverlay />
      
      {/* Meeting Header */}
      <div className="fixed top-4 left-4 right-20 z-40">
        <div className="glassmorphism-card px-4 py-3 rounded-xl max-w-md">
          <h1 className="text-xl font-bold text-white mb-1">
            {meetingHeading}
          </h1>
          {meetingSubheading && (
            <p className="text-sm text-white/80">{meetingSubheading}</p>
          )}
        </div>
      </div>

      {/* Meeting Info Button - Top Right */}
      {meetingCode && (
        <div className="fixed top-4 right-4 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] transition-colors">
                <Info size={20} className="text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              className="border-light-4 dark:border-dark-4 bg-light-1 dark:bg-dark-1 text-dark-2 dark:text-white min-w-[280px] p-4"
            >
              <DropdownMenuLabel className="text-base font-semibold mb-3">
                Meeting Information
              </DropdownMenuLabel>

              {/* Meeting Heading and Subheading */}
              <div className="mb-4 p-3 bg-light-2 dark:bg-dark-3 rounded-lg">
                <h3 className="font-semibold text-dark-2 dark:text-white mb-1">
                  {meetingHeading}
                </h3>
                {meetingSubheading && (
                  <p className="text-sm text-dark-2/70 dark:text-white/70">
                    {meetingSubheading}
                  </p>
                )}
              </div>

              {meetingCode && (
                <div className="mb-3">
                  <label className="text-xs font-medium text-dark-2/70 dark:text-white/70 mb-1 block">
                    Meeting Code
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-light-2 dark:bg-dark-3 border border-light-4 dark:border-dark-4 rounded-lg">
                      <p className="text-lg font-bold tracking-widest text-center text-dark-2 dark:text-white uppercase">
                        {formatMeetingCode(meetingCode)}
                      </p>
                    </div>
                    <button
                      onClick={copyMeetingCode}
                      className="p-2 rounded-lg hover:bg-light-3 dark:hover:bg-dark-3 transition-colors"
                      title="Copy Meeting Code"
                    >
                      <Copy size={16} className="text-dark-2 dark:text-white" />
                    </button>
                  </div>
                </div>
              )}

              {meetingLink && (
                <div>
                  <label className="text-xs font-medium text-dark-2/70 dark:text-white/70 mb-1 block">
                    Meeting Link
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-light-2 dark:bg-dark-3 border border-light-4 dark:border-dark-4 rounded-lg">
                      <p className="text-xs text-dark-2 dark:text-white truncate">
                        {meetingLink}
                      </p>
                    </div>
                    <button
                      onClick={copyMeetingLink}
                      className="p-2 rounded-lg hover:bg-light-3 dark:hover:bg-dark-3 transition-colors"
                      title="Copy Meeting Link"
                    >
                      <Copy size={16} className="text-dark-2 dark:text-white" />
                    </button>
                  </div>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="relative flex size-full items-center justify-center">
        <div
          className={cn(
            "flex size-full items-center",
            showChat
              ? "max-w-[calc(100%-350px)]"
              : showGithubImporter
              ? "max-w-[calc(100%-400px)]"
              : showWhiteboard
              ? "max-w-[calc(100%-400px)]"
              : "max-w-[1000px]"
          )}
        >
          <CallLayout />
        </div>
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CustomParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
        {showChat && <MeetingChat onClose={() => setShowChat(false)} />}
        {showChatbot && <Chatbot />}
        {showGithubImporter && (
          <GithubRepoImporter onClose={() => setShowGithubImporter(false)} />
        )}
        {showWhiteboard && (
          <Whiteboard onClose={() => setShowWhiteboard(false)} />
        )}
      </div>
      {/* video layout and call controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
        <CallControls onLeave={() => navigate(`/`)} />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowChatbot((prev) => !prev)}>
          <div
            className={cn(
              "cursor-pointer rounded-2xl px-4 py-2 transition-colors",
              showChatbot
                ? "bg-royal-1 hover:bg-royal-2"
                : "bg-[#19232d] hover:bg-[#4c535b]"
            )}
          >
            <Bot size={20} className="text-white" />
          </div>
        </button>
        <button onClick={() => setShowChat((prev) => !prev)}>
          <div
            className={cn(
              "cursor-pointer rounded-2xl px-4 py-2 transition-colors",
              showChat
                ? "bg-royal-1 hover:bg-royal-2"
                : "bg-[#19232d] hover:bg-[#4c535b]"
            )}
          >
            <MessageSquare size={20} className="text-white" />
          </div>
        </button>
        <button onClick={() => setShowGithubImporter((prev) => !prev)}>
          <div
            className={cn(
              "cursor-pointer rounded-2xl px-4 py-2 transition-colors",
              showGithubImporter
                ? "bg-royal-1 hover:bg-royal-2"
                : "bg-[#19232d] hover:bg-[#4c535b]"
            )}
          >
            <Github size={20} className="text-white" />
          </div>
        </button>
        <button onClick={() => setShowWhiteboard((prev) => !prev)}>
          <div
            className={cn(
              "cursor-pointer rounded-2xl px-4 py-2 transition-colors",
              showWhiteboard
                ? "bg-royal-1 hover:bg-royal-2"
                : "bg-[#19232d] hover:bg-[#4c535b]"
            )}
          >
            <Edit size={20} className="text-white" />
          </div>
        </button>
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
