import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { buildWhatsAppUrl } from '../config';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'PRODUCTS', path: '/products' },
    { name: 'CUSTOM', path: '/custom' },
    { name: 'INDUSTRIES', path: '/industries' },
    { name: 'PROCESS', path: '/process' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' }
  ];

  return (
    <>
      <header className={`editorial-nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="editorial-container">
          <div className="nav-container-inner">
            
            <div className="nav-brand">
              <Link to="/">ASKMEBAG</Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="nav-menu">
              <ul className="nav-list technical-text">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path || (link.path === '/products' && location.pathname.startsWith('/products'));
                  return (
                    <li key={link.name}>
                      <Link 
                        to={link.path} 
                        className={isActive ? 'nav-link-active' : ''}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            
            <div className="nav-action">
              <a href={buildWhatsAppUrl("Hi ASKMEBAG, I would like to start a custom order inquiry.")} className="nav-whatsapp-btn technical-text" target="_blank" rel="noreferrer">
                START ORDER <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="mobile-menu-toggle technical-text" onClick={() => setMobileMenuOpen(true)}>
              MENU
            </button>
            
          </div>
        </div>
      </header>

      {/* Mobile Editorial Overlay */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        
        <div className="mobile-nav-header">
          <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>ASKMEBAG</Link>
          <button className="mobile-menu-close technical-text" onClick={() => setMobileMenuOpen(false)}>
            CLOSE
          </button>
        </div>

        <nav className="mobile-nav-body">
          <ul className="mobile-nav-list">
            {navLinks.map((link, idx) => (
              <li key={link.name} className="mobile-nav-item">
                <span className="mobile-nav-num technical-text">0{idx + 1}</span>
                <Link to={link.path} className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-nav-footer">
          <a href={buildWhatsAppUrl("Hi ASKMEBAG, I'm reaching out from your website.")} className="mobile-nav-whatsapp technical-text" target="_blank" rel="noreferrer">
            WHATSAPP ASKMEBAG
          </a>
        </div>

      </div>
    </>
  );
};

export default Navbar;
