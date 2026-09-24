import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  ArrowUpRight, 
  Layers, 
  FileText, 
  Scissors, 
  Truck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { buildWhatsAppUrl } from '../config';
import './ProcessPage.css';

const processPhases = [
  {
    num: '01',
    title: 'REQUIREMENTS & USAGE SPECIFICATION',
    subtitle: 'Defining purpose, silhouette, fleet volume, and brand guidelines.',
    desc: 'You share your bag requirements—whether an executive corporate backpack, a high-capacity expedition duffel, or an event sling. We establish sizing, target unit volume, corporate branding standards, and required delivery dates.',
    deliverable: 'Formal Manufacturing Requirement Brief',
    timeline: 'Day 01',
    icon: FileText
  },
  {
    num: '02',
    title: 'CAD PATTERN & MATERIAL SCIENCE',
    subtitle: 'Textile selection, Pantone dyeing, and 2D/3D technical patterning.',
    desc: 'We map your design into computerized CAD pattern pieces. We select exact industrial textiles—Tactical Cordura 1000D, Ballistic Nylon 1680D, or Recycled RPET—and formulate exact Pantone thread and screen formulations.',
    deliverable: 'Dimensional CAD Technical Blueprint',
    timeline: 'Days 02–03',
    icon: Layers
  },
  {
    num: '03',
    title: 'PHYSICAL SAMPLING & PROTOTYPING',
    subtitle: 'Crafting a 1-to-1 physical golden sample in our factory workshop.',
    desc: 'Before bulk batch cutting, our master patternmakers construct a physical sample using production-grade fabrics, custom zipper pullers, and your chosen branding technique (embroidery, plaque, or patch).',
    deliverable: '100% Physical Golden Sample',
    timeline: 'Days 04–07',
    icon: Sparkles
  },
  {
    num: '04',
    title: 'REFINEMENT & PRODUCTION LOCK',
    subtitle: 'Sample evaluation, ergonomic testing, and formal batch sign-off.',
    desc: 'You receive and evaluate the physical sample. Any refinements to pocket ergonomics, strap tension, or branding placement are applied. Once signed off, the production bill of materials is locked for batch cutting.',
    deliverable: 'Locked Production Specification',
    timeline: 'Day 08',
    icon: ShieldCheck
  },
  {
    num: '05',
    title: 'AUTOMATED CUTTING & ASSEMBLY',
    subtitle: 'Computerized laser cutting, walking-foot stitching, and assembly.',
    desc: 'Material rolls are laser cut to ±0.5mm precision. Master sewing operators assemble the chambers using bonded nylon thread and triple-stitch load points. Hardware, YKK zips, and interior linings are fitted.',
    deliverable: 'Batch Fleet Assembly & Stitching',
    timeline: 'Days 09–21',
    icon: Scissors
  },
  {
    num: '06',
    title: 'QUALITY AUDIT & GLOBAL DISPATCH',
    subtitle: '100% individual inspection, protective packaging, and tracked transit.',
    desc: 'Every single unit undergoes rigorous multi-point QA: zip cycle verification, seam tensile test, and loose-thread inspection. Bags are barcoded, individually polybagged, and dispatched door-to-door.',
    deliverable: 'Delivered Fleet with Quality Guarantee',
    timeline: 'Days 22–25',
    icon: Truck
  }
];

const Process = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const whatsappInquiryUrl = buildWhatsAppUrl(
    "Hi ASKMEBAG team, I reviewed your manufacturing process and would like to start a custom production brief."
  );

  return (
    <div className="process-page-wrapper">
      
      {/* Editorial Page Header */}
      <header className="process-page-hero">
        <div className="editorial-container">
          <div className="process-hero-layout">
            <div className="process-hero-text">
              <span className="technical-text process-eyebrow">PAGE 03 // MANUFACTURING PROCESS</span>
              <h1 className="process-hero-title">
                FROM CONCEPT BLUEPRINT TO BULK FLEET DISPATCH.
              </h1>
              <p className="process-hero-desc">
                A transparent, rigorous 6-phase engineering workflow built for corporate brand teams, procurement leads, and institutions worldwide.
              </p>
            </div>
            
            <div className="process-hero-cta-box">
              <div className="cta-box-meta technical-text">
                <Clock size={14} className="text-emerald" />
                <span>RAPID PHYSICAL SAMPLING: 5–7 DAYS</span>
              </div>
              <a 
                href={whatsappInquiryUrl} 
                className="btn-process-primary" 
                target="_blank" 
                rel="noreferrer"
              >
                <MessageCircle size={16} />
                <span>START A PRODUCTION BRIEF</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Factory Highlights Proof Strip */}
      <section className="process-proof-strip">
        <div className="editorial-container">
          <div className="proof-strip-grid">
            <div className="proof-item">
              <span className="proof-stat">5–7 DAYS</span>
              <span className="proof-label technical-text">PHYSICAL SAMPLE TURNAROUND</span>
            </div>
            <div className="proof-item">
              <span className="proof-stat">NO MOQ</span>
              <span className="proof-label technical-text">FROM 1 UNIT TO 10,000+ UNITS</span>
            </div>
            <div className="proof-item">
              <span className="proof-stat">±0.5 MM</span>
              <span className="proof-label technical-text">COMPUTERIZED LASER ACCURACY</span>
            </div>
            <div className="proof-item">
              <span className="proof-stat">100%</span>
              <span className="proof-label technical-text">PRE-DISPATCH STRESS AUDIT</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Phase Aligned Pipeline Grid */}
      <section className="process-phases-section">
        <div className="editorial-container">
          
          <div className="section-intro-bar">
            <div className="intro-left">
              <span className="technical-text">THE 6-PHASE PRODUCTION PIPELINE</span>
              <h2 className="section-heading">How Every Order Moves Through Our Workshop</h2>
            </div>
            <p className="intro-right">
              Every detail is engineered with zero guesswork. We provide photo proofing and CAD verification at every critical checkpoint.
            </p>
          </div>

          <div className="process-phases-grid">
            {processPhases.map((phase) => {
              const IconComp = phase.icon;
              return (
                <div className="process-phase-card" key={phase.num}>
                  
                  {/* Card Top Meta */}
                  <div className="phase-card-header">
                    <div className="phase-num-badge">
                      <span className="technical-text">PHASE {phase.num}</span>
                    </div>
                    <div className="phase-timeline-tag technical-text">
                      <Clock size={12} />
                      <span>{phase.timeline}</span>
                    </div>
                  </div>

                  {/* Title & Icon */}
                  <div className="phase-title-group">
                    <div className="phase-icon-box">
                      <IconComp size={20} />
                    </div>
                    <div>
                      <h3 className="phase-card-title">{phase.title}</h3>
                      <p className="phase-card-subtitle">{phase.subtitle}</p>
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <p className="phase-card-desc">{phase.desc}</p>

                  {/* Deliverable Badge */}
                  <div className="phase-deliverable-box">
                    <span className="deliverable-label technical-text">DELIVERABLE //</span>
                    <span className="deliverable-value">{phase.deliverable}</span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Factory Workshop & QA Standards Showcase */}
      <section className="process-workshop-section">
        <div className="editorial-container">
          <div className="workshop-dual-card">
            
            {/* Left: Workbench Image */}
            <div className="workshop-visual">
              <img 
                src="/media/process_banner_cover.jpg" 
                alt="Industrial walking-foot sewing machine precision stitching bar-tack seams on custom client bag" 
                loading="lazy" 
                className="workshop-img"
              />
              <div className="workshop-img-caption technical-text">
                <span>FIG 03 // WALKING-FOOT INDUSTRIAL STITCHING &amp; BONDED NYLON ANCHORING</span>
              </div>
            </div>

            {/* Right: 4 Engineering Standards */}
            <div className="workshop-standards">
              <span className="technical-text standards-badge">QUALITY ASSURANCE SPECIFICATION</span>
              <h3 className="standards-title">Built to Survive Years of Daily Enterprise Demands</h3>
              <p className="standards-desc">
                We reject consumer fashion shortcuts. Every bag is engineered as an industrial tool, stress-tested to exceed standard OEM durability thresholds.
              </p>

              <div className="standards-list">
                <div className="standard-item">
                  <CheckCircle2 size={18} className="standard-check" />
                  <div>
                    <h4 className="standard-name">25kg Tensile Bar-Tack Seams</h4>
                    <p className="standard-detail">All shoulder harness and handle anchor points receive computerized bar-tack cross-reinforcement.</p>
                  </div>
                </div>

                <div className="standard-item">
                  <CheckCircle2 size={18} className="standard-check" />
                  <div>
                    <h4 className="standard-name">10,000-Cycle Heavy SBS &amp; YKK Zippers</h4>
                    <p className="standard-detail">Industrial-grade coil and metal zippers equipped with custom tactical paracord or debossed metal pullers.</p>
                  </div>
                </div>

                <div className="standard-item">
                  <CheckCircle2 size={18} className="standard-check" />
                  <div>
                    <h4 className="standard-name">DWR Water-Repellency Verification</h4>
                    <p className="standard-detail">Hydrophobic outer shell fabric treatments repel monsoons, spills, and outdoor humidity.</p>
                  </div>
                </div>

                <div className="standard-item">
                  <CheckCircle2 size={18} className="standard-check" />
                  <div>
                    <h4 className="standard-name">Zero Defect Guarantee on All Fleet Runs</h4>
                    <p className="standard-detail">Every single delivered bag is backed by our full craftsmanship and manufacturing warranty.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Action Footer Callout */}
      <section className="process-footer-cta">
        <div className="editorial-container">
          <div className="process-cta-banner">
            <div className="cta-banner-text">
              <span className="technical-text banner-sub">START YOUR MANUFACTURING JOURNEY</span>
              <h2 className="banner-title">Ready to build custom carry for your fleet?</h2>
              <p className="banner-desc">
                Share your logo, sketch, reference photo or quantity requirements. Our engineering team prepares a CAD specification and physical sampling quote within 24 hours.
              </p>
            </div>
            <div className="cta-banner-actions">
              <a 
                href={whatsappInquiryUrl} 
                className="btn-banner-primary"
                target="_blank" 
                rel="noreferrer"
              >
                <MessageCircle size={18} />
                <span>START WHATSAPP BRIEF</span>
                <ArrowUpRight size={16} />
              </a>
              <Link to="/custom" className="btn-banner-secondary">
                <span>TRY LIVE CUSTOM STUDIO</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Process;
