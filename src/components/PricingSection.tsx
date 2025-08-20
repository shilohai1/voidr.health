
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { handleCheckoutRedirect } from '@/utils/checkoutRedirect';
import { useNavigate } from 'react-router-dom';

const PricingSection = () => {
  const [selectedProduct, setSelectedProduct] = useState('ClinicBot');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlanClick = (productName: string, planName: string, price: number) => {
    if (price === 0) {
      let redirectUrl = '/dashboard';
      if (productName === 'ClinicBot') redirectUrl = '/ClinicBot';
      else if (productName === 'CaseWise') redirectUrl = '/CaseWise';
      else if (productName === 'AskVoidr') redirectUrl = '/SymptomChecker';
      navigate(`/auth?redirect=${redirectUrl}`);
      return;
    }

    // Map (product, plan) to checkoutUrls key
    let planKey: keyof typeof import('@/utils/checkoutRedirect').checkoutUrls | null = null;
    if (productName === 'ClinicBot' && planName === 'Clinical Starter') planKey = 'clinical_starter';
    else if (productName === 'ClinicBot' && planName === 'Clinical Pro') planKey = 'clinical_pro';
    else if (productName === 'CaseWise' && planName === 'Wise Starter') planKey = 'wise_starter';
    else if (productName === 'CaseWise' && planName === 'Wise Pro') planKey = 'wise_pro';
    // Removed Launch Bundle logic
    // Only allow upgrade if user is logged in
    // If not logged in, redirect to login/signup before checkout
    if (planKey) {
      handleCheckoutRedirect(planKey, !!user);
    }
  }

  const products = {
    ClinicBot: {
      name: 'ClinicBot',
      isComingSoon: false,
      plans: [
        {
          name: 'Free',
          price: 0,
          period: 'month',
          features: ['2 notes/month', 'No PDF export'],
          buttonText: 'Get Started',
          isPopular: false,
          disabled: false,
        },
        {
          name: 'Clinical Starter',
          price: 12,
          period: 'month',
          features: ['30 notes/month', 'PDF download'],
          buttonText: 'Choose Plan',
          isPopular: false,
          disabled: false,
        },
        {
          name: 'Clinical Pro',
          price: 29,
          period: 'month',
          features: ['Unlimited notes', 'PDF download'],
          buttonText: 'Choose Plan',
          isPopular: true,
          disabled: false,
        },
      ],
    },
    CaseWise: {
      name: 'Case Wise',
      isComingSoon: false,
      plans: [
        {
          name: 'Free',
          price: 0,
          period: 'month',
          features: ['5 simulations/month'],
          buttonText: 'Get Started',
          isPopular: false,
          disabled: false,
        },
        {
          name: 'Wise Starter',
          price: 19,
          period: 'month',
          features: ['30 simulations/month'],
          buttonText: 'Choose Plan',
          isPopular: false,
          disabled: false,
        },
        {
          name: 'Wise Pro',
          price: 29,
          period: 'month',
          features: ['Unlimited simulations'],
          buttonText: 'Choose Plan',
          isPopular: true,
          disabled: false,
        },
      ],
    },
    AskVoidr: {
      name: 'AskVoidr',
      isComingSoon: false,
      plans: [
        {
          name: 'Free',
          price: 0,
          period: 'month',
          features: [
            'Unlimited symptom analysis',
            'AI-powered health insights',
            'Instant responses',
            'User-friendly interface',
            'Available 24/7'
          ],
          buttonText: 'Get Started',
          isPopular: true,
          disabled: false,
        }
      ],
    },
  };

  return (
     <section id="pricing" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-[#0f1726] to-[#0f1726]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg sm:text-xl text-white max-w-3xl mx-auto">
            Start free, upgrade when you're ready. Flexible pricing for every stage of your medical journey.
          </p>
        </div>

        {/* Product Selector */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          {Object.keys(products).map((product) => (
            <button
              key={product}
              onClick={() => setSelectedProduct(product)}
              className={cn(
                "px-4 sm:px-6 py-3 rounded-full font-semibold transition-all w-full sm:w-auto min-h-[44px] relative",
                selectedProduct === product
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200",
                product === 'LaunchBundle' && "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
              )}
            >
              {product === 'LaunchBundle' ? 'Launch Bundle 🚀' : product}
              {product === 'LaunchBundle' && (
                <span className="ml-2 text-xs bg-white text-orange-600 px-2 py-1 rounded-full font-bold">
                  Limited
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className={cn(
          "grid gap-4 sm:gap-6 max-w-6xl mx-auto",
          selectedProduct === 'AskVoidr' || selectedProduct === 'LaunchBundle' ? "grid-cols-1 justify-center max-w-md mx-auto" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}>
          {products[selectedProduct as keyof typeof products].plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "relative rounded-2xl border p-4 sm:p-6 bg-white/80 backdrop-blur-sm",
                plan.isPopular ? "border-primary border-2 shadow-xl" : "border-gray-200 shadow-lg",
                plan.disabled && "opacity-75",
                selectedProduct === 'LaunchBundle' && "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {selectedProduct === 'LaunchBundle' ? 'Limited Time' : 'Popular'}
                </div>
              )}

              {selectedProduct === 'LaunchBundle' && (
                <div className="absolute -top-3 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Until Aug 15th
                </div>
              )}

              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600 text-sm">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={cn(
                  "w-full min-h-[44px]",
                  plan.isPopular && !plan.disabled
                    ? "bg-primary hover:bg-primary/90" 
                    : "bg-gray-900 hover:bg-gray-800",
                  plan.disabled && "opacity-50 cursor-not-allowed"
                )}
                disabled={plan.disabled}
                onClick={() => handlePlanClick(selectedProduct, plan.name, plan.price)}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
