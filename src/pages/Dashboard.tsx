
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { Video, FileText } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      <DashboardSidebar />
      
      <div className="ml-16 p-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Choose your Service</h1>
          </div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* StudyWithAI Card */}
            <LiquidCard className="w-full p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Video className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">StudyWithAI</h3>
                    <p className="text-gray-600">Generate AI-powered explainer videos</p>
                  </div>
                </div>
                
                <p className="text-gray-700">
                  Create short educational medical videos instantly based on your prompts. 
                  Perfect for visual learners who want quick, comprehensive explanations.
                </p>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    AI-powered video generation
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Medical concepts simplified
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Multiple quality options
                  </li>
                </ul>

                <Link to="/study-with-ai">
                  <LiquidButton className="w-full">
                    View StudyWithAI
                  </LiquidButton>
                </Link>
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
                    <h3 className="text-2xl font-bold text-gray-900">ClinicBot</h3>
                    <p className="text-gray-600">Streamline clinical documentation</p>
                  </div>
                </div>
                
                <p className="text-gray-700">
                  Summarise your clinic files, lecture notes and documents into short, 
                  actionable notes with AI assistance.
                </p>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Automated note taking
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Clinical decision support
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Multiple export formats
                  </li>
                </ul>

                <Link to="/clinic-bot">
                  <LiquidButton className="w-full">
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
