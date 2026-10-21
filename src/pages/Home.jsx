import React, { useState, useEffect, useMemo } from 'react';
import HeroExperience from '../experience/HeroExperience';
import BagsSection from '../components/BagsSection';
import CustomizationSection from '../components/CustomizationSection';
import IndustriesSection from '../components/IndustriesSection';
import ProcessTimeline from '../components/ProcessTimeline';
import PortfolioSection from '../components/PortfolioSection';
import ComfortStyleSection from '../components/ComfortStyleSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ScaleSection from '../components/ScaleSection';
import BulkOrderTiers from '../components/BulkOrderTiers';
import InstagramGallery from '../components/InstagramGallery';
import CTASection from '../components/CTASection';
import FadeIn from '../components/FadeIn';

const DEFAULT_SECTION_ORDER = [
  'hero',
  'bags',
  'customization',
  'industries',
  'process',
  'portfolio',
  'comfort',
  'testimonials',
  'scale',
  'tiers',
  'instagram',
  'cta'
];

const Home = () => {
  const [data, setData] = useState({
    featured_products: [],
    portfolio: [],
    testimonials: [],
    settings: {},
    sections: []
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Try index.php route first for reliable LiteSpeed routing, fallback to clean URL
        const res = await fetch('https://askmebag.com/api/index.php/home-data')
          .catch(() => fetch('https://askmebag.com/api/home-data'));
        
        if (res && res.ok) {
          const json = await res.json();
          if (json) {
            setData({
              featured_products: json.featured_products || [],
              portfolio: json.portfolio || [],
              testimonials: json.testimonials || [],
              settings: json.settings || {},
              sections: json.sections || []
            });
          }
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      }
    };

    fetchHomeData();
  }, []);

  // Map sections by section_key for O(1) lookup
  const sectionMap = useMemo(() => {
    const map = {};
    (data.sections || []).forEach(s => {
      map[s.section_key] = s;
    });
    return map;
  }, [data.sections]);

  // Check if a section is visible
  const isSectionVisible = (key) => {
    // If sections have loaded from DB, strictly honor is_visible
    if (data.sections && data.sections.length > 0) {
      const s = sectionMap[key];
      if (s) {
        return s.is_visible === true || s.is_visible === 1 || s.is_visible === '1' || s.is_visible === 'true';
      }
      // If not in DB yet (e.g. newly introduced instagram section), default to visible
      return true;
    }
    // Before API response arrives, show default visible sections
    return true;
  };

  // Determine active section order (CMS sort_order or default order)
  const orderedKeys = useMemo(() => {
    if (!data.sections || data.sections.length === 0) {
      return DEFAULT_SECTION_ORDER;
    }

    const sortedDbSections = [...data.sections]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map(s => s.section_key);

    // Append any default keys not present in DB (like 'instagram' if not seeded yet)
    DEFAULT_SECTION_ORDER.forEach(key => {
      if (!sortedDbSections.includes(key)) {
        if (key === 'instagram') {
          // Put instagram right before cta if missing
          const ctaIdx = sortedDbSections.indexOf('cta');
          if (ctaIdx !== -1) {
            sortedDbSections.splice(ctaIdx, 0, 'instagram');
          } else {
            sortedDbSections.push('instagram');
          }
        } else {
          sortedDbSections.push(key);
        }
      }
    });

    return sortedDbSections;
  }, [data.sections]);

  // Render individual section dynamically with its CMS data
  const renderSection = (key) => {
    if (!isSectionVisible(key)) return null;
    const sec = sectionMap[key];

    switch (key) {
      case 'hero':
        return <HeroExperience key="hero" sectionData={sec} />;
      case 'bags':
        return (
          <FadeIn key="bags" delay={0.1}>
            <BagsSection items={data.featured_products} sectionData={sec} />
          </FadeIn>
        );
      case 'customization':
        return (
          <FadeIn key="customization" delay={0.1}>
            <CustomizationSection sectionData={sec} />
          </FadeIn>
        );
      case 'industries':
        return (
          <FadeIn key="industries" delay={0.1}>
            <IndustriesSection sectionData={sec} />
          </FadeIn>
        );
      case 'process':
        return (
          <FadeIn key="process" delay={0.1}>
            <ProcessTimeline sectionData={sec} />
          </FadeIn>
        );
      case 'portfolio':
        return (
          <FadeIn key="portfolio" delay={0.1}>
            <PortfolioSection items={data.portfolio} sectionData={sec} />
          </FadeIn>
        );
      case 'comfort':
        return (
          <FadeIn key="comfort" delay={0.1}>
            <ComfortStyleSection sectionData={sec} />
          </FadeIn>
        );
      case 'testimonials':
        return (
          <FadeIn key="testimonials" delay={0.1}>
            <TestimonialsSection items={data.testimonials} sectionData={sec} />
          </FadeIn>
        );
      case 'scale':
        return (
          <FadeIn key="scale" delay={0.1}>
            <ScaleSection sectionData={sec} />
          </FadeIn>
        );
      case 'tiers':
        return (
          <FadeIn key="tiers" delay={0.1}>
            <BulkOrderTiers sectionData={sec} />
          </FadeIn>
        );
      case 'instagram':
        return (
          <FadeIn key="instagram" delay={0.1}>
            <InstagramGallery sectionData={sec} />
          </FadeIn>
        );
      case 'cta':
        return (
          <FadeIn key="cta" delay={0.1}>
            <CTASection sectionData={sec} />
          </FadeIn>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {orderedKeys.map(key => renderSection(key))}
    </>
  );
};

export default Home;
