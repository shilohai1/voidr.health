
import React from 'react';
import { Link } from 'react-router-dom';
import { TealLiquidButton } from '@/components/ui/teal-liquid-button';

const HeroSection = () => {
  return (
    <section
       className="px-4 sm:px-6 md:px-8 relative overflow-hidden flex flex-col justify-center min-h-screen bg-gradient-to-b from-[#89ebf5] via-white to-[#89ebf5] rounded-b-[3rem] sm:rounded-b-[4rem] md:rounded-b-[3rem]"
    >
      {/* Content positioned below navbar */}
      <div className="w-full max-w-7xl mx-auto text-center relative z-10 pt-20 sm:pt-24 md:pt-28">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
          Save Hours in Clinics and Study{' '}
          <span className="text-[#036873]">
            Smarter
          </span>
        </h1>
        
        {/* Subheading */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 font-medium">
         Summarize patient notes in 60 seconds. Analyze symptoms instantly. 
         Practice real clinical cases under pressure. All in one platform.
        </p>
        
        {/* CTA Button */}
        <div className="relative flex justify-center px-4 mb-8 sm:mb-16 sm:bottom-[2rem]">
          <Link to="/auth" className="mobile-full-width sm:w-auto">
            <TealLiquidButton size="xl" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto min-h-[44px] shadow-lg">
              Start Free Trial
            </TealLiquidButton>
          </Link>
        </div>
      </div>
      
      {/* iPhone 15 Mockup - Much smaller and positioned at bottom edge */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2/3 z-5">
        <div className="relative">
          {/* iPhone 15 Frame - Significantly reduced size */}
          <div className="relative w-[200px] sm:w-[240px] md:w-[280px] h-[400px] sm:h-[480px] md:h-[560px] bg-black rounded-[2.5rem] sm:rounded-[3rem] p-1.5 shadow-2xl">
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 h-5 sm:h-6 bg-black rounded-full z-20"></div>
            
            {/* Screen */}
            <div className="w-full h-full bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden relative">
              {/* Screen Content - New uploaded image */}
              <img 
                src="/lovable-uploads/22d406f3-4e0f-4d9b-8233-3e4fb57898cd.png" 
                alt="AskVoidr Symptom Checker Interface" 
                className="w-full h-full object-cover"
                loading="eager"
              />
              
              {/* Screen overlay for subtle depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
            </div>
            
            {/* Home indicator */}
            <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-28 sm:w-32 h-1 bg-white rounded-full opacity-60"></div>
          </div>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7de8dd]/10 to-[#FF6A3D]/5 rounded-[2.5rem] sm:rounded-[3rem] blur-xl -z-10 scale-110"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
