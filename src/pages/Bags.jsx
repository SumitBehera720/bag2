import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './BagsPage.css';

const collection = [
  {
    id: 'amb-01',
    name: 'THE BACKPACK',
    type: 'TECHNICAL CARRY',
    desc: 'Ergonomic utility and tactical comfort built for daily technical carry.',
    customization: 'MATERIAL / COMPARTMENTS / BRANDING',
    img: '/products/styled/1.png'
  },
  {
    id: 'amb-10',
    name: 'THE LAPTOP BAG',
    type: 'CORPORATE CARRY',
    desc: 'Sleek structural protection engineered for corporate environments.',
    customization: 'SIZE / STRAPS / HARDWARE',
    img: '/products/styled/10.png'
  },
  {
    id: 'amb-30',
    name: 'THE SLING',
    type: 'EVERYDAY CARRY',
    desc: 'Accessible, versatile carry optimized for events and everyday utility.',
    customization: 'FABRIC WEIGHT / HANDLES / PRINT',
    img: '/products/styled/30.png'
  },
  {
    id: 'amb-35',
    name: 'THE DUFFEL',
    type: 'HIGH CAPACITY',
    desc: 'High-capacity, reinforced duffels for teams, crew and demanding journeys.',
    customization: 'REINFORCEMENT / DIMENSIONS / EMBROIDERY',
    img: '/products/styled/35.png'
  },
  {
    id: 'amb-20',
    name: 'CORPORATE FLEET',
    type: 'SCALABLE PRODUCTION',
    desc: 'Lightweight, scalable solutions designed specifically for large events.',
    customization: 'SCREEN PRINT / WEBBING',
    img: '/products/styled/20.png'
  }
];

const Bags = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bags-index-wrapper">
      
      <div className="bags-index-layout">
        
        {/* Sticky Left Sidebar */}
        <div className="bags-index-sidebar">
          <div className="sidebar-sticky-content">
            <div className="technical-text mb-4">THE INDEX</div>
            <h1 className="sidebar-title">
              BAGS BUILT FOR<br/>
              DIFFERENT WAYS<br/>
              OF WORKING.
            </h1>
            <p className="sidebar-desc">
              Explore our core bag formats. Every piece is engineered structurally from the ground up, then customized around your specific use-case, brand, and quantity requirements.
            </p>
            <div className="sidebar-meta technical-text">
              <span>ORDER FROM 1 UNIT // NO MOQ</span>
              <span>AVERAGE PRODUCTION: 4 WEEKS</span>
            </div>
          </div>
        </div>

        {/* Scrolling Right Content */}
        <div className="bags-index-scroll">
          {collection.map((item, idx) => (
            <Link to={`/bags/${item.id}`} className="bag-catalogue-item" key={item.id}>
              
              <div className="bag-item-visual">
                <img src={item.img} alt={item.name} loading={idx === 0 ? "eager" : "lazy"} />
                <div className="bag-item-number technical-text">0{idx + 1}</div>
              </div>

              <div className="bag-item-details">
                <div className="bag-item-header">
                  <h2 className="bag-item-name">{item.name}</h2>
                  <ArrowRight className="bag-item-arrow" size={32} strokeWidth={1} />
                </div>
                
                <div className="bag-item-specs">
                  <div className="spec-block">
                    <span className="technical-text spec-label">FORMAT</span>
                    <span className="spec-value">{item.type}</span>
                  </div>
                  <div className="spec-block">
                    <span className="technical-text spec-label">USE CASE</span>
                    <span className="spec-value">{item.desc}</span>
                  </div>
                  <div className="spec-block">
                    <span className="technical-text spec-label">CUSTOMIZATION</span>
                    <span className="spec-value">{item.customization}</span>
                  </div>
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
      
    </div>
  );
};

export default Bags;
