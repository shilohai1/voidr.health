
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
                Voidr Health is a study tool that was born not out of spontaneity. It was created purely out of desperation and frustration, the type almost 98% of medical students can relate to. 
                Endless PDF’s, the one’s where one PDF leads to another and so on. And concepts? they don’t click no matter how many times you reread them.
              </p>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                We’re not just building an AI tool here. We’re building a study tool that we wish we had in med school, the one’s where thick medical topics are shortened, clear and symptoms are easily analyzed in just few seconds.
              </p>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Powered by OpenAI, Voidr Health makes learning feel human again with note summarizer, symptom analysis and clinical case simulator, designed in a way where your brain actually would want to learn unlike the traditional spoon-feeding method. Whether you’re preparing for tomorrow’s exam or trying to finally understand that one topic that never made sense, Voidr Health gives your clarity fast.
              </p>
              
              <p className="text-xl text-gray-700 leading-relaxed font-semibold">
                We're medical students too. We get it. And we're building this with one goal: To help you survive 
                med school and maybe even enjoy during the process.
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
