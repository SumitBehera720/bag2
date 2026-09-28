import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Anchor, 
  Wind, 
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './ProductAnatomy.css';

const ANATOMY_POINTS = [
  {
    id: 1,
    title: 'High-Tenacity Exterior Armor',
    category: 'SHELL ARCHITECTURE',
    shortName: '01 Shell',
    icon: Layers,
    pos: { top: '26%', left: '50%' },
    badge: '1000D DWR FINISH',
    desc: 'High-density tactical weave treated with environmentally compliant DWR coating to repel rain, road grime, and industrial abrasion.',
    spec: 'Hydrostatic Head: 10,000mm // UV-Grade 4'
  },
  {
    id: 2,
    title: 'Reinforced Box-X Bar-Tack Anchors',
    category: 'STRESS ARCHITECTURE',
    shortName: '02 Stress',
    icon: Anchor,
    pos: { top: '15%', left: '32%' },
    badge: '45KG TENSILE LOAD',
    desc: 'Dual-pass computerized bar-tack stitching at all handle, strap, and bottom attachment points to eliminate blowouts under heavy payload.',
    spec: '8–10 Stitches/Inch // Bonded Nylon 6.6 Thread'
  },
  {
    id: 3,
    title: 'Suspended 360° Tech Vault',
    category: 'DEVICE PROTECTION',
    shortName: '03 Vault',
    icon: Cpu,
    pos: { top: '44%', left: '48%' },
    badge: 'SHOCK-ABSORBING EVA',
    desc: 'Elevated laptop compartment that stays suspended 1 inch off the bottom floor, surrounded by 10mm high-density impact-absorbing foam.',
    spec: 'Fits up to specified laptop dimensions // Microfiber lining'
  },
  {
    id: 4,
    title: 'Weather-Sealed Reverse Zippers',
    category: 'CLOSURE ENGINEERING',
    shortName: '04 Zippers',
    icon: ShieldCheck,
    pos: { top: '38%', left: '72%' },
    badge: 'AQUAGUARD CYCLE TESTED',
    desc: 'Reverse-coil continuous track with polyurethane water barrier and custom cast matte zinc pulls for smooth one-hand operation.',
    spec: '10,000 Pull Cycle Warranty // Anti-Snag Guard'
  },
  {
    id: 5,
    title: 'Ergonomic Air-Channel Chassis',
    category: 'ERGONOMICS & COMFORT',
    shortName: '05 Chassis',
    icon: Wind,
    pos: { top: '68%', left: '35%' },
    badge: 'DUAL-DENSITY FOAM',
    desc: 'Contoured load-distribution harness with breathable 3D honeycomb mesh backing that promotes lumbar airflow during all-day transit.',
    spec: '40% Reduced Shoulder Pressure // Luggage Pass'
  },
  {
    id: 6,
    title: 'Bespoke Brand Insignia Zone',
    category: 'CUSTOM EMBELLISHMENT',
    shortName: '06 Brand',
    icon: Award,
    pos: { top: '58%', left: '58%' },
    badge: 'PANTONE MATCHED',
    desc: 'Flat reinforced branding landing designed for blind leather debossing, 3D high-density silicone transfer, or laser-serialized metal plaques.',
    spec: 'Zero Bleed // Micron Precision Registration'
  }
];

const ProductAnatomy = ({ product }) => {
  const [activePoint, setActivePoint] = useState(1);

  if (!product) return null;

  const currentActive = ANATOMY_POINTS.find(p => p.id === activePoint) || ANATOMY_POINTS[0];
  const laptopFitText = product.laptopFit || '15.6" Laptop';
  const primaryMaterial = product.materials?.[0] || 'Tactical Cordura 1000D';

  const handlePrev = () => {
    setActivePoint(prev => (prev === 1 ? ANATOMY_POINTS.length : prev - 1));
  };

  const handleNext = () => {
    setActivePoint(prev => (prev === ANATOMY_POINTS.length ? 1 : prev + 1));
  };

  // Customize description dynamically based on the product
  let dynamicDesc = currentActive.desc;
  if (currentActive.id === 1) {
    dynamicDesc = `Crafted with ${primaryMaterial} and high-tenacity reinforcement fibers, treated with DWR barrier to withstand aggressive urban and commercial use.`;
  } else if (currentActive.id === 3) {
    dynamicDesc = `Padded chamber engineered to securely fit up to ${laptopFitText}, suspended safely above the base with 10mm high-density EVA shock dampening.`;
  }

  const ActiveIcon = currentActive.icon;

  return (
    <section className="product-anatomy-section">
      <div className="editorial-container">
        
        {/* Compact Anatomy Header */}
        <div className="anatomy-header">
          <div className="anatomy-eyebrow technical-text">
            <span>ENGINEERING SCHEMATIC // DECONSTRUCTED ARCHITECTURE</span>
            <span className="anatomy-id-tag">FIG 02. ANATOMY</span>
          </div>
          <h2 className="anatomy-main-title">
            The Anatomy of {product.name}
          </h2>
          <p className="anatomy-subtitle">
            Every millimeter is purposefully engineered from internal shock isolation to high-stress anchor points.
          </p>
        </div>

        {/* Anatomy Interactive Arena: Compact Side-by-Side Blueprint */}
        <div className="anatomy-interactive-grid">
          
          {/* Left: Interactive Hotspot Stage */}
          <div className="anatomy-stage-box">
            <div className="stage-blueprint-grid"></div>

            <div className="stage-top-meta technical-text">
              <span className="live-pulse-indicator">
                <span className="pulse-dot"></span>
                <span>INTERACTIVE SCHEMATIC</span>
              </span>
              <span className="active-focus-label">
                LAYER 0{currentActive.id} // {currentActive.category}
              </span>
            </div>

            {/* Product Center Visual with Hotspots */}
            <div className="anatomy-visual-container">
              <img 
                src={product.cutoutImage} 
                alt={`${product.name} Anatomy`} 
                className="anatomy-bag-image"
              />

              {/* Pulsing Hotspot Markers */}
              {ANATOMY_POINTS.map((pt) => {
                const isSelected = activePoint === pt.id;
                return (
                  <button
                    key={pt.id}
                    type="button"
                    className={`anatomy-hotspot-pin ${isSelected ? 'active' : ''}`}
                    style={{ top: pt.pos.top, left: pt.pos.left }}
                    onClick={() => setActivePoint(pt.id)}
                    aria-label={`View ${pt.title}`}
                    title={pt.title}
                  >
                    <span className="pin-radar"></span>
                    <span className="pin-number">{pt.id}</span>
                  </button>
                );
              })}
            </div>

            {/* Stage Bottom Floating Pill */}
            <div className="stage-active-pill technical-text">
              <span className="pill-title">{currentActive.title}</span>
              <span className="pill-badge">{currentActive.badge}</span>
            </div>
          </div>

          {/* Right: Streamlined Spotlight Inspector & Quick Tiles */}
          <div className="anatomy-details-col">
            
            {/* Quick Pill Tabs for Instant Switching */}
            <div className="anatomy-tabs-row technical-text">
              {ANATOMY_POINTS.map((pt) => (
                <button
                  key={pt.id}
                  type="button"
                  className={`anatomy-tab-btn ${activePoint === pt.id ? 'active' : ''}`}
                  onClick={() => setActivePoint(pt.id)}
                >
                  {pt.shortName}
                </button>
              ))}
            </div>

            {/* Spotlight Active Layer Inspector Card */}
            <div className="anatomy-spotlight-card">
              <div className="spotlight-top-bar">
                <div className="spotlight-indicator">
                  <span className="spotlight-num technical-text">0{currentActive.id}</span>
                  <div className="spotlight-meta">
                    <span className="spotlight-cat technical-text">{currentActive.category}</span>
                    <h3 className="spotlight-title">{currentActive.title}</h3>
                  </div>
                </div>
                <div className="spotlight-badge technical-text">{currentActive.badge}</div>
              </div>

              <p className="spotlight-desc">{dynamicDesc}</p>

              <div className="spotlight-spec-box technical-text">
                <span className="spec-label">FACTORY STANDARD:</span>
                <span className="spec-value">{currentActive.spec}</span>
              </div>

              {/* Prev / Next Controls */}
              <div className="spotlight-nav-row">
                <button 
                  type="button" 
                  className="spotlight-nav-btn technical-text"
                  onClick={handlePrev}
                  aria-label="Previous layer"
                >
                  <ChevronLeft size={14} /> PREV POINT
                </button>
                
                <span className="spotlight-counter technical-text">
                  POINT 0{currentActive.id} OF 0{ANATOMY_POINTS.length}
                </span>

                <button 
                  type="button" 
                  className="spotlight-nav-btn technical-text"
                  onClick={handleNext}
                  aria-label="Next layer"
                >
                  NEXT POINT <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Compact 3x2 Quick-Selector Grid */}
            <div className="anatomy-quick-grid">
              {ANATOMY_POINTS.map((pt) => {
                const isSelected = activePoint === pt.id;
                const TileIcon = pt.icon;
                return (
                  <button
                    key={pt.id}
                    type="button"
                    className={`anatomy-quick-tile ${isSelected ? 'active' : ''}`}
                    onClick={() => setActivePoint(pt.id)}
                  >
                    <div className="tile-icon-wrap">
                      <TileIcon size={14} />
                    </div>
                    <div className="tile-info">
                      <span className="tile-idx technical-text">0{pt.id}</span>
                      <span className="tile-title">{pt.title.split(' ')[0]} {pt.title.split(' ')[1] || ''}</span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* Streamlined Bottom Technical Specifications Strip */}
        <div className="anatomy-tech-bar technical-text">
          <div className="tech-bar-cell">
            <span className="tech-cell-label">SHELL TENSILE</span>
            <span className="tech-cell-val">{primaryMaterial}</span>
          </div>
          <div className="tech-bar-cell">
            <span className="tech-cell-label">TECH COMPARTMENT</span>
            <span className="tech-cell-val">FITS {laptopFitText}</span>
          </div>
          <div className="tech-bar-cell">
            <span className="tech-cell-label">TOTAL VOLUME</span>
            <span className="tech-cell-val">{product.capacity}</span>
          </div>
          <div className="tech-bar-cell">
            <span className="tech-cell-label">STITCH DENSITY</span>
            <span className="tech-cell-val">8-10 SPI BOX-X REINFORCED</span>
          </div>
          <div className="tech-bar-cell">
            <span className="tech-cell-label">HARDWARE CYCLE</span>
            <span className="tech-cell-val">10,000 ZIP ACTUATION TEST</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductAnatomy;
