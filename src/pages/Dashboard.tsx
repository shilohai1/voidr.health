
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Brain, 
  Activity,
  ArrowRight, 
  Sparkles,
  Clock,
  LogOut
} from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { useUserContent } from '@/hooks/useUserContent';
import { Link, useNavigate } from 'react-router-dom';
import SymptomAnalyzerCard from '@/components/SymptomAnalyzerCard';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { content, loading } = useUserContent();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access your dashboard</h1>
          <Link to="/auth">
            <LiquidButton>Sign In</LiquidButton>
          </Link>
        </div>
      </div>
    );
  }

  // Mock symptom analysis count for now - this would come from actual symptom entries
  const symptomAnalysisCount = 0;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#5fcfb9",
        backgroundImage:
          "linear-gradient(246deg, rgba(95, 207, 185, 1) 0%, rgba(88, 177, 209, 1) 100%)",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header with Logout Button */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <picture>
              <source srcSet="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.webp" type="image/webp" />
              <img 
                src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" 
                alt="VOIDR" 
                className="h-12 w-auto mr-4"
              />
            </picture>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, {user.user_metadata?.name || user.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-white/80 text-lg">Your AI-powered medical companion</p>
            </div>
          </div>
          
          {/* Logout Button */}
          <LiquidButton
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 flex items-center gap-2 self-start md:self-auto"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </LiquidButton>
        </div>

        {/* Quick Stats */}
        {!loading && content && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-white/80" />
                <div className="text-2xl font-bold">{content.total_summaries}</div>
                <div className="text-sm text-white/70">Documents Summarized</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Activity className="w-8 h-8 mx-auto mb-2 text-white/80" />
                <div className="text-2xl font-bold">{symptomAnalysisCount}</div>
                <div className="text-sm text-white/70">Symptoms Analyzed</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-white/80" />
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-white/70">AI Availability</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* ClinicBot Card */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                Document AI
              </Badge>
            </div>
            
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-xl mr-4 group-hover:bg-green-200 transition-colors">
                  <FileText className="w-6 md:w-8 h-6 md:h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">ClinicBot</h3>
                  <p className="text-green-600 font-medium">Smart Summarization</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                Transform lengthy medical documents, research papers, and case studies into 
                concise, actionable summaries. Perfect for busy healthcare professionals 
                and medical students.
              </p>
              
              <div className="space-y-3 mb-6 md:mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  AI-powered document analysis
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Medical terminology expertise
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Instant PDF downloads
                </div>
              </div>
              
              <Link to="/study-with-ai">
                <LiquidButton className="w-full group bg-green-600 hover:bg-green-700 text-white">
                  Launch ClinicBot
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </LiquidButton>
              </Link>
            </CardContent>
          </Card>

          {/* AskVoidr Symptom Analyzer Card */}
          <SymptomAnalyzerCard />

          {/* Case Wise Card */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                Simulation
              </Badge>
            </div>
            
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange-100 rounded-xl mr-4 group-hover:bg-orange-200 transition-colors">
                  <Brain className="w-6 md:w-8 h-6 md:h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Case Wise</h3>
                  <p className="text-orange-600 font-medium">Medical Simulator</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                Practice clinical reasoning with realistic patient scenarios. From history-taking 
                to diagnosis and management - sharpen your medical skills with AI-powered cases.
              </p>
              
              <div className="space-y-3 mb-6 md:mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  Interactive patient scenarios
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  Real-time AI feedback
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  Progress tracking
                </div>
              </div>
              
              <Link to="/case-wise">
                <LiquidButton className="w-full group bg-orange-600 hover:bg-orange-700 text-white">
                  Start Simulation
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </LiquidButton>
              </Link>
            </CardContent>
          </Card>

          {/* StudyWithAI - Coming Soon Card */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 opacity-75">
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
                Coming Soon
              </Badge>
            </div>
            
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gray-100 rounded-xl mr-4">
                  <Sparkles className="w-6 md:w-8 h-6 md:h-8 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-600 mb-1">StudyWithAI</h3>
                  <p className="text-gray-500 font-medium">Advanced Study Tools</p>
                </div>
              </div>
              
              <p className="text-gray-500 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                Enhanced AI-powered study tools and learning resources to accelerate your 
                medical education journey. More features coming soon!
              </p>
              
              <LiquidButton className="w-full bg-gray-300 text-gray-600 cursor-not-allowed">
                Coming Soon
                <Clock className="w-4 h-4 ml-2" />
              </LiquidButton>
            </CardContent>
          </Card>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              Ready to Transform Your Medical Practice?
            </h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto text-sm md:text-base">
              Join thousands of healthcare professionals who trust VOIDR for their daily medical tasks. 
              Experience the future of medical AI today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/study-with-ai">
                <LiquidButton className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  Start with ClinicBot
                </LiquidButton>
              </Link>
              <Link to="/case-wise">
                <LiquidButton className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  Try Case Simulation
                </LiquidButton>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
