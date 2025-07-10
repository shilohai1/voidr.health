
import React from 'react';
import { Link } from 'react-router-dom';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

const CaseWisePromoSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-[#236dcf] to-[#1e5aa8]">
      <div className="max-w-7xl mx-auto">
        {/* Curved container */}
        <div className="bg-gradient-to-br from-[#236dcf] to-[#1e5aa8] rounded-t-[3rem] rounded-b-[3rem] p-8 sm:p-12 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            
            {/* Left Column - Content */}
            <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
              {/* Title */}
              <div className="text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  The World's Best Student-Friendly Simulation...
                </h2>
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                  Case Wise
                </h3>
              </div>

              {/* Description */}
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed text-center lg:text-left">
                Case Wise is a student-friendly medical simulation platform that brings the intensity of real hospital environments into the classroom. Designed for aspiring doctors, Case Wise replicates real-life clinical scenarios, putting students in the driver's seat to make high-stakes decisions under authentic hospital pressure. From emergency room chaos to complex patient histories, every case is crafted to develop critical thinking, clinical reasoning, and confidence—before ever stepping into a real ward. It's not just a simulation—it's your first step into the life of a doctor.
              </p>

              {/* CTA Button */}
              <div className="flex justify-center lg:justify-start pt-4">
                <Link to="/auth">
                  <LiquidButton size="xl" className="text-lg px-8 py-4 shadow-lg">
                    Try Case Wise Simulation Now!
                  </LiquidButton>
                </Link>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex justify-center order-1 lg:order-2">
              <div className="w-full max-w-lg">
                <img 
                  src="/lovable-uploads/1d2e6e77-6f99-4641-8c47-8b64bc1d1b17.png" 
                  alt="Case Wise Medical Simulation Interface" 
                  className="w-full h-auto object-cover rounded-xl shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseWisePromoSection;
