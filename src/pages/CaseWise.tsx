import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
import { Link } from 'react-router-dom';

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
  daily_streak: number;
}

const CaseWise = () => {
  const { user } = useAuth();
  const [currentCase, setCurrentCase] = useState<CaseScenario | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<CaseAttempt | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
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
          cases_this_month: 0,
          daily_streak: 0
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
      setPatientResponses({});
      setTestFeedback({});
      setDiagnosisSubmitted(false);
      setEvaluatingDiagnosis(false);
      setCustomQuestion('');
      setCustomInvestigation('');
      toast.success('New case generated successfully!');
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
          ...finalAttempt
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
      fetchUserStats();
      
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

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "#5fcfb9",
          backgroundImage:
            "linear-gradient(246deg, rgba(95, 207, 185, 1) 0%, rgba(88, 177, 209, 1) 100%)",
        }}
      >
        <LiquidCard className="max-w-md w-full mx-4 p-8 text-center">
          <div className="flex justify-center mb-4">
            <picture>
              <source srcSet="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.webp" type="image/webp" />
              <img 
                src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" 
                alt="VOIDR" 
                className="h-16 w-auto"
              />
            </picture>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Case Wise</h1>
          <p className="text-gray-600 mb-6">Please log in to access the medical simulator</p>
          <LiquidButton onClick={() => window.location.href = '/auth'}>
            Sign In
          </LiquidButton>
        </LiquidCard>
      </div>
    );
  }

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Link to="/dashboard" className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors">
              <picture>
                <source srcSet="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.webp" type="image/webp" />
                <img 
                  src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" 
                  alt="VOIDR" 
                  className="h-12 w-auto"
                />
              </picture>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Case Wise</h1>
              <p className="text-white/80">Interactive Medical Simulator</p>
            </div>
          </div>
          
          {userStats && (
            <LiquidCard className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-white flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {userStats.daily_streak}
                  </div>
                  <div className="text-white/70">Daily Streak</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white">{Math.round(userStats.average_score)}%</div>
                  <div className="text-white/70">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white">{userStats.completed_cases}</div>
                  <div className="text-white/70">Completed</div>
                </div>
              </div>
            </LiquidCard>
          )}
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
                disabled={loading}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <LiquidCard className="p-6 text-center bg-white/10 backdrop-blur-sm border-white/20">
                <Activity className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">Real Scenarios</h3>
                <p className="text-sm text-white/70">AI-generated cases based on real medical conditions</p>
              </LiquidCard>
              
              <LiquidCard className="p-6 text-center bg-white/10 backdrop-blur-sm border-white/20">
                <Award className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">Instant Feedback</h3>
                <p className="text-sm text-white/70">Get detailed feedback on your clinical reasoning</p>
              </LiquidCard>
              
              <LiquidCard className="p-6 text-center bg-white/10 backdrop-blur-sm border-white/20">
                <Clock className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">Track Progress</h3>
                <p className="text-sm text-white/70">Monitor your improvement over time</p>
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
                <LiquidButton onClick={() => setPhase('history')} className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  Ask Questions
                </LiquidButton>
                <LiquidButton 
                  onClick={() => setPhase('investigations')}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Order Tests
                </LiquidButton>
                <LiquidButton 
                  onClick={() => setPhase('diagnosis')}
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
                    className="text-left h-auto p-4 border-white/30 text-white hover:bg-white/10 bg-white/5"
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
                <LiquidButton onClick={() => setPhase('investigations')} className="bg-white/20 hover:bg-white/30 text-white">
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
                    className="text-left h-auto p-4 border-white/30 text-white hover:bg-white/10 bg-white/5"
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
                <LiquidButton onClick={() => setPhase('diagnosis')} className="bg-white/20 hover:bg-white/30 text-white">
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
                    className="h-auto p-4 text-left bg-white/20 hover:bg-white/30 text-white disabled:opacity-50"
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
                  onClick={() => setPhase('investigations')} 
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
                <div className="text-white/90 whitespace-pre-wrap">{feedback}</div>
              </div>

              <div className="flex justify-center space-x-4">
                <LiquidButton onClick={() => setPhase('menu')} className="bg-white/20 hover:bg-white/30 text-white">
                  New Case
                </LiquidButton>
                <LiquidButton 
                  onClick={() => window.location.href = '/dashboard'}
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
  );
};

export default CaseWise;
