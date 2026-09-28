import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  RotateCcw, 
  MessageCircle, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  ArrowRight,
  ArrowLeft,
  Sliders,
  Sparkles,
  Layers,
  Building2,
  MapPin,
  Clock,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';
import { COMPANY_CONFIG, buildWhatsAppUrl } from '../config';
import './CustomPage.css';

// 5 Curated Categories for Custom Production
const CUSTOM_CATEGORIES = [
  { id: 'all', name: 'ALL FORMATS' },
  { id: 'backpacks', name: 'BACKPACKS' },
  { id: 'laptop', name: 'LAPTOP BRIEFS' },
  { id: 'duffels', name: 'DUFFELS & TRAVEL' },
  { id: 'slings', name: 'SLINGS & EDC' }
];

// Curated DIRECT FRONT-FACING Models (Only genuine front angles suitable for live branding)
const CURATED_MODELS = [
  // Backpacks
  { 
    id: 'amb-03', 
    category: 'backpacks',
    name: 'Tactical Modular Daypack AM-03', 
    capacity: '30L', 
    tag: 'TACTICAL / AIR-MESH',
    dimensions: '48 × 32 × 18 cm',
    desc: 'High-capacity workhorse with laser-cut MOLLE webbing and contoured air-mesh harness.',
    primaryImg: '/products/cutout/3.png',
    angles: [
      { label: 'Front View', url: '/products/cutout/3.png' },
      { label: '3/4 Profile', url: '/products/cutout/4.png' }
    ]
  },
  { 
    id: 'amb-01', 
    category: 'backpacks',
    name: 'Executive Tech Daypack AM-01', 
    capacity: '28L', 
    tag: 'EXECUTIVE FLEET',
    dimensions: '46 × 31 × 16 cm',
    desc: 'Clean corporate commuter with dedicated tech stash chamber and structured upright base.',
    primaryImg: '/products/cutout/1.png',
    angles: [
      { label: 'Front View', url: '/products/cutout/1.png' }
    ]
  },
  { 
    id: 'amb-02', 
    category: 'backpacks',
    name: 'Dual-Tone Daily Commuter AM-02', 
    capacity: '26L', 
    tag: 'URBAN COMMUTE',
    dimensions: '45 × 30 × 16 cm',
    desc: 'Aerodynamic dual-tone silhouette with charcoal upper panel and high-density padding.',
    primaryImg: '/products/cutout/2.png',
    angles: [
      { label: 'Front View', url: '/products/cutout/2.png' }
    ]
  },
  { 
    id: 'amb-06', 
    category: 'backpacks',
    name: 'Heavy-Duty Field Backpack AM-06', 
    capacity: '32L', 
    tag: 'INDUSTRIAL GEAR',
    dimensions: '50 × 33 × 20 cm',
    desc: 'Rugged twin-compartment pack built for field engineers, heavy tools, and on-site technicians.',
    primaryImg: '/products/cutout/6.png',
    angles: [
      { label: 'Front View', url: '/products/cutout/6.png' }
    ]
  },
  { 
    id: 'amb-11', 
    category: 'backpacks',
    name: 'Computer World Tech Pack AM-11', 
    capacity: '28L', 
    tag: 'IT ONBOARDING',
    dimensions: '47 × 31 × 17 cm',
    desc: 'High-tenacity corporate backpack with padded 15.6" laptop vault and organizer chambers.',
    primaryImg: '/products/cutout/14.png',
    angles: [
      { label: 'Front View', url: '/products/cutout/14.png' },
      { label: '3/4 Angle', url: '/products/cutout/13.png' }
    ]
  },
  { 
    id: 'amb-13', 
    category: 'backpacks',
    name: 'Vanguard Tech Daypack AM-13', 
    capacity: '27L', 
    tag: 'CONTRAST PIPING',
    dimensions: '46 × 30 × 16 cm',
    desc: 'Dynamic contrast-piped commuter with ergonomic spinal ventilation and suspension bumpers.',
    primaryImg: '/products/cutout/16.png',
    angles: [
      { label: 'Front View', url: '/products/cutout/16.png' },
      { label: 'Back Harness', url: '/products/styled/16.png' }
    ]
  },

  // Laptop Briefs
  { 
    id: 'amb-08', 
    category: 'laptop',
    name: 'Executive Structured Attache AM-08', 
    capacity: '16L', 
    tag: 'EXECUTIVE BRIEF',
    dimensions: '42 × 31 × 12 cm',
    desc: 'Premium horizontal laptop brief with reinforced handles, shoulder strap, and luggage sleeve.',
    primaryImg: '/products/styled/8.png',
    angles: [
      { label: 'Front View', url: '/products/styled/8.png' },
      { label: '3/4 Angle', url: '/products/styled/10.png' }
    ]
  },
  { 
    id: 'amb-09', 
    category: 'laptop',
    name: 'Poojara Document Briefcase AM-09', 
    capacity: '15L', 
    tag: 'FORMAL ATTACHE',
    dimensions: '40 × 30 × 11 cm',
    desc: 'Structured formal briefcase with contrast piped trim, dual handles, and document partition.',
    primaryImg: '/products/cutout/10.png',
    angles: [
      { label: 'Front View', url: '/products/cutout/10.png' }
    ]
  },

  // Duffels & Travel
  { 
    id: 'amb-26', 
    category: 'duffels',
    name: 'Heavy Transit Series Duffel AM-26', 
    capacity: '42L', 
    tag: 'EXPEDITION / TRAVEL',
    dimensions: '58 × 32 × 30 cm',
    desc: 'Heavy-duty cylindrical travel duffel with wrap-around webbing handles and shoulder strap.',
    primaryImg: '/products/cutout/31.png',
    angles: [
      { label: 'Studio Front', url: '/products/cutout/31.png' }
    ]
  },
  { 
    id: 'amb-28', 
    category: 'duffels',
    name: 'Coca-Cola Expedition Red Duffel AM-28', 
    capacity: '38L', 
    tag: 'BRAND PROMOTION',
    dimensions: '54 × 30 × 28 cm',
    desc: 'Bold vibrant promotional sports duffel engineered for volume branded client merchandise.',
    primaryImg: '/products/cutout/34.png',
    angles: [
      { label: 'Studio View', url: '/products/cutout/34.png' }
    ]
  },

  // Slings & EDC
  { 
    id: 'amb-07', 
    category: 'slings',
    name: 'TVS Mobility Crossbody Sling AM-07', 
    capacity: '9L', 
    tag: 'MOBILITY EDC',
    dimensions: '30 × 20 × 9 cm',
    desc: 'Compact vertical crossbody organizer engineered for technicians and mobile personnel.',
    primaryImg: '/products/cutout/9.png',
    angles: [
      { label: 'Front View', url: '/products/cutout/9.png' }
    ]
  },
  { 
    id: 'amb-10', 
    category: 'slings',
    name: 'M-Plast Heavy Utility Sling AM-10', 
    capacity: '8L', 
    tag: 'EQUIPMENT CARRY',
    dimensions: '30 × 19 × 8 cm',
    desc: 'Engineered 12" x 7.5" equipment carry sling with external measurement callout.',
    primaryImg: '/products/cutout/5.png',
    angles: [
      { label: 'Front View', url: '/products/cutout/5.png' }
    ]
  },
  { 
    id: 'amb-25', 
    category: 'slings',
    name: 'Tactical Compact Sling Carrier AM-25', 
    capacity: '9L', 
    tag: 'QUICK-SWING EDC',
    dimensions: '31 × 20 × 10 cm',
    desc: 'Single-strap quick-swing sling bag tested for on-site facility staff and coordinators.',
    primaryImg: '/products/cutout/30.png',
    angles: [
      { label: 'Front View', url: '/products/cutout/30.png' }
    ]
  }
];

const BRANDING_METHODS = [
  { 
    id: 'embroidery', 
    name: '3D Precision Embroidery', 
    desc: 'Tactile raised embroidery with reinforced border stitch.',
    badge: 'LUXURY EMBOSSED'
  },
  { 
    id: 'screen', 
    name: 'High-Density Silk Screen', 
    desc: 'Crisp opaque pantone formulation, high UV resistance.',
    badge: 'CRISP PANTONE'
  },
  { 
    id: 'plaque', 
    name: 'Laser-Engraved Metal Plaque', 
    desc: 'Brushed zinc alloy badge with anti-scratch coating.',
    badge: 'INDUSTRIAL EXECUTIVE'
  },
  { 
    id: 'patch', 
    name: 'Debossed Leather Patch', 
    desc: 'Hot-stamped full grain synthetic patch with perimeter stitch.',
    badge: 'HERITAGE CRAFT'
  }
];

const LOGO_POSITIONS = [
  { id: 'center', label: 'Front Center', top: '56%', left: '50%' },
  { id: 'upper', label: 'Upper Panel', top: '34%', left: '50%' },
  { id: 'crest', label: 'Chest Crest', top: '44%', left: '50%' },
  { id: 'lower_right', label: 'Lower Right Corner', top: '65%', left: '60%' },
  { id: 'upper_left', label: 'Upper Left Pocket', top: '35%', left: '40%' }
];

const MATERIAL_OPTIONS = [
  { name: 'Tactical Cordura 1000D', note: 'Heavy water-repellent industrial weave (Fleet Standard)' },
  { name: 'Ballistic Nylon 1680D', note: 'Maximum abrasion resistance for heavy duty gear' },
  { name: 'Recycled Ocean RPET 900D', note: 'Eco-certified sustainable waterproof ripstop' },
  { name: 'Heavy Cotton Canvas 16oz', note: 'Natural organic heritage aesthetic' }
];

const HARDWARE_OPTIONS = [
  'Heavy SBS Industrial Matte Black Zippers',
  'Brushed Silver Heavy YKK Zippers',
  'Tactical Paracord Zip Pullers + SBS Zips'
];

const FEATURE_ADDONS = [
  'Shock-Proof 16" Padded Laptop Vault',
  'Waterproof Heat-Taped Seam Lamination',
  'Luggage Trolley Pass-Through Sleeve',
  'Night-Reflective 3M Safety Trim',
  'Hidden Anti-Theft Passport Pocket'
];

const QUICK_QUANTITIES = [50, 100, 250, 500, 1000];

const STEPS = [
  { num: 1, label: '01. SILHOUETTE', subtitle: 'Select Bag Model' },
  { num: 2, label: '02. BRANDING & LOGO', subtitle: 'Apply Logo & Method' },
  { num: 3, label: '03. FABRIC & TRIMS', subtitle: 'Materials & Hardware' },
  { num: 4, label: '04. VOLUME & ORDER', subtitle: 'MOQ 50 & WhatsApp RFQ' }
];

const Custom = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Studio States
  const [activeStep, setActiveStep] = useState(1);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedModel, setSelectedModel] = useState(CURATED_MODELS[0]);
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);

  // Customization States
  const [brandingMethod, setBrandingMethod] = useState(BRANDING_METHODS[0].name);
  const [logoPosition, setLogoPosition] = useState(LOGO_POSITIONS[0]);
  const [logoText, setLogoText] = useState('YOUR BRAND');
  const [logoImage, setLogoImage] = useState(null);
  const [logoScale, setLogoScale] = useState(100);
  const [logoRotate, setLogoRotate] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIAL_OPTIONS[0].name);
  const [hardware, setHardware] = useState(HARDWARE_OPTIONS[0]);
  const [selectedFeatures, setSelectedFeatures] = useState([
    FEATURE_ADDONS[0],
    FEATURE_ADDONS[2]
  ]);
  const [quantity, setQuantity] = useState(50);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  // When model changes, reset angle
  const handleSelectModel = (model) => {
    setSelectedModel(model);
    setActiveAngleIndex(0);
  };

  // Filter models by category
  const filteredModels = activeCategory === 'all' 
    ? CURATED_MODELS 
    : CURATED_MODELS.filter(m => m.category === activeCategory);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    setLogoImage(null);
    setLogoText('YOUR BRAND');
    setLogoScale(100);
    setLogoRotate(0);
    setLogoPosition(LOGO_POSITIONS[0]);
  };

  const toggleFeature = (feat) => {
    setSelectedFeatures(prev => 
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  // WhatsApp Order Submission directly to +91 90044 08854
  const handleSendWhatsAppOrder = () => {
    const message = [
      `*ASKMEBAG ORDER TAKING // CUSTOM STUDIO SPECIFICATION*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏢 *Trade Name:* ${COMPANY_CONFIG.tradeName}`,
      `📋 *GSTIN:* ${COMPANY_CONFIG.gstNo}`,
      `🏭 *Manufacturing Facility:* ${COMPANY_CONFIG.shortAddress}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🎒 *Selected Silhouette:* ${selectedModel.name}`,
      `📐 *Dimensions / Volume:* ${selectedModel.capacity} (${selectedModel.dimensions})`,
      `🎨 *Outer Fabric Grade:* ${selectedMaterial}`,
      `🏷️ *Embellishment Technique:* ${brandingMethod}`,
      `📍 *Branding Placement:* ${logoPosition.label}`,
      `✏️ *Brand Identification:* ${logoImage ? 'Custom Vector Logo File Ready' : `Wordmark: "${logoText}"`}`,
      `🔧 *Zipper & Hardware:* ${hardware}`,
      `⚙️ *Custom Engineering Trims:* ${selectedFeatures.length > 0 ? selectedFeatures.join(', ') : 'Standard Base'}`,
      `📦 *Order Quantity Required:* ${quantity} Units (MOQ: 50 PCS)`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      notes ? `📝 *Special Production Brief:* ${notes}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` : '',
      `Hello ASKMEBAG Team, I customized this bag on your live web studio. Please review this specification and share production quote, CAD digital render, and sample prototyping timeline on this WhatsApp number.`
    ].join('\n');

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  const handleCopySpec = () => {
    const summary = `ASKMEBAG Custom Specification:
Model: ${selectedModel.name} (${selectedModel.capacity} - ${selectedModel.dimensions})
Fabric: ${selectedMaterial}
Branding: ${brandingMethod} @ ${logoPosition.label}
Brand Mark: ${logoImage ? 'Uploaded Custom Logo' : logoText}
Hardware: ${hardware}
Features: ${selectedFeatures.join(', ')}
Quantity: ${quantity} units (MOQ: 50)
GSTIN: ${COMPANY_CONFIG.gstNo} | Manufacturer: ${COMPANY_CONFIG.shortAddress}
${notes ? `Notes: ${notes}` : ''}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getTechniqueClass = () => {
    if (brandingMethod.includes('Embroidery')) return 'technique-embroidery';
    if (brandingMethod.includes('Screen')) return 'technique-screen';
    if (brandingMethod.includes('Metal')) return 'technique-metal';
    if (brandingMethod.includes('Leather')) return 'technique-patch';
    return '';
  };

  const currentDisplayImg = selectedModel.angles?.[activeAngleIndex]?.url || selectedModel.primaryImg;

  return (
    <div className="custom-studio-page">
      
      {/* Studio Compact Editorial Header */}
      <header className="custom-studio-hero">
        <div className="editorial-container">
          <div className="studio-hero-top-row">
            <div className="hero-left">
              <div className="hero-meta-badges technical-text">
                <span className="badge-gst">
                  <ShieldCheck size={13} /> GSTIN: <strong>{COMPANY_CONFIG.gstNo}</strong>
                </span>
                <span className="badge-moq">
                  <CheckCircle2 size={13} /> MINIMUM ORDER: 50 UNITS (MOQ: 50 PCS)
                </span>
                <span className="badge-facility">
                  <MapPin size={12} /> BHIWANDI, MUMBAI WORKS
                </span>
              </div>
              <h1 className="hero-headline">
                LIVE CUSTOMIZATION STUDIO
              </h1>
              <p className="hero-subline">
                Direct OEM &amp; ODM Bag Manufacturing. Select a production silhouette, apply your brand logo in real-time, specify materials, and dispatch orders directly to our WhatsApp production desk.
              </p>
            </div>

            <div className="hero-right-cta">
              <a 
                href={buildWhatsAppUrl("Hello ASKMEBAG, I want to discuss custom bag manufacturing.")}
                target="_blank"
                rel="noreferrer"
                className="studio-header-wa-btn technical-text"
              >
                <MessageCircle size={15} />
                <span>HOTLINE: {COMPANY_CONFIG.whatsappDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Workbench Container */}
      <div className="editorial-container">
        
        {/* Interactive Step Navigator Tabs */}
        <div className="studio-steps-nav">
          {STEPS.map((step) => {
            const isActive = activeStep === step.num;
            const isCompleted = activeStep > step.num;
            return (
              <button
                key={step.num}
                type="button"
                className={`step-nav-tab ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => setActiveStep(step.num)}
              >
                <div className="step-tab-num">
                  {isCompleted ? <Check size={12} /> : step.num}
                </div>
                <div className="step-tab-info">
                  <span className="step-tab-title technical-text">{step.label}</span>
                  <span className="step-tab-subtitle">{step.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2-Column Unified Studio Workbench */}
        <div className="studio-workbench-grid">
          
          {/* ========================================================
              LEFT COLUMN: Live 3D Visual Stage (Persistent & Sticky)
              ======================================================== */}
          <div className="studio-stage-column">
            <div className="studio-stage-panel">
              
              {/* Top Stage Bar */}
              <div className="stage-top-meta">
                <div className="stage-tag technical-text">
                  <span className="live-dot"></span>
                  <span>{selectedModel.tag} // {selectedModel.capacity}</span>
                </div>

                {/* Angle Selector (when genuine angles exist for this model) */}
                {selectedModel.angles && selectedModel.angles.length > 1 ? (
                  <div className="stage-angles-switch">
                    {selectedModel.angles.map((ang, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`angle-btn ${activeAngleIndex === idx ? 'active' : ''}`}
                        onClick={() => setActiveAngleIndex(idx)}
                      >
                        {ang.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="stage-view-indicator technical-text">FRONT VIEW</span>
                )}
              </div>

              {/* Bag Visual Stage Arena */}
              <div className="stage-canvas-box">
                <div className="stage-bag-wrapper">
                  <img 
                    key={currentDisplayImg}
                    src={currentDisplayImg} 
                    alt={selectedModel.name} 
                    className="stage-bag-render"
                  />
                  <div className="stage-pedestal-shadow"></div>

                  {/* Dynamic Logo / Wordmark Embellishment Overlay */}
                  <div 
                    className={`stage-logo-overlay ${getTechniqueClass()}`}
                    style={{
                      top: logoPosition.top,
                      left: logoPosition.left,
                      transform: `translate(-50%, -50%) scale(${logoScale / 100}) rotate(${logoRotate}deg)`
                    }}
                  >
                    {logoImage ? (
                      <img src={logoImage} alt="Brand Logo Mockup" className="custom-uploaded-logo" />
                    ) : (
                      <div className="custom-brand-wordmark-box">
                        <span className="brand-wordmark-text">{logoText || 'YOUR LOGO'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Logo Fine-Tuning Controls */}
              <div className="stage-adjust-bar">
                <div className="adjust-control">
                  <span className="adjust-label technical-text">SIZE: {logoScale}%</span>
                  <input 
                    type="range" 
                    min="65" 
                    max="140" 
                    value={logoScale} 
                    onChange={(e) => setLogoScale(Number(e.target.value))}
                    className="adjust-range-slider"
                  />
                </div>
                <div className="adjust-control">
                  <span className="adjust-label technical-text">ROTATION: {logoRotate}°</span>
                  <input 
                    type="range" 
                    min="-20" 
                    max="20" 
                    value={logoRotate} 
                    onChange={(e) => setLogoRotate(Number(e.target.value))}
                    className="adjust-range-slider"
                  />
                </div>
                <button 
                  type="button" 
                  className="btn-adjust-reset"
                  onClick={handleResetLogo}
                  title="Reset placement & scale"
                >
                  <RotateCcw size={13} />
                </button>
              </div>

              {/* Real-Time Configuration Spec Summary */}
              <div className="stage-specs-summary">
                <div className="summary-row">
                  <span className="summary-key technical-text">MODEL</span>
                  <span className="summary-val">{selectedModel.name}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-key technical-text">FABRIC</span>
                  <span className="summary-val">{selectedMaterial}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-key technical-text">EMBELLISHMENT</span>
                  <span className="summary-val">{brandingMethod} ({logoPosition.label})</span>
                </div>
                <div className="summary-row highlight">
                  <span className="summary-key technical-text">ORDER QUANTITY</span>
                  <span className="summary-val">{quantity} Units (MOQ: 50 PCS)</span>
                </div>
              </div>

              {/* Stage Direct WhatsApp Order Action */}
              <div className="stage-action-buttons">
                <button 
                  type="button" 
                  className="btn-stage-wa-order"
                  onClick={handleSendWhatsAppOrder}
                  title="Send spec to WhatsApp (+91 90044 08854)"
                >
                  <MessageCircle size={17} />
                  <span>ORDER ON WHATSAPP (+91 90044 08854)</span>
                </button>
                <button 
                  type="button" 
                  className="btn-stage-copy-spec"
                  onClick={handleCopySpec}
                  title="Copy technical specification"
                >
                  {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                  <span>{copied ? 'SPECS COPIED' : 'COPY SPEC'}</span>
                </button>
              </div>

              {/* Manufacturing Certification Strip */}
              <div className="stage-trust-strip technical-text">
                <ShieldCheck size={13} className="text-emerald" />
                <span>DIRECT OEM FACTORY • FREE 3D DIGITAL MOCKUP • PHYSICAL SAMPLE INCLUDED</span>
              </div>

            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Interactive Step Deck (Organized & Compact)
              ======================================================== */}
          <div className="studio-controls-column">
            
            {/* STEP 1: SILHOUETTES */}
            {activeStep === 1 && (
              <div className="studio-step-card animate-fade">
                <div className="studio-card-head">
                  <div className="studio-step-tag technical-text">STEP 01 OF 04</div>
                  <h2 className="studio-card-heading">Choose Your Bag Base Model</h2>
                  <p className="studio-card-sub">
                    Select a production-engineered bag silhouette. Each format is manufactured from raw fabric roll to finished carry at our Bhiwandi Mumbai plant.
                  </p>
                </div>

                {/* Category Filter Pills */}
                <div className="step-cat-pills">
                  {CUSTOM_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`cat-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Models Grid */}
                <div className="curated-models-grid">
                  {filteredModels.map((m) => {
                    const isSelected = selectedModel.id === m.id;
                    return (
                      <div 
                        key={m.id}
                        className={`model-option-box ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSelectModel(m)}
                      >
                        <div className="model-img-frame">
                          <img src={m.primaryImg} alt={m.name} loading="lazy" />
                        </div>
                        <div className="model-info-frame">
                          <span className="model-cat-badge technical-text">{m.tag}</span>
                          <h3 className="model-title">{m.name}</h3>
                          <p className="model-snippet">{m.desc}</p>
                          <div className="model-bottom-spec technical-text">
                            <span>VOL: {m.capacity}</span>
                            <span>•</span>
                            <span>{m.dimensions}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="model-check-mark">
                            <Check size={14} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Step Progression Buttons */}
                <div className="step-nav-footer">
                  <div className="step-counter technical-text">STEP 1 / 4</div>
                  <button 
                    type="button" 
                    className="btn-next-step"
                    onClick={() => setActiveStep(2)}
                  >
                    <span>CONTINUE TO BRANDING &amp; LOGO</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: BRANDING & LOGO */}
            {activeStep === 2 && (
              <div className="studio-step-card animate-fade">
                <div className="studio-card-head">
                  <div className="studio-step-tag technical-text">STEP 02 OF 04</div>
                  <h2 className="studio-card-heading">Apply Your Brand Identity</h2>
                  <p className="studio-card-sub">
                    Type your company name or upload your vector logo file to preview placement and choose high-end factory embellishment techniques.
                  </p>
                </div>

                {/* Brand Name Input & File Upload */}
                <div className="brand-inputs-dual-grid">
                  <div className="brand-input-block">
                    <label className="input-title technical-text">OPTION A: TYPE BRAND NAME</label>
                    <input 
                      type="text" 
                      className="brand-text-input"
                      value={logoText}
                      onChange={(e) => {
                        setLogoText(e.target.value);
                        if (logoImage) setLogoImage(null);
                      }}
                      placeholder="e.g. ASKMEBAG, TECHFLEET"
                      maxLength={24}
                    />
                    <span className="input-hint">Renders live wordmark on the visual stage.</span>
                  </div>

                  <div className="brand-input-block">
                    <label className="input-title technical-text">OPTION B: UPLOAD LOGO FILE</label>
                    <label className="btn-upload-file-box">
                      <Upload size={16} />
                      <span>{logoImage ? 'CHANGE LOGO FILE' : 'UPLOAD VECTOR / PNG LOGO'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <span className="input-hint">PNG, JPG, or SVG with transparent background recommended.</span>
                  </div>
                </div>

                {/* Embellishment Technique Selection */}
                <div className="config-section-group">
                  <label className="input-title technical-text">CHOOSE FACTORY EMBELLISHMENT TECHNIQUE</label>
                  <div className="techniques-options-grid">
                    {BRANDING_METHODS.map((method) => {
                      const isSelected = brandingMethod === method.name;
                      return (
                        <div 
                          key={method.id}
                          className={`technique-selector-card ${isSelected ? 'active' : ''}`}
                          onClick={() => setBrandingMethod(method.name)}
                        >
                          <div className="technique-badge-row">
                            <span className="tech-badge technical-text">{method.badge}</span>
                            {isSelected && <Check size={14} className="tech-check-icon" />}
                          </div>
                          <h4 className="tech-name">{method.name}</h4>
                          <p className="tech-desc">{method.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Logo Placement Zone */}
                <div className="config-section-group">
                  <label className="input-title technical-text">SELECT LOGO PLACEMENT POSITION</label>
                  <div className="position-preset-pills">
                    {LOGO_POSITIONS.map((pos) => {
                      const isSelected = logoPosition.id === pos.id;
                      return (
                        <button 
                          key={pos.id}
                          type="button"
                          className={`pos-pill ${isSelected ? 'active' : ''}`}
                          onClick={() => setLogoPosition(pos)}
                        >
                          {isSelected && <Check size={12} />}
                          <span>{pos.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step Progression Buttons */}
                <div className="step-nav-footer">
                  <button 
                    type="button" 
                    className="btn-prev-step"
                    onClick={() => setActiveStep(1)}
                  >
                    <ArrowLeft size={15} />
                    <span>BACK TO SILHOUETTES</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn-next-step"
                    onClick={() => setActiveStep(3)}
                  >
                    <span>CONTINUE TO MATERIALS &amp; TRIMS</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: MATERIALS & HARDWARE */}
            {activeStep === 3 && (
              <div className="studio-step-card animate-fade">
                <div className="studio-card-head">
                  <div className="studio-step-tag technical-text">STEP 03 OF 04</div>
                  <h2 className="studio-card-heading">Specify Materials &amp; Hardware</h2>
                  <p className="studio-card-sub">
                    Engineered from commercial-grade textiles and heavy-duty SBS/YKK fasteners for maximum abrasion and load resilience.
                  </p>
                </div>

                {/* Outer Shell Textile */}
                <div className="config-section-group">
                  <label className="input-title technical-text">OUTER SHELL FABRIC GRADE</label>
                  <div className="materials-options-stack">
                    {MATERIAL_OPTIONS.map((mat) => {
                      const isSelected = selectedMaterial === mat.name;
                      return (
                        <div 
                          key={mat.name}
                          className={`material-option-card ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelectedMaterial(mat.name)}
                        >
                          <div className="custom-radio-circle">
                            {isSelected && <div className="radio-inner-dot" />}
                          </div>
                          <div className="material-card-content">
                            <span className="mat-title">{mat.name}</span>
                            <span className="mat-desc">{mat.note}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Hardware & Zippers */}
                <div className="config-section-group">
                  <label className="input-title technical-text">INDUSTRIAL FASTENERS &amp; ZIPPERS</label>
                  <div className="hardware-options-stack">
                    {HARDWARE_OPTIONS.map((hw) => {
                      const isSelected = hardware === hw;
                      return (
                        <div 
                          key={hw}
                          className={`hw-option-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => setHardware(hw)}
                        >
                          {isSelected && <Check size={13} />}
                          <span>{hw}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Add-on Engineering Features */}
                <div className="config-section-group">
                  <label className="input-title technical-text">OPTIONAL ENGINEERING ADD-ONS</label>
                  <div className="features-checkbox-grid">
                    {FEATURE_ADDONS.map((feat) => {
                      const isChecked = selectedFeatures.includes(feat);
                      return (
                        <div 
                          key={feat}
                          className={`feature-toggle-box ${isChecked ? 'active' : ''}`}
                          onClick={() => toggleFeature(feat)}
                        >
                          <div className={`checkbox-indicator ${isChecked ? 'checked' : ''}`}>
                            {isChecked && <Check size={11} />}
                          </div>
                          <span className="feature-label-text">{feat}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step Progression Buttons */}
                <div className="step-nav-footer">
                  <button 
                    type="button" 
                    className="btn-prev-step"
                    onClick={() => setActiveStep(2)}
                  >
                    <ArrowLeft size={15} />
                    <span>BACK TO BRANDING</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn-next-step"
                    onClick={() => setActiveStep(4)}
                  >
                    <span>CONTINUE TO VOLUME &amp; RFQ</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: VOLUME & WHATSAPP RFQ */}
            {activeStep === 4 && (
              <div className="studio-step-card animate-fade">
                <div className="studio-card-head">
                  <div className="studio-step-tag technical-text">STEP 04 OF 04</div>
                  <h2 className="studio-card-heading">Order Volume &amp; WhatsApp RFQ</h2>
                  <p className="studio-card-sub">
                    Our direct manufacturing minimum is 50 units (MOQ: 50 PCS). Volume discounts apply at 100, 250, and 500+ units.
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="quantity-select-panel">
                  <label className="input-title technical-text">SELECT REQUIRED PRODUCTION RUN (MOQ: 50 PCS)</label>
                  <div className="quick-qty-grid">
                    {QUICK_QUANTITIES.map((q) => (
                      <button
                        key={q}
                        type="button"
                        className={`qty-preset-btn ${quantity === q ? 'active' : ''}`}
                        onClick={() => setQuantity(q)}
                      >
                        <strong>{q}</strong>
                        <span>UNITS</span>
                      </button>
                    ))}
                  </div>

                  <div className="custom-qty-box">
                    <span className="custom-qty-label technical-text">CUSTOM QUANTITY:</span>
                    <input 
                      type="number" 
                      min="50" 
                      max="100000" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(50, parseInt(e.target.value) || 50))}
                      className="custom-qty-input"
                    />
                    <span className="custom-qty-moq technical-text">
                      {quantity >= 250 ? 'TIER III ENTERPRISE FLEET' : quantity >= 100 ? 'TIER II VOLUME DISCOUNT' : 'TIER I BASE MOQ (50 PCS)'}
                    </span>
                  </div>
                </div>

                {/* Special Requirements Textarea */}
                <div className="config-section-group">
                  <label className="input-title technical-text">SPECIAL PRODUCTION NOTES / TARGET TIMELINE</label>
                  <textarea 
                    className="production-notes-textarea"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Need delivery by 25th of next month, specific Pantone code for lining, corporate conference event in Mumbai..."
                  />
                </div>

                {/* Company Credential & Trust Box */}
                <div className="company-cred-box">
                  <div className="cred-item">
                    <Building2 size={15} />
                    <div>
                      <span className="cred-k technical-text">TRADE NAME</span>
                      <strong className="cred-v">{COMPANY_CONFIG.tradeName}</strong>
                    </div>
                  </div>
                  <div className="cred-item">
                    <ShieldCheck size={15} className="text-emerald" />
                    <div>
                      <span className="cred-k technical-text">GST NUMBER</span>
                      <strong className="cred-v">{COMPANY_CONFIG.gstNo}</strong>
                    </div>
                  </div>
                  <div className="cred-item">
                    <MapPin size={15} />
                    <div>
                      <span className="cred-k technical-text">FACTORY ADDRESS</span>
                      <span className="cred-v-small">{COMPANY_CONFIG.address}</span>
                    </div>
                  </div>
                </div>

                {/* Primary WhatsApp Order Taking Action */}
                <div className="step-submit-action-deck">
                  <button 
                    type="button" 
                    className="btn-main-whatsapp-order"
                    onClick={handleSendWhatsAppOrder}
                  >
                    <MessageCircle size={20} />
                    <div>
                      <span className="btn-main-title">SEND CUSTOM SPECIFICATION VIA WHATSAPP</span>
                      <span className="btn-main-sub technical-text">DIRECT TO {COMPANY_CONFIG.whatsappDisplay} // {quantity} UNITS</span>
                    </div>
                    <ArrowRight size={18} />
                  </button>

                  <div className="secondary-action-row">
                    <button 
                      type="button" 
                      className="btn-copy-specification technical-text"
                      onClick={handleCopySpec}
                    >
                      {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                      <span>{copied ? 'SPECIFICATION COPIED!' : 'COPY SPECIFICATION'}</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn-step-back-text technical-text"
                      onClick={() => setActiveStep(3)}
                    >
                      <ArrowLeft size={13} /> BACK TO STEP 03
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Custom;
