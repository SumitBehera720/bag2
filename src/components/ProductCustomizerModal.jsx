import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  MessageCircle, 
  Share2,
  Copy,
  Check, 
  Sliders, 
  ShieldCheck, 
  RotateCcw,
  Package,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { buildWhatsAppUrl, generateProductOrderMessage, generateBulkQuoteMessage } from '../config';
import './ProductCustomizerModal.css';

const BRANDING_METHODS = [
  { id: 'embroidery', name: '3D Precision Embroidery', desc: 'Tactile raised embroidery with reinforced border stitch' },
  { id: 'screen', name: 'High-Density Silk Screen', desc: 'Crisp opaque pantone formulation, high UV resistance' },
  { id: 'badge', name: 'Laser-Engraved Metal Plaque', desc: 'Brushed zinc alloy with anti-scratch clear coat' },
  { id: 'patch', name: 'Debossed Vegan Leather Patch', desc: 'Hot-stamped full grain synthetic leather accent' }
];

const LOGO_POSITIONS = [
  { id: 'center', label: 'Front Center Pocket', top: '60%', left: '50%' },
  { id: 'upper', label: 'Upper Storm Flap', top: '35%', left: '50%' },
  { id: 'mid', label: 'Mid-Body Center Crest', top: '48%', left: '50%' },
  { id: 'lower_right', label: 'Lower Right Accent', top: '66%', left: '58%' },
  { id: 'upper_left', label: 'Upper Left Chest', top: '38%', left: '44%' }
];

const QUANTITY_TIERS = [
  { qty: 1, label: '1 Unit (Sample)', badge: 'Prototype Tier' },
  { qty: 10, label: '10 Units', badge: 'Pilot Batch' },
  { qty: 50, label: '50 Units', badge: 'Small Fleet' },
  { qty: 100, label: '100 Units', badge: 'Popular Fleet' },
  { qty: 250, label: '250 Units', badge: 'Volume Discount' },
  { qty: 500, label: '500+ Units', badge: 'Direct Factory' }
];

const HARDWARE_OPTIONS = [
  'Matte Industrial Black SBS Zippers',
  'Brushed Silver YKK Heavy Zips',
  'Tactical Paracord Zip Pullers'
];

const FEATURE_ADDONS = [
  'Padded 16" Shock-Proof Laptop Compartment',
  'Waterproof Taped Seam Treatment',
  'Luggage Trolley Pass-Through Strap',
  'Night-Reflective Safety Piping'
];

const ProductCustomizerModal = ({ product, isOpen, onClose }) => {
  // Customizer States
  const [selectedMaterial, setSelectedMaterial] = useState(
    product?.materials?.[0] || 'Tactical Cordura 1000D'
  );
  const [brandingMethod, setBrandingMethod] = useState(BRANDING_METHODS[0].name);
  const [logoPosition, setLogoPosition] = useState(LOGO_POSITIONS[0]);
  const [logoText, setLogoText] = useState('YOUR BRAND');
  const [logoImage, setLogoImage] = useState(null);
  const [logoScale, setLogoScale] = useState(100);
  const [logoRotate, setLogoRotate] = useState(0);
  const [quantity, setQuantity] = useState(100);
  const [hardware, setHardware] = useState(HARDWARE_OPTIONS[0]);
  const [selectedFeatures, setSelectedFeatures] = useState([FEATURE_ADDONS[0], FEATURE_ADDONS[2]]);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  // Sync state when product prop changes
  useEffect(() => {
    if (product) {
      if (product.materials?.[0]) setSelectedMaterial(product.materials[0]);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const activeImage = product.cutoutImage || product.styledImage;

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
  };

  const toggleFeature = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  // Build Structured WhatsApp Messages
  const formatCustomSpecText = () => {
    return [
      `*ASKMEBAG CUSTOM FLEET SPECIFICATION SHEET*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `💼 *Base Model:* ${product.name} (${product.sku})`,
      `📦 *Target Volume:* ${quantity} Units`,
      `🧵 *Fabric Grade:* ${selectedMaterial}`,
      `🏷️ *Branding Technique:* ${brandingMethod}`,
      `📍 *Branding Placement:* ${logoPosition.label}`,
      `⚙️ *Hardware Selection:* ${hardware}`,
      `✨ *Special Features:*`,
      ...selectedFeatures.map(f => `  • ${f}`),
      logoImage ? `📎 *Company Logo:* Uploaded & ready for digital mockup` : `🔤 *Mockup Text:* "${logoText}"`,
      notes ? `📝 *Client Brief:* ${notes}` : null,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Please provide volume quotation, 3D CAD render confirmation, and physical sampling timeline.`
    ].filter(Boolean).join('\n');
  };

  const handleSendWhatsAppOrder = () => {
    const message = formatCustomSpecText();
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsAppSpec = () => {
    const shareMessage = [
      `*PROPOSED CUSTOM FLEET BAG SPECIFICATION*`,
      `Here is the custom configuration for *${product.name}*:`,
      `• *Volume:* ${quantity} Units`,
      `• *Branding:* ${brandingMethod} (${logoPosition.label})`,
      `• *Fabric:* ${selectedMaterial}`,
      `• *Hardware:* ${hardware}`,
      `Ready to initiate sample prototyping with ASKMEBAG:`,
      `https://wa.me/919890060000?text=${encodeURIComponent(formatCustomSpecText())}`
    ].join('\n');

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopySpec = () => {
    navigator.clipboard.writeText(formatCustomSpecText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="customizer-overlay" onClick={onClose}>
      <div className="customizer-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="customizer-header">
          <div className="customizer-header-title">
            <span className="badge-tag technical-text">ENTERPRISE LIVE CUSTOMIZER // PROTOTYPER</span>
            <h2>{product.name}</h2>
            <span className="sku-tag technical-text">SKU: {product.sku} &bull; {product.capacity} &bull; FITS {product.laptopFit}</span>
          </div>
          <button className="customizer-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="customizer-body">
          
          {/* Left Visual Preview Studio */}
          <div className="customizer-preview-col">
            <div className="preview-canvas-wrapper">
              
              <div className="canvas-header-meta">
                <span className="meta-tag technical-text">
                  <Sparkles size={12} /> LIVE DIGITAL SAMPLE
                </span>
                <span className="meta-scale technical-text">
                  ZOOM: {logoScale}% &bull; ROT: {logoRotate}°
                </span>
              </div>

              {/* Base Product Visual with Active Logo Overlay */}
              <div className="canvas-product-frame">
                <div className="canvas-bag-contain-stage">
                  <img 
                    src={activeImage} 
                    alt={product.name} 
                    className="canvas-bag-img"
                  />

                  {/* Ambient Pedestal Shadow */}
                  <div className="canvas-pedestal-shadow"></div>

                  {/* Interactive Logo Layer */}
                  <div 
                    className={`canvas-logo-anchor technique-${brandingMethod.toLowerCase().includes('embroidery') ? 'embroidery' : brandingMethod.toLowerCase().includes('screen') ? 'screen' : brandingMethod.toLowerCase().includes('metal') ? 'metal' : 'patch'}`}
                    style={{
                      top: logoPosition.top,
                      left: logoPosition.left,
                      transform: `translate(-50%, -50%) scale(${logoScale / 100}) rotate(${logoRotate}deg)`
                    }}
                  >
                    {logoImage ? (
                      <img src={logoImage} alt="Brand Logo Overlay" className="user-uploaded-logo" />
                    ) : (
                      <div className="placeholder-logo-box">
                        <span className="logo-placeholder-text">{logoText}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Canvas Action Quick Strip */}
              <div className="canvas-footer-strip">
                <div className="spec-badge-row">
                  <span className="spec-pill technical-text">{brandingMethod}</span>
                  <span className="spec-pill technical-text">{selectedMaterial}</span>
                </div>
                <button type="button" className="btn-canvas-reset" onClick={handleResetLogo}>
                  <RotateCcw size={12} />
                  <span>RESET LOGO</span>
                </button>
              </div>

            </div>

            {/* Quick Share Callout Banner */}
            <div className="customizer-share-bar">
              <div className="share-bar-info">
                <span className="share-title">Need stakeholder or manager approval?</span>
                <span className="share-sub">Share this custom configuration directly to WhatsApp.</span>
              </div>
              <div className="share-bar-btns">
                <button 
                  type="button" 
                  className="btn-share-wa"
                  onClick={handleShareWhatsAppSpec}
                  title="Share spec on WhatsApp"
                >
                  <Share2 size={14} />
                  <span>SHARE SPEC</span>
                </button>
                <button 
                  type="button" 
                  className="btn-copy-spec"
                  onClick={handleCopySpec}
                  title="Copy spec to clipboard"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'COPIED!' : 'COPY'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Configuration Console */}
          <div className="customizer-controls-col">
            
            {/* Step 1: Logo & Branding Upload */}
            <div className="control-section">
              <div className="section-header">
                <span className="step-num technical-text">01 // BRAND IDENTITY</span>
                <h3>Upload Corporate Logo</h3>
              </div>

              <div className="logo-upload-box">
                <input 
                  type="file" 
                  id="modal-logo-upload" 
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden-file-input"
                />
                <label htmlFor="modal-logo-upload" className="logo-upload-dropzone">
                  <Upload size={20} className="upload-icon" />
                  <div className="upload-text">
                    <span className="primary-upload-text">Upload Vector Logo (PNG, SVG, JPG)</span>
                    <span className="secondary-upload-text">Supports transparent backgrounds &bull; Max 15MB</span>
                  </div>
                </label>
              </div>

              {/* Text Fallback */}
              <div className="logo-text-input-wrap">
                <label htmlFor="logo-text-input" className="control-label technical-text">OR ENTER COMPANY / BRAND TEXT:</label>
                <input 
                  type="text" 
                  id="logo-text-input" 
                  value={logoText} 
                  onChange={(e) => setLogoText(e.target.value)}
                  placeholder="e.g. ACME CORP" 
                  className="editorial-input"
                />
              </div>

              {/* Logo Sizing & Rotation Sliders */}
              <div className="sliders-row">
                <div className="slider-group">
                  <div className="slider-label-row">
                    <span className="control-label technical-text">LOGO SIZE:</span>
                    <span className="slider-val technical-text">{logoScale}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="180" 
                    value={logoScale} 
                    onChange={(e) => setLogoScale(Number(e.target.value))}
                    className="custom-range-slider"
                  />
                </div>

                <div className="slider-group">
                  <div className="slider-label-row">
                    <span className="control-label technical-text">ROTATION:</span>
                    <span className="slider-val technical-text">{logoRotate}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="-45" 
                    max="45" 
                    value={logoRotate} 
                    onChange={(e) => setLogoRotate(Number(e.target.value))}
                    className="custom-range-slider"
                  />
                </div>
              </div>

              {/* Placement Selector */}
              <div className="position-selector-wrap">
                <span className="control-label technical-text">PLACEMENT LOCATION ON BAG:</span>
                <div className="position-pill-grid">
                  {LOGO_POSITIONS.map((pos) => (
                    <button
                      type="button"
                      key={pos.id}
                      className={`pos-pill ${logoPosition.id === pos.id ? 'active' : ''}`}
                      onClick={() => setLogoPosition(pos)}
                    >
                      {logoPosition.id === pos.id && <Check size={12} />}
                      <span>{pos.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Branding Technique */}
            <div className="control-section">
              <div className="section-header">
                <span className="step-num technical-text">02 // EMBELLISHMENT TECHNIQUE</span>
                <h3>Branding Method</h3>
              </div>

              <div className="branding-methods-grid">
                {BRANDING_METHODS.map((method) => (
                  <div 
                    key={method.id}
                    className={`branding-method-card ${brandingMethod === method.name ? 'active' : ''}`}
                    onClick={() => setBrandingMethod(method.name)}
                  >
                    <div className="method-radio">
                      {brandingMethod === method.name && <div className="radio-inner" />}
                    </div>
                    <div className="method-info">
                      <span className="method-name">{method.name}</span>
                      <span className="method-desc">{method.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Hardware & Features */}
            <div className="control-section">
              <div className="section-header">
                <span className="step-num technical-text">03 // HARDWARE &amp; CUSTOM SPECS</span>
                <h3>Zippers &amp; Engineering Upgrades</h3>
              </div>

              <div className="hardware-select-wrap">
                <span className="control-label technical-text">ZIPPER &amp; HARDWARE GRADE:</span>
                <div className="hardware-pill-grid">
                  {HARDWARE_OPTIONS.map((hw, idx) => (
                    <button
                      type="button"
                      key={idx}
                      className={`hw-pill ${hardware === hw ? 'active' : ''}`}
                      onClick={() => setHardware(hw)}
                    >
                      {hardware === hw && <Check size={12} />}
                      <span>{hw}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="features-checkbox-wrap">
                <span className="control-label technical-text">OPTIONAL FLEET UPGRADES:</span>
                <div className="features-list">
                  {FEATURE_ADDONS.map((feat, idx) => {
                    const isChecked = selectedFeatures.includes(feat);
                    return (
                      <div 
                        key={idx} 
                        className={`feature-check-row ${isChecked ? 'active' : ''}`}
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

            {/* Step 4: Volume & WhatsApp Action */}
            <div className="control-section">
              <div className="section-header">
                <span className="step-num technical-text">04 // PRODUCTION VOLUME</span>
                <h3>Fleet Quantity &amp; Ordering</h3>
              </div>

              <div className="qty-tiers-row">
                {QUANTITY_TIERS.map((tier) => (
                  <button
                    type="button"
                    key={tier.qty}
                    className={`tier-card ${quantity === tier.qty ? 'active' : ''}`}
                    onClick={() => setQuantity(tier.qty)}
                  >
                    <span className="tier-qty">{tier.qty}</span>
                    <span className="tier-units">UNITS</span>
                    <span className="tier-badge technical-text">{tier.badge}</span>
                  </button>
                ))}
              </div>

              {/* Exact Quantity Stepper */}
              <div className="custom-qty-stepper-wrap">
                <span className="control-label technical-text">CUSTOM QUANTITY (ORDER 1 OR ANY FLEET SIZE):</span>
                <div className="modal-qty-stepper">
                  <button 
                    type="button" 
                    className="modal-step-btn"
                    onClick={() => setQuantity(prev => Math.max(1, (parseInt(prev, 10) || 1) - 1))}
                    aria-label="Decrease quantity"
                  >-</button>
                  <input 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setQuantity(isNaN(val) || val < 1 ? 1 : val);
                    }}
                    className="modal-qty-input"
                  />
                  <button 
                    type="button" 
                    className="modal-step-btn"
                    onClick={() => setQuantity(prev => (parseInt(prev, 10) || 1) + 1)}
                    aria-label="Increase quantity"
                  >+</button>
                  <span className="modal-qty-hint technical-text">NO MOQ • 1 PC PROTOTYPE OR 10,000+ UNITS</span>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="notes-wrap">
                <label htmlFor="custom-notes" className="control-label technical-text">ADDITIONAL BRIEF / PANTONE CODES (OPTIONAL):</label>
                <textarea 
                  id="custom-notes" 
                  rows="2" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Target delivery date, specific Pantone color codes, custom packaging requirements..." 
                  className="editorial-textarea"
                />
              </div>

              {/* Action Buttons */}
              <div className="customizer-actions-row">
                <button 
                  type="button" 
                  className="btn-modal-wa-order"
                  onClick={handleSendWhatsAppOrder}
                >
                  <MessageCircle size={18} />
                  <span>SEND SPECIFICATION TO WHATSAPP</span>
                </button>

                <button 
                  type="button" 
                  className="btn-modal-wa-share"
                  onClick={handleShareWhatsAppSpec}
                >
                  <Share2 size={16} />
                  <span>SHARE WITH TEAM</span>
                </button>
              </div>

              <div className="guarantee-assurance technical-text">
                <ShieldCheck size={14} />
                <span>FREE PRE-PRODUCTION DIGITAL PROOF &bull; PHYSICAL SAMPLING IN 5-7 DAYS &bull; 100% SPEC ACCURACY</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductCustomizerModal;
