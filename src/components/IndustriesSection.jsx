import React, { useRef } from 'react';
import { ArrowRight, ArrowLeft, MessageCircle, ArrowUpRight } from 'lucide-react';
import { buildWhatsAppUrl, generateBulkQuoteMessage } from '../config';
import './IndustriesSection.css';

const industries = [
  { 
    id: '01', 
    client: 'CREST DATA SYSTEMS',
    title: 'Corporate Tech Fleet', 
    subtitle: '500 Dual Commuter Packs', 
    img: '/products/styled/1.png', 
    features: ['Logo Embroidery', 'Dual 15.6" Laptop Fit', 'Pantone Trim', 'Ergonomic Air-Mesh'],
    link: '/products?cat=backpacks'
  },
  { 
    id: '02', 
    client: "BD'S KIDZ ACADEMY",
    title: 'Education & Student Fleet', 
    subtitle: '1,000 Custom Daypacks', 
    img: '/products/styled/30.png', 
    features: ['High-Density Screen Print', 'Heavy-Duty Twill', 'Reinforced Straps', 'ID Sleeve'],
    link: '/products?cat=backpacks'
  },
  { 
    id: '03', 
    client: 'RAMA BODY CLUB',
    title: 'Athletic & Gym Fleet', 
    subtitle: '500 Heavy-Duty Duffels', 
    img: '/products/styled/35.png', 
    features: ['Silk Screen Print', 'Padded Shoulder Harness', 'Shoe Tunnel', 'Weatherproof Base'],
    link: '/products?cat=duffels'
  },
  { 
    id: '04', 
    client: 'POOJARA TECH',
    title: 'Executive Messenger Fleet', 
    subtitle: '1,200 Laptop Briefcases', 
    img: '/products/styled/10.png', 
    features: ['Metal Badge Branding', '15.6" Shock Cushion', 'Trolley Strap', 'YKK Metal Zips'],
    link: '/products?cat=laptop'
  }
];

const IndustriesSection = () => {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleFleetWhatsApp = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const msg = generateBulkQuoteMessage(item.title, item.client, 250);
    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };
  
  return (
    <section className="horizontal-industries" id="industries">
      <div className="horizontal-industries-layout">
        
        <div className="horizontal-industries-sidebar">
          <div className="sidebar-content-sticky">
            <span className="technical-text mb-4">CLIENT ARCHIVE // REAL MANUFACTURING</span>
            <h2 className="industries-sidebar-title">
              Made for<br/>
              Brands, Teams &amp;<br/>
              Institutions.
            </h2>
            <p className="industries-sidebar-desc">
              Real projects delivered at scale. Engineered from material selection to custom branding for enterprises worldwide.
            </p>
            
            <div className="industries-nav-row">
              <a href="/industries" className="industries-sidebar-link technical-text">
                EXPLORE ALL SECTORS <ArrowRight size={14} />
              </a>
              <div className="industries-arrows">
                <button 
                  type="button" 
                  className="btn-ind-arrow" 
                  onClick={() => handleScroll('left')}
                  aria-label="Previous fleet"
                >
                  <ArrowLeft size={16} />
                </button>
                <button 
                  type="button" 
                  className="btn-ind-arrow" 
                  onClick={() => handleScroll('right')}
                  aria-label="Next fleet"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="horizontal-industries-scroll" ref={scrollRef}>
          <div className="industries-track-inner">
            {industries.map((item) => (
              <div className="industry-card-new" key={item.id}>
                {/* Visual Stage */}
                <div className="industry-card-img">
                  <div className="industry-card-meta-top">
                    <span className="ind-meta-client technical-text">{item.client}</span>
                    <span className="ind-meta-qty technical-text">{item.subtitle}</span>
                  </div>
                  <img src={item.img} alt={`${item.client} ${item.title}`} loading="lazy" />
                </div>

                {/* Card Body */}
                <div className="industry-card-body">
                  <div className="industry-card-header">
                    <h3 className="industry-card-title">{item.title}</h3>
                  </div>
                  
                  {/* Feature Tags Chips */}
                  <div className="industry-card-pills">
                    {item.features.map((feature, idx) => (
                      <span key={idx} className="ind-feature-pill technical-text">{feature}</span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="industry-card-actions">
                    <button 
                      type="button" 
                      className="btn-ind-whatsapp"
                      onClick={(e) => handleFleetWhatsApp(e, item)}
                    >
                      <MessageCircle size={14} />
                      <span>INQUIRE THIS FLEET</span>
                    </button>
                    
                    <a href={item.link} className="ind-view-link technical-text">
                      <span>VIEW MODELS</span>
                      <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default IndustriesSection;
