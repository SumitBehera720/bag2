import React from 'react';
import './ScaleSection.css';

const ScaleSection = ({ sectionData }) => {
  const subtitle = sectionData?.subtitle || '06 / SCALE';
  const rawTitle = sectionData?.title || 'ONE BAG\nOR A THOUSAND.';
  const titleParts = rawTitle.includes('\n') ? rawTitle.split('\n') : (rawTitle.includes('. ') ? rawTitle.split('. ') : [rawTitle]);
  const description = sectionData?.description || 'Whether you need a small run or a large production order, tell us the quantity, purpose and customization you have in mind.';
  const bgImage = sectionData?.bg_image ? (sectionData.bg_image.startsWith('http') ? sectionData.bg_image : `https://askmebag.com${sectionData.bg_image}`) : '/media/scale_banner_cover.jpg';
  const ctaText = sectionData?.cta_text || 'TALK ABOUT A BULK ORDER';
  const ctaUrl = sectionData?.cta_url || '#contact';

  return (
    <section className="editorial-scale" id="scale">
      <div className="editorial-container">
        
        <div className="scale-banner">
          <img 
            src={bgImage} 
            alt="Enterprise custom manufactured bag fleet staged for bulk delivery."
            className="scale-bg"
            loading="lazy"
          />
          
          <div className="scale-content">
            <div className="scale-header">
              <div className="technical-text mb-4">{subtitle}</div>
              <h2 className="scale-title">
                {titleParts.map((part, i) => (
                  <React.Fragment key={i}>
                    {part}{i < titleParts.length - 1 && <br/>}
                  </React.Fragment>
                ))}
              </h2>
              <p className="scale-desc">
                {description}
              </p>
            </div>

            <div className="scale-footer">
              <div className="scale-metrics technical-text">
                <span>01</span>
                <span>100</span>
                <span>1,000</span>
                <span>10,000+</span>
              </div>
              
              <a href={ctaUrl} className="scale-cta">
                {ctaText}
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ScaleSection;
