import { useEffect, useRef } from 'react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/clerk-react';

interface VideoTileProfilePictureProps {
  enabled?: boolean;
}

const VideoTileProfilePicture = ({ enabled = true }: VideoTileProfilePictureProps) => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const { user } = useUser();
  const observerRef = useRef<MutationObserver | null>(null);
  const processedTilesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    const addProfilePicturesToVideoTiles = () => {
      // Find all video participant tiles - try multiple possible selectors
      const videoTiles = document.querySelectorAll([
        '[data-testid="participant-tile"]',
        '.str-video__participant-tile',
        '.str-video__participant-view',
        '.participant-tile',
        '[class*="participant"]',
        '[class*="tile"]'
      ].join(', '));
      
      console.log('Found video tiles:', videoTiles.length);
      
      videoTiles.forEach((tile, index) => {
        const tileElement = tile as HTMLElement;
        
        // Try multiple ways to get participant info
        const participantId = 
          tileElement.getAttribute('data-participant-id') || 
          tileElement.getAttribute('data-user-id') ||
          tileElement.getAttribute('data-testid')?.includes('participant') && `participant-${index}` ||
          `tile-${index}`;
        
        console.log('Processing tile:', participantId, tileElement.className);
        
        if (processedTilesRef.current.has(participantId)) return;

        // Check if video is off - multiple methods
        const videoElement = tileElement.querySelector('video');
        const hasVideoStream = videoElement && 
                              videoElement.srcObject instanceof MediaStream &&
                              videoElement.srcObject.getVideoTracks().some(track => track.enabled);
        
        const isVideoOff = !hasVideoStream;
        
        console.log('Video status for', participantId, ':', isVideoOff ? 'OFF' : 'ON');

        if (isVideoOff) {
          // Create profile picture overlay
          const existingOverlay = tileElement.querySelector('.profile-picture-overlay');
          if (existingOverlay) {
            existingOverlay.remove();
          }

          const overlay = document.createElement('div');
          overlay.className = 'profile-picture-overlay absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 z-10';
          
          // Try to get participant info
          const participant = participants.find(p => p.userId === participantId);
          const participantName = participant?.name || participant?.userId || `User ${index + 1}`;
          const participantImage = participant?.image || user?.imageUrl || '';

          console.log('Creating overlay for:', participantName, 'has image:', !!participantImage);

          if (participantImage) {
            const img = document.createElement('img');
            img.src = participantImage;
            img.alt = participantName;
            img.className = 'w-20 h-20 rounded-full object-cover border-4 border-gray-700';
            img.onerror = () => {
              console.log('Image failed to load, using initials');
              img.style.display = 'none';
              const fallback = createInitialsAvatar(participantName);
              overlay.appendChild(fallback);
            };
            overlay.appendChild(img);
          } else {
            const initialsAvatar = createInitialsAvatar(participantName);
            overlay.appendChild(initialsAvatar);
          }

          // Add participant name label
          const nameLabel = document.createElement('div');
          nameLabel.className = 'absolute bottom-2 left-2 right-2 bg-black/60 text-white text-sm font-medium px-2 py-1 rounded text-center';
          nameLabel.textContent = participantName;
          overlay.appendChild(nameLabel);

          // Add to tile
          tileElement.appendChild(overlay);
          processedTilesRef.current.add(participantId);
          console.log('Added overlay for:', participantId);
        }
      });
    };

    const createInitialsAvatar = (name: string) => {
      const initials = name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
      
      const avatar = document.createElement('div');
      avatar.className = 'w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-white text-xl font-bold border-4 border-gray-600';
      avatar.textContent = initials;
      return avatar;
    };

    // Set up mutation observer to watch for DOM changes
    observerRef.current = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if any relevant nodes were added/removed
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.querySelector && element.querySelector('video') ||
                  element.className && (
                    element.className.includes('participant') ||
                    element.className.includes('tile')
                  )) {
                shouldUpdate = true;
              }
            }
          });
        }
      });
      
      if (shouldUpdate) {
        console.log('DOM changed, updating video tiles');
        setTimeout(addProfilePicturesToVideoTiles, 100); // Small delay
      }
    });

    // Start observing - observe the entire document to catch all changes
    const meetingContainer = document.querySelector('[data-testid="call-layout"]') || 
                           document.querySelector('.str-video__call-layout') ||
                           document.querySelector('[class*="call"]') ||
                           document.body;
    
    console.log('Observing container:', meetingContainer.className);
    observerRef.current.observe(meetingContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-video-off', 'data-participant-id']
    });

    // Initial run
    console.log('Initial run - adding profile pictures');
    addProfilePicturesToVideoTiles();
    
    // Also run periodically as fallback
    const interval = setInterval(addProfilePicturesToVideoTiles, 2000);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearInterval(interval);
    };
  }, [participants, user, enabled]);

  return null; // This component doesn't render anything, it just manipulates the DOM
};

export default VideoTileProfilePicture;
