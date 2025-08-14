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
              <h3 className="text-xl sm:text-2xl font-bold text-red-600 mb-3 sm:mb-4">
                The Problem: Overwhelmed, Overworked, and Falling Behind
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Struggling with relentless med school stress? You’re not alone. Endless lectures, weekly quizzes, and high-pressure wards make it feel impossible to keep up. The real challenge isn’t just learning. It’s absorbing and retaining an avalanche of medical knowledge while juggling constant mental and emotional demands. <strong>What if your study system actually worked for your real life, not against it?</strong>
              </p>
            </div>

            {/* The Solution */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-3 sm:mb-4">
                The Solution: One AI Platform for Smarter, Faster Medical Learning
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                <strong>Voidr Health</strong> empowers med students, residents, and doctors to master medicine without burnout. Get instant, clear explanations anytime, anywhere.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                <strong>ClinicBot</strong>: Upload your notes and get fast, structured summaries, just like a personal tutor who values your time.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                <strong>AskVoidr</strong>: Describe patient symptoms and unlock real-time clinical insights, differential diagnoses, and quick next steps, all calmly, clearly, and stress-free.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                <strong>Case Wise</strong>: Train clinical skills in realistic scenarios, so you’ll crush OSCEs, ward rounds, and patient care.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-semibold mt-4">
                Save hours, study smarter, and step into exams or clinics with total confidence.
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
