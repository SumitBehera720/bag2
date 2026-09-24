import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageCircle, 
  Package, 
  Sliders, 
  ShieldCheck, 
  Check, 
  Sparkles
} from 'lucide-react';
import { getProductById, PRODUCTS } from '../data/productsData';
import { buildWhatsAppUrl, generateProductOrderMessage, generateBulkQuoteMessage } from '../config';
import ProductCustomizerModal from '../components/ProductCustomizerModal';
import FadeIn from '../components/FadeIn';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [activeImgMode, setActiveImgMode] = useState('cutout'); // 'cutout' or 'styled'
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [orderQty, setOrderQty] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const product = getProductById(id) || PRODUCTS[0];

  const activeImage = activeImgMode === 'cutout' ? product.cutoutImage : (product.styledImage || product.cutoutImage);

  const handleWhatsAppOrder = () => {
    const message = generateProductOrderMessage({
      productName: product.name,
      sku: product.sku,
      quantity: orderQty,
      color: 'Custom Brand Palette / Pantone',
      material: product.materials?.[0] || 'Tactical Cordura 1000D'
    });
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppBulk = () => {
    const message = generateBulkQuoteMessage(product.name, product.sku, 250);
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  // Related products in same category
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="product-detail-page">
      
      {/* Top Breadcrumb Nav */}
      <div className="detail-top-nav">
        <div className="editorial-container">
          <div className="breadcrumb-row technical-text">
            <Link to="/products" className="back-link">
              <ArrowLeft size={14} /> BACK TO PRODUCTS CATALOGUE
            </Link>
            <span className="sku-breadcrumb">ARCHIVE // {product.sku}</span>
          </div>
        </div>
      </div>

      <div className="editorial-container">
        <div className="product-detail-layout">
          
          {/* Left Column: Visual Gallery */}
          <div className="product-gallery-col">
            
            {/* Main Stage Image Frame */}
            <div className="detail-stage-frame">
              
              {/* Photo Mode Switcher */}
              <div className="detail-photo-toggle">
                <button 
                  className={`toggle-btn ${activeImgMode === 'cutout' ? 'active' : ''}`}
                  onClick={() => setActiveImgMode('cutout')}
                >
                  STUDIO CUTOUT
                </button>
                <button 
                  className={`toggle-btn ${activeImgMode === 'styled' ? 'active' : ''}`}
                  onClick={() => setActiveImgMode('styled')}
                >
                  IN-SITU LIFESTYLE
                </button>
              </div>

              <img 
                src={activeImage} 
                alt={product.name} 
                className={`detail-hero-img ${activeImgMode === 'styled' ? 'is-styled' : ''}`}
              />

              <div className="detail-stage-badges">
                <span className="stage-badge technical-text">FIG 01 // PRODUCTION ARCHIVE</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="gallery-thumbnails">
              <div 
                className={`thumb-box ${activeImgMode === 'cutout' ? 'active' : ''}`}
                onClick={() => setActiveImgMode('cutout')}
              >
                <img src={product.cutoutImage} alt="Cutout view" />
                <span className="technical-text thumb-label">STUDIO</span>
              </div>
              <div 
                className={`thumb-box ${activeImgMode === 'styled' ? 'active' : ''}`}
                onClick={() => setActiveImgMode('styled')}
              >
                <img src={product.styledImage || product.cutoutImage} alt="Styled view" />
                <span className="technical-text thumb-label">LIFESTYLE</span>
              </div>
            </div>

            {/* Customization Teaser Card */}
            <div className="customizer-teaser-box">
              <div className="teaser-content">
                <span className="teaser-badge technical-text">
                  <Sparkles size={13} /> INTERACTIVE PROTOTYPER
                </span>
                <h4>Want to see your company logo on this bag?</h4>
                <p>Upload your logo file or enter your brand name to view live placement mockups, choose custom fabrics, and specify hardware options.</p>
              </div>
              <button 
                className="btn-open-customizer technical-text"
                onClick={() => setIsCustomizerOpen(true)}
              >
                <Sliders size={16} /> LAUNCH LIVE CUSTOMIZER
              </button>
            </div>

          </div>

          {/* Right Column: Sticky Product Info */}
          <div className="product-info-col">
            <div className="product-info-sticky">
              <FadeIn>
                
                <div className="product-meta-header">
                  <span className="detail-category-tag technical-text">
                    CATEGORY: {product.category.toUpperCase()} &bull; SKU: {product.sku}
                  </span>
                  <div className="detail-status-pill technical-text">PRODUCTION READY</div>
                </div>

                <h1 className="product-title">{product.name}</h1>
                <p className="product-desc">{product.tagline}</p>

                {/* Key Quick Metrics */}
                <div className="quick-metrics-grid technical-text">
                  <div className="metric-cell">
                    <span className="metric-label">VOLUME</span>
                    <span className="metric-val">{product.capacity}</span>
                  </div>
                  <div className="metric-cell">
                    <span className="metric-label">LAPTOP FIT</span>
                    <span className="metric-val">{product.laptopFit}</span>
                  </div>
                  <div className="metric-cell">
                    <span className="metric-label">MIN ORDER</span>
                    <span className="metric-val">1 UNIT (NO MOQ)</span>
                  </div>
                  <div className="metric-cell">
                    <span className="metric-label">LEAD TIME</span>
                    <span className="metric-val">{product.leadTime}</span>
                  </div>
                </div>

                {/* Quantity Selector: Order from 1 piece */}
                <div className="detail-qty-container">
                  <div className="qty-headline-row">
                    <span className="qty-tag-label technical-text">SELECT QUANTITY:</span>
                    <span className="qty-tag-badge technical-text">NO MINIMUM &bull; ORDER 1 OR FLEET</span>
                  </div>
                  
                  <div className="qty-action-box">
                    <div className="qty-stepper-wrap">
                      <button 
                        type="button" 
                        className="qty-btn"
                        onClick={() => setOrderQty(prev => Math.max(1, prev - 1))}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        min="1" 
                        value={orderQty} 
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setOrderQty(isNaN(val) || val < 1 ? 1 : val);
                        }}
                        className="qty-val-input" 
                      />
                      <button 
                        type="button" 
                        className="qty-btn"
                        onClick={() => setOrderQty(prev => prev + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="qty-presets">
                      {[1, 5, 25, 50, 100, 250].map((q) => (
                        <button 
                          key={q}
                          type="button"
                          className={`qty-preset-btn ${orderQty === q ? 'active' : ''}`}
                          onClick={() => setOrderQty(q)}
                        >
                          {q === 1 ? '1 PC (SAMPLE)' : `${q} PCS`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary WhatsApp Direct CTAs */}
                <div className="detail-action-buttons">
                  <button className="btn-detail-order-wa" onClick={handleWhatsAppOrder}>
                    <MessageCircle size={18} />
                    <span>ORDER {orderQty} {orderQty === 1 ? 'UNIT (SAMPLE READY)' : 'UNITS'} ON WHATSAPP</span>
                  </button>

                  <div className="action-row-split">
                    <button className="btn-detail-bulk-wa" onClick={handleWhatsAppBulk}>
                      <Package size={16} />
                      <span>BULK WHOLESALE QUOTE</span>
                    </button>
                    <button className="btn-detail-customize" onClick={() => setIsCustomizerOpen(true)}>
                      <Sliders size={16} />
                      <span>CUSTOMIZE MODEL</span>
                    </button>
                  </div>
                </div>

                {/* Specifications Blocks */}
                <div className="product-specs-list">
                  
                  <div className="spec-card">
                    <h3 className="spec-card-title technical-text">CORE ENGINEERING FEATURES</h3>
                    <ul className="spec-features-list">
                      {product.features?.map((f, i) => (
                        <li key={i}><Check size={14} className="feature-check" /> {f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="spec-card">
                    <h3 className="spec-card-title technical-text">FABRIC &amp; MATERIAL OPTIONS</h3>
                    <div className="spec-tags-flow">
                      {product.materials?.map((m, i) => (
                        <span key={i} className="spec-tag">{m}</span>
                      ))}
                    </div>
                  </div>

                  <div className="spec-card">
                    <h3 className="spec-card-title technical-text">BRANDING METHODS SUPPORTED</h3>
                    <div className="spec-tags-flow">
                      {product.brandingOptions?.map((b, i) => (
                        <span key={i} className="spec-tag branding-tag">{b}</span>
                      ))}
                    </div>
                  </div>

                  <div className="spec-card guarantee-card">
                    <ShieldCheck size={20} className="guarantee-badge" />
                    <div>
                      <h4 className="guarantee-title">MANUFACTURING INTEGRITY PROMISE</h4>
                      <p className="guarantee-desc">Every piece undergoes 3-point QC: stitch tension, water-barrier seam check, and zip durability cycle test.</p>
                    </div>
                  </div>

                </div>

              </FadeIn>
            </div>
          </div>

        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <div className="section-head-row">
              <span className="technical-text section-subtitle">SAME FORMAT ARCHIVE</span>
              <h2 className="section-main-title">RELATED PRODUCTION MODELS</h2>
            </div>

            <div className="related-grid">
              {relatedProducts.map((rel) => (
                <Link to={`/products/${rel.id}`} key={rel.id} className="related-card">
                  <div className="related-img-frame">
                    <img src={rel.cutoutImage} alt={rel.name} />
                  </div>
                  <div className="related-info">
                    <span className="related-sku technical-text">{rel.sku}</span>
                    <h4 className="related-title">{rel.name}</h4>
                    <span className="related-cap technical-text">{rel.capacity} &bull; FITS {rel.laptopFit}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Live Customizer Modal */}
      <ProductCustomizerModal 
        product={product}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />

    </div>
  );
};

export default ProductDetail;
