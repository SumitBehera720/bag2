import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SmoothScrollContext = createContext({
  lenis: null,
  scrollTo: () => {},
  isReducedMotion: false,
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  const [lenisInstance, setLenisInstance] = useState(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Detect reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => {
      setIsReducedMotion(e.matches);
      if (lenisRef.current) {
        if (e.matches) {
          lenisRef.current.destroy();
          lenisRef.current = null;
          setLenisInstance(null);
        }
      }
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    if (mediaQuery.matches) {
      return () => mediaQuery.removeEventListener('change', handleMotionChange);
    }

    // Initialize Lenis with production parameters
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      autoResize: true,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;
    setLenisInstance(lenis);

    // Forward Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis exclusively through GSAP's ticker (no duplicate RAF loops)
    const tickerUpdate = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
      setLenisInstance(null);
    };
  }, []);

  const scrollTo = (target, options = {}) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...options,
      });
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance, scrollTo, isReducedMotion }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScroll;
