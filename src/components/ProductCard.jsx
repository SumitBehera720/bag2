import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sliders, ArrowUpRight, Package } from 'lucide-react';
import { buildWhatsAppUrl, generateProductOrderMessage, generateBulkQuoteMessage } from '../config';
import './ProductCard.css';

const ProductCard = ({ product, onOpenCustomizer }) => {
  const [photoView, setPhotoView] = useState('cutout'); // 'cutout' or 'styled'

  const currentImg = photoView === 'cutout' ? product.cutoutImage : (product.styledImage || product.cutoutImage);

  const handleWhatsAppQuickOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = generateProductOrderMessage({
      productName: product.name,
      sku: product.sku,
      quantity: product.minOrder,
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
          <span className="card-moq-badge">FROM 1 PC</span>
        </div>

        {/* Studio / Styled Toggle */}
        <div className="card-photo-toggle" onClick={(e) => e.stopPropagation()}>
          <button 
            type="button"
            className={`photo-toggle-btn ${photoView === 'cutout' ? 'active' : ''}`}
            onClick={() => setPhotoView('cutout')}
            title="Studio View"
          >
            STUDIO
          </button>
          <button 
            type="button"
            className={`photo-toggle-btn ${photoView === 'styled' ? 'active' : ''}`}
            onClick={() => setPhotoView('styled')}
            title="Real Client Photo"
          >
            CLIENT
          </button>
        </div>

        {/* Product Image */}
        <Link to={`/products/${product.id}`} className="card-img-link" title={`View ${product.name}`}>
          <img 
            src={currentImg} 
            alt={product.name} 
            className={`card-product-img ${photoView === 'styled' ? 'img-styled' : 'img-cutout'}`}
            loading="lazy"
          />
        </Link>
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
        <Link to={`/products/${product.id}`} className="card-title-link">
          <h3 className="card-title" title={product.name}>{product.name}</h3>
        </Link>

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

          <Link to={`/products/${product.id}`} className="btn-link-action" title="View technical specifications">
            <span>Specs</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;

