import React from 'react';
import './Portfolio.css';

const projects = [
  {
    id: '01',
    category: 'PROJECT / CORPORATE',
    title: 'CUSTOM BACKPACK',
    customization: 'CUSTOMIZATION / EMBROIDERY + MATERIAL',
    qty: 'QUANTITY / [REAL DATA ONLY]',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&w=1200&q=80',
    scale: 'large'
  },
  {
    id: '02',
    category: 'PROJECT / BRAND',
    title: 'LAPTOP WORK BRIEF',
    customization: 'CUSTOMIZATION / NEUTRAL BRANDING',
    qty: 'QUANTITY / [REAL DATA ONLY]',
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80',
    scale: 'medium'
  },
  {
    id: '03',
    category: 'PROJECT / EVENT',
    title: 'CONFERENCE CARRY',
    customization: 'CUSTOMIZATION / SCREEN PRINT + SCALE',
    qty: 'QUANTITY / [REAL DATA ONLY]',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80',
    scale: 'wide'
  }
];

const Portfolio = () => {
  return (
    <section className="portfolio-archive-section" id="portfolio">
      
      <div className="archive-header">
        <div className="archive-label">05 / RECENT WORK</div>
        <h2 className="archive-title">
          MADE FOR BRANDS,<br/>
          TEAMS & INSTITUTIONS.
        </h2>
      </div>

      <div className="archive-grid">
        
        {projects.map((project, idx) => (
          <div key={project.id} className={`archive-item scale-${project.scale}`}>
            
            <div className="archive-image-wrapper">
              <img src={project.image} alt={project.title} loading="lazy" />
              <div className="archive-id">{project.id}</div>
            </div>
            
            <div className="archive-meta">
              <div className="meta-category">{project.category}</div>
              <h3 className="meta-title">{project.title}</h3>
              
              <div className="meta-details">
                <span>{project.customization}</span>
                <span className="placeholder-data">{project.qty}</span>
              </div>
            </div>
            
          </div>
        ))}
        
      </div>
      
    </section>
  );
};

export default Portfolio;
