
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const PricingSection = () => {
  const [selectedProduct, setSelectedProduct] = useState('StudyWithAI');

  const products = {
    StudyWithAI: {
      name: 'StudyWithAI',
      plans: [
        {
          name: 'Free',
          price: 0,
          period: 'month',
          features: ['2 AI videos', '720p quality', 'Watermark included'],
          buttonText: 'Get Started',
          isPopular: false,
        },
        {
          name: 'Student Pro',
          price: 9,
          period: 'month',
          features: ['30 AI videos', '1080p quality', 'No watermark'],
          buttonText: 'Choose Plan',
          isPopular: true,
        },
        {
          name: 'Study Beast',
          price: 19,
          period: 'month',
          features: ['Unlimited videos', 'Custom script uploads', 'Priority queue'],
          buttonText: 'Choose Plan',
          isPopular: false,
        },
      ],
    },
    ClinicBot: {
      name: 'ClinicBot',
      plans: [
        {
          name: 'Free',
          price: 0,
          period: 'month',
          features: ['2 notes/month', 'Watermark included', 'No PDF export'],
          buttonText: 'Get Started',
          isPopular: false,
        },
        {
          name: 'Clinical Starter',
          price: 12,
          period: 'month',
          features: ['30 notes/month', 'Editable output', 'Basic templates'],
          buttonText: 'Choose Plan',
          isPopular: false,
        },
        {
          name: 'Resident Pro',
          price: 29,
          period: 'month',
          features: ['Unlimited notes', 'PDF export', 'Custom fields'],
          buttonText: 'Choose Plan',
          isPopular: true,
        },
        {
          name: 'Emergency Mode',
          price: 59,
          period: 'month',
          features: ['24-hour-on-call AI', 'Priority support', 'Custom integrations'],
          buttonText: 'Choose Plan',
          isPopular: false,
        },
      ],
    },
  };

  return (
     <section id="pricing" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-[#0f1726] to-[#0f1726]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
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
                "px-4 sm:px-6 py-3 rounded-full font-semibold transition-all w-full sm:w-auto min-h-[44px]",
                selectedProduct === product
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              )}
            >
              {product}
            </button>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {products[selectedProduct as keyof typeof products].plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "relative rounded-2xl border p-4 sm:p-6 bg-white/80 backdrop-blur-sm",
                plan.isPopular ? "border-primary border-2 shadow-xl" : "border-gray-200 shadow-lg"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Popular
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
                  plan.isPopular 
                    ? "bg-primary hover:bg-primary/90" 
                    : "bg-gray-900 hover:bg-gray-800"
                )}
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
