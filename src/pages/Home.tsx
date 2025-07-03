import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Courses from '../components/Courses';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import PricingSection from '../components/Pricing';
import CTA from '../components/CTA';

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <Courses />
      <Stats />
      <Testimonials />
      <PricingSection />
      <CTA />
    </>
  );
};

export default Home;