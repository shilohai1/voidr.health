
import React from 'react';
import { Link } from 'react-router-dom';
import { TealLiquidButton } from '@/components/ui/teal-liquid-button';

const HeroSection = () => {
  return (
    <section
      className="px-4 sm:px-6 md:px-8 relative overflow-hidden flex flex-col justify-center min-h-screen bg-gradient-to-b from-white via-white to-[#7de8dd]"
    >
      {/* Content positioned below navbar */}
      <div className="w-full max-w-7xl mx-auto text-center relative z-10 pt-20 sm:pt-24 md:pt-28">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
          AI Tools Tailored for{' '}
          <span className="text-[#FF6A3D]">
            Med Students, Residents & Doctors
          </span>
        </h1>
        
        {/* Subheading */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 font-medium">
          Revolutionize Medical Learning with AI Videos, Summaries & Interactive Tools.
        </p>
        
        {/* CTA Button */}
        <div className="flex justify-center px-4 mb-8 sm:mb-16">
          <Link to="/auth" className="mobile-full-width sm:w-auto">
            <TealLiquidButton size="xl" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto min-h-[44px] shadow-lg">
              Join VOIDR
            </TealLiquidButton>
          </Link>
        </div>
      </div>
      
      {/* iPhone 15 Mockup - Positioned at bottom */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3 z-10">
        <div className="relative">
          {/* iPhone 15 Frame */}
          <div className="relative w-[280px] sm:w-[320px] md:w-[360px] h-[570px] sm:h-[650px] md:h-[730px] bg-black rounded-[3rem] sm:rounded-[3.5rem] p-2 shadow-2xl">
            {/* Dynamic Island */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-24 sm:w-28 h-6 sm:h-7 bg-black rounded-full z-20"></div>
            
            {/* Screen */}
            <div className="w-full h-full bg-white rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden relative">
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
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 sm:w-36 h-1 bg-white rounded-full opacity-60"></div>
          </div>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7de8dd]/10 to-[#FF6A3D]/5 rounded-[3rem] sm:rounded-[3.5rem] blur-xl -z-10 scale-110"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
