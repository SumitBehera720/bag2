import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import './ProcessTimeline.css';

const processStages = [
  {
    id: '01',
    phase: 'STAGE 01 // ARCHITECTURAL DRAFTING',
    title: 'SPECIFICATION & CAD MODELING',
    desc: 'Translating client requirements into digital CAD tech-packs, 3D structural simulations, and pattern blueprints before touching physical textiles.',
    metrics: '48h Tech-Pack Turnaround',
    img: '/media/custom_page_cover.jpg',
    alt: 'CAD blueprints, material swatches, and drafting tools in manufacturing workshop.'
  },
  {
    id: '02',
    phase: 'STAGE 02 // RAW TEXTILE PREP',
    title: 'PRECISION LASER CUTTING',
    desc: 'Computerized laser and die cutting of high-denier textiles (Cordura 1000D, Ballistic Nylon 1680D) ensuring exact 0.5mm tolerances and zero edge fraying.',
    metrics: '±0.5mm Cut Tolerance',
    img: '/media/process_cut.jpg',
    alt: 'Precision textile cutting on industrial workshop cutting table.'
  },
  {
    id: '03',
    phase: 'STAGE 03 // STRUCTURAL ASSEMBLY',
    title: 'REINFORCED HEAVY STITCHING',
    desc: 'Heavy-gauge bonded nylon thread assembly with high-density bar-tack anchors at all primary handle, harness, and load-bearing stress points.',
    metrics: '25kg Tensile Bar-Tack',
    img: '/media/process_stitch.jpg',
    alt: 'Industrial sewing machine operator assembling heavy-duty tactical carry bag.'
  },
  {
    id: '04',
    phase: 'STAGE 04 // BRAND IDENTITY & HARDWARE',
    title: 'EMBELLISHMENT & HARDWARE FITMENT',
    desc: 'Application of 3D precision raised embroidery, laser-engraved zinc plaques, hot-stamped debossed leather patches, and heavy SBS/YKK zipper installation.',
    metrics: '10,000-Cycle Zip Rating',
    img: '/media/process_banner_cover.jpg',
    alt: 'Laser metal plaque and heavy-duty zipper hardware installation.'
  },
  {
    id: '05',
    phase: 'STAGE 05 // MULTI-POINT AUDIT',
    title: 'QUALITY ASSURANCE & DISPATCH',
    desc: '100% individual piece inspection checking seam strength, waterproof seal integrity, hardware glide, and export packaging before direct dispatch.',
    metrics: 'Zero-Defect Audit',
    img: '/media/scale_banner_cover.jpg',
    alt: 'Finished custom corporate carrier backpacks ready for palletized fleet delivery.'
  }
];

const ProcessTimeline = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = processStages[activeStageIndex];

  return (
    <section className="process-editorial-section" id="process">
      <div className="editorial-container">
        
        {/* Section Header */}
        <div className="process-header">
          <div className="process-eyebrow technical-text">
            <span>04 // RIGOROUS MANUFACTURING PIPELINE</span>
            <span className="process-badge">
              <CheckCircle2 size={12} /> 100% FACTORY DIRECT
            </span>
          </div>
          <h2 className="process-title">
            FROM RAW MATERIAL<br/>
            TO INDUSTRIAL CARRY.
          </h2>
          <p className="process-intro">
            A custom bag is a sequence of small engineering decisions — textile selection, structural pattern cutting, heavy bar-tack stitching, branding, and multi-point QC inspection.
          </p>
        </div>

        {/* 2-Column Interactive Production Showcase */}
        <div className="process-interactive-grid">
          
          {/* Left Column: Visual Showcase Frame */}
          <div className="process-stage-viewport">
            <div className="process-image-card">
              <img 
                key={activeStage.id}
                src={activeStage.img} 
                alt={activeStage.alt}
                className="stage-featured-photo fade-in"
                loading="lazy"
              />
              <div className="stage-photo-hud">
                <div className="hud-phase-tag technical-text">
                  <span className="hud-pulse"></span>
                  <span>{activeStage.phase}</span>
                </div>
                <div className="hud-metric-pill technical-text">
                  {activeStage.metrics}
                </div>
              </div>
            </div>

            {/* Stage Selector Dots / Stepper */}
            <div className="process-stepper-dots">
              {processStages.map((stage, idx) => (
                <button
                  key={stage.id}
                  type="button"
                  className={`stepper-dot-btn ${idx === activeStageIndex ? 'active' : ''}`}
                  onClick={() => setActiveStageIndex(idx)}
                  aria-label={`Jump to stage ${stage.id}`}
                >
                  <span className="stepper-dot-num technical-text">{stage.id}</span>
                  <span className="stepper-dot-name">{stage.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Clean Organized Stage Cards */}
          <div className="process-stages-stack">
            {processStages.map((stage, idx) => {
              const isActive = idx === activeStageIndex;
              return (
                <div 
                  key={stage.id}
                  className={`stage-step-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveStageIndex(idx)}
                >
                  <div className="step-card-header">
                    <span className="step-badge technical-text">{stage.id}</span>
                    <h3 className="step-card-title">{stage.title}</h3>
                    <ChevronRight size={18} className={`step-arrow ${isActive ? 'active-arrow' : ''}`} />
                  </div>
                  <p className="step-card-desc">{stage.desc}</p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProcessTimeline;
