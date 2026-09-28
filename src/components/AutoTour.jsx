import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, Pause, RotateCcw, Zap, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from './SmoothScroll';
import './AutoTour.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * PRODUCTION AUTO TOUR COMPONENT
 * Implements automated linear smooth scroll tour with speed toggling (1x: 20s, 2x: 10s),
 * direct DOM ref updates for progress (0 React re-renders per RAF), and user interaction gates.
 * Automatically initiates smooth banner video scroll on website open.
 */
const AutoTour = ({ 
  targetSelector = '#atelier-hero-track',
  autoStart = true,
  autoStartDelay = 1100
}) => {
  const location = useLocation();
  const { lenis } = useSmoothScroll();

  const [tourState, setTourState] = useState('idle'); // 'idle' | 'running' | 'paused' | 'completed'
  const [speed, setSpeed] = useState(1); // 1 = 20s, 2 = 10s
  const [canRestart, setCanRestart] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // References
  const tweenRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);
  const tourContainerRef = useRef(null);
  const progressValueRef = useRef(0);
  const userInteractedRef = useRef(false);
  const hasAutoStartedRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const lenisRef = useRef(lenis);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  // Hide on non-home pages (e.g. /prompt, /custom)
  const isVisible = location.pathname === '/';

  // Calculate target scroll distance for hero track
  const getTargetScroll = useCallback(() => {
    const el = document.querySelector(targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      return Math.max(scrollTop + rect.top + rect.height - window.innerHeight, 100);
    }
    // Fallback to 250vh
    return window.innerHeight * 2.5;
  }, [targetSelector]);

  // Kill any active tween cleanly
  const killTween = useCallback(() => {
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }
  }, []);

  // Update progress DOM directly without React re-renders
  const updateProgressDOM = (pct) => {
    const clamped = Math.min(Math.max(pct, 0), 100);
    progressValueRef.current = clamped;

    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${clamped}%`;
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = `${Math.round(clamped)}%`;
    }

    if (clamped > 2 && !canRestart) {
      setCanRestart(true);
    }
  };

  // Start or resume tour
  const startTour = useCallback(() => {
    killTween();

    const maxScroll = getTargetScroll();
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    const remainingDistance = Math.max(maxScroll - currentScroll, 0);

    const shouldRestartFromTop = remainingDistance < 15;
    if (shouldRestartFromTop) {
      // If at end, restart from top
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      ScrollTrigger.update();
      updateProgressDOM(0);
    }

    const startPos = shouldRestartFromTop ? 0 : (window.scrollY || document.documentElement.scrollTop);
    const distanceTotal = maxScroll;
    const remainingFraction = distanceTotal > 0 ? Math.max((maxScroll - startPos) / distanceTotal, 0) : 1;

    // Base duration: 1x = 20s, 2x = 10s
    const baseDuration = speed === 2 ? 10 : 20;
    const duration = Math.max(baseDuration * remainingFraction, 1);

    const scrollObj = { value: startPos };
    setTourState('running');

    tweenRef.current = gsap.to(scrollObj, {
      value: maxScroll,
      duration: duration,
      ease: 'none',
      onUpdate: () => {
        isProgrammaticScrollRef.current = true;
        if (lenisRef.current) {
          lenisRef.current.scrollTo(scrollObj.value, { immediate: true });
        } else {
          window.scrollTo(0, scrollObj.value);
        }
        ScrollTrigger.update();
        setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 50);

        const pct = (scrollObj.value / maxScroll) * 100;
        updateProgressDOM(pct);
      },
      onComplete: () => {
        setTourState('completed');
        killTween();
      }
    });
  }, [killTween, getTargetScroll, speed]);

  // Pause tour
  const pauseTour = useCallback(() => {
    if (tourState === 'running') {
      killTween();
      setTourState('paused');
    }
  }, [tourState, killTween]);

  // Restart tour from 0
  const restartTour = useCallback(() => {
    killTween();
    userInteractedRef.current = false;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: false, duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    updateProgressDOM(0);
    setCanRestart(false);
    setTourState('idle');
  }, [killTween]);

  // Auto-scroll banner section video when user opens the website
  useEffect(() => {
    if (!isVisible || !autoStart || hasAutoStartedRef.current) return;

    // Respect reduced motion accessibility
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Only auto-start if visitor opens near top of website
    const initialScroll = window.scrollY || document.documentElement.scrollTop;
    if (initialScroll > 80) return;

    const timer = setTimeout(() => {
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      if (!userInteractedRef.current && currentScroll < 80 && !hasAutoStartedRef.current) {
        hasAutoStartedRef.current = true;
        startTour();
      }
    }, autoStartDelay);

    return () => clearTimeout(timer);
  }, [isVisible, autoStart, autoStartDelay, startTour]);

  // Toggle speed between 1x and 2x
  const toggleSpeed = () => {
    const nextSpeed = speed === 1 ? 2 : 1;
    setSpeed(nextSpeed);

    // If currently running, restart tween with new speed
    if (tourState === 'running') {
      killTween();
      setTimeout(() => {
        const maxScroll = getTargetScroll();
        const currentScroll = window.scrollY || document.documentElement.scrollTop;
        const remainingFraction = maxScroll > 0 ? Math.max((maxScroll - currentScroll) / maxScroll, 0) : 1;
        const dur = Math.max((nextSpeed === 2 ? 10 : 20) * remainingFraction, 0.5);

        const scrollObj = { value: currentScroll };
        tweenRef.current = gsap.to(scrollObj, {
          value: maxScroll,
          duration: dur,
          ease: 'none',
          onUpdate: () => {
            isProgrammaticScrollRef.current = true;
            if (lenisRef.current) lenisRef.current.scrollTo(scrollObj.value, { immediate: true });
            else window.scrollTo(0, scrollObj.value);
            ScrollTrigger.update();
            setTimeout(() => {
              isProgrammaticScrollRef.current = false;
            }, 50);

            const pct = (scrollObj.value / maxScroll) * 100;
            updateProgressDOM(pct);
          },
          onComplete: () => {
            setTourState('completed');
            killTween();
          }
        });
      }, 30);
    }
  };

  // Keyboard and manual input listeners to pause tour automatically
  useEffect(() => {
    const handleWheel = () => {
      userInteractedRef.current = true;
      if (tourState === 'running') pauseTour();
    };

    const handleTouch = () => {
      userInteractedRef.current = true;
      if (tourState === 'running') pauseTour();
    };

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape'].includes(e.key)) {
        userInteractedRef.current = true;
        if (tourState === 'running') pauseTour();
      }
    };

    const handlePointerDown = (e) => {
      if (tourContainerRef.current && !tourContainerRef.current.contains(e.target)) {
        userInteractedRef.current = true;
        if (tourState === 'running') pauseTour();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [tourState, pauseTour]);

  // Kill tween on unmount or route change
  useEffect(() => {
    return () => {
      killTween();
      hasAutoStartedRef.current = false;
      userInteractedRef.current = false;
    };
  }, [location.pathname, killTween]);

  // Sync progress indicator when user manually scrolls or drags scrollbar
  useEffect(() => {
    const handleScroll = () => {
      if (tourState === 'running') {
        if (!isProgrammaticScrollRef.current) {
          userInteractedRef.current = true;
          pauseTour();
        }
      } else {
        const maxScroll = getTargetScroll();
        const currentScroll = window.scrollY || document.documentElement.scrollTop;
        if (maxScroll > 0) {
          const pct = Math.min((currentScroll / maxScroll) * 100, 100);
          updateProgressDOM(pct);
          if (pct >= 99 && tourState !== 'completed') {
            setTourState('completed');
          } else if (pct < 99 && tourState === 'completed') {
            setTourState('paused');
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tourState, pauseTour, getTargetScroll]);

  // Re-sync progress DOM when expanding from minimized
  useEffect(() => {
    if (!isMinimized) {
      updateProgressDOM(progressValueRef.current);
    }
  }, [isMinimized]);

  if (!isVisible) return null;

  // Minimized side tab view
  if (isMinimized) {
    return (
      <button 
        type="button"
        className="auto-tour-minimized-tab"
        onClick={() => setIsMinimized(false)}
        title="Open Cinematic Tour Controls"
        aria-label="Open Cinematic Tour Controls"
      >
        <Play size={13} className="tour-tab-icon" />
        <span className="tour-tab-label">AUTO TOUR</span>
      </button>
    );
  }

  return (
    <aside 
      ref={tourContainerRef}
      className={`auto-tour-bar ${tourState !== 'idle' ? 'is-active' : ''}`}
      aria-label="Automated Atelier Experience Tour"
    >
      {/* Live Aria Status */}
      <span className="sr-only" aria-live="polite">
        {tourState === 'running' 
          ? `Auto tour running at ${speed}x speed` 
          : tourState === 'paused' 
            ? 'Auto tour paused' 
            : tourState === 'completed' 
              ? 'Auto tour completed' 
              : 'Auto tour ready'}
      </span>

      {/* Main Tour Action Button */}
      <button
        type="button"
        className="tour-main-btn"
        onClick={() => {
          if (tourState === 'running') pauseTour();
          else startTour();
        }}
        aria-label={
          tourState === 'running' 
            ? 'Pause auto tour' 
            : tourState === 'paused' 
              ? 'Resume auto tour' 
              : tourState === 'completed' 
                ? 'Replay auto tour' 
                : 'Start auto tour'
        }
      >
        {tourState === 'running' ? (
          <>
            <Pause size={14} className="tour-icon pulse" />
            <span className="tour-label">PAUSE TOUR</span>
          </>
        ) : tourState === 'paused' ? (
          <>
            <Play size={14} className="tour-icon" />
            <span className="tour-label">RESUME TOUR</span>
          </>
        ) : tourState === 'completed' ? (
          <>
            <RotateCcw size={14} className="tour-icon" />
            <span className="tour-label">REPLAY FILM</span>
          </>
        ) : (
          <>
            <Play size={14} className="tour-icon" />
            <span className="tour-label">CINEMATIC TOUR</span>
          </>
        )}
      </button>

      {/* Speed 1x / 2x Toggle */}
      <button
        type="button"
        className={`tour-speed-toggle ${speed === 2 ? 'is-fast' : ''}`}
        onClick={toggleSpeed}
        title="Toggle speed (1x: 20s, 2x: 10s)"
        aria-label={`Current playback speed ${speed}x. Click to switch to ${speed === 1 ? '2x' : '1x'}`}
      >
        <Zap size={12} />
        <span>{speed}×</span>
      </button>

      {/* Restart Button (Active once >2% progress) */}
      {canRestart && (
        <button
          type="button"
          className="tour-restart-btn"
          onClick={restartTour}
          title="Restart tour from beginning"
          aria-label="Restart tour from top"
        >
          <RotateCcw size={12} />
        </button>
      )}

      {/* Progress Track and Percentage readout */}
      <div className="tour-progress-box">
        <div className="tour-progress-track">
          <div ref={progressBarRef} className="tour-progress-fill" style={{ width: '0%' }} />
        </div>
        <span ref={progressTextRef} className="tour-progress-text technical-text">0%</span>
      </div>

      {/* Cross / Minimize Button */}
      <button
        type="button"
        className="tour-close-btn"
        onClick={(e) => {
          e.stopPropagation();
          if (tourState === 'running') pauseTour();
          setIsMinimized(true);
        }}
        title="Minimize Tour Bar"
        aria-label="Minimize auto tour bar to side"
      >
        <X size={13} />
      </button>
    </aside>
  );
};

export default AutoTour;
