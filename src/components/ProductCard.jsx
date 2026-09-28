import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Sliders, ArrowUpRight, Package } from 'lucide-react';
import { buildWhatsAppUrl, generateProductOrderMessage, generateBulkQuoteMessage } from '../config';
import './ProductCard.css';

const getShortAngleLabel = (label) => {
  if (!label) return 'VIEW';
  const lower = label.toLowerCase();
  if (lower.includes('front')) return 'FRONT';
  if (lower.includes('3/4') || lower.includes('angle') || lower.includes('perspective')) return '3/4';
  if (lower.includes('harness') || lower.includes('back') || lower.includes('strap')) return 'BACK';
  if (lower.includes('top') || lower.includes('zipper')) return 'TOP';
  if (lower.includes('side') || lower.includes('profile')) return 'SIDE';
  if (lower.includes('dual')) return 'DUAL';
  if (lower.includes('single')) return 'SINGLE';
  return label.split(' ')[0].toUpperCase();
};

const ProductCard = ({ product, onOpenCustomizer }) => {
  const navigate = useNavigate();

  // Set a flag so Products page knows to restore scroll when this navigation returns
  const goToProduct = (e) => {
    e.preventDefault();
    try { sessionStorage.setItem('abag_restore_products_scroll', 'true'); } catch (_) {}
    navigate(`/products/${product.id}`);
  };
  const availableImages = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : [{ label: 'Studio View', url: product.cutoutImage || product.defaultImage }];

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const currentImg = availableImages[activeImgIndex]?.url || product.cutoutImage || product.defaultImage;

  const handleWhatsAppQuickOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = generateProductOrderMessage({
      productName: product.name,
      sku: product.sku,
      quantity: Math.max(50, product.minOrder || 50),
      color: product.colorOptions?.[0]?.name || 'Classic Black',
      material: product.materials?.[0] || '1000D Tactical Cordura'
    });
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppBulkQuote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = generateBulkQuoteMessage(product.name, product.sku, 250);
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  const handleCustomizeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenCustomizer) {
      onOpenCustomizer(product);
    }
  };

  return (
    <div className="editorial-product-card">
      
      {/* Product Image Stage - Seamless Background */}
      <div className="card-visual-frame">
        {/* Top Badges */}
        <div className="card-floating-meta">
          <span className="card-sku-badge">{product.sku}</span>
          <span className="card-moq-badge">MOQ 50 PCS</span>
        </div>

        {/* Multi-Angle Toggle (Positioned at bottom of frame to eliminate any badge collisions) */}
        {availableImages.length > 1 && (
          <div className="card-photo-toggle" onClick={(e) => e.stopPropagation()}>
            {availableImages.map((img, idx) => (
              <button 
                key={idx}
                type="button"
                className={`photo-toggle-btn ${activeImgIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveImgIndex(idx)}
                title={img.label}
              >
                {getShortAngleLabel(img.label)}
              </button>
            ))}
          </div>
        )}

        {/* Product Image */}
        <a
          href={`/products/${product.id}`}
          className="card-img-link"
          title={`View ${product.name}`}
          onClick={goToProduct}
        >
          <img 
            src={currentImg} 
            alt={`${product.name} - ${availableImages[activeImgIndex]?.label || 'Product View'}`} 
            className="card-product-img img-cutout"
            loading="lazy"
          />
        </a>
      </div>

      {/* Clean Card Details */}
      <div className="card-body">
        
        {/* Spec Pill Line */}
        <div className="card-specs-line">
          <span>{product.capacity}</span>
          <span className="spec-dot">•</span>
          <span>FITS {product.laptopFit}</span>
          <span className="spec-dot">•</span>
          <span className="spec-custom-tag">CUSTOMIZABLE</span>
        </div>

        {/* Modern Sans-Serif Title */}
        <a
          href={`/products/${product.id}`}
          className="card-title-link"
          onClick={goToProduct}
        >
          <h3 className="card-title" title={product.name}>{product.name}</h3>
        </a>

        {/* Primary WhatsApp Order Button */}
        <button 
          type="button"
          className="btn-card-whatsapp"
          onClick={handleWhatsAppQuickOrder}
          title="Direct WhatsApp order & custom mockup"
        >
          <MessageCircle size={16} />
          <span>ORDER ON WHATSAPP</span>
        </button>

        {/* Secondary Quick Action Links */}
        <div className="card-secondary-links">
          <button 
            type="button" 
            className="btn-link-action"
            onClick={handleCustomizeClick}
            title="Open visual customizer"
          >
            <Sliders size={13} />
            <span>Customize</span>
          </button>
          
          <button 
            type="button" 
            className="btn-link-action"
            onClick={handleWhatsAppBulkQuote}
            title="Bulk pricing on WhatsApp"
          >
            <Package size={13} />
            <span>Bulk Quote</span>
          </button>

          <a
            href={`/products/${product.id}`}
            className="btn-link-action"
            title="View technical specifications"
            onClick={goToProduct}
          >
            <span>Specs</span>
            <ArrowUpRight size={13} />
          </a>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;

