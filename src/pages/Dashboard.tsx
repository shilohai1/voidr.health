
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { Video, FileText, Stethoscope } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#236dcf]">
      <DashboardSidebar />
      
      <div className="lg:ml-16 transition-all duration-300">
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 px-4 py-8 lg:px-8 lg:py-12">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8 lg:mb-12 text-center">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4">Choose your Service</h1>
              </div>

              {/* Service Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                {/* StudyWithAI Card - Coming Soon */}
                <LiquidCard className="w-full p-6 relative">
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Coming Soon
                  </div>
                  <div className="space-y-6 opacity-75">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Video className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900">StudyWithAI</h3>
                        <p className="text-sm lg:text-base text-gray-600">Generate AI-powered explainer videos</p>
                      </div>
                    </div>
                    
                    <p className="text-sm lg:text-base text-gray-700">
                      Create short educational medical videos instantly based on your prompts. 
                      Perfect for visual learners who want quick, comprehensive explanations.
                    </p>
                    
                    <ul className="space-y-2 text-xs lg:text-sm text-gray-600">
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

                    <LiquidButton 
                      className="w-full min-h-[44px] opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Coming Soon
                    </LiquidButton>
                  </div>
                </LiquidCard>

                {/* ClinicBot Card */}
                <LiquidCard className="w-full p-6">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FileText className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900">ClinicBot</h3>
                        <p className="text-sm lg:text-base text-gray-600">Streamline clinical documentation</p>
                      </div>
                    </div>
                    
                    <p className="text-sm lg:text-base text-gray-700">
                      Summarise your clinic files, lecture notes and documents into short, 
                      actionable notes with AI assistance.
                    </p>
                    
                    <ul className="space-y-2 text-xs lg:text-sm text-gray-600">
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

                {/* Case Wise Card */}
                <LiquidCard className="w-full p-6">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Stethoscope className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Case Wise</h3>
                        <p className="text-sm lg:text-base text-gray-600">Interactive medical simulator</p>
                      </div>
                    </div>
                    
                    <p className="text-sm lg:text-base text-gray-700">
                      Practice clinical reasoning with AI-generated patient scenarios. 
                      Perfect for USMLE, OSCE, and PLAB preparation.
                    </p>
                    
                    <ul className="space-y-2 text-xs lg:text-sm text-gray-600">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                        Real-world medical cases
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                        Instant AI feedback
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                        Progress tracking
                      </li>
                    </ul>

                    <Link to="/case-wise" className="block">
                      <LiquidButton className="w-full min-h-[44px]">
                        Begin Simulation
                      </LiquidButton>
                    </Link>
                  </div>
                </LiquidCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
