import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MessageCircle, 
  Package, 
  CheckCircle2
} from 'lucide-react';
import { CATEGORIES } from '../data/productsData';
import { useProducts } from '../hooks/useProducts';
import { buildWhatsAppUrl, generateBulkQuoteMessage } from '../config';
import ProductCard from '../components/ProductCard';
import ProductCustomizerModal from '../components/ProductCustomizerModal';
import BulkOrderTiers from '../components/BulkOrderTiers';
import './Products.css';

const STORAGE_KEY = 'abag_products_state';

// Utility: save current products page state to sessionStorage
const saveProductsState = (state) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
};

// Utility: read saved state from sessionStorage
const loadProductsState = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

const Products = () => {
  const { products: PRODUCTS = [], loading } = useProducts();
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('cat');

  // Restore persisted state if returning from a product detail page
  const saved = loadProductsState();
  const isRestoring = saved && sessionStorage.getItem('abag_restore_products_scroll') === 'true';

  const [selectedCategory, setSelectedCategory] = useState(
    isRestoring && saved.category ? saved.category : (catParam || 'all')
  );
  const [searchQuery, setSearchQuery] = useState(
    isRestoring && saved.searchQuery != null ? saved.searchQuery : ''
  );
  const [activeCustomizerProduct, setActiveCustomizerProduct] = useState(null);
  const [visibleCount, setVisibleCount] = useState(
    isRestoring && saved.visibleCount ? saved.visibleCount : 24
  );

  // On mount: scroll to saved position if returning, else go to top
  useEffect(() => {
    const restoring = sessionStorage.getItem('abag_restore_products_scroll') === 'true';
    const savedState = loadProductsState();

    if (restoring && savedState?.scrollY != null) {
      // Clear the restore flag so future fresh visits go to top
      sessionStorage.removeItem('abag_restore_products_scroll');
      // Give the DOM a tick to paint with correct visibleCount before restoring scroll
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: savedState.scrollY, behavior: 'instant' });
          if (window.__lenis) {
            window.__lenis.scrollTo(savedState.scrollY, { immediate: true });
          }
        });
      });
    } else {
      sessionStorage.removeItem('abag_restore_products_scroll');
      window.scrollTo(0, 0);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save state whenever relevant values change
  useEffect(() => {
    saveProductsState({
      scrollY: window.scrollY,
      visibleCount,
      category: selectedCategory,
      searchQuery,
    });
  }, [visibleCount, selectedCategory, searchQuery]);

  // Also save scroll position continuously while on this page
  useEffect(() => {
    const handleScroll = () => {
      saveProductsState({
        scrollY: window.scrollY,
        visibleCount,
        category: selectedCategory,
        searchQuery,
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, selectedCategory, searchQuery]);

  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  // Filtered products list - safely handle properties and recalculate when PRODUCTS loads
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(PRODUCTS)) return [];
    return PRODUCTS.filter((item) => {
      if (!item) return false;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const name = (item.name || '').toLowerCase();
      const sku = (item.sku || '').toLowerCase();
      const tagline = (item.tagline || '').toLowerCase();
      const laptopFit = (item.laptopFit || '').toLowerCase();
      const materials = Array.isArray(item.materials) ? item.materials : [];
      const matchesQuery = (
        name.includes(q) ||
        sku.includes(q) ||
        tagline.includes(q) ||
        laptopFit.includes(q) ||
        materials.some(m => (m || '').toLowerCase().includes(q))
      );
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery, PRODUCTS]);

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
              <span className="technical-text header-eyebrow">PRODUCTION ARCHIVE // {PRODUCTS.length || 39} CURATED MODELS</span>
              <h1 className="header-title">Engineered Bags for Custom Branding &amp; Fleets</h1>
              <p className="header-desc">
                Precision-manufactured for corporate tech fleets, events, and customized client merchandise. Heavy-duty bar-tack stitching and full Pantone matching.
              </p>
            </div>

            {/* Direct Bulk Orders Tier Scroll CTA */}
            <div className="top-header-right">
              <a 
                href="#quote-calculator" 
                className="btn-bulk-whatsapp-compact"
                style={{ textDecoration: 'none' }}
              >
                <Package size={15} />
                <span>BULK ORDERS (25–250+ UNITS)</span>
                <MessageCircle size={15} className="wa-icon-accent" />
              </a>
            </div>
          </div>

          {/* Compact Perks Strip */}
          <div className="header-perks-strip technical-text">
            <span className="perk-strip-item"><CheckCircle2 size={12} className="perk-icon" /> MINIMUM ORDER 50 UNITS (MOQ)</span>
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

      {/* Bulk Order Tiers & Volume Commission Section */}
      <BulkOrderTiers />

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
