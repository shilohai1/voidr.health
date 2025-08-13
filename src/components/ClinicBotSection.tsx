
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Clock, Brain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClinicBotSection = () => {
  const scrollToClinicBot = () => {
    const element = document.getElementById('clinicbot-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="clinicbot-section" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-t-[50px]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="text-center"> {/* Added text-center */}
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                ClinicBot - Your AI Medical Note Summarizer
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                ClinicBot turns long, complex medical documents into clear, concise, and 
                medically accurate summaries all in seconds. Upload lecture notes, ward 
                round reports, or patient charts, and get instant, high precision notes 
                you can download as clean PDFs. Perfect for busy med students and 
                healthcare professionals who need accuracy without wasting time.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">AI-Powered Analysis</h3>
                  <p className="text-sm text-gray-600">Advanced medical AI understands complex terminology</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Lightning Fast</h3>
                  <p className="text-sm text-gray-600">Get summaries in seconds, not hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Medical Accuracy</h3>
                  <p className="text-sm text-gray-600">Preserves critical medical information and context</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">PDF Export</h3>
                  <p className="text-sm text-gray-600">Download clean, professional PDFs instantly</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center"> {/* Added flex and justify-center */}
              <Link to="/clinic-bot">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                  Try ClinicBot Free - Start Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Product Demo Image */}
          <div className="lg:order-first flex justify-center items-center">
            <div className="relative w-full max-w-[800px]">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-20"></div>
              <img
                src="/lovable-uploads/ef109c7d-da65-4b73-8c54-766471cc628c.png"
                alt="ClinicBot Interface Demo"
                className="relative w-full h-auto object-contain rounded-2xl shadow-2xl border border-green-200"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicBotSection;
