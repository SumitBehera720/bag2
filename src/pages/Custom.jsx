import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  RotateCcw, 
  MessageCircle, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Layers, 
  ArrowRight,
  Sliders,
  Sparkles,
  Tag
} from 'lucide-react';
import { buildWhatsAppUrl } from '../config';
import './CustomPage.css';

// 5 Broad Categories to give diverse product options
const CUSTOM_CATEGORIES = [
  { id: 'all', name: 'ALL FORMATS' },
  { id: 'backpacks', name: 'BACKPACKS' },
  { id: 'laptop', name: 'LAPTOP BRIEFS' },
  { id: 'duffels', name: 'DUFFELS & TRAVEL' },
  { id: 'slings', name: 'SLINGS & EDC' },
  { id: 'totes', name: 'TOTES' }
];

// Curated DIRECT FRONT-FACING CENTER Models
const CURATED_MODELS = [
  // Backpacks
  { 
    id: 'amb-03', 
    category: 'backpacks',
    name: 'Tactical Modular Daypack AM-03', 
    capacity: '28L', 
    tag: 'TACTICAL / AIR-MESH',
    dimensions: '48 × 32 × 18 cm',
    desc: 'Dual-compartment daypack with laser-cut MOLLE webbing and contoured harness.',
    img: '/products/cutout/3.png'
  },
  { 
    id: 'amb-09', 
    category: 'backpacks',
    name: 'Signature Corporate Carrier AM-09', 
    capacity: '26L', 
    tag: 'CORPORATE FLEET',
    dimensions: '46 × 31 × 16 cm',
    desc: 'Executive tech carrier with padded laptop vault and concealed zip compartments.',
    img: '/products/cutout/9.png'
  },
  { 
    id: 'amb-20', 
    category: 'backpacks',
    name: 'Field Commuter Daypack AM-20', 
    capacity: '25L', 
    tag: 'FIELD TEAMS',
    dimensions: '45 × 30 × 17 cm',
    desc: 'Lightweight high-tenacity pack with reflective safety accents and bar-tack anchors.',
    img: '/products/cutout/20.png'
  },
  { 
    id: 'amb-08', 
    category: 'backpacks',
    name: 'Reinforced Cargo Pack AM-08', 
    capacity: '32L', 
    tag: 'HEAVY CAPACITY',
    dimensions: '50 × 34 × 20 cm',
    desc: 'Heavy cargo carrier engineered for equipment teams and outdoor field gear.',
    img: '/products/cutout/8.png'
  },

  // Laptop Briefcases
  { 
    id: 'amb-10', 
    category: 'laptop',
    name: 'Executive Messenger Brief AM-10', 
    capacity: '16L', 
    tag: 'EXECUTIVE BRIEF',
    dimensions: '40 × 30 × 12 cm',
    desc: 'Padded 15.6" laptop messenger with trolley pass-through sleeve and leather handle.',
    img: '/products/cutout/10.png'
  },
  { 
    id: 'amb-11', 
    category: 'laptop',
    name: 'Corporate Document Briefcase AM-11', 
    capacity: '14L', 
    tag: 'FORMAL ATTACHE',
    dimensions: '39 × 29 × 10 cm',
    desc: 'Slim structured portfolio brief with organizer chambers and waterproof zip closure.',
    img: '/products/cutout/11.png'
  },
  { 
    id: 'amb-16', 
    category: 'laptop',
    name: 'Tech Shield Attache AM-16', 
    capacity: '15L', 
    tag: 'SHOCKPROOF CARRY',
    dimensions: '41 × 30 × 11 cm',
    desc: 'High-density EVA foam cushioned carrier for laptops, tablets, and chargers.',
    img: '/products/cutout/16.png'
  },

  // Duffels & Travel
  { 
    id: 'amb-43', 
    category: 'duffels',
    name: 'Pro Expedition Transit Duffel AM-43', 
    capacity: '42L', 
    tag: 'EXPEDITION / TRAVEL',
    dimensions: '58 × 34 × 30 cm',
    desc: 'Heavy-duty weatherproof travel duffel with reinforced base and backpack straps.',
    img: '/products/cutout/43.png'
  },
  { 
    id: 'amb-35', 
    category: 'duffels',
    name: 'Heavy Transit Series Duffel AM-35', 
    capacity: '35L', 
    tag: 'ATHLETIC FLEET',
    dimensions: '52 × 30 × 28 cm',
    desc: 'Cylindrical team duffel with ventilated shoe compartment and duffel harness.',
    img: '/products/cutout/35.png'
  },

  // Slings & EDC
  { 
    id: 'amb-27', 
    category: 'slings',
    name: 'Ascent Tactical Sling AM-27', 
    capacity: '8L', 
    tag: 'TACTICAL EDC',
    dimensions: '32 × 20 × 10 cm',
    desc: 'Ergonomic cross-body tactical swing pack with ambidextrous strap buckle.',
    img: '/products/cutout/27.png'
  },
  { 
    id: 'amb-30', 
    category: 'slings',
    name: 'Everyday Mobility Crossbody AM-30', 
    capacity: '6L', 
    tag: 'URBAN COMMUTE',
    dimensions: '28 × 18 × 8 cm',
    desc: 'Minimalist weather-resistant sling pack for passport, phone, and daily essentials.',
    img: '/products/cutout/30.png'
  },

  // Totes
  { 
    id: 'amb-21', 
    category: 'totes',
    name: 'Heavy Canvas Utility Tote AM-21', 
    capacity: '20L', 
    tag: 'CONFERENCE FLEET',
    dimensions: '42 × 38 × 14 cm',
    desc: '16oz heavy cotton duck canvas tote with dual shoulder handles and interior zip pouch.',
    img: '/products/cutout/21.png'
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

// Mathematically Centered Placement Zones for Front-Facing Bags
const LOGO_POSITIONS = [
  { id: 'center', label: 'Front Center', top: '58%', left: '50%' },
  { id: 'upper', label: 'Upper Center', top: '34%', left: '50%' },
  { id: 'mid', label: 'Mid-Body Crest', top: '46%', left: '50%' },
  { id: 'lower_right', label: 'Lower Right', top: '65%', left: '60%' },
  { id: 'upper_left', label: 'Upper Left Chest', top: '35%', left: '40%' }
];

const MATERIAL_OPTIONS = [
  { name: 'Tactical Cordura 1000D', note: 'Heavy water-repellent industrial weave' },
  { name: 'Ballistic Nylon 1680D', note: 'Maximum abrasion resistance for fleets' },
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

const QUICK_QUANTITIES = [1, 10, 25, 50, 100, 250, 500, 1000];

const Custom = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Studio States
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedModel, setSelectedModel] = useState(CURATED_MODELS[0]);
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
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  // Filter models by category
  const filteredModels = activeCategory === 'all' 
    ? CURATED_MODELS 
    : CURATED_MODELS.filter(m => m.category === activeCategory);

  // Upload handler
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

  // WhatsApp Order Submission
  const handleSendWhatsAppOrder = () => {
    const message = [
      `*ASKMEBAG // LIVE CUSTOM STUDIO ORDER*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🎒 *Base Silhouette:* ${selectedModel.name}`,
      `📐 *Dimensions / Vol:* ${selectedModel.capacity} (${selectedModel.dimensions})`,
      `🎨 *Fabric Grade:* ${selectedMaterial}`,
      `🏷️ *Branding Method:* ${brandingMethod}`,
      `📍 *Logo Position:* ${logoPosition.label}`,
      `✏️ *Brand Reference:* ${logoImage ? 'Custom Logo File Uploaded' : `"${logoText}"`}`,
      `🔧 *Hardware Grade:* ${hardware}`,
      `⚙️ *Custom Trims:* ${selectedFeatures.length > 0 ? selectedFeatures.join(', ') : 'Standard Base'}`,
      `📦 *Order Volume:* ${quantity} ${quantity === 1 ? 'UNIT (PROTOTYPE SAMPLE)' : 'UNITS'}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      notes ? `📝 *Client Notes:* ${notes}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` : '',
      `Hi ASKMEBAG team, I configured this custom bag in your online studio. Please share production quotation, CAD spec sheet, and sample dispatch timeline.`
    ].join('\n');

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  const handleCopySpec = () => {
    const summary = `ASKMEBAG Custom Specification:
Silhouette: ${selectedModel.name} (${selectedModel.capacity})
Fabric: ${selectedMaterial}
Branding: ${brandingMethod} @ ${logoPosition.label}
Brand Mark: ${logoImage ? 'Uploaded Custom Logo' : logoText}
Hardware: ${hardware}
Features: ${selectedFeatures.join(', ')}
Quantity: ${quantity} ${quantity === 1 ? 'unit sample' : 'units fleet'}
${notes ? `Notes: ${notes}` : ''}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Visual class for branding preview
  const getTechniqueClass = () => {
    if (brandingMethod.includes('Embroidery')) return 'technique-embroidery';
    if (brandingMethod.includes('Screen')) return 'technique-screen';
    if (brandingMethod.includes('Metal')) return 'technique-metal';
    if (brandingMethod.includes('Leather')) return 'technique-patch';
    return '';
  };

  return (
    <div className="custom-studio-page">
      
      {/* Studio Header */}
      <header className="custom-studio-hero">
        <div className="editorial-container">
          <div className="hero-breadcrumbs technical-text">
            <span>FACTORY CUSTOM STUDIO // OEM &amp; ODM PRODUCTION</span>
            <span className="no-moq-badge">
              <CheckCircle2 size={13} /> ORDER FROM 1 PIECE PROTOTYPE TO VOLUME FLEETS
            </span>
          </div>
          
          <h1 className="hero-headline">
            LIVE CUSTOMIZATION STUDIO.
          </h1>
          
          <p className="hero-subline">
            Select any direct front-facing production silhouette, apply your brand logo, customize materials and hardware, and request physical sampling or volume fleet quotes.
          </p>
        </div>
      </header>

      {/* Main Interactive Studio */}
      <div className="editorial-container">
        <div className="studio-layout">
          
          {/* LEFT COLUMN: Centered Visual Stage */}
          <div className="studio-left-col">
            <div className="studio-stage-card">
              
              {/* Stage Top Status Bar */}
              <div className="stage-top-bar">
                <div className="stage-meta-left technical-text">
                  <span className="live-dot"></span>
                  <span>{selectedModel.tag} // {selectedModel.capacity}</span>
                </div>
                <div className="stage-status-pill technical-text">
                  <span>FRONT-FACING VIEW</span>
                </div>
              </div>

              {/* Centered Bag Visual Arena */}
              <div className="stage-viewport">
                <div className="stage-bag-contain-stage">
                  
                  {/* Front-Facing Centered Bag Image */}
                  <img 
                    key={selectedModel.id}
                    src={selectedModel.img} 
                    alt={selectedModel.name} 
                    className="stage-main-bag"
                  />
                  <div className="stage-pedestal-shadow"></div>

                  {/* Centered Bounded Logo Overlay */}
                  <div 
                    className={`stage-logo-layer ${getTechniqueClass()}`}
                    style={{
                      top: logoPosition.top,
                      left: logoPosition.left,
                      transform: `translate(-50%, -50%) scale(${logoScale / 100}) rotate(${logoRotate}deg)`
                    }}
                  >
                    {logoImage ? (
                      <img src={logoImage} alt="User Custom Logo" className="user-logo-img" />
                    ) : (
                      <div className="placeholder-brand-box">
                        <span className="brand-wordmark">{logoText || 'YOUR LOGO'}</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Logo Fine-Tuning Bar */}
              <div className="stage-tuning-bar">
                <div className="tuning-control">
                  <span className="tuning-label technical-text">SCALE: {logoScale}%</span>
                  <input 
                    type="range" 
                    min="65" 
                    max="150" 
                    value={logoScale} 
                    onChange={(e) => setLogoScale(Number(e.target.value))}
                    className="tuning-slider"
                  />
                </div>
                <div className="tuning-control">
                  <span className="tuning-label technical-text">ROTATE: {logoRotate}°</span>
                  <input 
                    type="range" 
                    min="-25" 
                    max="25" 
                    value={logoRotate} 
                    onChange={(e) => setLogoRotate(Number(e.target.value))}
                    className="tuning-slider"
                  />
                </div>
                <button 
                  type="button" 
                  className="btn-tuning-reset technical-text"
                  onClick={handleResetLogo}
                  title="Reset placement & scale"
                >
                  <RotateCcw size={12} /> RESET
                </button>
              </div>

              {/* Stage Specs Summary */}
              <div className="stage-footer-tags technical-text">
                <span className="footer-tag">{selectedModel.name}</span>
                <span className="footer-tag">{brandingMethod}</span>
                <span className="footer-tag highlight">
                  {quantity} {quantity === 1 ? 'UNIT SAMPLE' : 'UNITS FLEET'}
                </span>
              </div>

            </div>

            {/* Quality Assurance Card */}
            <div className="studio-assurance-box">
              <ShieldCheck size={20} className="assurance-check" />
              <div className="assurance-info">
                <span className="assurance-lead technical-text">PHYSICAL SAMPLING BEFORE PRODUCTION</span>
                <p>
                  Every order includes 2D/3D CAD blueprint approval, fabric swatch verification, and physical sampling (5–7 days) before bulk cutting.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Intuitive 4-Step Configuration Deck */}
          <div className="studio-right-col">
            
            {/* STEP 1: SILHOUETTE & MODEL (With Diverse Product Options) */}
            <div className="studio-config-card">
              <div className="card-heading">
                <span className="step-tag technical-text">STEP 01 // SILHOUETTE &amp; PRODUCT OPTIONS</span>
                <h3 className="step-title">Choose Your Bag Model</h3>
                <p className="step-desc">
                  Select a product format below to get ideas. Every model is engineered from scratch and customized to your specifications.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="category-filter-pills">
                {CUSTOM_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Models Grid Selector */}
              <div className="models-select-grid">
                {filteredModels.map((m) => {
                  const isSelected = selectedModel.id === m.id;
                  return (
                    <div 
                      key={m.id}
                      className={`model-select-card ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedModel(m)}
                    >
                      <div className="model-thumb-box">
                        <img src={m.img} alt={m.name} loading="lazy" />
                      </div>
                      <div className="model-meta-box">
                        <span className="model-cat-tag technical-text">{m.tag}</span>
                        <h4 className="model-select-name">{m.name}</h4>
                        <span className="model-vol-pill technical-text">{m.capacity}</span>
                      </div>
                      {isSelected && (
                        <div className="model-selected-check">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: BRAND LOGO & PLACEMENT */}
            <div className="studio-config-card">
              <div className="card-heading">
                <span className="step-tag technical-text">STEP 02 // LOGO &amp; BRANDING</span>
                <h3 className="step-title">Apply Your Brand Identity</h3>
                <p className="step-desc">
                  Upload your vector logo file (PNG/SVG/AI) or enter your brand name to preview on the bag.
                </p>
              </div>

              {/* Logo Upload or Name */}
              <div className="brand-inputs-deck">
                <div className="brand-input-group">
                  <label className="input-label technical-text">OPTION A: TYPE BRAND NAME</label>
                  <input 
                    type="text" 
                    className="brand-text-field"
                    value={logoText}
                    onChange={(e) => {
                      setLogoText(e.target.value);
                      if (logoImage) setLogoImage(null);
                    }}
                    placeholder="Enter Company or Brand Name"
                    maxLength={24}
                  />
                </div>

                <div className="brand-input-group">
                  <label className="input-label technical-text">OPTION B: UPLOAD LOGO FILE</label>
                  <label className="btn-file-upload">
                    <Upload size={15} />
                    <span>{logoImage ? 'CHANGE LOGO FILE' : 'UPLOAD LOGO (PNG / JPG / SVG)'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Branding Technique Selector */}
              <div className="config-sub-section">
                <label className="input-label technical-text">SELECT EMBELLISHMENT TECHNIQUE</label>
                <div className="techniques-grid">
                  {BRANDING_METHODS.map((method) => {
                    const isSelected = brandingMethod === method.name;
                    return (
                      <div 
                        key={method.id}
                        className={`technique-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setBrandingMethod(method.name)}
                      >
                        <div className="technique-header">
                          <span className="technique-badge technical-text">{method.badge}</span>
                          {isSelected && <Check size={14} className="technique-check" />}
                        </div>
                        <h4 className="technique-name">{method.name}</h4>
                        <p className="technique-desc">{method.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Placement Zone Selector */}
              <div className="config-sub-section">
                <label className="input-label technical-text">SELECT LOGO PLACEMENT ZONE</label>
                <div className="positions-grid">
                  {LOGO_POSITIONS.map((pos) => {
                    const isSelected = logoPosition.id === pos.id;
                    return (
                      <button 
                        key={pos.id}
                        type="button"
                        className={`position-pill ${isSelected ? 'active' : ''}`}
                        onClick={() => setLogoPosition(pos)}
                      >
                        {isSelected && <Check size={12} />}
                        <span>{pos.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* STEP 3: MATERIALS & INDUSTRIAL TRIMS */}
            <div className="studio-config-card">
              <div className="card-heading">
                <span className="step-tag technical-text">STEP 03 // MATERIALS &amp; HARDWARE</span>
                <h3 className="step-title">Specify Fabrics &amp; Components</h3>
                <p className="step-desc">
                  Select your outer shell textile and heavy-duty zipper hardware.
                </p>
              </div>

              {/* Material Selector */}
              <div className="config-sub-section">
                <label className="input-label technical-text">OUTER SHELL FABRIC GRADE</label>
                <div className="materials-list">
                  {MATERIAL_OPTIONS.map((mat) => {
                    const isSelected = selectedMaterial === mat.name;
                    return (
                      <div 
                        key={mat.name}
                        className={`material-item-row ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedMaterial(mat.name)}
                      >
                        <div className="radio-circle">{isSelected && <div className="radio-dot" />}</div>
                        <div className="material-item-info">
                          <span className="material-name">{mat.name}</span>
                          <span className="material-note">{mat.note}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hardware Selector */}
              <div className="config-sub-section">
                <label className="input-label technical-text">ZIPPERS &amp; HARDWARE</label>
                <div className="hardware-grid">
                  {HARDWARE_OPTIONS.map((hw) => {
                    const isSelected = hardware === hw;
                    return (
                      <div 
                        key={hw}
                        className={`hardware-pill ${isSelected ? 'active' : ''}`}
                        onClick={() => setHardware(hw)}
                      >
                        {isSelected && <Check size={12} />}
                        <span>{hw}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Optional Custom Trims */}
              <div className="config-sub-section">
                <label className="input-label technical-text">OPTIONAL ENGINEERING ADD-ONS</label>
                <div className="features-checkboxes-grid">
                  {FEATURE_ADDONS.map((feat) => {
                    const isChecked = selectedFeatures.includes(feat);
                    return (
                      <div 
                        key={feat}
                        className={`feature-box ${isChecked ? 'active' : ''}`}
                        onClick={() => toggleFeature(feat)}
                      >
                        <div className={`checkbox-box ${isChecked ? 'checked' : ''}`}>
                          {isChecked && <Check size={12} />}
                        </div>
                        <span className="feature-text">{feat}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* STEP 4: QUANTITY & WHATSAPP RFQ */}
            <div className="studio-config-card step-submit-card">
              <div className="card-heading">
                <span className="step-tag technical-text">STEP 04 // QUANTITY &amp; INQUIRY</span>
                <h3 className="step-title">Order Sample or Volume Fleet</h3>
                <p className="step-desc">
                  Start with a 1-unit physical prototype or submit a bulk volume fleet quotation request.
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="quantity-controls-box">
                <div className="quick-qty-pills">
                  {QUICK_QUANTITIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className={`qty-pill ${quantity === q ? 'active' : ''}`}
                      onClick={() => setQuantity(q)}
                    >
                      {q === 1 ? '1 Pc Sample' : `${q} Units`}
                    </button>
                  ))}
                </div>

                <div className="custom-qty-input-row">
                  <span className="technical-text">CUSTOM QUANTITY:</span>
                  <input 
                    type="number" 
                    min="1" 
                    max="50000" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="qty-number-input"
                  />
                  <span className="qty-unit-label technical-text">
                    {quantity === 1 ? 'PHYSICAL SAMPLE' : 'UNITS PRODUCTION RUN'}
                  </span>
                </div>
              </div>

              {/* Client Notes Field */}
              <div className="notes-box">
                <label className="input-label technical-text">SPECIAL REQUIREMENTS / NOTES (OPTIONAL)</label>
                <textarea 
                  className="notes-textarea"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need delivery by next month, require specific Pantone 286C dyeing, custom lining pattern..."
                />
              </div>

              {/* Action Buttons */}
              <div className="submit-actions-deck">
                <button 
                  type="button" 
                  className="btn-whatsapp-submit"
                  onClick={handleSendWhatsAppOrder}
                >
                  <MessageCircle size={18} />
                  <span>START ORDER ON WHATSAPP ({quantity} {quantity === 1 ? 'SAMPLE' : 'UNITS'})</span>
                  <ArrowRight size={16} />
                </button>

                <button 
                  type="button" 
                  className="btn-copy-spec"
                  onClick={handleCopySpec}
                >
                  {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
                  <span>{copied ? 'SPECIFICATION COPIED!' : 'COPY SPECIFICATION'}</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Custom;
