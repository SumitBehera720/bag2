import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  return (
    <section className="testimonials-editorial-section" id="testimonials">
      <div className="testimonials-container">
        
        <div className="testimonials-header">
          <div className="testimonials-label">WHAT CLIENTS SAY</div>
        </div>

        <div className="testimonials-grid">
          
          {/* Primary Dominant Quote */}
          <div className="quote-primary">
            <blockquote>
              "The finish on the backpacks was exactly to our technical specification. We needed a precise Cordura build for our field team, and ASKMEBAG delivered perfectly."
            </blockquote>
            <div className="quote-author">
              <span className="author-name">ROHIT SHARMA</span>
              <span className="author-context">FIELD OPERATIONS, TECHCORP</span>
            </div>
          </div>

          {/* Secondary Quotes */}
          <div className="quote-secondary-group">
            <div className="quote-secondary">
              <blockquote>
                "We ordered 1,000 custom totes for the summit. Seamless production process."
              </blockquote>
              <div className="quote-author">
                <span className="author-name">PRIYA NAIR</span>
                <span className="author-context">EVENT DIRECTOR</span>
              </div>
            </div>

            <div className="quote-secondary">
              <blockquote>
                "Excellent structural integrity on our branded duffels."
              </blockquote>
              <div className="quote-author">
                <span className="author-name">RAHUL VERMA</span>
                <span className="author-context">FOUNDER, BRANDNEST</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
