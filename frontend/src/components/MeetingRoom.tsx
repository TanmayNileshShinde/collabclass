import { useState, useEffect } from "react";
import {
  CallControls,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useSearchParams } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import Chatbot from "./Chatbot";
import CustomParticipantsList from "./CustomParticipantsList";
import MeetingChat from "./MeetingChat";
import GithubRepoImporter from "./GithubRepoImporter";
import Whiteboard from "./Whiteboard";
import { useCall } from "@stream-io/video-react-sdk";
import {
  Users,
  MessageSquare,
  Github,
  Bot,
  Edit,
  Copy,
  Info,
  LayoutList,
  MoreHorizontal,
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
import VideoTileProfilePicture from "./VideoTileProfilePicture";
import { formatMeetingCode } from "@/lib/meetingUtils";
import AttendanceService from "@/services/AttendanceService";
import { useUser } from "@clerk/clerk-react";

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
  const { user } = useUser();

  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  // Track attendance when user joins or leaves meeting
  useEffect(() => {
    if (!call || !user || callingState !== CallingState.JOINED) return;

    const meetingId = call.id;
    const userId = user.id;
    const userName = user.fullName || user.username || 'Unknown User';

    // Record join when user successfully joins
    if (callingState === CallingState.JOINED && meetingId && userId) {
      AttendanceService.recordJoin(meetingId, userId, userName).catch(error => {
        console.error('Failed to record attendance join:', error);
      });
    }

    // Set up leave tracking when component unmounts or user leaves
    const handleLeave = () => {
      if (meetingId && userId) {
        AttendanceService.recordLeave(meetingId, userId).catch(error => {
          console.error('Failed to record attendance leave:', error);
        });
      }
    };

    // Listen for page unload (user closes browser/navigates away)
    const handleBeforeUnload = () => {
      handleLeave();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleLeave();
    };
  }, [call, user, callingState]);

  // Track participant join/leave events for other users
  useEffect(() => {
    if (!call) return;

    const handleParticipantJoined = (event: any) => {
      const participant = event.participant;
      if (participant && participant.userId && participant.name) {
        AttendanceService.recordJoin(call.id, participant.userId, participant.name).catch(error => {
          console.error('Failed to record participant join:', error);
        });
      }
    };

    const handleParticipantLeft = (event: any) => {
      const participant = event.participant;
      if (participant && participant.userId) {
        AttendanceService.recordLeave(call.id, participant.userId).catch(error => {
          console.error('Failed to record participant leave:', error);
        });
      }
    };

    // Subscribe to participant events
    call.on('participantJoined', handleParticipantJoined);
    call.on('participantLeft', handleParticipantLeft);

    return () => {
      call.off('participantJoined', handleParticipantJoined);
      call.off('participantLeft', handleParticipantLeft);
    };
  }, [call]);

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
      <VideoTileProfilePicture />
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
            "flex size-full items-center justify-center transition-all duration-300",
            showChat && showGithubImporter
              ? "max-w-[calc(100%-750px)]"
              : showChat || showGithubImporter
              ? "max-w-[calc(100%-350px)]"
              : showWhiteboard
              ? "max-w-[calc(100%-400px)]"
              : "max-w-[1000px]"
          )}
          style={{ minWidth: '400px' }}
        >
          <div className="w-full h-full flex items-center justify-center" style={{ minWidth: '400px', width: '100%' }}>
            <CallLayout />
          </div>
        </div>
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CustomParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
        {/* Fixed right-side panels */}
        <div className="fixed right-0 top-0 h-full flex items-start pt-20 z-30 gap-0">
          {showChat && (
            <div className="h-[calc(100vh-86px)]">
              <MeetingChat onClose={() => setShowChat(false)} />
            </div>
          )}
          {showGithubImporter && (
            <div className="h-[calc(100vh-86px)]">
              <GithubRepoImporter onClose={() => setShowGithubImporter(false)} />
            </div>
          )}
        </div>
        {showChatbot && <Chatbot />}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <MoreHorizontal size={20} className="text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white min-w-[200px]">
            <DropdownMenuLabel>More tools</DropdownMenuLabel>
            <DropdownMenuSeparator className="border-dark-1" />
            <DropdownMenuItem
              onClick={() => setShowChat((prev) => !prev)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                showChat && "bg-royal-1 text-white"
              )}
            >
              <MessageSquare size={16} />
              <span>Chat</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowGithubImporter((prev) => !prev)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                showGithubImporter && "bg-royal-1 text-white"
              )}
            >
              <Github size={16} />
              <span>GitHub repo</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowWhiteboard((prev) => !prev)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                showWhiteboard && "bg-royal-1 text-white"
              )}
            >
              <Edit size={16} />
              <span>Whiteboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowChatbot((prev) => !prev)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                showChatbot && "bg-royal-1 text-white"
              )}
            >
              <Bot size={16} />
              <span>AI assistant</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
