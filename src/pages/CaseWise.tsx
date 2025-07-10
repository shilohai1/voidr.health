import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Clock, 
  Heart, 
  Activity, 
  Thermometer, 
  User,
  Stethoscope,
  Brain,
  Award,
  ChevronRight,
  Play,
  RotateCcw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { toast } from 'sonner';

interface CaseScenario {
  id: string;
  patient_name: string;
  age: number;
  gender: string;
  presenting_complaint: string;
  vitals: any;
  context: string;
  medical_history: string;
  correct_diagnosis: string;
  difficulty_level: string;
  urgency_level: string;
}

interface CaseAttempt {
  id?: string;
  scenario_id: string;
  questions_asked: string[];
  investigations_ordered: string[];
  user_diagnosis: string;
  management_plan: string[];
  score: number;
  time_taken: number;
  completed: boolean;
}

interface UserStats {
  total_cases: number;
  completed_cases: number;
  average_score: number;
  current_streak: number;
  best_streak: number;
  cases_this_month: number;
}

const CaseWise = () => {
  const { user, profile } = useAuth();
  const [currentCase, setCurrentCase] = useState<CaseScenario | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<CaseAttempt | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [phase, setPhase] = useState<'menu' | 'case' | 'history' | 'investigations' | 'diagnosis' | 'feedback'>('menu');
  const [startTime, setStartTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [customDiagnosis, setCustomDiagnosis] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const availableQuestions = [
    "Can you tell me more about when this started?",
    "Do you have any past medical history?",
    "Are you taking any medications?",
    "Do you have any allergies?",
    "Does anything make it better or worse?",
    "Have you experienced this before?",
    "Any family history of similar problems?",
    "Any recent travel or sick contacts?",
    "Rate your pain from 1-10",
    "Any associated symptoms?"
  ];

  const availableInvestigations = [
    "Full Blood Count (CBC)",
    "Basic Metabolic Panel",
    "Liver Function Tests",
    "Cardiac Enzymes",
    "ECG",
    "Chest X-ray",
    "CT Head",
    "CT Chest/Abdomen/Pelvis",
    "Ultrasound",
    "Urinalysis",
    "Blood Cultures",
    "Arterial Blood Gas"
  ];

  const commonDiagnoses = [
    "Myocardial Infarction",
    "Pneumonia",
    "Appendicitis",
    "Stroke",
    "Sepsis", 
    "Gastroenteritis",
    "UTI",
    "Asthma Exacerbation",
    "Anxiety/Panic Attack",
    "Migraine"
  ];

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('case_wise_stats')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setUserStats(data);
      } else {
        // Initialize stats for new user
        const { error: rpcError } = await supabase.rpc('initialize_case_wise_stats', {
          user_uuid: user!.id
        });
        
        if (rpcError) {
          console.error('Error initializing stats:', rpcError);
        }
        
        setUserStats({
          total_cases: 0,
          completed_cases: 0,
          average_score: 0,
          current_streak: 0,
          best_streak: 0,
          cases_this_month: 0
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast.error('Failed to load user statistics');
    }
  };

  const generateNewCase = async () => {
    setLoading(true);
    try {
      console.log('Generating new case...');
      
      const { data, error } = await supabase.functions.invoke('generate-case', {
        body: { 
          action: 'generate-case',
          caseData: { difficulty: 'medium', specialty: 'general' }
        }
      });

      console.log('Response from generate-case:', data, error);

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data || !data.case) {
        throw new Error('No case data received');
      }

      setCurrentCase(data.case);
      setCurrentAttempt({
        scenario_id: data.case.id,
        questions_asked: [],
        investigations_ordered: [],
        user_diagnosis: '',
        management_plan: [],
        score: 0,
        time_taken: 0,
        completed: false
      });
      setStartTime(Date.now());
      setPhase('case');
      toast.success('New case generated successfully!');
    } catch (error) {
      console.error('Error generating case:', error);
      toast.error('Failed to generate case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = (question: string) => {
    if (currentAttempt) {
      setCurrentAttempt({
        ...currentAttempt,
        questions_asked: [...currentAttempt.questions_asked, question]
      });
      toast.success('Question asked!');
    }
  };

  const orderInvestigation = (investigation: string) => {
    if (currentAttempt) {
      setCurrentAttempt({
        ...currentAttempt,
        investigations_ordered: [...currentAttempt.investigations_ordered, investigation]
      });
      toast.success('Investigation ordered!');
    }
  };

  const submitDiagnosis = async (diagnosis: string) => {
    if (!currentAttempt || !currentCase) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const isCorrect = diagnosis.toLowerCase().includes(currentCase.correct_diagnosis.toLowerCase()) ||
                     currentCase.correct_diagnosis.toLowerCase().includes(diagnosis.toLowerCase());
    const score = calculateScore(isCorrect, timeSpent, currentAttempt.investigations_ordered.length);

    const finalAttempt = {
      ...currentAttempt,
      user_diagnosis: diagnosis,
      score,
      time_taken: timeSpent,
      completed: true
    };

    try {
      // Save attempt to database
      await supabase
        .from('case_attempts')
        .insert({
          user_id: user!.id,
          ...finalAttempt
        });

      // Update user stats
      await supabase.rpc('update_case_wise_stats', {
        user_uuid: user!.id,
        new_score: score,
        time_spent: timeSpent,
        completed: true
      });

      // Get AI feedback
      const { data } = await supabase.functions.invoke('generate-case', {
        body: {
          action: 'provide-feedback',
          caseData: { attempt: finalAttempt, scenario: currentCase }
        }
      });

      setFeedback(data?.feedback || 'Great work on completing this case!');
      setCurrentAttempt(finalAttempt);
      setPhase('feedback');
      fetchUserStats();
      
      toast.success(isCorrect ? 'Correct diagnosis!' : 'Case completed!');
    } catch (error) {
      console.error('Error submitting diagnosis:', error);
      toast.error('Failed to submit diagnosis');
    }
  };

  const calculateScore = (correct: boolean, timeSpent: number, investigationsCount: number) => {
    let score = correct ? 80 : 20;
    
    // Time bonus (faster = more points)
    if (timeSpent < 300) score += 15; // Under 5 minutes
    else if (timeSpent < 600) score += 10; // Under 10 minutes
    else if (timeSpent < 900) score += 5; // Under 15 minutes

    // Investigation efficiency (fewer unnecessary tests = more points)
    if (investigationsCount <= 3) score += 10;
    else if (investigationsCount <= 5) score += 5;

    return Math.min(100, Math.max(0, score));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'urgent': return 'bg-orange-500';
      default: return 'bg-green-500';
    }
  };

  const canAccessFeature = () => {
    if (!profile) return false;
    
    const casesThisMonth = userStats?.cases_this_month || 0;
    
    if (profile.is_premium) return true; // Premium users have access
    return casesThisMonth < 7; // Free users get 7 cases per month
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <LiquidCard className="max-w-md w-full mx-4 p-8 text-center">
          <Stethoscope className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Case Wise</h1>
          <p className="text-gray-600 mb-6">Please log in to access the medical simulator</p>
          <LiquidButton onClick={() => window.location.href = '/auth'}>
            Sign In
          </LiquidButton>
        </LiquidCard>
      </div>
    );
  }

  if (!canAccessFeature()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <LiquidCard className="max-w-md w-full mx-4 p-8 text-center">
          <Award className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Continue</h2>
          <p className="text-gray-600 mb-6">
            You've used all {userStats?.cases_this_month || 0}/7 free cases this month. 
            Upgrade to Premium for unlimited access!
          </p>
          <LiquidButton onClick={() => window.location.href = '/pricing'}>
            View Pricing
          </LiquidButton>
        </LiquidCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Stethoscope className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Case Wise</h1>
              <p className="text-gray-600">Interactive Medical Simulator</p>
            </div>
          </div>
          
          {userStats && (
            <LiquidCard className="p-4">
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-blue-600">{userStats.current_streak}</div>
                  <div className="text-gray-500">Streak</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">{Math.round(userStats.average_score)}%</div>
                  <div className="text-gray-500">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600">{userStats.completed_cases}</div>
                  <div className="text-gray-500">Completed</div>
                </div>
              </div>
            </LiquidCard>
          )}
        </div>

        {/* Main Content */}
        {phase === 'menu' && (
          <div className="max-w-4xl mx-auto">
            <LiquidCard className="p-8 text-center mb-8">
              <Brain className="w-20 h-20 text-blue-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Think Like a Doctor
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Practice clinical reasoning with AI-generated patient scenarios. 
                From history-taking to diagnosis and management - sharpen your medical skills 
                before stepping into the hospital.
              </p>
              
              <LiquidButton 
                onClick={generateNewCase}
                disabled={loading}
                className="text-lg px-8 py-4"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Generating Case...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Begin Simulation
                  </>
                )}
              </LiquidButton>
            </LiquidCard>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <LiquidCard className="p-6 text-center">
                <Activity className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Real Scenarios</h3>
                <p className="text-sm text-gray-600">AI-generated cases based on real medical conditions</p>
              </LiquidCard>
              
              <LiquidCard className="p-6 text-center">
                <Award className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Instant Feedback</h3>
                <p className="text-sm text-gray-600">Get detailed feedback on your clinical reasoning</p>
              </LiquidCard>
              
              <LiquidCard className="p-6 text-center">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Track Progress</h3>
                <p className="text-sm text-gray-600">Monitor your improvement over time</p>
              </LiquidCard>
            </div>
          </div>
        )}

        {phase === 'case' && currentCase && (
          <div className="max-w-4xl mx-auto">
            <LiquidCard className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <User className="w-8 h-8 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {currentCase.patient_name}
                    </h2>
                    <p className="text-gray-600">
                      {currentCase.age} year old {currentCase.gender}
                    </p>
                  </div>
                </div>
                <Badge className={getUrgencyColor(currentCase.urgency_level)}>
                  {currentCase.urgency_level}
                </Badge>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Presenting Complaint</h3>
                <p className="text-gray-700">{currentCase.presenting_complaint}</p>
              </div>

              {/* Vitals */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white p-3 rounded-lg border text-center">
                  <Thermometer className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <div className="text-sm font-medium">Temp</div>
                  <div className="text-xs text-gray-600">{currentCase.vitals.temperature}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border text-center">
                  <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <div className="text-sm font-medium">BP</div>
                  <div className="text-xs text-gray-600">{currentCase.vitals.blood_pressure}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border text-center">
                  <Activity className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-sm font-medium">HR</div>
                  <div className="text-xs text-gray-600">{currentCase.vitals.heart_rate}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border text-center">
                  <Activity className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <div className="text-sm font-medium">RR</div>
                  <div className="text-xs text-gray-600">{currentCase.vitals.respiratory_rate}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border text-center">
                  <Activity className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-sm font-medium">O2 Sat</div>
                  <div className="text-xs text-gray-600">{currentCase.vitals.oxygen_saturation}</div>
                </div>
              </div>

              <div className="flex space-x-4">
                <LiquidButton onClick={() => setPhase('history')}>
                  Ask Questions
                  <ChevronRight className="w-4 h-4 ml-2" />
                </LiquidButton>
                <Button 
                  variant="outline" 
                  onClick={() => setPhase('investigations')}
                >
                  Order Tests
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setPhase('diagnosis')}
                >
                  Make Diagnosis
                </Button>
              </div>
            </LiquidCard>
          </div>
        )}

        {phase === 'history' && currentCase && currentAttempt && (
          <div className="max-w-4xl mx-auto">
            <LiquidCard className="p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">History Taking</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {availableQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left h-auto p-4"
                    onClick={() => askQuestion(question)}
                    disabled={currentAttempt.questions_asked.includes(question)}
                  >
                    {currentAttempt.questions_asked.includes(question) && (
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    )}
                    {question}
                  </Button>
                ))}
              </div>

              {currentAttempt.questions_asked.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Questions Asked:</h3>
                  <ul className="space-y-1">
                    {currentAttempt.questions_asked.map((q, index) => (
                      <li key={index} className="text-sm text-gray-700">• {q}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-4">
                <Button onClick={() => setPhase('case')}>Back to Case</Button>
                <LiquidButton onClick={() => setPhase('investigations')}>
                  Order Tests
                  <ChevronRight className="w-4 h-4 ml-2" />
                </LiquidButton>
              </div>
            </LiquidCard>
          </div>
        )}

        {phase === 'investigations' && currentCase && currentAttempt && (
          <div className="max-w-4xl mx-auto">
            <LiquidCard className="p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Investigations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {availableInvestigations.map((investigation, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left h-auto p-4"
                    onClick={() => orderInvestigation(investigation)}
                    disabled={currentAttempt.investigations_ordered.includes(investigation)}
                  >
                    {currentAttempt.investigations_ordered.includes(investigation) && (
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    )}
                    {investigation}
                  </Button>
                ))}
              </div>

              {currentAttempt.investigations_ordered.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Tests Ordered:</h3>
                  <ul className="space-y-1">
                    {currentAttempt.investigations_ordered.map((test, index) => (
                      <li key={index} className="text-sm text-gray-700">• {test}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-4">
                <Button onClick={() => setPhase('history')}>Back to History</Button>
                <LiquidButton onClick={() => setPhase('diagnosis')}>
                  Make Diagnosis
                  <ChevronRight className="w-4 h-4 ml-2" />
                </LiquidButton>
              </div>
            </LiquidCard>
          </div>
        )}

        {phase === 'diagnosis' && currentCase && (
          <div className="max-w-4xl mx-auto">
            <LiquidCard className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Final Diagnosis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {commonDiagnoses.map((diagnosis, index) => (
                  <LiquidButton
                    key={index}
                    onClick={() => submitDiagnosis(diagnosis)}
                    className="h-auto p-4 text-left"
                  >
                    {diagnosis}
                  </LiquidButton>
                ))}
              </div>

              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="mb-4"
                >
                  {showCustomInput ? 'Hide' : 'Enter'} Custom Diagnosis
                </Button>
                
                {showCustomInput && (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Enter your diagnosis..."
                      value={customDiagnosis}
                      onChange={(e) => setCustomDiagnosis(e.target.value)}
                      className="w-full"
                    />
                    <LiquidButton
                      onClick={() => submitDiagnosis(customDiagnosis)}
                      disabled={!customDiagnosis.trim()}
                    >
                      Submit Diagnosis
                    </LiquidButton>
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-6">
                <Button onClick={() => setPhase('investigations')}>
                  Back to Tests
                </Button>
              </div>
            </LiquidCard>
          </div>
        )}

        {phase === 'feedback' && currentCase && currentAttempt && (
          <div className="max-w-4xl mx-auto">
            <LiquidCard className="p-6 mb-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {currentAttempt.score}%
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Case Complete!</h2>
                <p className="text-gray-600">
                  Correct Diagnosis: <span className="font-semibold">{currentCase.correct_diagnosis}</span>
                </p>
                <p className="text-gray-600">
                  Your Diagnosis: <span className="font-semibold">{currentAttempt.user_diagnosis}</span>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Detailed Feedback</h3>
                <div className="text-gray-700 whitespace-pre-wrap">{feedback}</div>
              </div>

              <div className="flex justify-center space-x-4">
                <LiquidButton onClick={() => setPhase('menu')}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Case
                </LiquidButton>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Back to Dashboard
                </Button>
              </div>
            </LiquidCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseWise;
