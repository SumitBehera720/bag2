import React from 'react';
import { Heart, MessageCircle, ArrowUpRight } from 'lucide-react';
import './InstagramGallery.css';

const InstagramIcon = ({ size = 16, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const DEFAULT_POSTS = [
  {
    id: 1,
    img: '/media/process_cut.jpg',
    tag: 'STAGE 01 // TEXTILE CUT',
    likes: '2.4k',
    comments: '84',
    caption: 'Hand-calibrating 1000D ballistic weaves for corporate fleet run #AMB240. Precision cut to 0.2mm tolerance.',
    url: 'https://instagram.com/askmebag'
  },
  {
    id: 2,
    img: '/media/process_stitch.jpg',
    tag: 'STAGE 02 // BAR-TACK',
    likes: '1.9k',
    comments: '42',
    caption: 'Heavy-gauge bonded nylon stitching with 42-stitch stress reinforcement on dual commuter harness points.',
    url: 'https://instagram.com/askmebag'
  },
  {
    id: 3,
    img: '/media/process_banner_cover.jpg',
    tag: 'STAGE 03 // HARDWARE',
    likes: '3.1k',
    comments: '112',
    caption: 'Industrial matte black SBS zipper tracks & 3D laser-engraved metal insignia plaques fitted for enterprise clients.',
    url: 'https://instagram.com/askmebag'
  },
  {
    id: 4,
    img: '/media/custom_page_cover.jpg',
    tag: 'STAGE 04 // CAD BLUEPRINT',
    likes: '2.8k',
    comments: '96',
    caption: 'Bespoke pattern geometry and physical pre-production material swatch proofing completed in 5 days.',
    url: 'https://instagram.com/askmebag'
  },
  {
    id: 5,
    img: '/media/scale_banner_cover.jpg',
    tag: 'STAGE 05 // FLEET DISPATCH',
    likes: '4.5k',
    comments: '167',
    caption: 'Mass scale completed fleet units stacked and sealed for international corporate deployment. Zero defect QC.',
    url: 'https://instagram.com/askmebag'
  },
  {
    id: 6,
    img: '/media/final_cta_banner.jpg',
    tag: 'STAGE 06 // VIP ONBOARDING',
    likes: '3.7k',
    comments: '128',
    caption: 'Executive tier rigid gift presentation boxes paired with weighted pens & matching debossed journals.',
    url: 'https://instagram.com/askmebag'
  }
];

export default function InstagramGallery({ sectionData }) {
  const title = sectionData?.title || 'Inside the Production Fleet.';
  const subtitle = sectionData?.subtitle || 'ATELIER SOCIAL // @ASKMEBAG';
  const description = sectionData?.description || 'From raw Cordura 1000D weave slicing to international palletized freight. Follow our real-time factory floor commissions.';
  const instagramUrl = sectionData?.cta_url || 'https://instagram.com/askmebag';
  const ctaText = sectionData?.cta_text || 'FOLLOW @ASKMEBAG';

  return (
    <section className="instagram-gallery-section" id="instagram">
      <div className="editorial-container">
        
        {/* Header Row */}
        <div className="instagram-header-row">
          <div className="instagram-header-left">
            <div className="instagram-badge-pill technical-text">
              <span className="instagram-pulse-dot" />
              <InstagramIcon size={13} />
              <span>{subtitle}</span>
            </div>
            <h2 className="instagram-title">
              {title}
            </h2>
            <p className="instagram-desc">
              {description}
            </p>
          </div>

          <a 
            href={instagramUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="instagram-follow-btn technical-text"
          >
            <InstagramIcon size={16} />
            <span>{ctaText}</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* 6-Card Gallery Grid */}
        <div className="instagram-grid">
          {DEFAULT_POSTS.map(post => (
            <a 
              key={post.id}
              href={post.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="instagram-card"
              title={post.caption}
            >
              <img 
                src={post.img} 
                alt={post.tag} 
                className="instagram-img"
                loading="lazy"
              />
              <div className="instagram-overlay">
                <div className="instagram-card-top">
                  <span className="instagram-tag-badge technical-text">{post.tag}</span>
                  <InstagramIcon size={15} style={{ opacity: 0.9 }} />
                </div>
                <div className="instagram-card-bottom">
                  <p className="instagram-caption-preview">{post.caption}</p>
                  <div className="instagram-metrics-row technical-text">
                    <span className="instagram-metric-item">
                      <Heart size={12} fill="#ff5b99" color="#ff5b99" />
                      {post.likes}
                    </span>
                    <span className="instagram-metric-item">
                      <MessageCircle size={12} fill="#ffffff" color="#ffffff" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
