import React, { useEffect, useRef, useState, useCallback } from 'react';
import './ScrollVideo.css';

/**
 * PRODUCTION SCROLL VIDEO ENGINE
 * Smooth, frame-rate independent playhead scrubbing with exponential damping
 * and hardware decoder protection.
 */
export const DAMPING_FACTOR = 0.12;
export const SEEK_EPSILON = 0.015;

const ScrollVideo = ({
  src = '/media/desktop.mp4',
  scrollProgress = 0,
  onDurationChange = () => {},
  onTimeUpdate = () => {},
  className = '',
  poster = '',
  enableParallax = true,
  children
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Playhead state refs
  const targetTimeRef = useRef(0);
  const playheadRef = useRef(0);
  const durationRef = useRef(10);
  const isSeekingRef = useRef(false);
  const lastSeekStampRef = useRef(0);
  const rafIdRef = useRef(null);

  // UI state
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Update target time whenever scrollProgress changes
  useEffect(() => {
    const dur = durationRef.current || 10;
    const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);
    targetTimeRef.current = clampedProgress * dur;
  }, [scrollProgress]);

  // Video loaded metadata handler
  const handleLoadedMetadata = useCallback((e) => {
    const video = e.currentTarget;
    if (video.duration && !isNaN(video.duration) && video.duration > 0) {
      durationRef.current = video.duration;
      onDurationChange(video.duration);
    }
    setIsLoaded(true);
    setLoadError(null);
  }, [onDurationChange]);

  const handleError = useCallback((e) => {
    console.warn('[ScrollVideo] Media loading notice:', e);
    setLoadError('Unable to scrub native video stream.');
  }, []);

  const handleSeeked = useCallback(() => {
    isSeekingRef.current = false;
    const video = videoRef.current;
    if (video) {
      onTimeUpdate(video.currentTime);
    }
  }, [onTimeUpdate]);

  // Smooth RAF scrub loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      const dur = durationRef.current || 10;
      const target = Math.min(Math.max(targetTimeRef.current, 0), dur);

      // Smooth exponential damping toward target
      const delta = target - playheadRef.current;
      playheadRef.current += delta * DAMPING_FACTOR;

      const now = performance.now();

      // Decoder timeout unlock: if seeking was stuck for >80ms, unblock
      if (isSeekingRef.current && (now - lastSeekStampRef.current > 80)) {
        isSeekingRef.current = false;
      }

      // Check if we need to update video.currentTime
      if (!isSeekingRef.current && Math.abs(video.currentTime - playheadRef.current) > SEEK_EPSILON) {
        isSeekingRef.current = true;
        lastSeekStampRef.current = now;

        const seekTo = Math.min(Math.max(playheadRef.current, 0), dur);
        
        try {
          if ('fastSeek' in video) {
            video.fastSeek(seekTo);
          } else {
            video.currentTime = seekTo;
          }
        } catch {
          video.currentTime = seekTo;
        }

        onTimeUpdate(seekTo);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [onTimeUpdate]);

  // Subtle desktop mouse parallax
  useEffect(() => {
    if (!enableParallax) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;
      setParallaxOffset({
        x: normX * 6,
        y: normY * 4
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableParallax]);

  return (
    <div 
      ref={containerRef} 
      className={`scroll-video-container ${className}`}
      style={{
        transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0)`
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="scroll-video-element"
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        tabIndex={-1}
        aria-hidden="true"
        onLoadedMetadata={handleLoadedMetadata}
        onSeeked={handleSeeked}
        onError={handleError}
      />

      {/* Scrim Overlay that guarantees text readability without washing out video */}
      <div className="scroll-video-vignette" />

      {/* Restrained Loading Indicator */}
      {!isLoaded && !loadError && (
        <div className="scroll-video-loader" role="status" aria-label="Loading atelier film">
          <div className="loader-spinner" />
          <span className="loader-text technical-text">CALIBRATING ATELIER FILM...</span>
        </div>
      )}

      {children}
    </div>
  );
};

export default ScrollVideo;
