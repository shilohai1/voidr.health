
import React, { useState } from 'react';
import { LiquidCard } from '@/components/ui/liquid-glass-card';

const ProductPreviewSection = () => {
  const [activeTab, setActiveTab] = useState('StudyWithAI');

  const products = {
    StudyWithAI: {
      title: 'StudyWithAI',
      subtitle: 'Generate AI-powered explainer videos from lecture slides.',
      features: ['AI explainer videos', 'Medical concepts simplified'],
      mockup: (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="h-32 bg-blue-200 rounded mb-3 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      subtitle: 'Streamline clinical documentation with AI assistance.',
      features: ['Automated note taking', 'Clinical decision support'],
      mockup: (
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
          <div className="bg-white p-4 rounded shadow-sm">
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
    <section id="products" className="py-20 px-4 bg-gradient-to-br from-[#f8fbff] via-white to-[#f3fceb]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            See Voidr in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our AI-powered tools can transform your medical education and practice.
          </p>
        </div>

        {/* Product Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(products).map((productKey) => (
            <button
              key={productKey}
              onClick={() => setActiveTab(productKey)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeTab === productKey
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              {productKey}
            </button>
          ))}
        </div>

        {/* Active Product Display */}
        <div className="max-w-4xl mx-auto">
          <LiquidCard className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Product Info */}
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {products[activeTab as keyof typeof products].title}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  {products[activeTab as keyof typeof products].subtitle}
                </p>
                <ul className="space-y-3">
                  {products[activeTab as keyof typeof products].features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Mockup */}
              <div>
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
