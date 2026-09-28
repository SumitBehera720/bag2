import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  ChevronDown,
  Sparkles,
  Layers,
  Sliders,
  Box,
  Truck,
  Compass
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollVideo from '../components/ScrollVideo';
import { useSmoothScroll } from '../components/SmoothScroll';
import { buildWhatsAppUrl } from '../config';
import './HeroExperience.css';

gsap.registerPlugin(ScrollTrigger);

// 5 Narrative Chapters mapped across the 10-second atelier film
const CHAPTERS = [
  {
    id: 1,
    range: [0.0, 0.22],
    num: '01',
    phase: 'RAW WEAVE CUTTING',
    headline: 'BUILT AROUND\nYOUR IDEA.',
    title: 'Precision Pattern Geometry & Ballistic Weaves',
    description: 'Every bespoke fleet commission starts with hand-calibrated pattern cutting. Industrial 1000D ballistic weaves are sliced to 0.2mm tolerance for unmatched structural integrity.',
    badge: 'STAGE 01 // CORDURA® 1000D / 45° BIAS'
  },
  {
    id: 2,
    range: [0.22, 0.46],
    num: '02',
    phase: 'HARDWARE INTEGRATION',
    headline: 'HEAVY HARDWARE.\nZERO COMPROMISE.',
    title: 'Reinforced Zips & Stress Anchoring',
    description: 'Main luggage gussets fitted with high-gauge matte industrial zipper tracks, bar-tacked with 42-stitch stress reinforcement to withstand 15,000 continuous opening cycles.',
    badge: 'STAGE 02 // INDUSTRIAL NO. 8 SBS HARDWARE'
  },
  {
    id: 3,
    range: [0.46, 0.70],
    num: '03',
    phase: 'BRAND EMBLEM ALIGNMENT',
    headline: 'YOUR EMBLEM.\nFLAWLESSLY CRAFTED.',
    title: 'Bespoke Corporate Insignia Debossing',
    description: 'Watch the atelier production floor personalize each unit with corporate identity. Debossed badges, dual logo placements, and pantone-matched embroidery created for modern enterprise teams.',
    badge: 'STAGE 03 // PMS COLOR EMBLEM & DEBOSS'
  },
  {
    id: 4,
    range: [0.70, 0.88],
    num: '04',
    phase: 'ATELIER PRESENTATION',
    headline: 'EXECUTIVE TIER\nGIFT PRESENTATION.',
    title: 'Custom VIP Onboarding Kitting',
    description: 'Bespoke bags nestled inside rigid presentation packaging, paired with matching debossed leather executive journals and weighted aluminum writing instruments for immediate gifting.',
    badge: 'STAGE 04 // 680G RIGID GIFT PRESENTATION'
  },
  {
    id: 5,
    range: [0.88, 1.0],
    num: '05',
    phase: 'ENTERPRISE PALLETIZATION',
    headline: 'FLEET SCALE.\nGLOBAL DISPATCH.',
    title: 'Volume Deployment & QC Verification',
    description: 'Mass scale completed fleet units stacked and sealed for international corporate deployment. Full inventory tracking, batch QC audit certificates, and direct desk delivery.',
    badge: 'STAGE 05 // MOQ 50 UNITS • GLOBAL FREIGHT'
  }
];

const HeroExperience = () => {
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(10);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const { scrollTo, lenis } = useSmoothScroll();

  // Pin the hero viewport during scroll and scrub smoothly through chapters
  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        pin: viewport,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.6, // Silky smooth interpolation
        onUpdate: (self) => {
          const p = self.progress;
          setScrollProgress(p);

          // Find current chapter
          let idx = 0;
          for (let i = 0; i < CHAPTERS.length; i++) {
            const [min, max] = CHAPTERS[i].range;
            if (p >= min && p <= max) {
              idx = i;
              break;
            }
          }
          setActiveChapterIndex(idx);
        }
      });
    }, track);

    return () => ctx.revert();
  }, []);

  const activeChapter = CHAPTERS[activeChapterIndex] || CHAPTERS[0];

  // Jump smoothly to a specific chapter
  const handleJumpToChapter = (index) => {
    if (!trackRef.current) return;
    const targetFraction = CHAPTERS[index].range[0] + 0.04;
    const trackRect = trackRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const targetScroll = scrollTop + trackRect.top + targetFraction * (trackRect.height - window.innerHeight);
    scrollTo(targetScroll);
  };

  // Format timecode (00:00:00)
  const formatTimecode = (sec) => {
    const totalSec = Math.max(sec, 0);
    const m = Math.floor(totalSec / 60);
    const s = Math.floor(totalSec % 60);
    const ms = Math.floor((totalSec % 1) * 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(ms).padStart(2, '0')}`;
  };

  const tweenRef = useRef(null);
  const autoPlayFiredRef = useRef(false);

  // Trigger smooth auto-play / auto-scroll when visitor opens website
  useEffect(() => {
    // Only auto-play if at the top on initial load
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    if (currentScroll > 60 || autoPlayFiredRef.current) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const killAutoPlay = () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };

    // User interaction listeners to cancel auto-play
    const handleUserInteraction = () => {
      killAutoPlay();
    };

    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction);

    const timer = setTimeout(() => {
      if ((window.scrollY || document.documentElement.scrollTop) > 60) return;
      autoPlayFiredRef.current = true;

      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const targetScroll = Math.max(scrollTop + rect.top + rect.height - window.innerHeight, 100);

      const scrollObj = { value: scrollTop };
      // Smooth cinematic auto-play scroll through the banner section video
      tweenRef.current = gsap.to(scrollObj, {
        value: targetScroll,
        duration: 18,
        ease: 'none',
        onUpdate: () => {
          if (lenis) {
            lenis.scrollTo(scrollObj.value, { immediate: true });
          } else {
            window.scrollTo(0, scrollObj.value);
          }
          ScrollTrigger.update();
        },
        onComplete: () => {
          killAutoPlay();
        }
      });
    }, 900);

    return () => {
      clearTimeout(timer);
      killAutoPlay();
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [lenis]);

  return (
    <div id="atelier-hero-track" ref={trackRef} className="hero-scroll-track">
      
      {/* Viewport Pinned by GSAP ScrollTrigger */}
      <div ref={viewportRef} className="hero-pinned-viewport">
        
        {/* Native HTML5 Scrubbed Video Background */}
        <ScrollVideo
          src="/media/desktop.mp4"
          scrollProgress={scrollProgress}
          onDurationChange={setVideoDuration}
          onTimeUpdate={setCurrentVideoTime}
          enableParallax={true}
        />

        {/* Ambient Grid Reticle */}
        <div className="hero-atelier-grid" aria-hidden="true" />

        {/* Main Center-Left Cinematic Narrative Content */}
        <div className="hero-stage-content">
          <div className="editorial-container">
            <div className="narrative-content-wrap">
              
              {/* Stage Eyebrow */}
              <div className="stage-eyebrow-row">
                <span className="stage-index-badge technical-text">{activeChapter.badge}</span>
              </div>

              {/* Dynamic Headline with Smooth Transition */}
              <h1 className="hero-main-title">
                {activeChapter.headline.split('\n').map((line, idx) => (
                  <span key={idx} className="title-line">
                    {line}
                    <br />
                  </span>
                ))}
              </h1>

              {/* Sub-headline & Story */}
              <h2 className="chapter-subtitle">{activeChapter.title}</h2>
              <p className="chapter-narrative-copy">{activeChapter.description}</p>

              {/* CTA Action Group */}
              <div className="hero-cta-group">
                <a
                  href={buildWhatsAppUrl(`Hi ASKMEBAG team, I watched the atelier production film and I would like to commission a custom bag order for Stage ${activeChapter.num} (${activeChapter.title}). Please advise on volume terms.`)}
                  className="btn-hero-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>START CUSTOM ORDER (MOQ 50)</span>
                  <ArrowUpRight size={16} />
                </a>

                <Link to="/custom" className="btn-hero-secondary">
                  <span>OPEN CUSTOM STUDIO</span>
                </Link>

                <a href="#quote-calculator" className="btn-hero-tertiary desktop-only">
                  <span>VOLUME TIERS</span>
                  <ChevronDown size={14} />
                </a>
              </div>

              {/* Quality & MOQ Proof Badges */}
              <div className="hero-proof-marks">
                <span className="proof-mark-item">
                  <CheckCircle2 size={13} className="proof-icon" />
                  MINIMUM ORDER 50 UNITS (MOQ)
                </span>
                <span className="proof-mark-item">
                  <CheckCircle2 size={13} className="proof-icon" />
                  PRE-PRODUCTION PHYSICAL SAMPLE INCLUDED
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Interactive Scroll Indicator */}
        <div className="hero-scroll-cue" aria-hidden="true">
          <div className="cue-mouse">
            <div className="cue-wheel" />
          </div>
          <span className="cue-text technical-text">SCRUB ATELIER FILM // SCROLL TO ADVANCE</span>
        </div>

      </div>

    </div>
  );
};

export default HeroExperience;
