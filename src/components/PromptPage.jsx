import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Sparkles, Terminal, FileVideo, Cpu, Layers } from 'lucide-react';
import './PromptPage.css';

const RECONSTRUCTION_PROMPT = `VIDEO_FILENAME: public/media/desktop.mp4 (served in browser as /media/desktop.mp4)

CONCEPT:
Bespoke Technical Bag Manufacturing & Corporate Fleet Atelier.
A 500vh scroll-scrubbed native HTML5 video landing hero that demystifies the physical manufacturing journey of custom corporate bags—from hand-calibrated Cordura 1000D cutting and industrial SBS zipper assembly to precision client emblem debossing, luxury VIP onboarding kitting, and global palletized dispatch.

BRAND IDENTITY & ART DIRECTION BRIEF:
- Brand Name: ASKMEBAG / Atelier Fleet & Technical Bag Manufacturing
- Product Offering: Custom Engineered Ballistic Cordura Backpacks, Executive Folios, and Enterprise Tech Bags with debossed corporate insignia, custom dyed textiles, and Net-30 bulk contracting.
- Target Audience: Corporate gifting executives, tech fleet procurement leads, conference managers, and bespoke private label brands.
- Minimum Order Quantity (MOQ): 50 Units across all fleet tiers.
- Palette Hex Tokens:
    • Primary Ivory Ground: #F4F0E8
    • Deep Atelier Charcoal: #1B1B19 & #121211
    • Warm Bronze / Terracotta Accent: #A35D33
    • Tactical Olive: #59604B
    • Architectural Stone: #D9D3C8
- Typography:
    • Primary & Heading: 'Poppins', sans-serif (Weights: 300, 400, 500, 600, 700, 800, 900)
    • Technical Telemetry & Instruments: 'JetBrains Mono', monospace

NARRATIVE CHAPTERS (10.0s NATIVE VIDEO SCRUB):
• Chapter 01 (0.00 – 0.22 | 0.0s – 2.2s): RAW WEAVE & CALIPER GEOMETRY
  - Visual: Craftsman measuring and slicing Cordura 1000D with rotary blade and ruler.
  - Telemetry: 12.4mm caliper gauge, 380 N warp tear strength, 45° bias cutting reticle.
• Chapter 02 (0.22 – 0.46 | 2.2s – 4.6s): HARDWARE INTEGRATION & TENSILE RIGIDITY
  - Visual: Rigorous testing of heavy matte SBS/YKK luggage zippers on main gusset.
  - Telemetry: No. 8 luggage zips, 15,000 cycle rating, 42-stitch bar-tack reinforcement.
• Chapter 03 (0.46 – 0.70 | 4.6s – 7.0s): BESPOKE CORPORATE IDENTITY EMBEDDING
  - Visual: Assembly team inspecting finished packs debossed with client emblem ("Gnedit COPORTS").
  - Telemetry: PMS 426C & Cool Gray color calibration, sub-surface heat deboss, front crest alignment.
• Chapter 04 (0.70 – 0.88 | 7.0s – 8.8s): ATELIER PRESENTATION KITTING
  - Visual: Packing custom backpack into rigid executive box with matching debossed notebook and pen.
  - Telemetry: 680g rigid presentation tare, magnetic closure, VIP employee onboarding package.
• Chapter 05 (0.88 – 1.00 | 8.8s – 10.0s): FLEET PALLETIZATION & GLOBAL DISPATCH
  - Visual: Rows of completed fleet packs on pallets tape-sealed for international freight.
  - Telemetry: 50 Units MOQ, 3-4 week production window, air & sea logistics.

SIGNATURE MOTION BEHAVIORS:
1. Native HTML5 ScrollVideo engine with exponential playhead damping (DAMPING_FACTOR = 0.085) and hardware seek gate (SEEK_EPSILON = 0.016s).
2. Lenis smooth scrolling driven exclusively through GSAP's ticker (no duplicate RAF loops).
3. Floating Auto Tour controller with 1x (20s) and 2x (10s) speed toggle, linear GSAP tween, zero-rerender ref progress tracking, and key/wheel pause protection.
4. SVG Caliper Crosshair and Corner Reticles dynamically resizing with active chapter indices.
5. Interactive chapter pill scrubber enabling rapid non-linear navigation across video phases.

TECHNICAL STACK:
- React 19, TypeScript/JSX, Vite
- GSAP 3 with ScrollTrigger
- Lenis Smooth Scrolling
- Lucide React Icons
- Native HTML5 Video (No WebGL/canvas simulation)`;

const PromptPage = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(RECONSTRUCTION_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="prompt-page-wrap">
      <div className="editorial-container">
        
        {/* Navigation Back to Experience */}
        <div className="prompt-nav-bar">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            <span>RETURN TO ATELIER EXPERIENCE</span>
          </Link>
          <div className="prompt-badge technical-text">
            <Sparkles size={12} className="sparkle-icon" />
            <span>KIMI K3 RECONSTRUCTION ARCHIVE</span>
          </div>
        </div>

        {/* Hero Header */}
        <header className="prompt-header">
          <div className="prompt-eyebrow technical-text">SYSTEM BLUEPRINT // PRODUCTION RECONSTRUCTION</div>
          <h1 className="prompt-title">Atelier Scroll Video Architecture</h1>
          <p className="prompt-lead">
            Complete creative brief, narrative breakdown, telemetry specifications, and self-contained reconstruction prompt for the ASKMEBAG 500vh scroll-scrubbed commercial video engine.
          </p>
        </header>

        {/* Overview Metadata Grid */}
        <div className="prompt-meta-grid">
          
          <div className="meta-card">
            <div className="meta-card-head">
              <FileVideo size={18} className="meta-icon" />
              <span className="technical-text">MEDIA ASSET SPEC</span>
            </div>
            <div className="meta-row">
              <span className="meta-k">Source Video</span>
              <span className="meta-v">/media/desktop.mp4</span>
            </div>
            <div className="meta-row">
              <span className="meta-k">Resolution</span>
              <span className="meta-v">1920 × 1080 (16:9 4K Master)</span>
            </div>
            <div className="meta-row">
              <span className="meta-k">Framerate</span>
              <span className="meta-v">24.000 FPS Progressive</span>
            </div>
            <div className="meta-row">
              <span className="meta-k">Duration</span>
              <span className="meta-v">10.00 Seconds Exact</span>
            </div>
          </div>

          <div className="meta-card">
            <div className="meta-card-head">
              <Cpu size={18} className="meta-icon" />
              <span className="technical-text">ENGINE ARCHITECTURE</span>
            </div>
            <div className="meta-row">
              <span className="meta-k">Scrub Engine</span>
              <span className="meta-v">Exponential Damping (0.085)</span>
            </div>
            <div className="meta-row">
              <span className="meta-k">Scroll Driver</span>
              <span className="meta-v">Lenis + GSAP Ticker</span>
            </div>
            <div className="meta-row">
              <span className="meta-k">Auto Tour</span>
              <span className="meta-v">1× (20s) & 2× (10s) Linear Tween</span>
            </div>
            <div className="meta-row">
              <span className="meta-k">Hardware Gating</span>
              <span className="meta-v">Drain Pending on Seeked</span>
            </div>
          </div>

          <div className="meta-card">
            <div className="meta-card-head">
              <Layers size={18} className="meta-icon" />
              <span className="technical-text">BRAND IDENTITY</span>
            </div>
            <div className="meta-row">
              <span className="meta-k">Brand Name</span>
              <span className="meta-v">ASKMEBAG Atelier</span>
            </div>
            <div className="meta-row">
              <span className="meta-k">Primary Palette</span>
              <span className="meta-v">#F4F0E8 / #1B1B19 / #A35D33</span>
            </div>
            <div className="meta-row">
              <span className="meta-k">Global Font</span>
              <span className="meta-v">Poppins (300-900)</span>
            </div>
            <div className="meta-row">
              <span className="meta-k">Minimum Order</span>
              <span className="meta-v">50 Units (MOQ Enforced)</span>
            </div>
          </div>

        </div>

        {/* Prompt Terminal Box with Copy Action */}
        <section className="prompt-box-section">
          <div className="prompt-box-header">
            <div className="prompt-box-title">
              <Terminal size={16} />
              <span>SELF-CONTAINED RECONSTRUCTION PROMPT</span>
            </div>
            <button 
              type="button" 
              className={`copy-prompt-btn ${copied ? 'is-copied' : ''}`}
              onClick={handleCopy}
              aria-label="Copy reconstruction prompt to clipboard"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>PROMPT COPIED!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>COPY PROMPT</span>
                </>
              )}
            </button>
          </div>

          <pre className="prompt-code-block">
            <code>{RECONSTRUCTION_PROMPT}</code>
          </pre>
        </section>

      </div>
    </div>
  );
};

export default PromptPage;
