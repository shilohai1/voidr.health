
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
                Let’s be real. Medical school isn’t just hard anymore… it’s relentless. You wake up already behind. There are lectures you barely remember attending, quizzes every week, case reports piling up, and ward rounds that expect you to know everything. The pressure isn’t just academic — it’s mental, emotional, and constant. And somewhere in between, you're supposed to actually learn and retain all this? It’s not that you're not smart — you just need a system that actually works with your life.
              </p>
            </div>

            {/* The Solution */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-3 sm:mb-4">The Solution</h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Voidr health was built to make learning medicine less brutal — and a lot more human. Just type in the topic you’re stuck on — anything from thyroid panels to clinical pathways.

On clinicals or ward rounds? Upload or paste a document, and ClinicBot summarizes it in seconds — like a personal tutor who knows you’re short on time.

And now, there’s AskVoidr — your AI co-pilot for real-time medical reasoning and symptom analyzer. Just describe a patient symptoms, and AskVoidr walks you through differentials, red flags, and next steps — calmly, clearly, and without overwhelm.

And for hands-on learning? We’ve integrated Case Wise, the world’s most clinically accurate medical simulator — so you can practice decision-making in real scenarios, safely.
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
