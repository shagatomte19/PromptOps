import React from 'react';
import { Hero } from '../components/sections/Hero';
import { ProblemSection } from '../components/sections/ProblemSection';
import { SolutionSection } from '../components/sections/SolutionSection';
import { FeaturesGrid } from '../components/sections/FeaturesGrid';
import { DeveloperSection } from '../components/sections/DeveloperSection';
import { PricingSection } from '../components/sections/PricingSection';
import { CTA } from '../components/sections/CTA';

export const Landing: React.FC = () => {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesGrid />
      <DeveloperSection />
      <PricingSection />
      <CTA />
    </>
  );
};