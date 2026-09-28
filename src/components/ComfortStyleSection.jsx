import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, CheckCircle2, Feather, Shield, Compass } from 'lucide-react';
import { buildWhatsAppUrl } from '../config';
import './ComfortStyleSection.css';

const ComfortStyleSection = () => {
  return (
    <section className="comfort-style-section" id="comfort-style">
      <div className="editorial-container">
        
        {/* Section Header */}
        <div className="comfort-header">
          <div className="comfort-eyebrow technical-text">
            <Sparkles size={13} className="sparkle-icon" />
            <span>ATELIER ERGONOMICS // THE CRAFT PHILOSOPHY</span>
          </div>
          <h2 className="comfort-slogan-title">
            Engineered for Comfort.<br className="desktop-break" />
            Designed for Style.
          </h2>
          <p className="comfort-slogan-lead">
            Where human biomechanics meets executive boardroom elegance. Every bespoke silhouette is crafted with ergonomic weight-distribution harnesses, breathable airflow channels, and tailored waterproof textiles — ensuring all-day comfort without sacrificing your brand's sophisticated presence.
          </p>
        </div>

        {/* Feature Showcase Grid */}
        <div className="comfort-showcase-grid">
          
          {/* Left Feature Pillars Column */}
          <div className="comfort-pillars-col">
            
            <div className="comfort-pillar-card">
              <div className="pillar-header-row">
                <span className="pillar-num technical-text">01 // ERGONOMICS</span>
                <Feather size={16} className="pillar-icon" />
              </div>
              <h3 className="pillar-title">Anatomic Load Distribution</h3>
              <p className="pillar-desc">
                Contoured dual-density EVA memory foam and breathable 3D air-mesh padding cradle the cervical and lumbar spine, dissipating heavy fleet equipment weight across long transit days.
              </p>
              <div className="pillar-tags technical-text">
                <span className="pillar-tag-item">Airflow Lumbar Channel</span>
                <span className="pillar-tag-item">40% Stress Relief</span>
              </div>
            </div>

            <div className="comfort-pillar-card">
              <div className="pillar-header-row">
                <span className="pillar-num technical-text">02 // ARCHITECTURE</span>
                <Compass size={16} className="pillar-icon" />
              </div>
              <h3 className="pillar-title">Tailored Roll-Top Silhouette</h3>
              <p className="pillar-desc">
                Clean, architectural geometry crafted from hydrophobic Cordura 1000D weave, accented with vegetable-tanned full-grain leather straps and matte bronze anodized hardware.
              </p>
              <div className="pillar-tags technical-text">
                <span className="pillar-tag-item">Scalable Volume</span>
                <span className="pillar-tag-item">Italian Leather Accents</span>
              </div>
            </div>

            <div className="comfort-pillar-card">
              <div className="pillar-header-row">
                <span className="pillar-num technical-text">03 // UTILITY</span>
                <Shield size={16} className="pillar-icon" />
              </div>
              <h3 className="pillar-title">Airport & Executive Utility</h3>
              <p className="pillar-desc">
                Suspended 16-inch shock-proof laptop vault, magnetic quick-release latch, hidden passport security pocket, and integrated luggage trolley pass-through sleeve.
              </p>
              <div className="pillar-tags technical-text">
                <span className="pillar-tag-item">Suspended Tech Vault</span>
                <span className="pillar-tag-item">Trolley Pass-Through</span>
              </div>
            </div>

          </div>

          {/* Right Image Showcase Column */}
          <div className="comfort-image-col">
            <div className="comfort-image-frame">
              <img 
                src="/media/comfort_style_backpack.jpg" 
                alt="Engineered for Comfort and Designed for Style - Luxury Bespoke Roll-Top Backpack"
                className="comfort-featured-img"
                loading="lazy"
              />

              {/* Floating Quality Assurance Badge */}
              <div className="comfort-floating-badge">
                <span className="badge-tag technical-text">ATELIER SPECIFICATION</span>
                <span className="badge-highlight">Zero-Fatigue Architecture</span>
                <span className="badge-sub technical-text">LIMITED BESPOKE FLEET PRODUCTION</span>
              </div>

              {/* Inset Hotspot Annotation */}
              <div className="image-hotspot-pin">
                <span className="hotspot-pulse" />
                <span className="hotspot-label technical-text">3D CONTOUR MESH</span>
              </div>
            </div>
          </div>

        </div>

        {/* Section Bottom Actions & MOQ Proof */}
        <div className="comfort-actions-row">
          <div className="comfort-ctas">
            <Link to="/custom" className="btn-comfort-primary">
              <span>CUSTOMIZE THIS SILHOUETTE</span>
              <ArrowUpRight size={16} />
            </Link>
            
            <a 
              href={buildWhatsAppUrl("Hi ASKMEBAG team, I'm interested in commissioning bags designed around the 'Engineered for Comfort and Designed for Style' ergonomic silhouette. Please advise on fleet terms.")} 
              className="btn-comfort-secondary"
              target="_blank" 
              rel="noreferrer"
            >
              <span>INQUIRE ERGONOMIC FLEET (MOQ 50)</span>
            </a>
          </div>

          <div className="comfort-proof-list">
            <span className="proof-pill">
              <CheckCircle2 size={13} className="proof-icon" />
              MINIMUM ORDER: 50 UNITS (MOQ)
            </span>
            <span className="proof-pill">
              <CheckCircle2 size={13} className="proof-icon" />
              PRE-PRODUCTION PHYSICAL SAMPLE INCLUDED
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ComfortStyleSection;
