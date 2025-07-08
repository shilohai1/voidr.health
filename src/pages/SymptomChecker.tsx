
import React, { useState } from 'react';
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

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
          <LiquidCard className="max-w-md mx-auto p-8">
            <div className="text-center mb-6">
              <User className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Gender</h2>
              <p className="text-gray-600">This helps us provide more accurate analysis</p>
            </div>
            <RadioGroup
              value={symptomData.gender}
              onValueChange={(value) => setSymptomData({ ...symptomData, gender: value })}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="Male" id="male" />
                <Label htmlFor="male" className="cursor-pointer flex-1 font-medium">Male</Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="Female" id="female" />
                <Label htmlFor="female" className="cursor-pointer flex-1 font-medium">Female</Label>
              </div>
            </RadioGroup>
          </LiquidCard>
        );

      case 2:
        return (
          <LiquidCard className="max-w-md mx-auto p-8">
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Age Group</h2>
              <p className="text-gray-600">Select the appropriate age category</p>
            </div>
            <RadioGroup
              value={symptomData.ageGroup}
              onValueChange={(value) => setSymptomData({ ...symptomData, ageGroup: value })}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="Adult" id="adult" />
                <Label htmlFor="adult" className="cursor-pointer flex-1 font-medium">Adult (18+ years)</Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="Child" id="child" />
                <Label htmlFor="child" className="cursor-pointer flex-1 font-medium">Child (Under 18 years)</Label>
              </div>
            </RadioGroup>
          </LiquidCard>
        );

      case 3:
        return (
          <LiquidCard className="max-w-md mx-auto p-8">
            <div className="text-center mb-6">
              <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Symptom Onset</h2>
              <p className="text-gray-600">When did your symptoms start?</p>
            </div>
            <RadioGroup
              value={symptomData.symptomOnset}
              onValueChange={(value) => setSymptomData({ ...symptomData, symptomOnset: value })}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="Less than 24 hours" id="recent" />
                <Label htmlFor="recent" className="cursor-pointer flex-1 font-medium">Less than 24 hours</Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="1-3 days" id="few-days" />
                <Label htmlFor="few-days" className="cursor-pointer flex-1 font-medium">1-3 days</Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="More than 3 days" id="longer" />
                <Label htmlFor="longer" className="cursor-pointer flex-1 font-medium">More than 3 days</Label>
              </div>
            </RadioGroup>
          </LiquidCard>
        );

      case 4:
        return (
          <LiquidCard className="max-w-lg mx-auto p-8">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Symptom Location</h2>
              <p className="text-gray-600">Where are you experiencing these symptoms?</p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="location">Location of symptoms</Label>
              <Input
                id="location"
                placeholder="e.g., chest, head, stomach, lower abdomen..."
                value={symptomData.symptomLocation}
                onChange={(e) => setSymptomData({ ...symptomData, symptomLocation: e.target.value })}
                className="w-full"
              />
            </div>
          </LiquidCard>
        );

      case 5:
        return (
          <LiquidCard className="max-w-lg mx-auto p-8">
            <div className="text-center mb-6">
              <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Details</h2>
              <p className="text-gray-600">Describe your symptoms in more detail </p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="details">Symptom description</Label>
              <Textarea
                id="details"
                placeholder="Describe your symptoms, their intensity, what makes them better or worse, any associated symptoms..."
                value={symptomData.symptomDetails}
                onChange={(e) => setSymptomData({ ...symptomData, symptomDetails: e.target.value })}
                className="w-full min-h-[120px]"
              />
            </div>
          </LiquidCard>
        );

      case 6:
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            {analysisResult ? (
              <>
                <LiquidCard className="p-8">
                  <div className="text-center mb-6">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Results</h2>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                      <p className="text-red-800 font-medium text-center">
                        ⚠️ Strictly not a diagnosis. For actual diagnosis, consult a medical professional.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Risk Level */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">Risk Level</h3>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getRiskLevelColor(analysisResult.risk_level)}`}>
                        {getRiskIcon(analysisResult.risk_level)}
                        <span className="font-semibold capitalize">{analysisResult.risk_level}</span>
                      </div>
                    </div>

                    {/* Parsed Symptoms */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">Identified Symptoms</h3>
                      <div className="space-y-2">
                        {analysisResult.parsed_symptoms.map((symptom, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                            <Activity className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-900">{symptom}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Possible Conditions */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Possible Conditions</h3>
                    <div className="space-y-3">
                      {analysisResult.conditions.map((condition, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">{condition.name}</span>
                            <span className="text-sm font-medium text-gray-600">
                              {Math.round(condition.probability * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${condition.probability * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </LiquidCard>

                <div className="text-center">
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
                    variant="outline"
                    className="mr-4"
                  >
                    Start New Assessment
                  </Button>
                  <Link to="/">
                    <Button>Back to Home</Button>
                  </Link>
                </div>
              </>
            ) : (
              <LiquidCard className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing your symptoms...</p>
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
      case 5: return true; // Optional step
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-white to-[#f3fceb] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AskVoidr Symptom Checker</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get AI-powered insights about your symptoms. Remember, this is not a substitute for professional medical advice.
          </p>
        </div>

        {/* Progress Bar */}
        {currentStep < 6 && (
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Step {currentStep} of 5</span>
              <span className="text-sm text-gray-600">{Math.round((currentStep / 5) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Content */}
        {renderStep()}

        {/* Navigation Buttons */}
        {currentStep < 6 && (
          <div className="flex justify-center gap-4 mt-8">
            {currentStep > 1 && (
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            {currentStep < 5 ? (
              <LiquidButton
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-2"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </LiquidButton>
            ) : (
              <LiquidButton
                onClick={handleAnalyze}
                disabled={isLoading || !canProceed()}
                className="px-6 py-2"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
              </LiquidButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;
