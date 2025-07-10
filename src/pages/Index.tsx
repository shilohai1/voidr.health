
import React from 'react';
import { NavBar } from '@/components/ui/tubelight-navbar';
import HeroSection from '@/components/HeroSection';
import PainSolutionSection from '@/components/PainSolutionSection';
import ProductPreviewSection from '@/components/ProductPreviewSection';
import CaseWisePromoSection from '@/components/CaseWisePromoSection';
import AskVoidrPromoSection from '@/components/AskVoidrPromoSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import { User } from 'lucide-react';

const Index = () => {
  const navItems = [
    { 
      name: 'Services', 
      url: '#services',
      hasDropdown: true,
      dropdownItems: [
        { name: 'StudyWithAI', url: '#studywithai' },
        { name: 'ClinicBot', url: '#clinicbot' },
        { name: 'Case Wise', url: '/case-wise' },
        { name: 'AskVoidr', url: '/symptom-checker' }
      ]
    },
    { name: 'Pricing', url: '#pricing' },
    { name: 'Affiliates', url: '/affiliates' },
    { 
      name: 'About Us', 
      url: '#about',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Who We Are', url: '/about' },
        { name: 'Instagram', url: 'https://www.instagram.com/voidr.health/' },
        { name: 'Twitter', url: 'https://x.com/voidrhealth' }
      ]
    },
    { name: 'Login', url: '/auth', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-white to-[#f3fceb]">
      <NavBar items={navItems} />
      <HeroSection />
      <PainSolutionSection />
      <div id="services">
        <ProductPreviewSection />
      </div>
      <CaseWisePromoSection />
      <AskVoidrPromoSection />
      <TestimonialsSection />
      <div id="pricing">
        <PricingSection />
      </div>
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
