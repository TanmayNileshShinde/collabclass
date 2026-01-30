import { useEffect, useRef } from 'react';

const SimpleVideoOverlay = () => {
  const processedRef = useRef<Set<HTMLVideoElement>>(new Set());

  useEffect(() => {
    console.log('SimpleVideoOverlay mounted');

    const addProfilePictureOverlay = (videoElement: HTMLVideoElement) => {
      if (processedRef.current.has(videoElement)) {
        console.log('Video already processed');
        return;
      }
      
      // Multiple methods to detect if video is "off"
      let isVideoOff = false;
      
      // Method 1: Check if video has no stream
      const hasStream = videoElement.srcObject instanceof MediaStream && 
                       videoElement.srcObject.getVideoTracks().some(track => track.enabled && track.readyState === 'live');
      
      // Method 2: Check video dimensions (often 0x0 or 2x2 when off)
      const hasValidDimensions = videoElement.videoWidth > 2 && videoElement.videoHeight > 2;
      
      // Method 3: Check if video is paused/ended
      const isVideoPaused = videoElement.paused || videoElement.ended;
      
      // Method 4: Check if video element has no src attribute
      const hasNoSrc = !videoElement.src && !videoElement.currentSrc;
      
      // Consider video "off" if any of these conditions are met
      isVideoOff = !hasStream || !hasValidDimensions || isVideoPaused || hasNoSrc;
      
      console.log('Video analysis:', {
        hasStream,
        hasValidDimensions,
        isVideoPaused,
        hasNoSrc,
        videoWidth: videoElement.videoWidth,
        videoHeight: videoElement.videoHeight,
        isVideoOff
      });
      
      if (isVideoOff) {
        console.log('Adding overlay for video that appears to be off');
        
        // Find the parent container - try multiple approaches
        let container = videoElement.parentElement;
        if (!container || container.tagName === 'BODY') {
          container = videoElement.closest('[class*="participant"], [class*="tile"], [class*="video"], div') as HTMLElement;
        }
        
        // If still no good container, use the video element itself
        if (!container || container.tagName === 'BODY') {
          console.log('Using video element as container');
          container = videoElement;
        }
        
        if (!container) {
          console.log('No container found for video');
          return;
        }

        // Check if overlay already exists
        const existingOverlay = container.querySelector('.profile-picture-overlay');
        if (existingOverlay) {
          console.log('Overlay already exists');
          return;
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'profile-picture-overlay';
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
        avatar.textContent = 'U'; // Default initial
        
        overlay.appendChild(avatar);
        
        // Make sure container has relative positioning
        const computedStyle = getComputedStyle(container);
        if (computedStyle.position === 'static') {
          container.style.position = 'relative';
        }
        
        container.appendChild(overlay);
        processedRef.current.add(videoElement);
        
        console.log('Successfully added profile picture overlay');
      } else {
        console.log('Video appears to be active, no overlay needed');
      }
    };

    const findAndProcessVideos = () => {
      const videos = document.querySelectorAll('video');
      console.log('Found videos:', videos.length);
      
      videos.forEach((video, index) => {
        console.log(`Processing video ${index + 1}:`, {
          className: video.className,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          paused: video.paused,
          src: !!video.src,
          currentSrc: !!video.currentSrc
        });
        addProfilePictureOverlay(video as HTMLVideoElement);
      });
    };

    // Initial scan after a delay
    setTimeout(findAndProcessVideos, 2000);
    
    // Watch for new videos
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'VIDEO' || element.querySelector('video')) {
                shouldUpdate = true;
              }
            }
          });
        }
      });
      
      if (shouldUpdate) {
        setTimeout(findAndProcessVideos, 1000);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Periodic check more frequently
    const interval = setInterval(findAndProcessVideos, 2000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
};

export default SimpleVideoOverlay;
