import React, { useEffect } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, generateBulkQuoteMessage } from '../config';
import FadeIn from '../components/FadeIn';
import './IndustriesPage.css';

const industriesData = [
  {
    id: '01',
    category: 'TECH & ENTERPRISE',
    client: 'CREST DATA SYSTEMS',
    title: 'Dual Commuter Backpack Fleet',
    desc: 'Engineered for high-value tech devices. Features separate dual padded sleeves for 15.6" laptops, water-resistant ballistic poly, ergonomic load-distributing air-mesh straps, and precision neon corporate embroidery.',
    specs: ['500 Units Produced', 'Dual Laptop Sleeve', 'Pantone Matched Trim', 'Bar-Tack Reinforced'],
    img: '/products/styled/1.png',
    layout: 'image-left-wide'
  },
  {
    id: '02',
    category: 'EXECUTIVE & CORPORATE',
    client: 'POOJARA TECH',
    title: 'Executive Commuter Briefcase',
    desc: 'Bespoke heather grey executive brief designed for conferences, client presentations, and travel. Reinforced carrying handles, trolley pass-through strap, shockproof EVA cushioning, and laser-engraved metal crest branding.',
    specs: ['1,200 Units Delivered', 'Laser-Cut Metal Badge', 'Trolley Pass-Through', 'YKK Metal Zips'],
    img: '/products/styled/10.png',
    layout: 'image-right-standard'
  },
  {
    id: '03',
    category: 'ACADEMIES & EDUCATION',
    client: "BD'S KIDZ ACADEMY",
    title: 'Dual-Tone Student Carry Fleet',
    desc: 'Heavy-duty Play Way School backpacks built to withstand daily campus friction. Ergonomic curved shoulder straps, transparent vinyl ID holder, reinforced double-pull zippers, and vibrant silk-screen academy crest.',
    specs: ['1,000 Units Produced', 'Heavy-Duty Twill', 'Vinyl ID Slot', 'Double-Pull Zippers'],
    img: '/products/styled/30.png',
    layout: 'image-left-tall'
  },
  {
    id: '04',
    category: 'ATHLETICS & FITNESS',
    client: 'RAMA BODY CLUB',
    title: 'Heavy-Duty Team Gym Duffel',
    desc: 'High-capacity athletic gear carrier featuring a ventilated shoe tunnel, reinforced nylon webbing grab handles with padded grip, waterproof bottom panel, and bold contrasting club typography.',
    specs: ['500 Units Produced', 'Ventilated Shoe Tunnel', 'Waterproof Base', 'Heavy Nylon Webbing'],
    img: '/products/styled/35.png',
    layout: 'image-right-wide'
  },
  {
    id: '05',
    category: 'INDUSTRIAL & FIELD',
    client: 'HERO INDUSTRIAL',
    title: 'Industrial Commuter Fleet',
    desc: 'Tough, multi-chamber workforce backpacks engineered for manufacturing engineers and field teams. Oil-and-dirt repellent finish, internal document organizers, and high-visibility bar-tack points.',
    specs: ['2,500 Units Delivered', 'Multi-Chamber Cargo', 'Industrial Stitching', 'Dirt-Repellent Poly'],
    img: '/products/styled/20.png',
    layout: 'image-left-standard'
  },
  {
    id: '06',
    category: 'WORKPLACE UTILITY',
    client: 'ADANI ENTERPRISES',
    title: 'Vertical Crossbody Utility Sling',
    desc: 'Compact hands-free vertical carry pack for operational facility managers. Concealed anti-theft compartments, quick-release ambidextrous strap, and debossed matte branding patch.',
    specs: ['800 Units Delivered', 'Quick-Release Strap', 'Anti-Theft Zip', 'Custom Debossed Patch'],
    img: '/products/styled/2.png',
    layout: 'image-right-tall'
  }
];

const Industries = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInquireWhatsApp = (item) => {
    const msg = generateBulkQuoteMessage(item.title, item.client, 250);
    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="industries-page-wrapper">
      
      <header className="industries-page-hero">
        <div className="editorial-container">
          <div className="industries-hero-content">
            <FadeIn>
              <div className="technical-text hero-eyebrow mb-2">PAGE 02 // SECTORS &amp; FLEETS</div>
              <h1 className="industries-hero-title">
                Bags Engineered for Real-World Fleets.
              </h1>
              <p className="industries-hero-desc">
                From tech giants and educational academies to athletic clubs and industrial workforces — every sector demands a tailored carry solution. Here are real client fleets manufactured in our facility.
              </p>
            </FadeIn>
          </div>
        </div>
      </header>

      <div className="industries-list">
        {industriesData.map((item) => (
          <section key={item.id} className={`industry-block ${item.layout}`}>
            <div className="editorial-container">
              <div className="industry-grid">
                
                <div className="industry-visual-col">
                  <FadeIn>
                    <div className="industry-img-container">
                      <div className="industry-img-badge technical-text">
                        <span>{item.client}</span>
                        <span>{item.specs[0]}</span>
                      </div>
                      <img 
                        src={item.img} 
                        alt={`${item.client} - ${item.title}`} 
                        loading="lazy" 
                      />
                    </div>
                  </FadeIn>
                </div>

                <div className="industry-text-col">
                  <FadeIn delay={0.1}>
                    <div className="technical-text sector-label">{item.id} // {item.category}</div>
                    <h2 className="industry-block-title">{item.title}</h2>
                    <p className="industry-block-desc">{item.desc}</p>
                    
                    <div className="industry-specs-grid">
                      {item.specs.map((spec, sIdx) => (
                        <span key={sIdx} className="industry-spec-pill technical-text">{spec}</span>
                      ))}
                    </div>

                    <div className="industry-actions-row">
                      <button 
                        type="button"
                        onClick={() => handleInquireWhatsApp(item)}
                        className="btn-ind-page-whatsapp"
                      >
                        <MessageCircle size={15} />
                        <span>INQUIRE THIS FLEET VIA WHATSAPP</span>
                      </button>

                      <a href="/products" className="btn-ind-explore-link technical-text">
                        <span>VIEW CATALOG MODELS</span>
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </FadeIn>
                </div>

              </div>
            </div>
          </section>
        ))}
      </div>

    </div>
  );
};

export default Industries;
