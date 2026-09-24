import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ArrowUpRight } from 'lucide-react';
import './BagsSection.css';

const collection = [
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
];

const BagsSection = () => {
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
          <span className="technical-text mb-2">OUR MANUFACTURED BAGS</span>
          <h2 className="carousel-title">
            Different Needs.<br/>Same Quality.
          </h2>
          <div style={{ marginTop: '0.85rem' }}>
            <Link to="/products" className="technical-text link-explore-archive">
              EXPLORE ALL 47 PRODUCTION MODELS <ArrowUpRight size={14} />
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
              0{activeSlide} / 0{collection.length}
            </span>
          </div>
        </div>
        
      </div>

      <div className="carousel-track-wrapper">
        <button className="carousel-nav-btn prev" onClick={scrollLeft} aria-label="Previous">
          <ArrowLeft size={16} />
        </button>
        
        <div 
          className="carousel-track" 
          ref={scrollRef} 
          onScroll={handleScroll}
        >
          {collection.map((item) => (
            <Link to={item.link} className="carousel-card" key={item.id}>
              <div className="carousel-card-img">
                <span className="carousel-card-tag technical-text">{item.tag}</span>
                <img src={item.img} alt={`${item.client} ${item.title}`} loading="lazy" />
              </div>
              <div className="carousel-card-meta">
                <span className="carousel-card-client technical-text">{item.client} • {item.spec}</span>
                <h3 className="carousel-card-title">
                  {item.title} <ArrowRight size={14} className="card-arrow" />
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <button className="carousel-nav-btn next" onClick={scrollRight} aria-label="Next">
          <ArrowRight size={16} />
        </button>
      </div>

    </section>
  );
};

export default BagsSection;
