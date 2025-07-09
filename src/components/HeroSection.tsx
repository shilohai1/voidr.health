
import React from 'react';
import { Link } from 'react-router-dom';
import { TealLiquidButton } from '@/components/ui/teal-liquid-button';
import { LavaLamp } from '@/components/ui/fluid-blob';

const HeroSection = () => {
  return (
    <section
      className="px-4 sm:px-6 md:px-8 relative overflow-hidden flex flex-col justify-center min-h-screen"
    >
      {/* Background Elements - Simplified for mobile performance */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse will-change-transform"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000 will-change-transform"></div>
      </div>
      
      {/* Fluid Blob Background - Hidden on mobile for performance */}
      <div className="absolute inset-0 opacity-10 sm:opacity-20 hidden sm:block pointer-events-none">
        <LavaLamp />
      </div>
      
      <div className="w-full max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
          AI Tools built for{' '}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Medical Students, Residents & Doctors
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
          Transform your medical education with AI-powered video generation, document summarization, and interactive learning tools.
        </p>
        
        <div className="flex justify-center px-4">
          <Link to="/auth" className="mobile-full-width sm:w-auto">
            <TealLiquidButton size="xl" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto min-h-[44px]">
              Join VOIDR
            </TealLiquidButton>
          </Link>
        </div>
        
        <div className="mt-8 sm:mt-12 text-xs sm:text-sm text-gray-500 px-4">
          Trusted by 10,000+ medical students worldwide
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
