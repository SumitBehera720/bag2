import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sliders, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import './CustomizationSection.css';

const customizationCards = [
  { 
    id: '01', 
    title: 'MATERIAL SELECTION', 
    desc: 'Tactical Cordura 1000D, Ballistic Nylon 1680D, Heavy Twill Canvas & Recycled Ocean RPET.' 
  },
  { 
    id: '02', 
    title: 'COLOUR & PANTONE DYEING', 
    desc: 'Precision mill dyeing matched directly to your enterprise Pantone & corporate hex guidelines.' 
  },
  { 
    id: '03', 
    title: 'LOGO & BRAND EMBELLISHMENT', 
    desc: 'Tactile 3D raised embroidery, laser-engraved metal plaques, hot debossed leather patches & HD print.' 
  },
  { 
    id: '04', 
    title: 'ENGINEERED COMPARTMENTS', 
    desc: 'Shock-proof 16" laptop chambers, concealed passport stash, USB pass-through & cable management.' 
  },
  { 
    id: '05', 
    title: 'FLEET CAPACITY & SIZING', 
    desc: 'Structural volume tailored from 9L compact EDC slings to 45L multi-day executive travel fleet duffles.' 
  },
  { 
    id: '06', 
    title: 'HARDWARE & REINFORCEMENTS', 
    desc: 'Industrial SBS & YKK heavy-gauge zippers, paracord pullers, alloy buckles & bar-tack load stitching.' 
  }
];

const CustomizationSection = () => {
  return (
    <section className="editorial-customization" id="custom">
      <div className="editorial-container">
        
        {/* Section Header */}
        <div className="custom-section-header">
          <div className="custom-eyebrow technical-text">
            <span>02 // BESPOKE OEM &amp; ODM PRODUCTION</span>
            <span className="custom-moq-pill">
              <CheckCircle2 size={12} /> MINIMUM ORDER 50 UNITS (MOQ)
            </span>
          </div>
          <h2 className="customization-title">
            NOT JUST A BAG.<br/>
            YOUR BAG.
          </h2>
          <p className="customization-desc">
            We don't sell generic off-the-shelf blanks. Every bag is engineered structurally from scratch around your specific organization, branding, and daily utility requirements.
          </p>
        </div>

        {/* 2-Column Split Showcase */}
        <div className="customization-grid">
          
          {/* Visual Showcase Col */}
          <div className="customization-visual-col">
            <div className="customization-img-wrapper">
              <img 
                src="/media/custom_craft_cover.jpg" 
                alt="Bespoke bag customization detailing showing Pantone color chips, laser engraved brass hardware, and precision stitching." 
                loading="lazy"
                className="customization-cover-img"
              />
              <div className="craft-badge-overlay technical-text">
                <span className="badge-bullet"></span>
                <span>FIG 02 // BESPOKE HARDWARE &amp; TEXTILE LAB</span>
              </div>
            </div>

            {/* Quick Feature Callout Bar */}
            <div className="custom-callout-strip">
              <div className="callout-item">
                <span className="callout-num technical-text">5–7 DAYS</span>
                <span className="callout-label">Physical Prototype</span>
              </div>
              <div className="callout-divider"></div>
              <div className="callout-item">
                <span className="callout-num technical-text">FROM 1 PC</span>
                <span className="callout-label">No Minimum Order</span>
              </div>
              <div className="callout-divider"></div>
              <div className="callout-item">
                <span className="callout-num technical-text">100% CAD</span>
                <span className="callout-label">Pattern Verification</span>
              </div>
            </div>
          </div>

          {/* Structured Cards Column */}
          <div className="customization-text-col">
            <div className="customization-cards-list">
              {customizationCards.map((card) => (
                <div className="custom-spec-card" key={card.id}>
                  <div className="card-top-row">
                    <span className="card-step-id technical-text">{card.id}</span>
                    <h3 className="card-step-title">{card.title}</h3>
                  </div>
                  <p className="card-step-desc">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Box */}
            <div className="custom-cta-box">
              <div className="cta-box-text">
                <span className="cta-box-title">Ready to see your logo on our bags?</span>
                <span className="cta-box-sub">Launch our interactive live 3D prototyper studio.</span>
              </div>
              <Link to="/custom" className="btn-open-custom-studio">
                <Sliders size={16} />
                <span>OPEN LIVE CUSTOM STUDIO</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CustomizationSection;
