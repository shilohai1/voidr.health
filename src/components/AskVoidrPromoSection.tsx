import React from 'react';
import { Link } from 'react-router-dom';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

const AskVoidrPromoSection = () => {
  return (
    <section
      className="py-20 px-4"
      style={{
        background: 'linear-gradient(135deg, #52bdc7 0%, #72ccc6 100%)',
        borderRadius: '2rem'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium text-black mb-4">
            Presenting the most favourite VOIDR of all...
          </h2>
          <h3 className="text-5xl md:text-7xl font-bold text-black mb-8">
            AskVoidr
          </h3>
          <p className="text-lg text-black max-w-4xl mx-auto leading-relaxed">
            AskVoidr is the intelligent symptom analysis engine built into the voidr.health ecosystem — a mission-critical tool designed to help users make sense of their symptoms quickly, accurately, and safely. Built for both patients and healthcare professionals, AskVoidr bridges the gap between uncertainty and informed action through precision AI, clinical structure, and human-centered design.
          </p>
        </div>

        {/* Main Content - Single Box */}
        <div className="max-w-6xl mx-auto">
          <LiquidCard className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left Column - How it works */}
              <div>
                <h4 className="text-2xl font-bold text-black mb-2">
                  How does AskVoidr work?
                </h4>
                <p className="text-lg text-black mb-6">
                  AskVoidr works in just 5 simple steps:
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      1
                    </div>
                    <p className="text-black">Choose your Gender</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      2
                    </div>
                    <p className="text-black">Choose your Age category</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      3
                    </div>
                    <p className="text-black">Choose your Symptom onset</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      4
                    </div>
                    <p className="text-black">Enter your Symptom location</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      5
                    </div>
                    <p className="text-black">Describe your symptoms in detail</p>
                  </div>
                </div>

                <p className="text-black font-medium text-sm mb-6">
                  (<strong>Pro Tip:</strong> The more accurate detail you enter, the more accurate results you may get)
                </p>

                <p className="text-lg font-semibold text-black mb-4">
                  And VOILA! AskVoidr will give you the probable causes to your symptoms.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 text-sm">
                    <strong>Remember:</strong> AskVoidr is only created for informational purposes and to give you an idea for your symptoms. Be sure to consult a medical professional for accurate diagnosis.
                  </p>
                </div>

                <Link to="/symptom-checker">
                  <LiquidButton className="w-full">
                    Try AskVoidr for FREE
                  </LiquidButton>
                </Link>
              </div>

              {/* Right Column - Reference Image */}
              <div>
                <div className="text-center mb-4">
                  <h5 className="text-lg font-semibold text-black mb-2">
                    See AskVoidr in Action
                  </h5>
                  <p className="text-black text-sm">
                    Here's what your analysis results will look like
                  </p>
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="/lovable-uploads/43cb0459-ca84-469c-8a4a-7d286ca99f91.png"
                    alt="AskVoidr Analysis Results Example"
                    className="w-full h-auto max-w-none"
                    style={{ imageRendering: 'crisp-edges' }}
                  />
                </div>
              </div>
            </div>
          </LiquidCard>
        </div>
      </div>
    </section>
  );
};

export default AskVoidrPromoSection;
