
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { Video, FileText } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#236dcf]">
      <DashboardSidebar />
      
      <div className="lg:ml-16 p-4 sm:p-6 md:p-8 pt-16 lg:pt-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">Choose your Service</h1>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* StudyWithAI Card */}
            <LiquidCard className="w-full p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                    <Video className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">StudyWithAI</h3>
                    <p className="text-sm sm:text-base text-gray-600">Generate AI-powered explainer videos</p>
                  </div>
                </div>
                
                <p className="text-sm sm:text-base text-gray-700">
                  Create short educational medical videos instantly based on your prompts. 
                  Perfect for visual learners who want quick, comprehensive explanations.
                </p>
                
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                    AI-powered video generation
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                    Medical concepts simplified
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                    Multiple quality options
                  </li>
                </ul>

                <Link to="/study-with-ai" className="block">
                  <LiquidButton className="w-full min-h-[44px]">
                    View StudyWithAI
                  </LiquidButton>
                </Link>
              </div>
            </LiquidCard>

            {/* ClinicBot Card */}
            <LiquidCard className="w-full p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">ClinicBot</h3>
                    <p className="text-sm sm:text-base text-gray-600">Streamline clinical documentation</p>
                  </div>
                </div>
                
                <p className="text-sm sm:text-base text-gray-700">
                  Summarise your clinic files, lecture notes and documents into short, 
                  actionable notes with AI assistance.
                </p>
                
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    Automated note taking
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    Clinical decision support
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    Multiple export formats
                  </li>
                </ul>

                <Link to="/clinic-bot" className="block">
                  <LiquidButton className="w-full min-h-[44px]">
                    View ClinicBot
                  </LiquidButton>
                </Link>
              </div>
            </LiquidCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
