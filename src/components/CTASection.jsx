import React from 'react';
import { buildWhatsAppUrl } from '../config';
import './CTASection.css';

const CTASection = ({ sectionData }) => {
  const rawTitle = sectionData?.title || 'HAVE A BAG\nIN MIND?';
  const titleParts = rawTitle.includes('\n') ? rawTitle.split('\n') : [rawTitle];
  const description = sectionData?.description || "Send us a reference, sketch, logo or just an idea. We'll take it from there.";
  const bgImage = sectionData?.bg_image ? (sectionData.bg_image.startsWith('http') ? sectionData.bg_image : `https://askmebag.com${sectionData.bg_image}`) : '/media/final_cta_banner.jpg';
  const ctaPrimary = sectionData?.cta_text || 'START A CUSTOM ORDER';
  const ctaPrimaryUrl = sectionData?.cta_url || buildWhatsAppUrl("Hi ASKMEBAG, I'm interested in starting a custom bag order.");

  return (
    <section className="editorial-final-cta" id="contact">
      <div className="editorial-container">
        <div className="final-cta-layout">
          
          <div className="final-cta-visual">
            <div className="final-cta-img-wrapper">
              <img 
                src={bgImage} 
                alt="Finished bespoke client manufactured backpacks in architectural design studio." 
                loading="lazy"
              />
            </div>
          </div>

          <div className="final-cta-content">
            <h2 className="final-cta-title">
              {titleParts.map((part, i) => (
                <React.Fragment key={i}>
                  {part}{i < titleParts.length - 1 && <br/>}
                </React.Fragment>
              ))}
            </h2>
            <p className="final-cta-desc">
              {description}
            </p>
            
            <div className="final-cta-actions">
              <a href={ctaPrimaryUrl} className="btn-primary-editorial" target="_blank" rel="noreferrer">
                {ctaPrimary}
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
