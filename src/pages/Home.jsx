import React from 'react';
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
import CTASection from '../components/CTASection';
import FadeIn from '../components/FadeIn';

const Home = () => {
  return (
    <>
      {/* Scroll-Scrubbed Atelier Video Hero Experience */}
      <HeroExperience />

      {/* Primary Catalog & Customization */}
      <FadeIn delay={0.1}><BagsSection /></FadeIn>
      <FadeIn delay={0.1}><CustomizationSection /></FadeIn>
      <FadeIn delay={0.1}><IndustriesSection /></FadeIn>
      <FadeIn delay={0.1}><ProcessTimeline /></FadeIn>
      
      {/* MADE FOR BRANDS, TEAMS & INSTITUTIONS */}
      <FadeIn delay={0.1}><PortfolioSection /></FadeIn>

      {/* Slogan Showcase: Engineered for Comfort. Designed for Style. */}
      <FadeIn delay={0.1}><ComfortStyleSection /></FadeIn>

      {/* Social Proof & Commercial Fleet Tiers */}
      <FadeIn delay={0.1}><TestimonialsSection /></FadeIn>
      <FadeIn delay={0.1}><ScaleSection /></FadeIn>
      <FadeIn delay={0.1}><BulkOrderTiers /></FadeIn>
      <FadeIn delay={0.1}><CTASection /></FadeIn>
    </>
  );
};

export default Home;
