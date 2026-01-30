import { useCallStateHooks } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/clerk-react';
import { X, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { Button } from './ui/button';

interface CustomParticipantsListProps {
  onClose: () => void;
}

const CustomParticipantsList = ({ onClose }: CustomParticipantsListProps) => {
  const { user } = useUser();
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();

  // Get participant display name
  const getParticipantDisplayName = (participant: any) => {
    // For local participant, use Clerk user data (without "You" fallback)
    if (participant.userId === user?.id) {
      return user?.username || user?.firstName || user?.lastName || 'Me';
    }
    
    // Try to get name from participant data
    if (participant.name) return participant.name;
    
    // Fallback to userId
    return participant.userId || 'Unknown User';
  };

  // Get participant image
  const getParticipantImage = (participant: any) => {
    // For local participant, use Clerk user image
    if (participant.userId === user?.id) {
      return user?.imageUrl;
    }
    
    // Try to get image from participant data
    return participant.image;
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Combine local and remote participants, avoiding duplicates
  const allParticipants = localParticipant 
    ? [localParticipant, ...participants.filter(p => p.userId !== localParticipant.userId)]
    : participants;

  return (
    <div className="flex flex-col h-[calc(100vh-86px)] w-[350px] bg-light-1 dark:bg-dark-1 border-l border-light-4 dark:border-dark-4 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-light-4 dark:border-dark-4">
        <h2 className="text-lg font-semibold text-dark-2 dark:text-white">
          Participants ({allParticipants.length})
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-dark-2 dark:text-white hover:bg-light-3 dark:hover:bg-dark-3"
        >
          <X size={20} />
        </Button>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {allParticipants.map((participant) => {
          const displayName = getParticipantDisplayName(participant);
          const participantImage = getParticipantImage(participant);
          const isLocal = participant.userId === user?.id;
          
          return (
            <div
              key={participant.userId}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-light-2 dark:hover:bg-dark-3 transition-colors"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium overflow-hidden">
                {participantImage ? (
                  <img 
                    src={participantImage} 
                    alt={displayName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials(displayName)}</span>
                )}
              </div>

              {/* Participant Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-dark-2 dark:text-white truncate">
                    {displayName}
                    {isLocal && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        (You)
                      </span>
                    )}
                  </p>
                </div>
                
                {/* Status Indicators */}
                <div className="flex items-center space-x-2 mt-1">
                  {/* Audio Status */}
                  <div className="flex items-center space-x-1">
                    {(participant as any).isAudioMuted || !(participant as any).hasAudio ? (
                      <MicOff size={14} className="text-red-500" />
                    ) : (
                      <Mic size={14} className="text-green-500" />
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {(participant as any).isAudioMuted || !(participant as any).hasAudio ? 'Muted' : 'Speaking'}
                    </span>
                  </div>

                  {/* Video Status */}
                  <div className="flex items-center space-x-1">
                    {(participant as any).hasVideo ? (
                      <Video size={14} className="text-green-500" />
                    ) : (
                      <VideoOff size={14} className="text-gray-500" />
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {(participant as any).hasVideo ? 'Video On' : 'Video Off'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomParticipantsList;
