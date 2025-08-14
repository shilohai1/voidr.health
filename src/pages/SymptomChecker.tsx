import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, User, Calendar, MapPin, FileText, Activity, AlertTriangle, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DashboardSidebar from '@/components/DashboardSidebar';

interface SymptomData {
  gender: string;
  ageGroup: string;
  symptomOnset: string;
  symptomLocation: string;
  symptomDetails: string;
}

interface AnalysisResult {
  parsed_symptoms: string[];
  conditions: Array<{
    name: string;
    probability: number;
  }>;
  risk_level: 'low' | 'moderate' | 'high' | 'emergency';
}

const SymptomChecker = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [symptomData, setSymptomData] = useState<SymptomData>({
    gender: '',
    ageGroup: '',
    symptomOnset: '',
    symptomLocation: '',
    symptomDetails: '',
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isGoingBack, setIsGoingBack] = useState(false);

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Auto-next after filling options
  React.useEffect(() => {
    if (isGoingBack) {
      setIsGoingBack(false);
      return;
    }
    
    if (currentStep === 1 && symptomData.gender) handleNext();
    if (currentStep === 2 && symptomData.ageGroup) handleNext();
    if (currentStep === 3 && symptomData.symptomOnset) handleNext();
    // Remove auto-next for step 4 (symptom location) to allow user to type
    // if (currentStep === 4 && symptomData.symptomLocation.trim()) handleNext();
  }, [currentStep, symptomData.gender, symptomData.ageGroup, symptomData.symptomOnset, isGoingBack]);

  const handleBack = () => {
    if (currentStep > 1) {
      setIsGoingBack(true);
      // Clear the current step's data to prevent auto-advance
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      
      // Clear the data for the step we're going back to
      if (newStep === 1) {
        setSymptomData(prev => ({ ...prev, gender: '' }));
      } else if (newStep === 2) {
        setSymptomData(prev => ({ ...prev, ageGroup: '' }));
      } else if (newStep === 3) {
        setSymptomData(prev => ({ ...prev, symptomOnset: '' }));
      } else if (newStep === 4) {
        setSymptomData(prev => ({ ...prev, symptomLocation: '' }));
      }
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      console.log('Sending symptom data:', symptomData);
      
      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: symptomData
      });

      console.log('Response from edge function:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data received from analysis');
      }

      setAnalysisResult(data);
      setCurrentStep(6);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast.error('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-4 h-4" />;
      case 'moderate': return <Clock className="w-4 h-4" />;
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <LiquidCard className="w-full max-w-md mx-auto p-6 sm:p-8">
            <div className="text-center mb-6">
              <User className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-white" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Select Gender</h2>
              <p className="text-sm sm:text-base text-white/80">This helps us provide more accurate analysis</p>
            </div>
            <RadioGroup
              value={symptomData.gender}
              onValueChange={(value) => setSymptomData({ ...symptomData, gender: value })}
              className="space-y-3 sm:space-y-4"
            >
              <div className="flex items-center space-x-2 p-3 sm:p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors min-h-[48px]">
                <RadioGroupItem value="Male" id="male" />
                <Label htmlFor="male" className="cursor-pointer flex-1 font-medium text-sm sm:text-base text-white">Male</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 sm:p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors min-h-[48px]">
                <RadioGroupItem value="Female" id="female" />
                <Label htmlFor="female" className="cursor-pointer flex-1 font-medium text-sm sm:text-base text-white">Female</Label>
              </div>
            </RadioGroup>
          </LiquidCard>
        );

      case 2:
        return (
          <LiquidCard className="w-full max-w-md mx-auto p-6 sm:p-8">
            <div className="text-center mb-6">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-white" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Age Group</h2>
              <p className="text-sm sm:text-base text-white/80">Select the appropriate age category</p>
            </div>
            <RadioGroup
              value={symptomData.ageGroup}
              onValueChange={(value) => setSymptomData({ ...symptomData, ageGroup: value })}
              className="space-y-3 sm:space-y-4"
            >
              <div className="flex items-center space-x-2 p-3 sm:p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors min-h-[48px]">
                <RadioGroupItem value="Adult" id="adult" />
                <Label htmlFor="adult" className="cursor-pointer flex-1 font-medium text-sm sm:text-base text-white">Adult (18+ years)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 sm:p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors min-h-[48px]">
                <RadioGroupItem value="Child" id="child" />
                <Label htmlFor="child" className="cursor-pointer flex-1 font-medium text-sm sm:text-base text-white">Child (Under 18 years)</Label>
              </div>
            </RadioGroup>
          </LiquidCard>
        );

      case 3:
        return (
          <LiquidCard className="w-full max-w-md mx-auto p-6 sm:p-8">
            <div className="text-center mb-6">
              <Clock className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-white" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Symptom Onset</h2>
              <p className="text-sm sm:text-base text-white/80">When did your symptoms start?</p>
            </div>
            <RadioGroup
              value={symptomData.symptomOnset}
              onValueChange={(value) => setSymptomData({ ...symptomData, symptomOnset: value })}
              className="space-y-3 sm:space-y-4"
            >
              <div className="flex items-center space-x-2 p-3 sm:p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors min-h-[48px]">
                <RadioGroupItem value="Less than 24 hours" id="recent" />
                <Label htmlFor="recent" className="cursor-pointer flex-1 font-medium text-sm sm:text-base text-white">Less than 24 hours</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 sm:p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors min-h-[48px]">
                <RadioGroupItem value="1-3 days" id="few-days" />
                <Label htmlFor="few-days" className="cursor-pointer flex-1 font-medium text-sm sm:text-base text-white">1-3 days</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 sm:p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors min-h-[48px]">
                <RadioGroupItem value="More than 3 days" id="longer" />
                <Label htmlFor="longer" className="cursor-pointer flex-1 font-medium text-sm sm:text-base text-white">More than 3 days</Label>
              </div>
            </RadioGroup>
          </LiquidCard>
        );

      case 4:
        return (
          <LiquidCard className="w-full max-w-md sm:max-w-lg mx-auto p-6 sm:p-8">
            <div className="text-center mb-6">
              <MapPin className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-white" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Symptom Location</h2>
              <p className="text-sm sm:text-base text-white/80">Where are you experiencing these symptoms?</p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="location" className="text-sm sm:text-base text-white">Location of symptoms</Label>
              <Input
                id="location"
                placeholder="e.g., chest, head, stomach, lower abdomen..."
                value={symptomData.symptomLocation}
                onChange={(e) => setSymptomData({ ...symptomData, symptomLocation: e.target.value })}
                className="w-full min-h-[44px] text-sm sm:text-base bg-transparent border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </LiquidCard>
        );

      case 5:
        return (
          <LiquidCard className="w-full max-w-md sm:max-w-lg mx-auto p-6 sm:p-8">
            <div className="text-center mb-6">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-white" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Additional Details</h2>
              <p className="text-sm sm:text-base text-white/80">Describe your symptoms in more detail</p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="details" className="text-sm sm:text-base text-white">Symptom description</Label>
              <Textarea
                id="details"
                placeholder="Describe your symptoms, their intensity, what makes them better or worse, any associated symptoms..."
                value={symptomData.symptomDetails}
                onChange={(e) => setSymptomData({ ...symptomData, symptomDetails: e.target.value })}
                className="w-full min-h-[100px] sm:min-h-[120px] text-sm sm:text-base bg-transparent border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </LiquidCard>
        );

      case 6:
        return (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            {analysisResult ? (
              <>
                <LiquidCard className="p-6 sm:p-8">
                  <div className="text-center mb-6">
                    <Activity className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-white" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Analysis Results</h2>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mt-4">
                      <p className="text-red-800 font-medium text-center text-sm sm:text-base">
                        ⚠️ Strictly not a diagnosis. For actual diagnosis, consult a medical professional.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Risk Level */}
                    <div className="space-y-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">Risk Level</h3>
                      <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border ${getRiskLevelColor(analysisResult.risk_level)}`}>
                        {getRiskIcon(analysisResult.risk_level)}
                        <span className="font-semibold capitalize text-sm sm:text-base">{analysisResult.risk_level}</span>
                      </div>
                    </div>

                    {/* Parsed Symptoms */}
                    <div className="space-y-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">Identified Symptoms</h3>
                      <div className="space-y-2">
                        {analysisResult.parsed_symptoms.map((symptom, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                            <Activity className="w-4 h-4 text-white flex-shrink-0" />
                            <span className="text-white text-sm sm:text-base">{symptom}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Possible Conditions */}
                  <div className="mt-6 sm:mt-8">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Possible Conditions</h3>
                    <div className="space-y-3">
                      {analysisResult.conditions.map((condition, index) => (
                        <div key={index} className="p-3 sm:p-4 border border-white/20 rounded-lg bg-white/5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-white text-sm sm:text-base">{condition.name}</span>
                            <span className="text-sm font-medium text-white/80">
                              {Math.round(condition.probability * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div
                              className="bg-white h-2 rounded-full transition-all duration-300"
                              style={{ width: `${condition.probability * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </LiquidCard>

                <div className="text-center space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
                  <Button
                    onClick={() => {
                      setCurrentStep(1);
                      setSymptomData({
                        gender: '',
                        ageGroup: '',
                        symptomOnset: '',
                        symptomLocation: '',
                        symptomDetails: '',
                      });
                      setAnalysisResult(null);
                    }}
                    className="w-full sm:w-auto min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                     Start New Assessment
                  </Button>
                  <Link to="/dashboard" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto min-h-[44px] bg-gray-600 text-white hover:bg-gray-700 transition-colors">Back to Dashboard</Button>
                  </Link>
                </div>
              </>
            ) : (
              <LiquidCard className="p-6 sm:p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white/80 text-sm sm:text-base">Analyzing your symptoms...</p>
              </LiquidCard>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return symptomData.gender !== '';
      case 2: return symptomData.ageGroup !== '';
      case 3: return symptomData.symptomOnset !== '';
      case 4: return symptomData.symptomLocation.trim() !== '';
      case 5: return symptomData.symptomDetails.trim() !== ''; // Require symptom details for step 5
      default: return false;
    }
  };

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "#4ba697",
          backgroundImage: "linear-gradient(246deg, rgba(79, 175, 156, 0.95) 0%, rgba(74, 149, 176, 0.95) 100%)"
        }}
      >
        <LiquidCard className="max-w-md w-full mx-4 p-8 text-center">
          <div className="flex justify-center mb-4">
            <picture>
              <source srcSet="/lovable-uploads/ef109c7d-da65-4b73-8c54-766471cc628c.png" type="image/png" />
              <img 
                src="/lovable-uploads/ef109c7d-da65-4b73-8c54-766471cc628c.png" 
                alt="Symptom Checker" 
                className="h-16 w-auto"
              />
            </picture>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Symptom Checker</h1>
          <p className="text-gray-600 mb-6">Please log in to access Symptom Checker</p>
          <LiquidButton onClick={() => window.location.href = '/auth'}>
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
        <div className="container mx-auto flex flex-col justify-center min-h-screen py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">AskVoidr Symptom Checker</h1>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
              Get AI-powered insights about your symptoms. Remember, this is not a substitute for professional medical advice.
            </p>
          </div>
          
          {/* Progress Bar */}
          {currentStep < 6 && (
            <div className="max-w-md mx-auto mb-8">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <span className="text-xs sm:text-sm text-white/80 text-left">Step {currentStep} of 5</span>
                <span className="text-xs sm:text-sm text-white/80 text-right">{Math.round((currentStep / 5) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Step Content */}
          {renderStep()}

          {/* Navigation Buttons */}
          {currentStep < 6 && (
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-8">
              {currentStep > 1 && (
                <Button 
                  onClick={handleBack} 
                  className="order-2 sm:order-1 w-full sm:w-auto min-h-[44px] bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              {/* Add Next button for steps 1-4 */}
              {currentStep < 5 && (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="order-1 sm:order-2 px-6 py-2 w-full sm:w-auto min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </Button>
              )}
              {/* Analyze button for step 5 */}
              {currentStep === 5 && (
                <Button
                  onClick={handleAnalyze}
                  disabled={isLoading || !canProceed()}
                  className="order-1 sm:order-2 px-6 py-2 w-full sm:w-auto min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
