
import React from 'react';

const PainSolutionSection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            {/* The Problem */}
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-4">The Problem</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Medical school is honestly getting out of hand these days. Way too overwhelming tasks and assignments as you progress through the semesters, let alone the weekly quizzes...
              </p>
            </div>

            {/* The Solution */}
            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-4">The Solution</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                We created Voidr.health exactly for this! You can now enter your questions and topics into Voidr and it will generate you a short video depending on how you want it and explain everything in detail. Voidr also helps summarise documents that is useful during your regular ward rounds.
              </p>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="flex justify-center">
            <div className="w-full max-w-md h-96 bg-gradient-to-br from-[#e6f6fa] to-[#f3fceb] rounded-xl shadow-lg overflow-hidden">
              <img 
                src="/lovable-uploads/3b054787-db8d-4625-9091-6e38c8ddb840.png" 
                alt="Medical Student with Anatomy Tablet" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainSolutionSection;
