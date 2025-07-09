
import React from 'react';

const PainSolutionSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            {/* The Problem */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-red-600 mb-3 sm:mb-4">The Problem</h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Medical school is honestly getting out of hand these days. Way too overwhelming tasks and assignments as you progress through the semesters, let alone the weekly quizzes...
              </p>
            </div>

            {/* The Solution */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-3 sm:mb-4">The Solution</h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We created Voidr.health exactly for this! You can now enter your questions and topics into Voidr and it will generate you a short video depending on how you want it and explain everything in detail. Voidr also helps summarise documents that is useful during your regular ward rounds.
              </p>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="w-full max-w-sm sm:max-w-md h-64 sm:h-80 md:h-96 bg-gradient-to-br from-[#e6f6fa] to-[#f3fceb] rounded-xl shadow-lg overflow-hidden">
              <picture>
                <source 
                  srcSet="/lovable-uploads/3b054787-db8d-4625-9091-6e38c8ddb840.webp" 
                  type="image/webp" 
                />
                <img 
                  src="/lovable-uploads/3b054787-db8d-4625-9091-6e38c8ddb840.png" 
                  alt="Medical Student with Anatomy Tablet" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="400"
                  height="384"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainSolutionSection;
