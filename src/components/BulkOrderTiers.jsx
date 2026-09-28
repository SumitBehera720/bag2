import React from 'react';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { buildWhatsAppUrl } from '../config';
import './BulkOrderTiers.css';

const TIERS = [
  {
    id: 'tier-1',
    badge: 'PILOT COMMISSION',
    badgeType: 'default',
    tierSubtitle: 'TIER I: PILOT / EXECUTIVE',
    unitRange: '50 – 99 Units',
    allowance: '15% Volume Allowance',
    productionWindow: 'Production window: 3 – 4 Weeks',
    features: [
      'Blind debossed company insignia',
      'Individual personalized employee initials',
      'Standard atelier gift presentation packaging',
      'Pre-production material swatch proof'
    ],
    ctaText: 'Inquire for 50 Units',
    ctaUnits: 50,
    isFeatured: false,
    btnStyle: 'dark'
  },
  {
    id: 'tier-2',
    badge: '★ MOST REQUESTED TIER',
    badgeType: 'featured',
    tierSubtitle: 'TIER II: DEPARTMENT / FLEET',
    unitRange: '100 – 249 Units',
    allowance: '25% Volume Allowance',
    productionWindow: 'Production window: 4 – 6 Weeks',
    features: [
      'Custom dyed textile or leather colorways',
      'Dual logo branding (exterior plate & interior lining)',
      'Customized internal organizational pockets',
      'Dedicated production supervisor & stage updates',
      'Physical prototype delivered in 5 days'
    ],
    ctaText: 'Inquire for 100 Units',
    ctaUnits: 100,
    isFeatured: true,
    btnStyle: 'accent'
  },
  {
    id: 'tier-3',
    badge: 'ENTERPRISE FLEET',
    badgeType: 'enterprise',
    tierSubtitle: 'TIER III: GLOBAL ENTERPRISE SCALE',
    unitRange: '250+ Units',
    allowance: 'Custom Contract Terms',
    productionWindow: 'Production window: Scheduled Fleet Deployments',
    features: [
      'Full bespoke pattern engineering from sketch',
      'Proprietary hardware casting & laser serials',
      'Multi-destination international drop shipping',
      'Corporate PO invoicing with Net-30 payment terms',
      'Permanent replenishment archive guarantee'
    ],
    ctaText: 'Inquire for 250+ Units',
    ctaUnits: 250,
    isFeatured: false,
    btnStyle: 'dark'
  }
];

const BulkOrderTiers = ({ title = "Volume Fleet Production & Bulk Orders", subtitle = "Engineered tiered commissions for executive corporate gifts, team deployments, and global enterprise operations." }) => {
  
  const handleInquire = (tier) => {
    const message = [
      `*ASKMEBAG BULK COMMISSION INQUIRY*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `💼 *Selected Tier:* ${tier.tierSubtitle}`,
      `📦 *Target Volume:* ${tier.unitRange}`,
      `🏷️ *Volume Allowance / Terms:* ${tier.allowance}`,
      `⏱️ *${tier.productionWindow}*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `*Included Specifications:*`,
      ...tier.features.map(f => ` • ${f}`),
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Hello ASKMEBAG production team, I would like to initiate an inquiry for this volume tier. Please provide commercial terms, prototype timeline, and design mockup consultation.`
    ].join('\n');

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="bulk-order-section" id="quote-calculator">
      <div className="editorial-container">
        
        {/* Section Heading */}
        <div className="bulk-section-header">
          <span className="technical-text bulk-eyebrow">VOLUME COMMISSIONS // ATELIER TIERS</span>
          <h2 className="bulk-title">{title}</h2>
          {subtitle && <p className="bulk-subtitle">{subtitle}</p>}
        </div>

        {/* 3 Tier Cards Grid */}
        <div className="bulk-cards-grid">
          {TIERS.map((tier) => (
            <div 
              key={tier.id} 
              className={`bulk-tier-card ${tier.isFeatured ? 'featured-card' : ''}`}
            >
              {/* Card Header Pill Badge */}
              <div className="tier-badge-row">
                <span className={`tier-pill-badge badge-${tier.badgeType}`}>
                  {tier.badge}
                </span>
              </div>

              {/* Tier Subtitle & Big Units */}
              <div className="tier-header-content">
                <div className="tier-subtitle-label technical-text">{tier.tierSubtitle}</div>
                <h3 className="tier-units-heading">{tier.unitRange}</h3>
                <div className="tier-allowance-highlight">{tier.allowance}</div>
                <div className="tier-production-window">{tier.productionWindow}</div>
              </div>

              {/* Divider */}
              <hr className="tier-divider" />

              {/* Features List */}
              <ul className="tier-features-list">
                {tier.features.map((item, idx) => (
                  <li key={idx} className="tier-feature-item">
                    <CheckCircle2 size={16} className="tier-check-icon" strokeWidth={1.8} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Inquire Action Button */}
              <div className="tier-cta-wrap">
                <button
                  type="button"
                  className={`btn-tier-inquire btn-${tier.btnStyle}`}
                  onClick={() => handleInquire(tier)}
                  title={`${tier.ctaText} via WhatsApp`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowUpRight size={15} className="btn-inquire-arrow" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BulkOrderTiers;
