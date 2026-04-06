import { useEffect, useRef } from "react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";

interface VideoTileProfilePictureProps {
  enabled?: boolean;
}

const VideoTileProfilePicture = ({
  enabled = true,
}: VideoTileProfilePictureProps) => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const addProfilePicturesToVideoTiles = () => {
      const videoTiles = document.querySelectorAll(
        '.str-video__participant-view, .str-video__participant-tile, [class*="participant-view"], [class*="participant-tile"]',
      );

      videoTiles.forEach((tile) => {
        const tileElement = tile as HTMLElement;

        const videoElement = tileElement.querySelector(
          "video",
        ) as HTMLVideoElement;
        const participantDetails = tileElement.querySelector(
          ".str-video__participant-details",
        );

        let hasVideoStream = false;
        if (videoElement) {
          if (videoElement.srcObject instanceof MediaStream) {
            const videoTracks = videoElement.srcObject.getVideoTracks();
            hasVideoStream =
              videoTracks.length > 0 &&
              videoTracks.some(
                (track) => track.enabled && track.readyState === "live",
              );
          }

          if (!hasVideoStream) {
            hasVideoStream = !!(
              videoElement.src ||
              (videoElement.srcObject && videoElement.readyState > 0)
            );
          }
        }

        const isVideoOff = !hasVideoStream;

        const nameElement = participantDetails?.querySelector(
          '.str-video__participant-details__name, [class*="name"]',
        );
        const participantName =
          nameElement?.textContent?.trim() ||
          tileElement.getAttribute("data-participant-name") ||
          "User";

        const participant = participants.find((p) => {
          const pName = p.name || p.userId || "";
          return (
            pName === participantName ||
            tileElement.textContent?.includes(pName)
          );
        });

        const participantImage = participant?.image || "";
        const displayName =
          participant?.name || participant?.userId || participantName;

        const existingOverlay = tileElement.querySelector(
          ".video-off-profile-overlay",
        ) as HTMLElement;

        if (isVideoOff) {
          if (!existingOverlay) {
            const overlay = document.createElement("div");
            overlay.className = "video-off-profile-overlay";

            const avatarContainer = document.createElement("div");
            avatarContainer.className = "video-off-avatar-container";

            if (participantImage) {
              const img = document.createElement("img");
              img.src = participantImage;
              img.alt = displayName;
              img.className = "video-off-avatar-image";
              img.onerror = () => {
                img.style.display = "none";
                const initialsAvatar = createInitialsAvatar(displayName);
                avatarContainer.appendChild(initialsAvatar);
              };
              avatarContainer.appendChild(img);
            } else {
              const initialsAvatar = createInitialsAvatar(displayName);
              avatarContainer.appendChild(initialsAvatar);
            }

            overlay.appendChild(avatarContainer);

            const nameLabel = document.createElement("div");
            nameLabel.className = "video-off-name-label";
            nameLabel.textContent = displayName;
            overlay.appendChild(nameLabel);

            if (getComputedStyle(tileElement).position === "static") {
              tileElement.style.position = "relative";
            }

            if (videoElement) {
              videoElement.style.opacity = "0";
              videoElement.style.pointerEvents = "none";
            }

            tileElement.appendChild(overlay);
          }
        } else {
          if (existingOverlay) {
            existingOverlay.remove();
          }

          if (videoElement) {
            videoElement.style.opacity = "1";
            videoElement.style.pointerEvents = "auto";
          }
        }
      });
    };

    const createInitialsAvatar = (name: string) => {
      const initials =
        name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase())
          .filter((char) => /[A-Z0-9]/.test(char))
          .slice(0, 2)
          .join("") ||
        name.charAt(0).toUpperCase() ||
        "U";

      const avatar = document.createElement("div");
      avatar.className = "video-off-avatar-initials";
      avatar.textContent = initials;
      return avatar;
    };

    observerRef.current = new MutationObserver(() => {
      setTimeout(addProfilePicturesToVideoTiles, 100);
    });

    const meetingContainer =
      document.querySelector(".str-video__call") ||
      document.querySelector('[class*="call"]') ||
      document.body;

    observerRef.current.observe(meetingContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    addProfilePicturesToVideoTiles();

    const interval = setInterval(() => {
      addProfilePicturesToVideoTiles();
    }, 1000);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearInterval(interval);
    };
  }, [participants, enabled]);

  return null;
};

export default VideoTileProfilePicture;
