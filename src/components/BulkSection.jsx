import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import './BulkSection.css';

const BulkSection = () => {
  return (
    <section className="bulk-scale-section" id="bulk-orders">
      <div className="scale-container">
        
        <div className="scale-header">
          <div className="scale-label">06 / SCALE</div>
          <h2 className="scale-title">
            ONE BAG<br/>
            OR A THOUSAND.
          </h2>
          <p className="scale-desc">
            Whether you need a small run or a large production order, tell us the quantity, purpose and customization you have in mind.
          </p>
          
          <button className="scale-cta">
            TALK ABOUT A BULK ORDER <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="scale-image-container">
          <img 
            src="/media/scale_banner_cover.jpg" 
            alt="Custom enterprise backpacks prepared for bulk logistics dispatch" 
            loading="lazy"
          />
          <div className="scale-overlay">
            <div className="scale-metrics">
              <span>01</span>
              <span>100</span>
              <span>1,000</span>
              <span>10,000+</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BulkSection;
