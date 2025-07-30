
import React from 'react';
import { TubelightNavbar } from '@/components/ui/tubelight-navbar';
import Footer from '@/components/Footer';
import { User } from 'lucide-react';

const AboutUs = () => {
  const navItems = [
    { 
      name: 'Products', 
      url: '#products',
      hasDropdown: true,
      dropdownItems: [
        { name: 'StudyWithAI', url: '#studywithai' },
        { name: 'ClinicBot', url: '#clinicbot' },
        { name: 'PathoSketch', url: '#pathosketch' }
      ]
    },
    { name: 'Pricing', url: '#pricing' },
    { name: 'Affiliates', url: '/affiliates' },
    { 
      name: 'About Us', 
      url: '/about',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Who We Are', url: '/about' },
        { name: 'Instagram', url: 'https://instagram.com' },
        { name: 'Twitter', url: 'https://twitter.com' }
      ]
    },
    { name: 'Login', url: '/auth', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-white to-[#f3fceb]">
      <TubelightNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">About Us</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-white/20">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Voidr.health was born out of frustration; the kind every medical student knows too well. 
                Endless PDF's. Overwhelming lectures. Concepts that don't click no matter how many times you reread them.
              </p>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                We're not just building an AI tool. We're building the study tool we wish we had; a way to turn 
                dense medical topics into short, clear, animated videos with voiceovers and captions in seconds.
              </p>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Powered by OpenAI, RunwayML and ElevenLabs, Voidr.health makes learning feel human again with 
                visual, digestible and made for how your brain actually learns. Whether you're preparing for 
                tomorrow's exam or trying to finally understand that one topic that never made sense, Voidr gives 
                your clarity fast.
              </p>
              
              <p className="text-xl text-gray-700 leading-relaxed font-semibold">
                We're medical students too. We get it. And we're building this with one goal: To help you survive 
                med school and maybe even enjoy the process.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
