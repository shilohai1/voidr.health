
import React from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { Check, Star, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Pricing = () => {
  const clinicBotPlans = [
    {
      name: 'Free',
      price: 0,
      period: 'month',
      features: ['2 notes/month', 'No PDF export'],
      isPopular: false,
      checkoutUrl: null,
    },
    {
      name: 'Clinical Starter',
      price: 12,
      period: 'month',
      features: ['30 notes/month', 'PDF download'],
      isPopular: true,
      checkoutUrl: 'https://buy.polar.sh/polar_cl_cV1a6rzBp9o3R2OjH6F0pIxNevppLcd1n0sff0I5eGI',
    },
    {
      name: 'Clinical Pro',
      price: 29,
      period: 'month',
      features: ['Unlimited Notes', 'PDF Download'],
      isPopular: false,
      checkoutUrl: 'https://buy.polar.sh/polar_cl_w58BlnB3fhSZhMK07JZGA3EuocVjS1HppU1U14AtqHe',
    },
  ];

  const caseWisePlans = [
    {
      name: 'Free',
      price: 0,
      period: 'month',
      features: ['5 simulations/month'],
      isPopular: false,
      checkoutUrl: null,
    },
    {
      name: 'Wise Starter',
      price: 19,
      period: 'month',
      features: ['30 simulations/month'],
      isPopular: true,
      checkoutUrl: 'https://buy.polar.sh/polar_cl_qZEyoG4QHG5584E73QQ28Py5Pt77MYeUnAgQv1vj8MK',
    },
    {
      name: 'Wise Pro',
      price: 29,
      period: 'month',
      features: ['Unlimited Simulations'],
      isPopular: false,
      checkoutUrl: 'https://buy.polar.sh/polar_cl_xB2RTXzohCHZmp9I6kzrCZwqxFgYHvUIuUhTM0dAoZl',
    },
  ];

  const askVoidrPlans = [
    {
      name: 'Free',
      price: 0,
      period: 'month',
      features: [
        'Unlimited symptom analysis',
        'AI-powered health insights',
        'Instant Responses',
        'User-Friendly interface',
        'Available 24/7'
      ],
      isPopular: false,
      checkoutUrl: null,
    },
  ];

  const handleCheckout = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div 
      className="min-h-screen flex"
      style={{
        backgroundColor: "#5fcfb9",
        backgroundImage:
          "linear-gradient(246deg, rgba(95, 207, 185, 1) 0%, rgba(88, 177, 209, 1) 100%)",
      }}
    >
      <DashboardSidebar />
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Pricing Plans</h1>
            <p className="text-white/80 text-lg">Choose the perfect plan for your medical journey</p>
          </div>
          
          {/* ClinicBot Pricing */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">ClinicBot</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {clinicBotPlans.map((plan) => (
                <LiquidCard key={plan.name} className={`p-6 lg:p-8 relative bg-white/95 backdrop-blur-sm ${plan.isPopular ? 'border-2 border-green-500 shadow-xl' : 'border border-white/30'}`}> 
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl lg:text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-sm lg:text-base text-gray-600">/{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm lg:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.checkoutUrl ? (
                    <Button 
                      onClick={() => handleCheckout(plan.checkoutUrl!)}
                      className={`w-full ${plan.isPopular ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} transition-all duration-200 hover:scale-105`}
                    >
                      Choose Plan
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200"
                      disabled
                    >
                      Current Plan
                    </Button>
                  )}
                </LiquidCard>
              ))}
            </div>
          </div>
          
          {/* Case Wise Pricing */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Case Wise</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {caseWisePlans.map((plan) => (
                <LiquidCard key={plan.name} className={`p-6 lg:p-8 relative bg-white/95 backdrop-blur-sm ${plan.isPopular ? 'border-2 border-blue-500 shadow-xl' : 'border border-white/30'}`}> 
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl lg:text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-sm lg:text-base text-gray-600">/{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm lg:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.checkoutUrl ? (
                    <Button 
                      onClick={() => handleCheckout(plan.checkoutUrl!)}
                      className={`w-full ${plan.isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'} transition-all duration-200 hover:scale-105`}
                    >
                      Choose Plan
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200"
                      disabled
                    >
                      Current Plan
                    </Button>
                  )}
                </LiquidCard>
              ))}
            </div>
          </div>

          {/* AskVoidr Pricing */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">AskVoidr</h2>
            <div className="max-w-2xl mx-auto">
              {askVoidrPlans.map((plan) => (
                <LiquidCard key={plan.name} className="p-6 lg:p-8 bg-white/95 backdrop-blur-sm border border-white/30"> 
                  <div className="text-center mb-6">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl lg:text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-sm lg:text-base text-gray-600">/{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm lg:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200"
                    disabled
                  >
                    Always Free
                  </Button>
                </LiquidCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
