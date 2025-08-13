import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  Heart, 
  Activity, 
  Thermometer, 
  User,
  Brain,
  Award,
  CheckCircle,
  Loader,
  Plus,
  Calendar
} from 'lucide-react';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';

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
  id: string;
  case_id: string;
  user_id: string;
  diagnosis: string;
  accuracy_score: number;
  time_taken: number;
  created_at: string;
  questions_asked: string[];
  investigations_ordered: string[];
  score: number;
  user_diagnosis: string;
  completed: boolean;
}

interface UserStats {
  daily_streak: number;
  average_score: number;
  completed_cases: number;
}

const CaseWise = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canUseFeature, incrementUsage, refreshSubscriptionData } = useSubscription();
  const [currentCase, setCurrentCase] = useState<CaseScenario | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<CaseAttempt | null>(null);
  // Remove local userStats state and fetchUserStats logic
  // Use useSubscription for all stats
  const { plan, simulations_used, simulations_remaining, is_unlimited_simulations, notes_used, notes_remaining, is_unlimited_notes, pdf_enabled } = useSubscription();
  const [phase, setPhase] = useState<'menu' | 'case' | 'history' | 'investigations' | 'diagnosis' | 'feedback'>('menu');
  const [startTime, setStartTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [customDiagnosis, setCustomDiagnosis] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [patientResponses, setPatientResponses] = useState<{[key: string]: string}>({});
  const [testFeedback, setTestFeedback] = useState<{[key: string]: string}>({});
  const [diagnosisSubmitted, setDiagnosisSubmitted] = useState(false);
  const [evaluatingDiagnosis, setEvaluatingDiagnosis] = useState(false);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [customInvestigation, setCustomInvestigation] = useState<string>('');

  // Get subscription info for UI
  const { allowed: canStartSimulation, remaining: remainingSimulations, limit: simulationLimit } = canUseFeature('casewise', 'simulations');

  // Function to clean markdown formatting from feedback
  const cleanFeedbackText = (text: string) => {
    if (!text) return '';
    return text
      .replace(/^#+\s*/gm, '') // Remove markdown headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
      .replace(/`(.*?)`/g, '$1') // Remove code formatting
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
      .replace(/^\s*[-*+]\s*/gm, '• ') // Convert markdown lists to bullet points
      .replace(/^\s*\d+\.\s*/gm, '') // Remove numbered list formatting
      .trim();
  };

  const availableQuestions = [
    "Can you tell me more about when this pain started?",
    "Do you have any past medical history of note?",
    "Are you currently taking any medications?",
    "Do you have any known drug allergies?",
    "Does anything make the pain better or worse?",
    "Have you experienced anything like this before?",
    "Is there any family history of similar problems?",
    "Any recent travel or exposure to sick contacts?",
    "On a scale of 1-10, how would you rate your pain?",
    "Any associated symptoms like nausea, vomiting, or fever?",
    "Have you noticed any changes in your bowel habits?",
    "Any shortness of breath or chest pain?",
    "Any recent weight loss or night sweats?",
    "Do you smoke or drink alcohol regularly?",
    "Have you had any recent surgeries or hospitalizations?",
    "Are you experiencing any dizziness or lightheadedness?",
    "Have you noticed any changes in your appetite?",
    "Any recent changes in your sleep patterns?",
    "Do you have any history of mental health conditions?",
    "Have you been under any unusual stress lately?"
  ];

  const availableInvestigations = [
    "FBC (Full Blood Count)",
    "U&Es (Urea & Electrolytes)",
    "LFTs (Liver Function Tests)",
    "Cardiac enzymes (Troponin I/T)",
    "12-lead ECG",
    "CXR (Chest X-ray)",
    "CT Head",
    "CT CAP (Chest/Abdomen/Pelvis)",
    "Abdominal USS",
    "Urinalysis & M,C&S",
    "Blood cultures",
    "ABG (Arterial Blood Gas)",
    "D-dimer",
    "Inflammatory markers (CRP, ESR)",
    "Coagulation screen (PT/INR, APTT)",
    "Echocardiogram",
    "Thyroid function tests (TFTs)",
    "HbA1c",
    "Lipid profile",
    "Vitamin B12 & Folate",
    "Iron studies",
    "Bone profile",
    "Magnesium levels",
    "Lactate",
    "Procalcitonin",
    "BNP/NT-proBNP",
    "Arterial Doppler",
    "Venous Doppler",
    "MRI Brain",
    "CT Angiogram"
  ];

  const commonDiagnoses = [
    "STEMI (ST-Elevation MI)",
    "NSTEMI (Non-ST Elevation MI)",
    "Acute appendicitis",
    "Community-acquired pneumonia",
    "Acute stroke (CVA)",
    "Sepsis/SIRS",
    "Acute gastroenteritis",
    "UTI (Urinary tract infection)",
    "Acute asthma exacerbation",
    "Panic disorder/anxiety",
    "Acute migraine",
    "Acute cholecystitis",
    "DVT (Deep vein thrombosis)",
    "PE (Pulmonary embolism)",
    "Acute renal colic"
  ];

  useEffect(() => {
    if (user) {
      // fetchUserStats(); // This function is no longer needed
    }
  }, [user]);

  // const fetchUserStats = async () => { // This function is no longer needed
  //   try {
  //     const { data, error } = await supabase
  //       .from('user_stats')
  //       .select('*')
  //       .eq('user_id', user?.id)
  //       .single();

  //     if (error && error.code !== 'PGRST116') throw error;
  //     setUserStats(data || { daily_streak: 0, average_score: 0, completed_cases: 0 });
  //   } catch (error) {
  //     console.error('Error fetching user stats:', error);
  //   }
  // };

  const generateNewCase = async () => {
    // Check if user can start a new simulation
    if (!canStartSimulation) {
      toast.error(
        simulationLimit === -1 
          ? 'You need to upgrade your plan to start more simulations'
          : `You've reached your limit of ${simulationLimit} simulations this month. Upgrade to continue!`,
        {
          action: {
            label: 'Upgrade Now',
            onClick: () => navigate('/#pricing')
          }
        }
      );
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-case', {
        body: { action: 'generate-case', caseData: { difficulty: 'medium' } }
      });
      if (error) throw error;
      const caseData = data?.case;
      setCurrentCase(caseData);
      setPhase('case');
      setStartTime(Date.now());
      // Increment usage counter
      await incrementUsage('simulations', 'casewise');
      await refreshSubscriptionData(); // Force refresh after usage
    } catch (error) {
      console.error('Error generating case:', error);
      toast.error('Failed to generate case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async (question: string) => {
    if (currentAttempt && currentCase) {
      setCurrentAttempt({
        ...currentAttempt,
        questions_asked: [...currentAttempt.questions_asked, question]
      });

      // Get AI patient response
      try {
        const { data } = await supabase.functions.invoke('generate-case', {
          body: {
            action: 'patient-response',
            caseData: { question, scenario: currentCase }
          }
        });

        if (data?.response) {
          setPatientResponses(prev => ({
            ...prev,
            [question]: data.response
          }));

          // Generate voiceover
          if (data.audioContent) {
            const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
            audio.play().catch(console.error);
          }
        }
      } catch (error) {
        console.error('Error getting patient response:', error);
        setPatientResponses(prev => ({
          ...prev,
          [question]: "I'm not sure about that..."
        }));
      }

      toast.success('Question asked!');
    }
  };

  const askCustomQuestion = async () => {
    if (customQuestion.trim() && currentAttempt && currentCase) {
      await askQuestion(customQuestion.trim());
      setCustomQuestion('');
    }
  };

  const orderInvestigation = async (investigation: string) => {
    if (currentAttempt && currentCase) {
      setCurrentAttempt({
        ...currentAttempt,
        investigations_ordered: [...currentAttempt.investigations_ordered, investigation]
      });

      // Get AI feedback on test choice
      try {
        const { data } = await supabase.functions.invoke('generate-case', {
          body: {
            action: 'test-feedback',
            caseData: { investigation, scenario: currentCase }
          }
        });

        if (data?.feedback) {
          setTestFeedback(prev => ({
            ...prev,
            [investigation]: data.feedback
          }));
          toast.success(data.feedback);
        }
      } catch (error) {
        console.error('Error getting test feedback:', error);
        toast.success('Investigation ordered!');
      }
    }
  };

  const orderCustomInvestigation = async () => {
    if (customInvestigation.trim() && currentAttempt && currentCase) {
      await orderInvestigation(customInvestigation.trim());
      setCustomInvestigation('');
    }
  };

  const submitDiagnosis = async (diagnosis: string) => {
    if (!currentAttempt || !currentCase || diagnosisSubmitted) return;

    setDiagnosisSubmitted(true);
    setEvaluatingDiagnosis(true);

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
      await supabase
        .from('case_attempts')
        .insert({
          user_id: user!.id,
          scenario_id: currentCase.id,
          user_diagnosis: diagnosis,
          score,
          time_taken: timeSpent,
          completed: true,
          questions_asked: JSON.stringify(currentAttempt.questions_asked),
          investigations_ordered: JSON.stringify(currentAttempt.investigations_ordered),
          created_at: currentAttempt.created_at,
          id: currentAttempt.id,
          diagnosis: currentAttempt.diagnosis,
          accuracy_score: currentAttempt.accuracy_score
        });

      await supabase.rpc('update_case_wise_stats', {
        user_uuid: user!.id,
        new_score: score,
        time_spent: timeSpent,
        completed: true
      });

      const { data } = await supabase.functions.invoke('generate-case', {
        body: {
          action: 'provide-feedback',
          caseData: { attempt: finalAttempt, scenario: currentCase }
        }
      });

      setFeedback(data?.feedback || 'Well done on completing this case!');
      setCurrentAttempt(finalAttempt);
      setPhase('feedback');
      // fetchUserStats(); // This function is no longer needed
      await refreshSubscriptionData();
      
      toast.success(isCorrect ? 'Correct diagnosis!' : 'Case completed!');
    } catch (error) {
      console.error('Error submitting diagnosis:', error);
      toast.error('Failed to submit diagnosis');
      setDiagnosisSubmitted(false);
    } finally {
      setEvaluatingDiagnosis(false);
    }
  };

  const calculateScore = (correct: boolean, timeSpent: number, investigationsCount: number) => {
    let score = correct ? 80 : 20;
    
    if (timeSpent < 300) score += 15;
    else if (timeSpent < 600) score += 10;
    else if (timeSpent < 900) score += 5;

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

  // Add a helper to initialize currentAttempt if not set
  const ensureAttempt = () => {
    if (!currentAttempt && currentCase) {
      setCurrentAttempt({
        id: '',
        case_id: currentCase.id,
        user_id: user?.id || '',
        diagnosis: '',
        accuracy_score: 0,
        time_taken: 0,
        created_at: new Date().toISOString(),
        questions_asked: [],
        investigations_ordered: [],
        score: 0,
        user_diagnosis: '',
        completed: false
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LiquidCard className="max-w-md w-full mx-4 p-8 text-center">
          <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Case Wise</h1>
          <p className="text-gray-600 mb-6">Please log in to access Case Wise</p>
          <LiquidButton onClick={() => navigate('/auth')}>
            Sign In
          </LiquidButton>
        </LiquidCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />
      <div
        className="flex-1"
        style={{
          background: "linear-gradient(135deg, #141670 0%, #3E5782 100%)"
        }}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header with Usage Info */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Case Wise</h1>
              <p className="text-white/80">AI-Powered Medical Simulations</p>
            </div>
            {/* Remove the top right badge showing simulations left from the header section */}
          </div>

          {/* Main Content */}
          {phase === 'menu' && (
            <div className="max-w-4xl mx-auto">
              <LiquidCard className="p-8 text-center mb-8 bg-white/10 backdrop-blur-sm border-white/20">
                <Brain className="w-20 h-20 text-white mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">
                  Welcome to Case Wise
                </h2>
                <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                  Practice clinical reasoning with clinically accurate AI-generated patient scenarios. 
                  From history-taking to diagnosis and management - sharpen your medical skills 
                  before stepping into the hospital.
                </p>
                
                <p className="text-white/60 italic text-sm mb-8 max-w-2xl mx-auto">
                  DISCLAIMER: All characters used in this simulation are fictional and AI generated and does not represent anyone in real life.
                </p>
                
                <LiquidButton 
                  onClick={generateNewCase}
                  disabled={loading || !canStartSimulation}
                  className="text-lg px-8 py-4 bg-white/20 hover:bg-white/30"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Generating Case...
                    </>
                  ) : (
                    "Begin Simulation"
                  )}
                </LiquidButton>
              </LiquidCard>

              {/* Quick Stats */}
              {/* In the Quick Stats card, use these values instead of userStats */}
              <div className="flex justify-center mt-8">
                <LiquidCard className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-white flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {/* Use simulations_remaining from useSubscription */}
                        {simulations_remaining}
                      </div>
                      <div className="text-white/70">Simulations Left</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-white">{Math.round(0)}%</div> {/* Average score is not tracked in this simulation */}
                      <div className="text-white/70">Avg Score</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-white">{0}</div> {/* Completed cases is not tracked in this simulation */}
                      <div className="text-white/70">Completed</div>
                    </div>
                  </div>
                </LiquidCard>
              </div>
            </div>
          )}

          {phase === 'case' && currentCase && (
            <div className="max-w-4xl mx-auto">
              <LiquidCard className="p-6 mb-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <User className="w-8 h-8 text-white" />
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {currentCase.patient_name}
                      </h2>
                      <p className="text-white/80">
                        {currentCase.age} year old {currentCase.gender}
                      </p>
                    </div>
                  </div>
                  <Badge className={getUrgencyColor(currentCase.urgency_level)}>
                    {currentCase.urgency_level}
                  </Badge>
                </div>

                <div className="bg-white/20 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-white mb-2">Presenting Complaint</h3>
                  <p className="text-white/90">{currentCase.presenting_complaint}</p>
                </div>

                {/* Vitals */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="bg-white/20 p-3 rounded-lg text-center">
                    <Thermometer className="w-5 h-5 text-red-300 mx-auto mb-1" />
                    <div className="text-sm font-medium text-white">Temp</div>
                    <div className="text-xs text-white/80">{currentCase.vitals.temperature}</div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg text-center">
                    <Heart className="w-5 h-5 text-red-300 mx-auto mb-1" />
                    <div className="text-sm font-medium text-white">BP</div>
                    <div className="text-xs text-white/80">{currentCase.vitals.blood_pressure}</div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg text-center">
                    <Activity className="w-5 h-5 text-blue-300 mx-auto mb-1" />
                    <div className="text-sm font-medium text-white">HR</div>
                    <div className="text-xs text-white/80">{currentCase.vitals.heart_rate}</div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg text-center">
                    <Activity className="w-5 h-5 text-green-300 mx-auto mb-1" />
                    <div className="text-sm font-medium text-white">RR</div>
                    <div className="text-xs text-white/80">{currentCase.vitals.respiratory_rate}</div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg text-center">
                    <Activity className="w-5 h-5 text-blue-300 mx-auto mb-1" />
                    <div className="text-sm font-medium text-white">O2 Sat</div>
                    <div className="text-xs text-white/80">{currentCase.vitals.oxygen_saturation}</div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <LiquidButton onClick={() => { ensureAttempt(); setPhase('history'); }} className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    Ask Questions
                  </LiquidButton>
                  <LiquidButton 
                    onClick={() => { ensureAttempt(); setPhase('investigations'); }}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    Order Tests
                  </LiquidButton>
                  <LiquidButton 
                    onClick={() => { ensureAttempt(); setPhase('diagnosis'); }}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    Make Diagnosis
                  </LiquidButton>
                </div>
              </LiquidCard>
            </div>
          )}

          {phase === 'history' && currentCase && currentAttempt && (
            <div className="max-w-4xl mx-auto">
              <LiquidCard className="p-6 mb-6 bg-white/10 backdrop-blur-sm border-white/20">
                <h2 className="text-xl font-bold text-white mb-4">History Taking</h2>
                
                {/* Custom Question Input */}
                <div className="mb-6 p-4 bg-white/20 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Ask Custom Question</h3>
                  <div className="flex space-x-2">
                    <Input
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      placeholder="Type your custom question here..."
                      className="flex-1 bg-white/20 border-white/30 text-white placeholder-white/60"
                      onKeyPress={(e) => e.key === 'Enter' && askCustomQuestion()}
                    />
                    <LiquidButton
                      onClick={askCustomQuestion}
                      disabled={!customQuestion.trim()}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ask
                    </LiquidButton>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {availableQuestions.map((question, index) => (
                    <LiquidButton
                      key={index}
                      variant="outline"
                      className="text-left h-auto p-2 sm:p-4 border-white/30 text-xs sm:text-sm md:text-base text-white hover:bg-white/10 bg-white/5"
                      onClick={() => askQuestion(question)}
                      disabled={currentAttempt.questions_asked.includes(question)}
                    >
                      {currentAttempt.questions_asked.includes(question) && (
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                      )}
                      {question}
                    </LiquidButton>
                  ))}
                </div>

                {/* Patient Responses */}
                {Object.keys(patientResponses).length > 0 && (
                  <div className="bg-white/20 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-white mb-2">Patient Responses:</h3>
                    <div className="space-y-3">
                      {Object.entries(patientResponses).map(([question, response], index) => (
                        <div key={index} className="border-l-2 border-white/30 pl-3">
                          <div className="text-sm text-white/70 mb-1">Q: {question}</div>
                          <div className="text-white">{response}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <LiquidButton onClick={() => setPhase('case')} className="bg-white/20 hover:bg-white/30 text-white">
                    Back to Case
                  </LiquidButton>
                  <LiquidButton onClick={() => { ensureAttempt(); setPhase('investigations'); }} className="bg-white/20 hover:bg-white/30 text-white">
                    Order Tests
                  </LiquidButton>
                </div>
              </LiquidCard>
            </div>
          )}

          {phase === 'investigations' && currentCase && currentAttempt && (
            <div className="max-w-4xl mx-auto">
              <LiquidCard className="p-6 mb-6 bg-white/10 backdrop-blur-sm border-white/20">
                <h2 className="text-xl font-bold text-white mb-4">Investigations</h2>
                
                {/* Custom Investigation Input */}
                <div className="mb-6 p-4 bg-white/20 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Order Custom Investigation</h3>
                  <div className="flex space-x-2">
                    <Input
                      value={customInvestigation}
                      onChange={(e) => setCustomInvestigation(e.target.value)}
                      placeholder="Type custom investigation here..."
                      className="flex-1 bg-white/20 border-white/30 text-white placeholder-white/60"
                      onKeyPress={(e) => e.key === 'Enter' && orderCustomInvestigation()}
                    />
                    <LiquidButton
                      onClick={orderCustomInvestigation}
                      disabled={!customInvestigation.trim()}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Order
                    </LiquidButton>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {availableInvestigations.map((investigation, index) => (
                    <LiquidButton
                      key={index}
                      variant="outline"
                      className="text-left h-auto p-2 sm:p-4 border-white/30 text-xs sm:text-sm md:text-base text-white hover:bg-white/10 bg-white/5"
                      onClick={() => orderInvestigation(investigation)}
                      disabled={currentAttempt.investigations_ordered.includes(investigation)}
                    >
                      {currentAttempt.investigations_ordered.includes(investigation) && (
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                      )}
                      {investigation}
                    </LiquidButton>
                  ))}
                </div>

                {/* Test Feedback */}
                {Object.keys(testFeedback).length > 0 && (
                  <div className="bg-white/20 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-white mb-2">Clinical Reasoning:</h3>
                    <div className="space-y-2">
                      {Object.entries(testFeedback).map(([test, feedback], index) => (
                        <div key={index} className="text-sm">
                          <span className="text-white/80">{test}:</span> <span className="text-white">{feedback}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentAttempt.investigations_ordered.length > 0 && (
                  <div className="bg-white/20 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-white mb-2">Tests Ordered:</h3>
                    <ul className="space-y-1">
                      {currentAttempt.investigations_ordered.map((test, index) => (
                        <li key={index} className="text-sm text-white/90">• {test}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex space-x-4">
                  <LiquidButton onClick={() => setPhase('history')} className="bg-white/20 hover:bg-white/30 text-white">
                    Back to History
                  </LiquidButton>
                  <LiquidButton onClick={() => { ensureAttempt(); setPhase('diagnosis'); }} className="bg-white/20 hover:bg-white/30 text-white">
                    Make Diagnosis
                  </LiquidButton>
                </div>
              </LiquidCard>
            </div>
          )}

          {phase === 'diagnosis' && currentCase && (
            <div className="max-w-4xl mx-auto">
              <LiquidCard className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <h2 className="text-xl font-bold text-white mb-4">Final Diagnosis</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {commonDiagnoses.map((diagnosis, index) => (
                    <LiquidButton
                      key={index}
                      onClick={() => submitDiagnosis(diagnosis)}
                      disabled={diagnosisSubmitted}
                      className="h-auto p-2 sm:p-4 text-left bg-white/20 hover:bg-white/30 text-xs sm:text-sm md:text-base text-white disabled:opacity-50"
                    >
                      {diagnosis}
                    </LiquidButton>
                  ))}
                </div>

                <div className="border-t border-white/20 pt-4">
                  <LiquidButton
                    variant="outline"
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className="mb-4 border-white/30 text-white hover:bg-white/10"
                    disabled={diagnosisSubmitted}
                  >
                    {showCustomInput ? 'Hide' : 'Enter'} Custom Diagnosis
                  </LiquidButton>
                  
                  {showCustomInput && (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Enter your diagnosis..."
                        value={customDiagnosis}
                        onChange={(e) => setCustomDiagnosis(e.target.value)}
                        className="w-full bg-white/20 border-white/30 text-white placeholder-white/60"
                        disabled={diagnosisSubmitted}
                      />
                      <LiquidButton
                        onClick={() => submitDiagnosis(customDiagnosis)}
                        disabled={!customDiagnosis.trim() || diagnosisSubmitted}
                        className="bg-white/20 hover:bg-white/30 text-white disabled:opacity-50"
                      >
                        Submit Diagnosis
                      </LiquidButton>
                    </div>
                  )}
                </div>
                
                {evaluatingDiagnosis && (
                  <div className="mt-6 text-center">
                    <div className="flex items-center justify-center space-x-2 text-white">
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Case Wise is evaluating your Diagnosis...</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-center mt-6">
                  <LiquidButton 
                    onClick={() => { ensureAttempt(); setPhase('investigations'); }} 
                    className="bg-white/20 hover:bg-white/30 text-white"
                    disabled={diagnosisSubmitted}
                  >
                    Back to Tests
                  </LiquidButton>
                </div>
              </LiquidCard>
            </div>
          )}

          {phase === 'feedback' && currentCase && currentAttempt && (
            <div className="max-w-4xl mx-auto">
              <LiquidCard className="p-6 mb-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {currentAttempt.score}%
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Case Complete!</h2>
                  <p className="text-white/80">
                    Correct Diagnosis: <span className="font-semibold text-white">{currentCase.correct_diagnosis}</span>
                  </p>
                  <p className="text-white/80">
                    Your Diagnosis: <span className="font-semibold text-white">{currentAttempt.user_diagnosis}</span>
                  </p>
                </div>

                <div className="bg-white/20 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-white mb-2">Detailed Feedback</h3>
                  <div className="text-white/90 whitespace-pre-wrap">{cleanFeedbackText(feedback)}</div>
                </div>

                <div className="flex justify-center space-x-4">
                  <LiquidButton onClick={() => setPhase('menu')} className="bg-white/20 hover:bg-white/30 text-white">
                    New Case
                  </LiquidButton>
                  <LiquidButton 
                    onClick={() => navigate('/dashboard')}
                    className="bg-white/20 hover:bg-white/30 text-white"
                  >
                    Back to Dashboard
                  </LiquidButton>
                </div>
              </LiquidCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseWise;
