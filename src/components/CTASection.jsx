import React from 'react';
import { buildWhatsAppUrl } from '../config';
import './CTASection.css';

const CTASection = () => {
  return (
    <section className="editorial-final-cta" id="contact">
      <div className="editorial-container">
        <div className="final-cta-layout">
          
          <div className="final-cta-visual">
            <div className="final-cta-img-wrapper">
              <img 
                src="/media/final_cta_banner.jpg" 
                alt="Finished bespoke client manufactured backpacks in architectural design studio." 
                loading="lazy"
              />
            </div>
          </div>

          <div className="final-cta-content">
            <h2 className="final-cta-title">
              HAVE A BAG<br/>
              IN MIND?
            </h2>
            <p className="final-cta-desc">
              Send us a reference, sketch, logo or just an idea. We'll take it from there.
            </p>
            
            <div className="final-cta-actions">
              <a href={buildWhatsAppUrl("Hi ASKMEBAG, I'm interested in starting a custom bag order.")} className="btn-primary-editorial" target="_blank" rel="noreferrer">
                START A CUSTOM ORDER
              </a>
              <a href={buildWhatsAppUrl("Hi ASKMEBAG, I have a quick question about bag customization.")} className="btn-secondary-editorial technical-text" target="_blank" rel="noreferrer">
                WHATSAPP ASKMEBAG
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTASection;
