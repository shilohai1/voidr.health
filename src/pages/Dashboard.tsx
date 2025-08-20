import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Brain, 
  Activity,
  ArrowRight,
  Sparkles,
  Clock
} from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { useUserContent } from '@/hooks/useUserContent';
import { Link } from 'react-router-dom';
import SymptomAnalyzerCard from '@/components/SymptomAnalyzerCard';
import DashboardSidebar from '@/components/DashboardSidebar';
import AdminCreditMonitor from '@/components/AdminCreditMonitor';

const DashboardContent = ({ user, content }: any) => {
  console.log('DashboardContent: Rendering with content:', { content });
  
  // Mock symptom analysis count for now
  const symptomAnalysisCount = 0;

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />
      <div
        className="flex-1"
        style={{
          backgroundColor: "#5fcfb9",
          backgroundImage:
            "linear-gradient(246deg, rgba(95, 207, 185, 1) 0%, rgba(88, 177, 209, 1) 100%)",
        }}
      >
        {/* Admin Credit Monitor - Only visible to admin */}
        <AdminCreditMonitor />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Welcome back, {user.user_metadata?.name || user.email?.split('@')[0]}! 👋🏻
                </h1>
                <p className="text-white/80 text-lg">Your AI-powered medical companion</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
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
                
                <Link to="/clinic-bot">
                  <LiquidButton className="w-full group bg-green-600 hover:bg-green-700 text-white">
                    Launch ClinicBot
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
                
                <p className="text-orange-500 italic text-xs mb-6 md:mb-8">
                  DISCLAIMER: All characters used in this simulation are fictional and AI generated and does not represent anyone in real life.
                </p>
                
                <div className="space-y-3 mb-6 md:mb-8">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    Interactive patient cases
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    Real-time feedback
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    Progress tracking
                  </div>
                </div>
                
                <Link to="/case-wise">
                  <LiquidButton className="w-full group bg-orange-600 hover:bg-orange-700 text-white">
                    Start Simulation
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
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { content, loading, error } = useUserContent();
  const [renderError, setRenderError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('Dashboard: Component mounted', { user, loading, error });
  }, []);

  useEffect(() => {
    console.log('Dashboard: State changed', { user, loading, error, content });
  }, [user, loading, error, content]);

  try {
    // Not authenticated
    if (!user) {
      console.log('Dashboard: No user, showing sign in message');
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

    // Loading state
    if (loading) {
      console.log('Dashboard: Loading content');
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5fcfb9] to-[#58b1d1]">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Loading Dashboard...</h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      );
    }

    // Error state
    if (error || renderError) {
      console.error('Dashboard: Error state', { error, renderError });
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
            <p className="text-gray-600 mb-4">{error || renderError?.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    // Render main content
    console.log('Dashboard: Rendering main content');
    return <DashboardContent user={user} content={content} />;
  } catch (error) {
    console.error('Dashboard: Render error caught:', error);
    setRenderError(error as Error);
    return null;
  }
};

export default Dashboard;
