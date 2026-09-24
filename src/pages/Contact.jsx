import React, { useEffect, useState } from 'react';
import { MessageCircle, ArrowUpRight, MapPin, Mail, Phone, Clock } from 'lucide-react';
import { COMPANY_CONFIG, buildWhatsAppUrl } from '../config';
import FadeIn from '../components/FadeIn';
import './ContactPage.css';

const INQUIRY_TYPES = [
  'Bulk Corporate Order (100+ Units)',
  'Custom Branded Sample / Prototype',
  'Event & Conference Bags',
  'Wholesale Distribution Inquiry'
];

const Contact = () => {
  const [inquiryType, setInquiryType] = useState(INQUIRY_TYPES[0]);
  const [companyName, setCompanyName] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState('100');
  const [note, setNote] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSendWhatsAppInquiry = (e) => {
    e.preventDefault();
    const message = [
      `*ASKMEBAG WEBSITE INQUIRY*`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `📋 *Requirement:* ${inquiryType}`,
      companyName ? `🏢 *Company / Organization:* ${companyName}` : null,
      `🔢 *Estimated Quantity:* ${estimatedQuantity} units`,
      note ? `📝 *Brief / Notes:* ${note}` : null,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `Hi ASKMEBAG team, please share catalog options, wholesale pricing, and sample lead times.`
    ].filter(Boolean).join('\n');

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="contact-page-wrapper">
      
      <div className="editorial-container">
        
        {/* Hero Row */}
        <div className="contact-layout">
          
          <div className="contact-text-col">
            <FadeIn>
              <div className="technical-text mb-4">PAGE 05 / CONTACT &amp; INQUIRIES</div>
              <h1 className="contact-hero-title">
                LET'S TALK<br/>
                ABOUT<br/>
                THE BAG.
              </h1>
              <p className="contact-hero-desc">
                Whether you need a custom-engineered fleet of 250 bags or a specialized physical prototype for your brand, our manufacturing desk is ready on WhatsApp.
              </p>

              {/* Direct WhatsApp Instant Action */}
              <div className="contact-wa-direct-card">
                <div className="wa-card-header">
                  <MessageCircle size={22} className="wa-card-icon" />
                  <div>
                    <h4>Fastest Response on WhatsApp</h4>
                    <p>Direct chat with our production and quoting specialists</p>
                  </div>
                </div>
                <a 
                  href={buildWhatsAppUrl("Hi ASKMEBAG, I'm reaching out to discuss a custom bag production requirement.")}
                  className="btn-editorial btn-wa-direct"
                  target="_blank"
                  rel="noreferrer"
                >
                  START WHATSAPP CHAT <ArrowUpRight size={14} />
                </a>
              </div>
            </FadeIn>
          </div>

          <div className="contact-info-col">
            <FadeIn delay={0.1}>
              
              {/* Interactive Quick Dispatcher Form */}
              <div className="contact-quick-form">
                <h3 className="form-heading technical-text">DISPATCH AN INQUIRY</h3>
                
                <form onSubmit={handleSendWhatsAppInquiry} className="inquiry-form-elements">
                  <div className="form-group">
                    <label className="technical-text">I'M LOOKING FOR</label>
                    <select 
                      value={inquiryType} 
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="form-select"
                    >
                      {INQUIRY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label className="technical-text">BRAND / COMPANY NAME</label>
                      <input 
                        type="text" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Acme Industries"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="technical-text">ESTIMATED QUANTITY (FROM 1 UNIT)</label>
                      <input 
                        type="number" 
                        min="1"
                        step="1"
                        value={estimatedQuantity}
                        onChange={(e) => setEstimatedQuantity(e.target.value)}
                        placeholder="1 unit (Sample) or fleet quantity"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="technical-text">BRIEF DESCRIPTION / TIMELINE</label>
                    <textarea 
                      rows="3"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. Need laptop backpacks for 150 employees with embroidered logo before next quarter..."
                      className="form-textarea"
                    />
                  </div>

                  <button type="submit" className="btn-editorial btn-submit-inquiry">
                    <MessageCircle size={16} /> SEND INQUIRY VIA WHATSAPP
                  </button>
                </form>
              </div>

              {/* Verified Contact Details Grid */}
              <div className="contact-blocks">
                
                <div className="contact-block">
                  <h3 className="technical-text contact-label"><Phone size={13} /> WHATSAPP &amp; PHONE</h3>
                  <a href={buildWhatsAppUrl("Hello ASKMEBAG")} className="contact-value-link" target="_blank" rel="noreferrer">
                    {COMPANY_CONFIG.whatsappDisplay}
                  </a>
                </div>

                <div className="contact-block">
                  <h3 className="technical-text contact-label"><Mail size={13} /> DIRECT EMAIL</h3>
                  <a href={`mailto:${COMPANY_CONFIG.email}`} className="contact-value-link">
                    {COMPANY_CONFIG.email}
                  </a>
                </div>

                <div className="contact-block">
                  <h3 className="technical-text contact-label"><MapPin size={13} /> PRODUCTION &amp; HUB</h3>
                  <p className="contact-value">Pune &amp; Mumbai Industrial Corridor, Maharashtra, India</p>
                </div>

                <div className="contact-block">
                  <h3 className="technical-text contact-label"><Clock size={13} /> OPERATIONAL HOURS</h3>
                  <p className="contact-value">Monday &ndash; Saturday &bull; 9:30 AM &ndash; 7:00 PM IST</p>
                </div>

              </div>
            </FadeIn>
          </div>

        </div>

        {/* Cool & Attractive Client Fleet Showcase Grid */}
        <div className="contact-visual-row">
          <FadeIn delay={0.2}>
            <div className="contact-showcase-section">
              <div className="showcase-section-header">
                <div>
                  <span className="technical-text showcase-eyebrow">CLIENT ARCHIVE // REAL MANUFACTURED RUNS</span>
                  <h3 className="showcase-section-title">Reference Production Fleets</h3>
                </div>
                <p className="showcase-section-desc">
                  Select any manufactured fleet below to immediately request a quotation or physical sample via WhatsApp.
                </p>
              </div>

              <div className="contact-showcase-grid">
                {[
                  {
                    client: 'CREST DATA SYSTEMS',
                    title: 'Dual Commuter Pack',
                    run: '500 Units Delivered',
                    img: '/products/styled/1.png',
                    tag: 'TECH FLEET'
                  },
                  {
                    client: 'POOJARA TECH',
                    title: 'Executive Briefcase',
                    run: '1,200 Units Delivered',
                    img: '/products/styled/10.png',
                    tag: 'EXECUTIVE'
                  },
                  {
                    client: "BD'S KIDZ ACADEMY",
                    title: 'Student Daypack',
                    run: '1,000 Units Produced',
                    img: '/products/styled/30.png',
                    tag: 'INSTITUTIONAL'
                  },
                  {
                    client: 'RAMA BODY CLUB',
                    title: 'Heavy Gym Duffel',
                    run: '500 Units Produced',
                    img: '/products/styled/35.png',
                    tag: 'ATHLETIC'
                  }
                ].map((item, idx) => (
                  <div className="contact-showcase-card" key={idx}>
                    <div className="contact-card-stage">
                      <span className="contact-card-tag technical-text">{item.tag}</span>
                      <img src={item.img} alt={`${item.client} ${item.title}`} loading="lazy" />
                    </div>
                    <div className="contact-card-info">
                      <span className="contact-card-client technical-text">{item.client}</span>
                      <h4 className="contact-card-name">{item.title}</h4>
                      <span className="contact-card-run technical-text">{item.run}</span>
                      
                      <button 
                        type="button" 
                        className="btn-contact-quick-quote"
                        onClick={() => {
                          const msg = generateBulkQuoteMessage(item.title, item.client, 250);
                          window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
                        }}
                      >
                        <MessageCircle size={13} />
                        <span>INQUIRE THIS MODEL</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

      </div>

    </div>
  );
};

export default Contact;
