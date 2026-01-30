import { useEffect, useRef } from 'react';

const AggressiveVideoOverlay = () => {
  const overlayMapRef = useRef<Map<HTMLVideoElement, HTMLElement>>(new Map());

  useEffect(() => {
    console.log('AggressiveVideoOverlay mounted');

    const createOverlay = (videoElement: HTMLVideoElement) => {
      // Remove existing overlay if any
      const existingOverlay = overlayMapRef.current.get(videoElement);
      if (existingOverlay) {
        existingOverlay.remove();
      }

      // Create new overlay
      const overlay = document.createElement('div');
      overlay.className = 'video-off-overlay';
      overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        z-index: 10;
        pointer-events: none;
        border-radius: 0.5rem;
      `;
      
      // Create initials avatar
      const avatar = document.createElement('div');
      avatar.style.cssText = `
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #374151;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        font-weight: bold;
        border: 4px solid #4b5563;
      `;
      avatar.textContent = 'U';
      
      overlay.appendChild(avatar);
      
      // Store reference
      overlayMapRef.current.set(videoElement, overlay);
      
      return overlay;
    };

    const updateVideoOverlay = (videoElement: HTMLVideoElement) => {
      const overlay = overlayMapRef.current.get(videoElement);
      
      // Check if video is actually playing content
      const hasActiveVideo = 
        videoElement.videoWidth > 2 && 
        videoElement.videoHeight > 2 && 
        !videoElement.paused &&
        videoElement.readyState >= 2; // HAVE_CURRENT_DATA

      console.log(`Video update check:`, {
        videoWidth: videoElement.videoWidth,
        videoHeight: videoElement.videoHeight,
        paused: videoElement.paused,
        readyState: videoElement.readyState,
        hasActiveVideo
      });

      // Find container
      let container = videoElement.parentElement;
      if (!container || container.tagName === 'BODY') {
        container = videoElement.closest('div') as HTMLElement;
      }
      
      if (!container) {
        console.log('No container found for video');
        return;
      }

      // Ensure container has relative positioning
      const computedStyle = getComputedStyle(container);
      if (computedStyle.position === 'static') {
        container.style.position = 'relative';
      }

      if (hasActiveVideo) {
        // Video is active, remove overlay
        if (overlay && overlay.parentNode) {
          overlay.remove();
          console.log('Removed overlay - video is active');
        }
      } else {
        // Video is off, add overlay if not present
        if (!overlay || !overlay.parentNode) {
          const newOverlay = createOverlay(videoElement);
          container.appendChild(newOverlay);
          console.log('Added overlay - video appears to be off');
        }
      }
    };

    const processAllVideos = () => {
      const videos = document.querySelectorAll('video');
      console.log(`Processing ${videos.length} video elements`);
      
      videos.forEach((video, index) => {
        const videoEl = video as HTMLVideoElement;
        console.log(`Video ${index + 1}:`, {
          className: videoEl.className,
          videoWidth: videoEl.videoWidth,
          videoHeight: videoEl.videoHeight,
          paused: videoEl.paused,
          readyState: videoEl.readyState
        });
        
        updateVideoOverlay(videoEl);
      });
    };

    // Start processing after a short delay
    setTimeout(processAllVideos, 1000);
    
    // Set up interval to keep checking
    const interval = setInterval(processAllVideos, 1500);
    
    // Also listen for video events
    const addVideoListeners = (video: HTMLVideoElement) => {
      const events = ['loadedmetadata', 'play', 'pause', 'ended', 'resize'];
      
      events.forEach(eventType => {
        video.addEventListener(eventType, () => {
          console.log(`Video event: ${eventType}`);
          updateVideoOverlay(video);
        });
      });
    };

    // Watch for new videos
    const observer = new MutationObserver(() => {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        addVideoListeners(video as HTMLVideoElement);
      });
      processAllVideos();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
      // Clean up overlays
      overlayMapRef.current.forEach(overlay => overlay.remove());
      overlayMapRef.current.clear();
    };
  }, []);

  return null;
};

export default AggressiveVideoOverlay;
