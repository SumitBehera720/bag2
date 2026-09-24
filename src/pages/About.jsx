import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Sliders, 
  ArrowRight, 
  MessageCircle,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import { buildWhatsAppUrl, generateQuickInquiryMessage } from '../config';
import FadeIn from '../components/FadeIn';
import './AboutPage.css';

const chapters = [
  {
    num: '01',
    category: 'MANUFACTURING ETHOS',
    title: 'ENGINEERING FROM SCRATCH, NOT GENERIC BLANKS.',
    body: 'Most branded bags in the corporate market are off-the-shelf blanks with a cheap logo heat-pressed on top. We took the opposite approach: we build carry formats from the ground up, engineering seam geometries, compartment volumes, and load distributions specifically around how your team will actually carry their tools.',
    points: [
      'Zero generic blanks — every silhouette is custom patterned',
      'Structural weight distribution engineered to protect spine & posture',
      'Custom millimeter-accurate laptop chambers with high-density EVA foam'
    ],
    client: 'CREST DATA SYSTEMS',
    qty: '500 UNITS DELIVERED',
    item: 'Dual Techpack Commuter (Cobalt Accents)',
    img: '/products/styled/1.png',
    alt: 'Crest Data Systems enterprise dual laptop commuter backpack production.'
  },
  {
    num: '02',
    category: 'RAPID PROTOTYPING',
    title: 'THE PHYSICAL SAMPLING STANDARD.',
    body: 'Every major production run begins with a physical sample in your hands within 5–7 days. We translate sketches and tech briefs into CAD patterns, mill-dyed fabric swatches, and working prototypes so executive stakeholders can test fit, weight, and aesthetics before volume manufacturing begins.',
    points: [
      '5–7 day physical sample dispatch for stakeholder review',
      'CAD pattern validation & digital dimensional simulation',
      'Direct Pantone color-matching on mill-dyed fabrics'
    ],
    client: 'POOJARA TECH',
    qty: '1,200 UNITS DELIVERED',
    item: 'Executive Heather Commuter Briefcase',
    img: '/products/styled/10.png',
    alt: 'Poojara executive messenger briefcase with custom high-density branding.'
  },
  {
    num: '03',
    category: 'STRUCTURAL DURABILITY',
    title: 'STRESS-TESTED FOR THE REAL WORLD.',
    body: 'A bag is a piece of daily industrial equipment. It gets thrown into cabs, carried through monsoon rain, stuffed under airline seats, and overloaded with laptops and power bricks. We use heavy bonded nylon thread, 25kg bar-tack anchors, and abrasion-resistant denier textiles that outlast standard corporate gifts by years.',
    points: [
      '25kg tensile load stress testing on all shoulder straps and top handles',
      '10,000-cycle zipper glide endurance standard',
      'Water-repellent PU/DWR coating with taped internal seams'
    ],
    client: 'RAMA BODY CLUB',
    qty: '500 UNITS DELIVERED',
    item: 'Heavy-Duty Pro Athletic Fleet Duffel',
    img: '/products/styled/35.png',
    alt: 'Rama Body Club custom athletic and gym duffel bag.'
  }
];

const pillars = [
  {
    id: '01',
    title: 'MATERIAL SCIENCE',
    desc: 'High-denier Ballistic Nylon 1680D, Cordura 1000D, Eco-RPET, and 16oz Twill Canvas chosen for specific tensile friction and weight ratios.'
  },
  {
    id: '02',
    title: 'LOAD GEOMETRY',
    desc: 'Ergonomic lumbar load curves and 3D breathable air-mesh padding designed to shift center-of-mass weight smoothly into the core body.'
  },
  {
    id: '03',
    title: 'STITCH INTEGRITY',
    desc: 'Double-needle chain stitching with heavy-gauge bonded nylon threads, reinforced with computerized box-X and bar-tack anchors.'
  },
  {
    id: '04',
    title: 'INDUSTRIAL HARDWARE',
    desc: 'All-metal zinc alloy buckles, heavy-gauge YKK and SBS industrial zippers, and tactical paracord pullers built for relentless daily use.'
  }
];

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const whatsappInquiryUrl = buildWhatsAppUrl(
    generateQuickInquiryMessage("Enterprise OEM Manufacturing Consultation")
  );

  return (
    <div className="about-page-wrapper">
      
      {/* Editorial Hero */}
      <header className="about-page-hero">
        <div className="editorial-container">
          <FadeIn>
            <div className="about-hero-meta technical-text">
              <span>PAGE 04 // FACTORY HERITAGE &amp; PRODUCTION ETHOS</span>
              <span className="about-factory-badge">
                <CheckCircle2 size={13} /> DIRECT OEM / ODM FACTORY
              </span>
            </div>

            <h1 className="about-hero-title">
              WE MAKE BAGS<br/>
              AROUND REAL<br/>
              REQUIREMENTS.
            </h1>

            <p className="about-hero-sub">
              ASKMEBAG is an industrial carry manufacturer. We engineer, prototype, and manufacture custom bags from the yarn up — delivering precision carry solutions for enterprise fleets, tech giants, educational institutions, and global teams.
            </p>

            {/* Heritage Proof Strip */}
            <div className="about-proof-strip technical-text">
              <div className="proof-stat">
                <span className="stat-number">15+</span>
                <span className="stat-desc">Years OEM Heritage</span>
              </div>
              <div className="proof-divider"></div>
              <div className="proof-stat">
                <span className="stat-number">500K+</span>
                <span className="stat-desc">Bags Manufactured</span>
              </div>
              <div className="proof-divider"></div>
              <div className="proof-stat">
                <span className="stat-number">5–7 D</span>
                <span className="stat-desc">Sample Turnaround</span>
              </div>
              <div className="proof-divider"></div>
              <div className="proof-stat">
                <span className="stat-number">NO MOQ</span>
                <span className="stat-desc">Order From 1 Unit</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </header>

      {/* Main Paired Story Chapters */}
      <div className="about-chapters-container">
        <div className="editorial-container">
          
          {chapters.map((chapter, idx) => {
            const isReverse = idx % 2 === 1;
            return (
              <section className={`about-chapter-row ${isReverse ? 'row-reverse' : ''}`} key={chapter.num}>
                
                {/* Text Story Column */}
                <div className="chapter-text-col">
                  <FadeIn>
                    <div className="chapter-eyebrow technical-text">
                      <span className="chapter-num">{chapter.num}</span>
                      <span>// {chapter.category}</span>
                    </div>
                    <h2 className="chapter-heading">{chapter.title}</h2>
                    <p className="chapter-body">{chapter.body}</p>
                    
                    <ul className="chapter-points-list">
                      {chapter.points.map((pt, pIdx) => (
                        <li key={pIdx}>
                          <CheckCircle2 size={15} className="point-check" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </FadeIn>
                </div>

                {/* Paired Museum Specimen Card */}
                <div className="chapter-visual-col">
                  <FadeIn delay={0.15}>
                    <div className="specimen-card">
                      <div className="specimen-header technical-text">
                        <span className="specimen-client">{chapter.client}</span>
                        <span className="specimen-qty">{chapter.qty}</span>
                      </div>
                      
                      <div className="specimen-img-frame">
                        <img 
                          src={chapter.img} 
                          alt={chapter.alt} 
                          loading="lazy" 
                          className="specimen-img"
                        />
                      </div>

                      <div className="specimen-footer technical-text">
                        <span className="specimen-fig">FIG 0{chapter.num} // SPECIFICATION SPECIMEN</span>
                        <span className="specimen-name">{chapter.item}</span>
                      </div>
                    </div>
                  </FadeIn>
                </div>

              </section>
            );
          })}

        </div>
      </div>

      {/* 4 Structural Pillars Section */}
      <section className="about-pillars-section">
        <div className="editorial-container">
          <FadeIn>
            <div className="pillars-header">
              <span className="pillars-eyebrow technical-text">04 // ENGINEERING FOUNDATIONS</span>
              <h2 className="pillars-title">FOUR STRUCTURAL PRINCIPLES.</h2>
              <p className="pillars-desc">
                Every custom bag that leaves our factory floor is governed by these core manufacturing standards.
              </p>
            </div>

            <div className="pillars-grid">
              {pillars.map((pillar) => (
                <div className="pillar-card" key={pillar.id}>
                  <span className="pillar-num technical-text">{pillar.id}</span>
                  <h3 className="pillar-name">{pillar.title}</h3>
                  <p className="pillar-body">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Factory Action Footer */}
      <section className="about-action-footer">
        <div className="editorial-container">
          <div className="action-box-inner">
            <div className="action-box-content">
              <span className="action-eyebrow technical-text">DIRECT OEM &amp; ODM PRODUCTION</span>
              <h2 className="action-title">Ready to build custom carry for your organization?</h2>
              <p className="action-sub">
                From a single prototype for board review to 10,000+ unit corporate fleet deliveries — our manufacturing team is ready to assist.
              </p>
            </div>
            
            <div className="action-box-buttons">
              <a 
                href={whatsappInquiryUrl} 
                target="_blank" 
                rel="noreferrer"
                className="btn-about-wa"
              >
                <MessageCircle size={18} />
                <span>START WHATSAPP BRIEF</span>
                <ArrowRight size={15} />
              </a>
              <Link to="/custom" className="btn-about-custom">
                <Sliders size={16} />
                <span>TRY LIVE CUSTOMIZER</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
