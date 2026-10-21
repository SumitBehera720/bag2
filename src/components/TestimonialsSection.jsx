import React from 'react';
import './TestimonialsSection.css';
import { Quote } from 'lucide-react';

const TestimonialsSection = ({ items = [], sectionData }) => {
  const subtitle = sectionData?.subtitle || '06 / THE VERDICT';
  const title = sectionData?.title || 'RELIABILITY AT SCALE.';
  const description = sectionData?.description || '';

  const testimonials = items.length > 0 ? items.map((t, i) => ({
    id: t.id || i,
    text: t.content,
    role: t.role || t.name,
    industry: t.company || 'CLIENT'
  })) : [
    {
      id: 1,
      text: "The material quality and attention to stitching detail exceeded our technical requirements. A truly robust carry solution for our engineering team.",
      role: "HEAD OF OPERATIONS",
      industry: "TECH BRAND"
    },
    {
      id: 2,
      text: "Managing logistics for 2,000 attendees is complex enough. The bags arrived precisely on schedule, uniformly packed, and built to an incredibly high standard.",
      role: "EVENT DIRECTOR",
      industry: "GLOBAL SUMMIT"
    },
    {
      id: 3,
      text: "We required custom hardware and specific fabric dying to match our brand identity. The prototyping process was transparent and the final execution was flawless.",
      role: "CREATIVE DIRECTOR",
      industry: "LIFESTYLE BRAND"
    }
  ];
  return (
    <section className="editorial-testimonials" id="testimonials">
      <div className="editorial-container">
        
        <div className="testimonials-header">
          <div className="technical-text mb-4">{subtitle}</div>
          <h2 className="testimonials-title">
            {title}
          </h2>
          {description && (
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: 600 }}>
              {description}
            </p>
          )}
        </div>

        <div className="testimonials-grid">
          {testimonials.map((item) => (
            <div className="testimonial-column" key={item.id}>
              <Quote className="quote-icon" size={24} strokeWidth={1} />
              <p className="testimonial-text">
                {item.text}
              </p>
              <div className="testimonial-author technical-text">
                <span className="author-role">{item.role}</span>
                <span className="author-industry">{item.industry}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
