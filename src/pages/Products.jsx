import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MessageCircle, 
  Package, 
  CheckCircle2
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/productsData';
import { buildWhatsAppUrl, generateBulkQuoteMessage } from '../config';
import ProductCard from '../components/ProductCard';
import ProductCustomizerModal from '../components/ProductCustomizerModal';
import './Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('cat');
  const [selectedCategory, setSelectedCategory] = useState(catParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCustomizerProduct, setActiveCustomizerProduct] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || (
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.laptopFit.toLowerCase().includes(q) ||
        item.materials.some(m => m.toLowerCase().includes(q))
      );
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenGeneralBulkQuote = () => {
    const message = generateBulkQuoteMessage('Custom Enterprise Bag Fleet (Various Models)', 'CATALOG-2026', 500);
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="products-page-container">
      
      {/* Compact Editorial Header */}
      <section className="products-top-header">
        <div className="editorial-container">
          <div className="top-header-row">
            <div className="top-header-left">
              <span className="technical-text header-eyebrow">PRODUCTION ARCHIVE // 47 DEDICATED MODELS</span>
              <h1 className="header-title">Engineered Bags for Custom Branding &amp; Fleets</h1>
              <p className="header-desc">
                Precision-manufactured for corporate tech fleets, events, and customized client merchandise. Heavy-duty bar-tack stitching and full Pantone matching.
              </p>
            </div>

            {/* Direct WhatsApp Wholesale Pricing CTA */}
            <div className="top-header-right">
              <button className="btn-bulk-whatsapp-compact" onClick={handleOpenGeneralBulkQuote}>
                <Package size={15} />
                <span>BULK ORDERS (100–5,000+ UNITS)</span>
                <MessageCircle size={15} className="wa-icon-accent" />
              </button>
            </div>
          </div>

          {/* Compact Perks Strip */}
          <div className="header-perks-strip technical-text">
            <span className="perk-strip-item"><CheckCircle2 size={12} className="perk-icon" /> NO MOQ // ORDER FROM 1 UNIT</span>
            <span className="perk-strip-item"><CheckCircle2 size={12} className="perk-icon" /> FREE 3D DIGITAL MOCKUP</span>
            <span className="perk-strip-item"><CheckCircle2 size={12} className="perk-icon" /> PHYSICAL PRE-PROD SAMPLE</span>
            <span className="perk-strip-item"><CheckCircle2 size={12} className="perk-icon" /> PANTONE COLOR MATCHING</span>
            <span className="perk-strip-item"><CheckCircle2 size={12} className="perk-icon" /> DIRECT FACTORY DISPATCH</span>
          </div>
        </div>
      </section>

      {/* Slim Sticky Command Toolbar */}
      <section className="catalog-toolbar-section">
        <div className="editorial-container">
          <div className="catalog-toolbar">
            
            {/* Category Pills Bar */}
            <div className="category-pills-scroll">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setVisibleCount(24);
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search Input Box */}
            <div className="search-box-wrapper">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(24);
                }}
                placeholder="Search models, laptop, size..."
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')} title="Clear filter">
                  &times;
                </button>
              )}
            </div>

          </div>

          {/* Filter Status Tag (only when active search) */}
          {searchQuery && (
            <div className="catalog-status-bar technical-text">
              <span>SHOWING {filteredProducts.length} BAGS MATCHING: "{searchQuery}"</span>
              <button className="btn-clear-query" onClick={() => setSearchQuery('')}>RESET SEARCH</button>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="catalog-grid-section">
        <div className="editorial-container">
          {filteredProducts.length === 0 ? (
            <div className="no-results-box">
              <h3>No bag models found matching your criteria.</h3>
              <p>Try clearing your search query or selecting "ALL PRODUCTS".</p>
              <button 
                className="btn-clear-filters technical-text"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onOpenCustomizer={(p) => setActiveCustomizerProduct(p)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredProducts.length && (
                <div className="load-more-container">
                  <button 
                    className="btn-load-more technical-text"
                    onClick={() => setVisibleCount((prev) => prev + 24)}
                  >
                    LOAD MORE PRODUCTION MODELS ({filteredProducts.length - visibleCount} REMAINING)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Customizer Modal */}
      <ProductCustomizerModal 
        product={activeCustomizerProduct}
        isOpen={!!activeCustomizerProduct}
        onClose={() => setActiveCustomizerProduct(null)}
      />

    </div>
  );
};

export default Products;
