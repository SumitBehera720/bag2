import React from 'react';
import './ScaleSection.css';

const ScaleSection = () => {
  return (
    <section className="editorial-scale" id="scale">
      <div className="editorial-container">
        
        <div className="scale-banner">
          <img 
            src="/media/scale_banner_cover.jpg" 
            alt="Enterprise custom manufactured bag fleet staged for bulk delivery."
            className="scale-bg"
            loading="lazy"
          />
          
          <div className="scale-content">
            <div className="scale-header">
              <div className="technical-text mb-4">06 / SCALE</div>
              <h2 className="scale-title">
                ONE BAG<br/>
                OR A THOUSAND.
              </h2>
              <p className="scale-desc">
                Whether you need a small run or a large production order, tell us the quantity, purpose and customization you have in mind.
              </p>
            </div>

            <div className="scale-footer">
              <div className="scale-metrics technical-text">
                <span>01</span>
                <span>100</span>
                <span>1,000</span>
                <span>10,000+</span>
              </div>
              
              <a href="#contact" className="scale-cta">
                TALK ABOUT A BULK ORDER
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ScaleSection;
