import React from 'react';
import Hero from '../components/Hero';
import BagsSection from '../components/BagsSection';
import CustomizationSection from '../components/CustomizationSection';
import IndustriesSection from '../components/IndustriesSection';
import ProcessTimeline from '../components/ProcessTimeline';
import PortfolioSection from '../components/PortfolioSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ScaleSection from '../components/ScaleSection';
import CTASection from '../components/CTASection';
import FadeIn from '../components/FadeIn';

const Home = () => {
  return (
    <>
      <Hero />
      <FadeIn delay={0.1}><BagsSection /></FadeIn>
      <FadeIn delay={0.1}><CustomizationSection /></FadeIn>
      <FadeIn delay={0.1}><IndustriesSection /></FadeIn>
      <FadeIn delay={0.1}><ProcessTimeline /></FadeIn>
      <FadeIn delay={0.1}><PortfolioSection /></FadeIn>
      <FadeIn delay={0.1}><TestimonialsSection /></FadeIn>
      <FadeIn delay={0.1}><ScaleSection /></FadeIn>
      <FadeIn delay={0.1}><CTASection /></FadeIn>
    </>
  );
};

export default Home;
