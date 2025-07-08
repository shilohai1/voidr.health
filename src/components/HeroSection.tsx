import React from 'react';
import { Link } from 'react-router-dom';
import { TealLiquidButton } from '@/components/ui/teal-liquid-button';
import { LavaLamp } from '@/components/ui/fluid-blob';

const HeroSection = () => {
  return (
    <section
      className="px-4 relative overflow-hidden flex flex-col justify-center"
      style={{ minHeight: '100vh' }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>
      
      {/* Fluid Blob Background */}
      <div className="absolute inset-0 opacity-20">
        <LavaLamp />
      </div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          AI Tools built for{' '}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Medical Students, Residents & Doctors
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform your medical education with AI-powered video generation, document summarization, and interactive learning tools.
        </p>
        
        <div className="flex justify-center">
          <Link to="/auth">
            <TealLiquidButton size="xl" className="text-lg px-8 py-4">
              Join VOIDR
            </TealLiquidButton>
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          Trusted by 10,000+ medical students worldwide
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
