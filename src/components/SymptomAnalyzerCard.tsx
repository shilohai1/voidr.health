
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { Link } from 'react-router-dom';

const SymptomAnalyzerCard = () => {
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-4 right-4">
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
          AI Analysis
        </Badge>
      </div>
      
      <CardContent className="p-8">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-blue-100 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">AskVoidr</h3>
            <p className="text-blue-600 font-medium">Symptom Analyzer</p>
          </div>
        </div>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Get instant AI-powered symptom analysis and health insights. Our intelligent system 
          helps you understand potential conditions and provides educational health information 
          based on your symptoms.
        </p>
        
        <div className="space-y-3 mb-8">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            Intelligent symptom pattern recognition
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            Educational health insights and recommendations
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            Quick and confidential analysis
          </div>
        </div>
        
        <Link to="/symptom-checker">
          <LiquidButton className="w-full group bg-blue-600 hover:bg-blue-700 text-white">
            Start AskVoidr
          </LiquidButton>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SymptomAnalyzerCard;
