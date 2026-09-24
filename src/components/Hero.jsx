import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { buildWhatsAppUrl } from '../config';
import './Hero.css';

const Hero = () => {
  return (
    <section className="editorial-hero">
      
      {/* Background Image Layer */}
      <div className="hero-bg-wrapper">
        <picture>
          <source media="(max-width: 768px)" srcSet="/media/hero_mobile.jpg" />
          <img 
            src="/media/hero_desktop.jpg" 
            alt="Custom backpack resting on a production workbench inside a real bag workshop." 
            className="hero-img-fullscreen"
            loading="eager"
          />
        </picture>
      </div>

      {/* Content Layer */}
      <div className="hero-content-layer">
        <div className="editorial-container">
          <div className="hero-text-block">
            
            <div className="technical-text tech-header">
              <span>CUSTOM MANUFACTURING / DESIGN / BRANDING</span>
            </div>

            <h1 className="hero-title">
              BUILT<br/>
              AROUND<br/>
              YOUR IDEA.
            </h1>

            <p className="hero-description">
              Custom bags for companies, institutions, events, brands, teams and individuals — designed around what you actually need.
            </p>

            <div className="hero-actions">
              <a href={buildWhatsAppUrl("Hi ASKMEBAG, I'm interested in starting a custom bag order.")} className="btn-editorial" target="_blank" rel="noreferrer">
                START A CUSTOM ORDER <ArrowUpRight size={16} />
              </a>
              <a href="/products" className="btn-editorial-outline">
                EXPLORE PRODUCTS
              </a>
            </div>

            <div className="technical-text hero-small-line">
              <span>ONE BAG OR A THOUSAND.</span>
            </div>

          </div>
        </div>
      </div>
      
    </section>
  );
};

export default Hero;
