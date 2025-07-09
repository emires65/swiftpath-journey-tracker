
import React from 'react';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import ServicesSection from '../components/ServicesSection';
import TrackingSection from '../components/TrackingSection';
import TestimonialsSection from '../components/TestimonialsSection';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSlider />
      <StatsSection />
      <ServicesSection />
      <TrackingSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
