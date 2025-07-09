
import React from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Pricing = () => {
  const studyWithAIPlans = [
    {
      name: 'Free',
      price: 0,
      period: 'month',
      features: ['2 AI videos', '720p quality', 'Watermark included'],
      isPopular: false,
    },
    {
      name: 'Student Pro',
      price: 9,
      period: 'month',
      features: ['30 AI videos', '1080p quality', 'No watermark'],
      isPopular: true,
    },
    {
      name: 'Study Beast',
      price: 19,
      period: 'month',
      features: ['Unlimited videos', 'Custom script uploads', 'Priority queue'],
      isPopular: false,
    },
  ];

  const clinicBotPlans = [
    {
      name: 'Free',
      price: 0,
      period: 'month',
      features: ['2 notes/month', 'Watermark included', 'No PDF export'],
      isPopular: false,
    },
    {
      name: 'Clinical Starter',
      price: 12,
      period: 'month',
      features: ['30 notes/month', 'Editable output', 'Basic templates'],
      isPopular: false,
    },
    {
      name: 'Resident Pro',
      price: 29,
      period: 'month',
      features: ['Unlimited notes', 'PDF export', 'Custom fields'],
      isPopular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#236dcf]">
      <DashboardSidebar />
      <div className="lg:ml-16 transition-all duration-300">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <h1 className="text-3xl font-bold text-black mb-4">Pricing Plans</h1>
              <p className="text-base text-black">Choose the perfect plan for your medical journey</p>
            </div>
            
            {/* StudyWithAI Pricing */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-6 text-center">StudyWithAI</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {studyWithAIPlans.map((plan) => (
                  <LiquidCard key={plan.name} className={`p-6 relative bg-white ${plan.isPopular ? 'border-2 border-blue-500' : ''}`}> 
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Popular
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-black mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-black">${plan.price}</span>
                        <span className="text-sm text-black">/{plan.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                          <span className="text-black text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.isPopular ? "default" : "outline"}>
                      {plan.price === 0 ? 'Get Started' : 'Choose Plan'}
                    </Button>
                  </LiquidCard>
                ))}
              </div>
            </div>
            
            {/* ClinicBot Pricing */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6 text-center">ClinicBot</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {clinicBotPlans.map((plan) => (
                  <LiquidCard key={plan.name} className={`p-6 relative bg-white ${plan.isPopular ? 'border-2 border-green-500' : ''}`}> 
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Popular
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-black mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-black">${plan.price}</span>
                        <span className="text-sm text-black">/{plan.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-black text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.isPopular ? "default" : "outline"}>
                      {plan.price === 0 ? 'Get Started' : 'Choose Plan'}
                    </Button>
                  </LiquidCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
