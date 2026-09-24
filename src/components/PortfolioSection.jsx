import React from 'react';
import { ArrowUpRight, CheckCircle2, MessageCircle, ShieldCheck, Clock, Layers } from 'lucide-react';
import { buildWhatsAppUrl, generateBulkQuoteMessage } from '../config';
import './PortfolioSection.css';

const projects = [
  {
    id: '01',
    fleetTag: 'FLEET 01 // TACTICAL DAYPACK',
    client: 'TATA TECHNOLOGIES',
    item: 'Tactical Modular Daypack',
    specNote: 'Dual Compartment + Air-Mesh Padding',
    qty: '1,500 UNITS',
    turnaround: '18 Days',
    fabric: 'Ballistic Cordura 1000D',
    branding: 'Laser Metal Plaque + Stitching',
    img: '/products/cutout/3.png',
    alt: 'Tata Technologies tactical modular daypack'
  },
  {
    id: '02',
    fleetTag: 'FLEET 02 // FIELD COMMUTER',
    client: 'HERO MOTOCORP',
    item: 'Enterprise Commuter Daypack',
    specNote: 'Reflective Accents + Bar-Tack Stitching',
    qty: '2,500 UNITS',
    turnaround: '25 Days',
    fabric: '1200D Twill Canvas',
    branding: 'Reflective Screen Print',
    img: '/products/cutout/20.png',
    alt: 'Hero MotoCorp enterprise field team daypack'
  },
  {
    id: '03',
    fleetTag: 'FLEET 03 // CORPORATE CARRIER',
    client: 'INFOSYS GLOBAL',
    item: 'Signature Corporate Carrier',
    specNote: 'Padded Tech Stash + Concealed Zip',
    qty: '3,000 UNITS',
    turnaround: '22 Days',
    fabric: 'Waterproof Poly 900D',
    branding: '3D Raised Embroidery',
    img: '/products/cutout/9.png',
    alt: 'Infosys signature corporate carrier daypack'
  },
  {
    id: '04',
    fleetTag: 'FLEET 04 // EXPEDITION DUFFEL',
    client: 'ADANI ENTERPRISES',
    item: 'Pro Expedition Heavy Duffel',
    specNote: 'Tarpaulin Base + Reinforced Harness',
    qty: '1,200 UNITS',
    turnaround: '20 Days',
    fabric: 'Weatherproof Heavy Canvas',
    branding: 'Embossed Silicone Badge',
    img: '/products/cutout/43.png',
    alt: 'Adani expedition heavy duffel bag'
  }
];

const PortfolioSection = () => {
  const handleQuoteClick = (project) => {
    const count = parseInt(project.qty.replace(/\D/g, '')) || 500;
    const msg = generateBulkQuoteMessage(project.item, project.client, count);
    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="fleet-portfolio-section" id="portfolio">
      <div className="editorial-container">
        
        {/* Section Header */}
        <div className="fleet-portfolio-header">
          <div className="header-left">
            <span className="technical-text fleet-tagline">05 // CLIENT ARCHIVE</span>
            <h2 className="fleet-portfolio-title">
              MADE FOR BRANDS, TEAMS &amp; INSTITUTIONS.
            </h2>
            <p className="fleet-portfolio-desc">
              Direct OEM production runs engineered to exact corporate specs. Fully verified factory archival records.
            </p>
          </div>
          <div className="header-right-meta">
            <div className="meta-badge-item">
              <CheckCircle2 size={16} className="text-emerald" />
              <span>500K+ Enterprise Units Delivered</span>
            </div>
            <div className="meta-badge-item">
              <ShieldCheck size={16} className="text-emerald" />
              <span>Full Brand NDA Compliance</span>
            </div>
          </div>
        </div>

        {/* 4-Card Fleet Grid Showcase (Zero vertical scroll trap) */}
        <div className="fleet-cards-grid">
          {projects.map((project) => (
            <div className="fleet-card" key={project.id}>
              
              {/* Card Header */}
              <div className="fleet-card-header">
                <div className="fleet-card-subtag technical-text">{project.fleetTag}</div>
                <h3 className="fleet-client-name">{project.client}</h3>
                <div className="fleet-volume-pill">
                  <span className="pulse-dot"></span>
                  <span className="qty-value">{project.qty}</span>
                  <span className="status-label">VERIFIED RUN</span>
                </div>
              </div>

              {/* Product Visual Arena */}
              <div className="fleet-image-stage">
                <img 
                  src={project.img} 
                  alt={project.alt} 
                  className="fleet-product-image"
                  loading="lazy"
                />
                <div className="pedestal-shadow"></div>
              </div>

              {/* Item Details */}
              <div className="fleet-item-info">
                <h4 className="fleet-item-name">{project.item}</h4>
                <p className="fleet-item-spec">{project.specNote}</p>
              </div>

              {/* Technical Specifications */}
              <div className="fleet-specs-deck">
                <div className="spec-row">
                  <span className="spec-name technical-text">
                    <Layers size={12} /> FABRIC
                  </span>
                  <span className="spec-val">{project.fabric}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name technical-text">
                    <Clock size={12} /> TURNAROUND
                  </span>
                  <span className="spec-val">{project.turnaround}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name technical-text">
                    <CheckCircle2 size={12} /> BRANDING
                  </span>
                  <span className="spec-val">{project.branding}</span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                type="button" 
                className="btn-fleet-rfq"
                onClick={() => handleQuoteClick(project)}
                title={`Request quote for ${project.client} fleet specification`}
              >
                <MessageCircle size={15} />
                <span>REQUEST SIMILAR FLEET</span>
                <ArrowUpRight size={14} className="rfq-arrow" />
              </button>

            </div>
          ))}
        </div>

        {/* Trust Proof Strip */}
        <div className="fleet-bottom-proof">
          <div className="proof-point">
            <span className="proof-bullet">•</span>
            <span>Custom Molded Hardware &amp; Heavy YKK/SBS Pullers</span>
          </div>
          <div className="proof-point">
            <span className="proof-bullet">•</span>
            <span>Zero MOQ Physical Sampling Available (5–7 Days)</span>
          </div>
          <div className="proof-point">
            <span className="proof-bullet">•</span>
            <span>Door-to-Door Coordinated Fleet Logistics Across India &amp; Worldwide</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PortfolioSection;
