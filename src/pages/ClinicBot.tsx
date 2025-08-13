
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  FileText, 
  Download,
  CheckCircle,
  AlertCircle,
  Brain,
  Clock,
  FileCheck,
  Paperclip
} from 'lucide-react';
import { useFileSummarization } from '@/hooks/useFileSummarization';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { Link, useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';
import { toast } from 'sonner';

const ClinicBot = () => {
  const navigate = useNavigate();
  const [scriptText, setScriptText] = useState('');
  const [wordCount, setWordCount] = useState([500]);
  const { generateSummary, generateTextSummary, downloadSummaryAsPDF, isLoading, summary } = useFileSummarization();
  const { user } = useAuth();
  const { canUseFeature, incrementUsage, refreshSubscriptionData, pdf_enabled } = useSubscription();

  // Get subscription info for UI
  const { allowed: canGenerateNotes, remaining: remainingNotes, limit: noteLimit } = canUseFeature('clinicbot', 'notes');

  // Function to clean markdown formatting from summary
  const cleanSummaryText = (text: string) => {
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

  const handleSummarize = async () => {
    if (!scriptText.trim()) {
      toast.error('Please enter text for summarization');
      return;
    }

    // Check if user can generate more notes
    if (!canGenerateNotes) {
      toast.error(
        noteLimit === -1 
          ? 'You need to upgrade your plan to generate more notes'
          : `You've reached your limit of ${noteLimit} notes this month. Upgrade to continue!`,
        {
          action: {
            label: 'Upgrade Now',
            onClick: () => navigate('/#pricing')
          }
        }
      );
      return;
    }
    
    try {
      await generateTextSummary(scriptText, wordCount[0]);
      await incrementUsage('notes', 'clinicbot');
      await refreshSubscriptionData(); // Force refresh after usage
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary. Please try again.');
    }
  };

  const handleDownload = () => {
    if (!summary) return;

    // Check if user can download PDFs
    if (!pdf_enabled) {
      toast.error('PDF export is only available on paid plans', {
        action: {
          label: 'Upgrade Now',
          onClick: () => navigate('/#pricing')
        }
      });
      return;
    }

      const filename = 'summary.txt'; // Default filename
      downloadSummaryAsPDF(summary, filename);
      refreshSubscriptionData();
  };

  const getWordCountFromText = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LiquidCard className="max-w-md w-full mx-4 p-8 text-center">
          <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ClinicBot</h1>
          <p className="text-gray-600 mb-6">Please log in to access ClinicBot</p>
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
              <h1 className="text-3xl font-bold text-white">ClinicBot</h1>
              <p className="text-white/80">AI-Powered Document Summarization</p>
            </div>
            {/* Stat boxes removed as per request */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <LiquidCard className="p-8 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="text-center mb-6">
                <FileText className="w-16 h-16 text-white mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Enter Your Content</h2>
                <p className="text-white/70">
                  Input your script for AI summarization
                </p>
              </div>

              {/* Text Input Area */}
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Script Text</Label>
                    <Textarea
                    placeholder="Paste your script here..."
                    className="min-h-[200px] bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      value={scriptText}
                      onChange={(e) => setScriptText(e.target.value)}
                  />
                </div>

                {/* Word Count Slider */}
                <div>
                  <Label className="text-white">Summary Length (words)</Label>
                  <Slider
                    value={wordCount}
                    onValueChange={setWordCount}
                    max={1000}
                    min={100}
                    step={50}
                    className="my-4"
                  />
                  <div className="text-sm text-white/70 text-center">
                    Target: {wordCount[0]} words
                  </div>
                </div>

                {/* Generate Button */}
                <LiquidButton
                  onClick={handleSummarize}
                  disabled={isLoading || !scriptText || !canGenerateNotes}
                  className="w-full bg-white/20 hover:bg-white/30"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Summary
                    </>
                  )}
                </LiquidButton>
              </div>
            </LiquidCard>

            {/* Output Section */}
            <LiquidCard className="p-8 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="text-center mb-6">
                <FileCheck className="w-16 h-16 text-white mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Generated Summary</h2>
                <p className="text-white/70">
                  Your AI-generated medical notes will appear here
                </p>
              </div>

                <div className="space-y-4">
                {summary ? (
                  <>
                    <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-white/90 font-sans">
                      {cleanSummaryText(summary)}
                      </pre>
                    </div>
                    <LiquidButton
                      onClick={handleDownload}
                      className="w-full bg-white/20 hover:bg-white/30"
                      disabled={!pdf_enabled}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download as PDF
                    </LiquidButton>
                  </>
                ) : (
                  <div className="text-center text-white/50 py-12">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No summary generated yet</p>
                </div>
              )}
          </div>
            </LiquidCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicBot;
