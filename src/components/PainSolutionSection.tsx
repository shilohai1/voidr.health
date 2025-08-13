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
                Let’s be honest. Medical training today isn’t just hard, it’s 
                <strong> relentless</strong>. You wake up already lagging behind. Lectures are all confusing, 
                quizzes drop every week, case reports pile up, and ward rounds want you to
                recall every detail. The workload isn’t only academic. It’s mental, 
                emotional, and constant. Somewhere in between, you’re expected to 
                <strong> absorb and retain a mountain of medical knowledge</strong>. 
                It’s not about intelligence. It’s about having a system that works with 
                your real life, not against it.
              </p>
            </div>

            {/* The Solution */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-3 sm:mb-4">
                The Solution: One AI Platform for Smarter, Faster Medical Learning
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                <strong>Voidr Health</strong> was built so med students, residents, and doctors 
                can learn and practice medicine without having to burn out.
                and get instant, clear explanations.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                On clinicals or ward rounds? Upload or paste your notes and 
                <strong> ClinicBot</strong> condenses them into a short, structured summary 
                in seconds. Just like a personal tutor who knows your time is limited.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Need help thinking like a clinician? <strong>AskVoidr</strong> is your AI 
                co-pilot for real-time symptom analysis and differential 
                reasoning. Just describe the patient’s symptoms, and it walks you through 
                possible causes, urgent red flags, and logical next steps, all while calmly, clearly, 
                and without overwhelm.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                For hands-on skill building, <strong>Case Wise</strong> lets you practice 
                clinical decision-making in realistic, timed scenarios, preparing you for 
                OSCEs, ward rounds, and real-world cases.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-semibold mt-4">
                All three tools work together so you can save hours, study smarter, and walk 
                into exams or patient care with confidence.
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
