import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageCircle, 
  Package, 
  Sliders, 
  ShieldCheck, 
  Check, 
  Sparkles
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useSmoothScroll } from '../components/SmoothScroll';
import { buildWhatsAppUrl, generateProductOrderMessage, generateBulkQuoteMessage } from '../config';
import ProductCustomizerModal from '../components/ProductCustomizerModal';
import ProductAnatomy from '../components/ProductAnatomy';
import FadeIn from '../components/FadeIn';
import './ProductDetail.css';

const getCleanAnglePillLabel = (label) => {
  if (!label) return 'VIEW';
  const lower = label.toLowerCase();
  if (lower.includes('front')) return 'FRONT';
  if (lower.includes('3/4') || lower.includes('perspective') || lower.includes('angle')) return '3/4 ANGLE';
  if (lower.includes('harness') || lower.includes('back') || lower.includes('strap')) return 'HARNESS / BACK';
  if (lower.includes('top') || lower.includes('zipper')) return 'TOP ACCESS';
  if (lower.includes('side') || lower.includes('profile')) return 'SIDE VIEW';
  if (lower.includes('dual')) return 'DUAL ZIP';
  if (lower.includes('single')) return 'SINGLE ZIP';
  return label.toUpperCase();
};

const getCleanThumbLabel = (label) => {
  if (!label) return 'View';
  const lower = label.toLowerCase();
  if (lower.includes('front')) return 'Front';
  if (lower.includes('3/4') || lower.includes('perspective') || lower.includes('angle')) return '3/4 Angle';
  if (lower.includes('harness') || lower.includes('back') || lower.includes('strap')) return 'Harness';
  if (lower.includes('top') || lower.includes('zipper')) return 'Top View';
  if (lower.includes('side') || lower.includes('profile')) return 'Side View';
  if (lower.includes('dual')) return 'Dual';
  if (lower.includes('single')) return 'Single';
  return label;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [orderQty, setOrderQty] = useState(50);
  const { lenis } = useSmoothScroll();

  // Navigate back to catalog and request scroll restoration
  const handleBackToProducts = (e) => {
    e.preventDefault();
    try { sessionStorage.setItem('abag_restore_products_scroll', 'true'); } catch (_) {}
    navigate('/products');
  };

  const { products: PRODUCTS = [], loading } = useProducts();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [id, lenis]);

  const getProductById = (searchId) => PRODUCTS.find(p => p.id === searchId || p.string_id === searchId || String(p.id) === String(searchId));
  const product = getProductById(id) || PRODUCTS[0] || {};

  const availableImages = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : [{ label: 'Studio View', url: product.cutoutImage || product.defaultImage || '' }];

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Reset image index when product id changes
  useEffect(() => {
    setActiveImgIndex(0);
  }, [id]);

  if (loading && PRODUCTS.length === 0) return <div className="product-detail-page"><div className="editorial-container">Loading...</div></div>;

  const activeImage = availableImages[activeImgIndex]?.url || product.cutoutImage || product.defaultImage;

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
            <a href="/products" className="back-link" onClick={handleBackToProducts}>
              <ArrowLeft size={14} /> BACK TO PRODUCTS CATALOGUE
            </a>
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
              
              {/* Photo Mode Switcher (When multiple genuine angles exist) */}
              {availableImages.length > 1 && (
                <div className="detail-photo-toggle">
                  {availableImages.map((img, idx) => (
                    <button 
                      key={idx}
                      className={`toggle-btn ${activeImgIndex === idx ? 'active' : ''}`}
                      onClick={() => setActiveImgIndex(idx)}
                      title={img.label}
                    >
                      {getCleanAnglePillLabel(img.label)}
                    </button>
                  ))}
                </div>
              )}

              <img 
                src={activeImage} 
                alt={`${product.name} - ${availableImages[activeImgIndex]?.label || 'Product Angle'}`} 
                className="detail-hero-img"
              />

              <div className="detail-stage-badges">
                <span className="stage-badge technical-text">
                  {getCleanAnglePillLabel(availableImages[activeImgIndex]?.label)} // {product.sku}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {availableImages.length > 1 && (
              <div className="gallery-thumbnails">
                {availableImages.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`thumb-box ${activeImgIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                    title={img.label}
                  >
                    <img src={img.url} alt={img.label} />
                    <span className="technical-text thumb-label">{getCleanThumbLabel(img.label)}</span>
                  </div>
                ))}
              </div>
            )}

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
                    <span className="metric-val">50 UNITS (MOQ)</span>
                  </div>
                  <div className="metric-cell">
                    <span className="metric-label">LEAD TIME</span>
                    <span className="metric-val">{product.leadTime}</span>
                  </div>
                </div>

                {/* Quantity Selector: Order from 50 pieces */}
                <div className="detail-qty-container">
                  <div className="qty-headline-row">
                    <span className="qty-tag-label technical-text">SELECT QUANTITY:</span>
                    <span className="qty-tag-badge technical-text">MINIMUM ORDER: 50 UNITS (MOQ)</span>
                  </div>
                  
                  <div className="qty-action-box">
                    <div className="qty-stepper-wrap">
                      <button 
                        type="button" 
                        className="qty-btn"
                        onClick={() => setOrderQty(prev => Math.max(50, prev - 10))}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        min="50" 
                        value={orderQty} 
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setOrderQty(isNaN(val) || val < 50 ? 50 : val);
                        }}
                        className="qty-val-input" 
                      />
                      <button 
                        type="button" 
                        className="qty-btn"
                        onClick={() => setOrderQty(prev => prev + 10)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="qty-presets">
                      {[50, 100, 250, 500, 1000].map((q) => (
                        <button 
                          key={q}
                          type="button"
                          className={`qty-preset-btn ${orderQty === q ? 'active' : ''}`}
                          onClick={() => setOrderQty(q)}
                        >
                          {q} PCS
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary WhatsApp Direct CTAs */}
                <div className="detail-action-buttons">
                  <button className="btn-detail-order-wa" onClick={handleWhatsAppOrder}>
                    <MessageCircle size={18} />
                    <span>ORDER {orderQty} UNITS ON WHATSAPP (MOQ: 50)</span>
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
      </div>

      {/* Product Anatomy & Architectural Schematic Section */}
      <ProductAnatomy product={product} />

      <div className="editorial-container">
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
