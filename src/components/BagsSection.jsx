import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ArrowUpRight } from 'lucide-react';
import './BagsSection.css';

const DEFAULT_COLLECTION = [
  { 
    id: '01', 
    title: 'Reinforced Cargo Pack', 
    client: 'Industrial Operations AM-08', 
    spec: '30L • Heavy Bar-Tack Dual Chamber',
    tag: 'CARGO FLEET',
    img: '/products/cutout/8.png', 
    link: '/products/amb-08' 
  },
  { 
    id: '02', 
    title: 'Executive Document Brief', 
    client: 'Enterprise Attache AM-11', 
    spec: '16L • 15.6" Shock Cushion Carry',
    tag: 'EXECUTIVE BRIEF',
    img: '/products/cutout/11.png', 
    link: '/products/amb-11' 
  },
  { 
    id: '03', 
    title: 'Ascent Tactical Sling', 
    client: 'Field Mobility Edition AM-27', 
    spec: '7L • Single-Strap Ergonomic Swing',
    tag: 'MODULAR SLING',
    img: '/products/cutout/27.png', 
    link: '/products/amb-27' 
  },
  { 
    id: '04', 
    title: 'Canvas Field Duffel', 
    client: 'Heavy Transit Series AM-42', 
    spec: '35L • Weatherproof Cylindrical Base',
    tag: 'EXPEDITION DUFFEL',
    img: '/products/cutout/42.png', 
    link: '/products/amb-42' 
  },
  { 
    id: '05', 
    title: 'Apex Business Edition', 
    client: 'Corporate Fleet AM-17', 
    spec: '25L • Onboarding Executive Fit',
    tag: 'ENTERPRISE FLEET',
    img: '/products/cutout/17.png', 
    link: '/products/amb-17' 
  },
  { 
    id: '06', 
    title: 'Stealth Tactical Daypack', 
    client: 'Technical Ripstop AM-46', 
    spec: '28L • Matte Black Cordura Weave',
    tag: 'TACTICAL DAYPACK',
    img: '/products/cutout/46.png', 
    link: '/products/amb-46' 
  },
  { 
    id: '07', 
    title: 'Executive Tech Daypack', 
    client: 'Corporate Fleet AM-01', 
    spec: '24L • External Tech Stash Pocket',
    tag: 'TECH COMMUTER',
    img: '/products/cutout/1.png', 
    link: '/products/amb-01' 
  },
  { 
    id: '08', 
    title: 'Dual-Tone Daily Commuter', 
    client: 'Aerodynamic Series AM-02', 
    spec: '22L • High-Density Foam Padding',
    tag: 'AERODYNAMIC PACK',
    img: '/products/cutout/2.png', 
    link: '/products/amb-02' 
  },
  { 
    id: '09', 
    title: 'Tactical Modular Daypack', 
    client: 'Field Operations AM-03', 
    spec: '32L • Laser-Cut MOLLE Webbing',
    tag: 'MODULAR WORKHORSE',
    img: '/products/cutout/3.png', 
    link: '/products/amb-03' 
  },
  { 
    id: '10', 
    title: 'Heavy-Duty Field Backpack', 
    client: 'Engineer Fleet AM-06', 
    spec: '35L • Twin Chamber Cordura Build',
    tag: 'FIELD CARRIER',
    img: '/products/cutout/6.png', 
    link: '/products/amb-06' 
  },
  { 
    id: '11', 
    title: 'Crossbody Mobility Sling', 
    client: 'Technician Transit AM-07', 
    spec: '8L • Vertical Quick-Draw Pouch',
    tag: 'TECHNICIAN SLING',
    img: '/products/cutout/9.png', 
    link: '/products/amb-07' 
  },
  { 
    id: '12', 
    title: 'Poojara Document Briefcase', 
    client: 'Formal Attache AM-09', 
    spec: '18L • Contrast Piped Dual Handles',
    tag: 'FORMAL ATTACHE',
    img: '/products/cutout/10.png', 
    link: '/products/amb-09' 
  },
];

const BagsSection = ({ items = [], sectionData }) => {
  const subtitle = sectionData?.subtitle || 'OUR MANUFACTURED BAGS';
  const rawTitle = sectionData?.title || 'Different Needs.\nSame Quality.';
  const titleParts = rawTitle.includes('\n') ? rawTitle.split('\n') : (rawTitle.includes('. ') ? rawTitle.split('. ') : [rawTitle]);

  // Use passed items if available (take up to 12), otherwise fall back to curated 12-item default collection
  const collection = items && items.length > 0 ? items.slice(0, 12).map((p, i) => {
    let rawTag = 'PRODUCT';
    if (Array.isArray(p.features) && p.features.length > 0) {
      rawTag = p.features[0];
    } else if (typeof p.features === 'string' && p.features.trim()) {
      rawTag = p.features.split(',')[0].trim();
    } else if (p.category) {
      rawTag = p.category;
    }
    const tag = String(rawTag).substring(0, 18).toUpperCase();

    let rawSpec = '';
    if (typeof p.description === 'string' && p.description.trim()) {
      rawSpec = p.description;
    } else if (p.tagline) {
      rawSpec = p.tagline;
    } else if (p.capacity) {
      rawSpec = `${p.capacity} • ${p.category || 'Carry Solution'}`;
    }
    const spec = rawSpec.length > 34 ? rawSpec.substring(0, 34) + '...' : rawSpec;

    const img = p.primary_image || (p.image_url 
      ? (p.image_url.startsWith('http') ? p.image_url : `https://askmebag.com/storage/${p.image_url}`)
      : (p.image 
        ? `https://askmebag.com/storage/${p.image}` 
        : (p.cutoutImage || DEFAULT_COLLECTION[i % DEFAULT_COLLECTION.length]?.img || '/products/cutout/8.png')
      ));

    return {
      id: String(i + 1).padStart(2, '0'),
      title: p.name || p.title || `Custom Bag ${i + 1}`,
      client: p.category ? `${p.category.toUpperCase()} • ${p.sku || `AM-${String(i + 1).padStart(2, '0')}`}` : (p.client || 'Corporate Fleet'),
      spec: spec,
      tag: tag,
      img: img,
      link: `/products/${p.string_id || p.id || p.sku || 'amb-08'}`
    };
  }) : DEFAULT_COLLECTION;

  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollProgress(progress);
    }
  };
  
  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const activeSlide = Math.min(
    Math.max(1, Math.round(scrollProgress * (collection.length - 1)) + 1),
    collection.length
  );

  return (
    <section className="carousel-collection-section" id="bags">
      
      <div className="carousel-header-container">
        
        <div className="carousel-header-left">
          <span className="technical-text mb-2">{subtitle}</span>
          <h2 className="carousel-title">
            {titleParts.map((part, i) => (
              <React.Fragment key={i}>
                {part}{i < titleParts.length - 1 && (part.endsWith('.') ? <><br/></> : <>. <br/></>)}
              </React.Fragment>
            ))}
          </h2>
          {sectionData?.description && (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: 460 }}>
              {sectionData.description}
            </p>
          )}
          <div style={{ marginTop: '0.85rem' }}>
            <Link to={sectionData?.cta_url || "/products"} className="technical-text link-explore-archive">
              {sectionData?.cta_text || 'EXPLORE ALL 47 PRODUCTION MODELS'} <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        <div className="carousel-header-right">
          <div className="scroll-indicator-wrapper">
            <span className="scroll-label">Scroll to explore <ArrowRight size={14}/></span>
            <div className="scroll-track">
              <div 
                className="scroll-thumb" 
                style={{ width: `${Math.max(15, scrollProgress * 100)}%` }} 
              />
            </div>
            <span className="scroll-count technical-text">
              {String(activeSlide).padStart(2, '0')} / {String(collection.length).padStart(2, '0')}
            </span>
          </div>
        </div>
        
      </div>

      <div className="carousel-track-wrapper">
        <button className="carousel-nav-btn prev" onClick={scrollLeft} aria-label="Previous">
          <ArrowLeft size={16} />
        </button>
        <button className="carousel-nav-btn next" onClick={scrollRight} aria-label="Next">
          <ArrowRight size={16} />
        </button>

        <div className="carousel-track" ref={scrollRef} onScroll={handleScroll}>
          {collection.map((item) => (
            <div className="carousel-card-item" key={item.id}>
              
              <Link to={item.link} className="carousel-card-img-wrapper">
                <span className="carousel-card-tag technical-text">{item.tag}</span>
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="carousel-product-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/products/cutout/8.png';
                  }}
                />
              </Link>
              
              <div className="carousel-card-details">
                <div className="technical-text item-client">{item.client}</div>
                {item.spec && <div className="technical-text item-spec">{item.spec}</div>}
                <div className="card-bottom-row">
                  <h3 className="item-title">{item.title}</h3>
                  <Link to={item.link} className="item-arrow-btn" aria-label={`View ${item.title}`}>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default BagsSection;
