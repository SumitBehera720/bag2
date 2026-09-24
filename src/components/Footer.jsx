import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MessageCircle, Mail, Phone, MapPin, Clock, ShieldCheck, Download } from 'lucide-react';
import { COMPANY_CONFIG, buildWhatsAppUrl, generateQuickInquiryMessage } from '../config';
import './Footer.css';

const Footer = () => {
  const whatsappUrl = buildWhatsAppUrl(
    generateQuickInquiryMessage("Enterprise Custom Bag Production & Sampling")
  );

  return (
    <>
      <footer className="footer-editorial">
        {/* Top High-Conversion Action Strip */}
        <div className="footer-action-strip">
          <div className="action-strip-content">
            <span className="technical-text action-eyebrow">DIRECT OEM &amp; ODM FACTORY MANUFACTURING</span>
            <h3 className="action-strip-title">
              Ready to engineer custom carry for your organization?
            </h3>
            <p className="action-strip-sub">
              Physical sampling and single prototypes to volume fleet manufacturing, with complete logo embroidery, custom trims, and factory-direct dispatch.
            </p>
          </div>
          <div className="action-strip-buttons">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noreferrer"
              className="btn-footer-wa"
            >
              <MessageCircle size={18} />
              <span>START WHATSAPP CHAT</span>
              <ArrowUpRight size={15} />
            </a>
            <Link to="/contact" className="btn-footer-secondary">
              <span>GET FORMAL RFQ</span>
            </Link>
          </div>
        </div>

        {/* Main 4-Column Grid */}
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <h2 className="footer-logo">ASKMEBAG</h2>
            <p className="footer-tagline">
              ENGINEERED FLEET CARRY &amp; CUSTOM INDUSTRIAL MANUFACTURING.
            </p>
            <div className="footer-cert-badges">
              <span className="cert-pill technical-text">
                <ShieldCheck size={13} /> ZERO DEFECT GUARANTEE
              </span>
              <span className="cert-pill technical-text">
                <Clock size={13} /> 2–3 WK DISPATCH
              </span>
            </div>
            <div className="footer-direct-contact">
              <a href={`tel:${COMPANY_CONFIG.whatsappDisplay.replace(/\s+/g, '')}`} className="footer-contact-item">
                <Phone size={13} />
                <span>{COMPANY_CONFIG.whatsappDisplay}</span>
              </a>
              <a href={`mailto:${COMPANY_CONFIG.email}`} className="footer-contact-item">
                <Mail size={13} />
                <span>{COMPANY_CONFIG.email}</span>
              </a>
              <div className="footer-contact-item muted">
                <MapPin size={13} />
                <span>Pune &amp; Mumbai Industrial Corridor, India</span>
              </div>
            </div>
          </div>

          {/* Catalog Index Column */}
          <div className="footer-col nav-col">
            <h3 className="footer-heading technical-text">CATALOG ARCHIVE</h3>
            <ul className="footer-links">
              <li><Link to="/products?cat=backpacks">Commuter Backpacks</Link></li>
              <li><Link to="/products?cat=laptop">Laptop Bags &amp; Briefs</Link></li>
              <li><Link to="/products?cat=slings">Tactical Crossbody Slings</Link></li>
              <li><Link to="/products?cat=duffels">Heavy Duffels &amp; Weekenders</Link></li>
              <li><Link to="/products?cat=corporate">Corporate Fleet Editions</Link></li>
              <li><Link to="/products">Browse All 47 Models</Link></li>
            </ul>
          </div>

          {/* Customization & Capabilities Column */}
          <div className="footer-col nav-col">
            <h3 className="footer-heading technical-text">CAPABILITIES</h3>
            <ul className="footer-links">
              <li><Link to="/custom">Live 3D Customizer</Link></li>
              <li><Link to="/process">Industrial Stitch Process</Link></li>
              <li><Link to="/industries">Corporate &amp; Tech Fleets</Link></li>
              <li><Link to="/industries">Education &amp; Institution Bags</Link></li>
              <li><Link to="/industries">Fitness &amp; Athletic Duffels</Link></li>
              <li><Link to="/about">Material &amp; Hardware Standards</Link></li>
            </ul>
          </div>

          {/* Fast Direct WhatsApp Dispatch Column */}
          <div className="footer-col wa-col">
            <h3 className="footer-heading technical-text">DIRECT DISPATCH</h3>
            <p className="wa-box-desc">
              Have an urgent bulk requirement or vector logo ready? Chat directly with our production manager for instant digital mockups:
            </p>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="footer-wa-card"
            >
              <div className="wa-card-header">
                <span className="wa-live-dot"></span>
                <span className="technical-text wa-card-status">PRODUCTION DESK ONLINE</span>
              </div>
              <span className="wa-card-number">{COMPANY_CONFIG.whatsappDisplay}</span>
              <span className="wa-card-cue technical-text">TAP TO OPEN WHATSAPP CHAT &rarr;</span>
            </a>
            <span className="footer-operating-hours technical-text">
              MON – SAT &bull; 9:30 AM – 7:00 PM IST
            </span>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="copyright technical-text">
            © {new Date().getFullYear()} ASKMEBAG INDUSTRIAL CARRY WORKS. ALL RIGHTS RESERVED.
          </div>
          <div className="legal-links technical-text">
            <Link to="/about">ABOUT FACTORY</Link>
            <Link to="/contact">DIRECT INQUIRY</Link>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">WHATSAPP SUPPORT</a>
          </div>
        </div>
      </footer>

      {/* Global Floating Official WhatsApp Icon (FAB) */}
      <a 
        href={whatsappUrl} 
        className="whatsapp-float-icon-btn"
        target="_blank" 
        rel="noreferrer"
        aria-label="Direct Chat on WhatsApp"
        title="Chat on WhatsApp (+91 98900 60000)"
      >
        <svg 
          viewBox="0 0 32 32" 
          className="wa-fab-icon"
          fill="currentColor"
          width="32" 
          height="32"
          aria-hidden="true"
        >
          <path d="M16 2C8.28 2 2 8.28 2 16c0 2.58.7 5.03 1.94 7.15L2 30l7.07-1.85C11.13 29.28 13.52 30 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.54c-2.24 0-4.39-.62-6.25-1.78l-.45-.28-4.64 1.22 1.24-4.52-.29-.47A11.45 11.45 0 0 1 4.46 16c0-6.36 5.18-11.54 11.54-11.54 6.36 0 11.54 5.18 11.54 11.54 0 6.36-5.18 11.54-11.54 11.54zm6.33-8.65c-.35-.17-2.06-1.02-2.38-1.13-.32-.12-.55-.17-.79.17-.23.35-.91 1.13-1.11 1.36-.2.23-.41.26-.76.09-.35-.17-1.47-.54-2.8-1.73-1.04-.92-1.74-2.07-1.94-2.42-.2-.35-.02-.54.15-.71.16-.16.35-.41.52-.61.17-.2.23-.35.35-.58.12-.23.06-.44-.03-.61-.09-.17-.79-1.9-1.08-2.61-.28-.68-.57-.59-.79-.6h-.67c-.23 0-.61.09-.93.44-.32.35-1.22 1.19-1.22 2.91 0 1.72 1.25 3.39 1.43 3.62.17.23 2.47 3.77 5.98 5.28.83.36 1.48.58 1.99.74.84.27 1.6.23 2.2.14.67-.1 2.06-.84 2.35-1.66.29-.81.29-1.51.2-1.66-.08-.14-.32-.23-.67-.4z"/>
        </svg>
        <span className="wa-fab-pulse"></span>
        <span className="wa-fab-dot"></span>
      </a>
    </>
  );
};

export default Footer;
