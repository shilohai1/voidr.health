
import React from 'react';
import { Link } from 'react-router-dom';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

const CaseWisePromoSection = () => {
  return (
    <section 
      id="CaseWisePromoSection"
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-[#236dcf] to-[#1e5aa8]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Curved container */}
        <div className="bg-gradient-to-br from-[#236dcf] to-[#1e5aa8] rounded-t-[3rem] sm:rounded-t-[4rem] md:rounded-t-[5rem] rounded-b-[3rem] sm:rounded-b-[4rem] md:rounded-b-[5rem] p-8 sm:p-12 md:p-16">
          <div className="space-y-8 sm:space-y-12">
            
            {/* Title */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                The World's Best Student-Friendly Simulation...
              </h2>
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Case Wise
              </h3>
            </div>

            {/* Description */}
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
                Case Wise is a student-friendly medical simulation platform that brings the intensity of real hospital environments into the classroom. Designed for aspiring doctors, Case Wise replicates real-life clinical scenarios, putting students in the driver's seat to make high-stakes decisions under authentic hospital pressure. From emergency room chaos to complex patient histories, every case is crafted to develop critical thinking, clinical reasoning, and confidence—before ever stepping into a real ward. It's not just a simulation—it's your first step into the life of a doctor.
              </p>
            </div>

            {/* Image - Now positioned below description */}
            <div className="flex justify-center">
              <div className="w-full max-w-lg">
                <img 
                  src="/lovable-uploads/1d2e6e77-6f99-4641-8c47-8b64bc1d1b17.png" 
                  alt="Case Wise Medical Simulation Interface" 
                  className="w-full h-auto object-cover rounded-xl shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>

            {/* CTA Button - Now positioned below image */}
            <div className="flex justify-center pt-4">
              <Link to="/auth">
                <LiquidButton size="xl" className="text-lg px-8 py-4 shadow-lg">
                  Try Case Wise Simulation Now!
                </LiquidButton>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseWisePromoSection;
