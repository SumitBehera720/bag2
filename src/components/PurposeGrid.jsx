import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './PurposeGrid.css';

const purposes = [
  {
    id: '01',
    title: 'Corporate',
    description: 'Laptop bags, employee kits and conference carry.',
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '02',
    title: 'Institutions',
    description: 'Academic backpacks, school kits and faculty bags.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '03',
    title: 'Events',
    description: 'Conference totes, swag bags and low-profile carry.',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '04',
    title: 'Brands',
    description: 'Bespoke merchandise and private label manufacturing.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '05',
    title: 'Teams',
    description: 'Duffels, sports kits and uniform-matched bags.',
    image: 'https://images.unsplash.com/photo-1552589578-f71f6cb00f89?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '06',
    title: 'Individuals',
    description: 'Single prototypes and bespoke personal pieces.',
    image: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=1200&q=80'
  }
];

const PurposeGrid = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePurpose = purposes[activeIndex];

  return (
    <section className="purpose-editorial-section" id="industries">
      <div className="purpose-header">
        <h2 className="purpose-main-title">
          BUILT FOR<br/>EVERY PURPOSE.
        </h2>
        <div className="purpose-meta">
          <span>SELECT CONTEXT</span>
        </div>
      </div>

      <div className="purpose-decision-tree">
        
        {/* Dominant Visual Anchor */}
        <div className="purpose-dominant">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePurpose.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="dominant-image-wrapper"
            >
              <img src={activePurpose.image} alt={activePurpose.title} />
              <div className="dominant-overlay"></div>
              
              <div className="dominant-content">
                <div className="dominant-id">{activePurpose.id}</div>
                <h3>{activePurpose.title}</h3>
                <p>{activePurpose.description}</p>
                <a href={`/shop#${activePurpose.title.toLowerCase()}`} className="explore-btn">
                  [ Explore {activePurpose.title} &rarr; ]
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Secondary Navigation Index */}
        <div className="purpose-index">
          <ul className="purpose-list">
            {purposes.map((purpose, index) => (
              <li 
                key={purpose.id}
                className={`purpose-list-item ${index === activeIndex ? 'active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
              >
                <span className="list-id">{purpose.id}</span>
                <span className="list-title">{purpose.title}</span>
                {index === activeIndex && (
                  <motion.div 
                    layoutId="active-indicator" 
                    className="list-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ArrowRight size={16} />
                  </motion.div>
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
};

export default PurposeGrid;
