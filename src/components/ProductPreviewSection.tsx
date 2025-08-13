
import React, { useState } from 'react';
import { LiquidCard } from '@/components/ui/liquid-glass-card';

const ProductPreviewSection = () => {
  const [activeTab, setActiveTab] = useState('ClinicBot');

  const products = {
    StudyWithAI: {
      title: 'StudyWithAI',
      subtitle: 'Turn any medical topic into a short, personalized video that actually makes sense.',
      features: ['Input topic, get video', 'Explains confusing med concepts', 'Trained on real med data', 'Personalized visual learning tool', 'Built for rapid clarity', 'Download in 720p or 1080p', 'Med school, but faster'],
      isComingSoon: true,
      mockup: (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-lg relative">
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Coming Soon
          </div>
          <div className="flex items-center space-x-2 mb-3 sm:mb-4 opacity-75">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded shadow-sm opacity-75">
            <div className="h-24 sm:h-32 bg-blue-200 rounded mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8" />
              </svg>
            </div>
            <div className="text-xs text-gray-600">AI Video Generation</div>
          </div>
        </div>
      )
    },
    ClinicBot: {
      title: 'ClinicBot',
      subtitle: 'Instantly convert long medical texts into clear, concise clinical notes.',
      features: ['Summarizes long scripts instantly', 'Bullet-point clinical notes output', 'Handles 2000+ word files', 'Upload PDFs, get summaries', 'Med-specific AI summarizer', 'Smarter than generic chatbots'],
      isComingSoon: false,
      mockup: (
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-lg">
          <div className="bg-white p-3 sm:p-4 rounded shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="text-xs text-gray-600">Clinical Notes</div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <section id="products" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-[#f8fbff] via-white to-[#f3fceb]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            See Voidr in Action
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our AI-powered tools can transform your medical education and practice.
          </p>
        </div>

        {/* Product Tabs */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          {Object.keys(products).map((productKey) => (
            <button
              key={productKey}
              onClick={() => setActiveTab(productKey)}
              className={`px-4 sm:px-6 py-3 rounded-full font-semibold transition-all w-full sm:w-auto min-h-[44px] relative ${
                activeTab === productKey
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              {productKey}
              {products[productKey as keyof typeof products].isComingSoon && (
                <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Active Product Display */}
        <div className="max-w-4xl mx-auto">
          <LiquidCard className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
              {/* Product Info */}
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {products[activeTab as keyof typeof products].title}
                  </h3>
                  {products[activeTab as keyof typeof products].isComingSoon && (
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                  {products[activeTab as keyof typeof products].subtitle}
                </p>
                <ul className="space-y-3">
                  {products[activeTab as keyof typeof products].features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Mockup */}
              <div className="order-1 md:order-2">
                {products[activeTab as keyof typeof products].mockup}
              </div>
            </div>
          </LiquidCard>
        </div>
      </div>
    </section>
  );
};

export default ProductPreviewSection;
