
import React from 'react';
import { Link } from 'react-router-dom';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

const AskVoidrPromoSection = () => {
  return (
    <section 
      id="AskVoidrPromoSection"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 rounded-b-[3rem] sm:rounded-b-[4rem] md:rounded-b-[5rem] relative z-10"  
      style={{ backgroundColor: '#72ccc6' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4">
            Presenting the most favourite VOIDR of all...
          </h2>
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-4 sm:mb-6">
            AskVoidr — Your AI Symptom Checker
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-black max-w-4xl mx-auto leading-relaxed">
            AskVoidr helps you understand your symptoms in minutes without endless Googling or guesswork. 
            Our AI analyzes your details with clinical precision, giving you educational insights so you can 
            walk into your next appointment informed and confident.

          </p>
        </div>

        {/* Main Content */}
        <LiquidCard className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
            {/* How it Works Section */}
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-black mb-2">
                How does AskVoidr work?
              </h4>
              <p className="text-base sm:text-lg font-semibold text-black mb-3">
                (Takes Less Than 2 Minutes):
              </p>
              
              <div className="space-y-3 text-black">
                <div className="text-sm sm:text-base">
                  <span className="font-semibold">Step 1</span> - Choose your Gender
                </div>
                <div className="text-sm sm:text-base">
                  <span className="font-semibold">Step 2</span> - Choose your Age category
                </div>
                <div className="text-sm sm:text-base">
                  <span className="font-semibold">Step 3</span> - Choose your Symptom onset
                </div>
                <div className="text-sm sm:text-base">
                  <span className="font-semibold">Step 4</span> - Enter your Symptom location
                </div>
                <div className="text-sm sm:text-base">
                  <span className="font-semibold">Step 5</span> - Describe your symptoms in detail
                </div>
              </div>

              <div className="mt-4 p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs sm:text-sm text-black font-medium">
                  <span className="font-bold">Pro Tip</span> - The more accurate details you enter, the more accurate results you get
                </p>
              </div>

              <div className="mt-4 sm:mt-6 text-black">
                <p className="text-base sm:text-lg font-semibold mb-2">
                  And VOILA! AskVoidr will give you the most likely causes for your symptoms.
                </p>
                <p className="text-xs sm:text-sm italic">
                  Remember: AskVoidr is only created for educational and informational purposes only and to give you an idea for your symptoms. Be sure to consult a medical professional for precise and accurate diagnosis
                </p>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm sm:max-w-md">
                <picture>
                  <source 
                    srcSet="/lovable-uploads/43cb0459-ca84-469c-8a4a-7d286ca99f91.webp" 
                    type="image/webp" 
                  />
                  <img
                    src="/lovable-uploads/43cb0459-ca84-469c-8a4a-7d286ca99f91.png"
                    alt="AskVoidr Demo Interface"
                    className="w-full h-auto rounded-lg shadow-lg"
                    loading="lazy"
                    width="400"
                    height="600"
                  />
                </picture>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-8 sm:mt-12">
            <Link to="/symptom-checker" className="inline-block w-full sm:w-auto">
              <LiquidButton className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold min-h-[44px]">
                Check Your Symptoms Now for FREE!
              </LiquidButton>
            </Link>
          </div>
        </LiquidCard>
      </div>
    </section>
  );
};

export default AskVoidrPromoSection;
