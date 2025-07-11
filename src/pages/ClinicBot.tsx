
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
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { Link } from 'react-router-dom';

const StudyWithAI = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scriptText, setScriptText] = useState('');
  const [wordCount, setWordCount] = useState([500]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { generateSummary, downloadSummaryAsPDF, isLoading, summary } = useFileSummarization();
  const { user } = useAuth();

  const handleFileSelect = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];

    if (!validTypes.includes(file.type)) {
      alert('Please select a valid file type (PDF, Word, or Text)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSummarize = async () => {
    if (!scriptText.trim() && !selectedFile) {
      alert('Please enter text or upload a file');
      return;
    }
    
    if (selectedFile) {
      await generateSummary(selectedFile);
    } else {
      // Create a temporary file from the text input
      const blob = new Blob([scriptText], { type: 'text/plain' });
      const file = new File([blob], 'manual_input.txt', { type: 'text/plain' });
      await generateSummary(file);
    }
  };

  const handleDownload = () => {
    if (summary) {
      const filename = selectedFile ? selectedFile.name : 'manual_input.txt';
      downloadSummaryAsPDF(summary, filename);
    }
  };

  const getWordCountFromText = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
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
              <source srcSet="/lovable-uploads/ef109c7d-da65-4b73-8c54-766471cc628c.png" type="image/png" />
              <img 
                src="/lovable-uploads/ef109c7d-da65-4b73-8c54-766471cc628c.png" 
                alt="ClinicBot" 
                className="h-16 w-auto"
              />
            </picture>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ClinicBot</h1>
          <p className="text-gray-600 mb-6">Please log in to access ClinicBot</p>
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
         <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
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
              <h1 className="text-3xl font-bold text-white">ClinicBot</h1>
              <p className="text-white/80">AI-Powered Document Summarization</p>
            </div>
          </div>
          <Badge className="bg-green-500 text-white px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            Smart AI
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <LiquidCard className="p-8 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="text-center mb-6">
              <FileText className="w-16 h-16 text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Enter Your Content</h2>
              <p className="text-white/70">
                Input your script or upload a PDF file for AI summarization
              </p>
            </div>

            {/* Text Input Area */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-white font-medium">Enter your script (10,000+ words supported)</Label>
                <div className="relative">
                  <Textarea
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    placeholder="Paste your script, research paper, or medical document here..."
                    className="min-h-[200px] bg-white/20 border-white/30 text-white placeholder:text-white/60 resize-none"
                  />
                  <div className="absolute top-3 right-3 flex items-center space-x-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="ghost"
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white p-2"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-white/60">
                  <span>Words: {getWordCountFromText(scriptText)}</span>
                  {selectedFile && (
                    <span className="flex items-center space-x-1">
                      <FileCheck className="w-4 h-4" />
                      <span>{selectedFile.name}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Word Count Slider */}
              <div className="space-y-3">
                <Label className="text-white font-medium">Summary Length: {wordCount[0]} words</Label>
                <Slider
                  value={wordCount}
                  onValueChange={setWordCount}
                  max={1000}
                  min={100}
                  step={50}
                  className="w-full"
                  showTooltip={true}
                  tooltipContent={(value) => `${value} words`}
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>100 words</span>
                  <span>1000 words</span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {/* Summarize Button */}
            <div className="mt-6">
              <LiquidButton
                onClick={handleSummarize}
                disabled={isLoading || (!scriptText.trim() && !selectedFile)}
                className="w-full text-lg py-4 bg-white/20 hover:bg-white/30 text-white disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Analyzing Content...
                  </>
                ) : (
                  <>
                    Generate Summary ({wordCount[0]} words)
                  </>
                )}
              </LiquidButton>
            </div>
          </LiquidCard>

          {/* Results Section */}
          <LiquidCard className="p-8 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">AI Summary</h3>
              {summary && (
                <LiquidButton
                  onClick={handleDownload}
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </LiquidButton>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-white/80">
                  <Clock className="w-4 h-4" />
                  <span>Processing your content...</span>
                </div>
                <Progress value={65} className="w-full" />
                <div className="bg-white/20 p-4 rounded-lg">
                  <div className="animate-pulse space-y-2">
                    <div className="h-3 bg-white/30 rounded w-full"></div>
                    <div className="h-3 bg-white/30 rounded w-4/5"></div>
                    <div className="h-3 bg-white/30 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ) : summary ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Summary Generated Successfully</span>
                </div>
                <div className="bg-white/20 p-6 rounded-lg">
                  <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
                    {summary}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 text-lg">
                  Your AI-generated summary will appear here
                </p>
                <p className="text-white/40 text-sm mt-2">
                  Enter text or upload a document to get started
                </p>
              </div>
            )}
          </LiquidCard>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <LiquidCard className="p-6 text-center bg-white/10 backdrop-blur-sm border-white/20">
            <Brain className="w-10 h-10 text-white mx-auto mb-4" />
            <h4 className="text-white font-semibold mb-2">Medical Expertise</h4>
            <p className="text-white/70 text-sm">
              Our AI understands medical terminology and provides accurate, contextual summaries
            </p>
          </LiquidCard>
          
          <LiquidCard className="p-6 text-center bg-white/10 backdrop-blur-sm border-white/20">
            <Clock className="w-10 h-10 text-white mx-auto mb-4" />
            <h4 className="text-white font-semibold mb-2">Lightning Fast</h4>
            <p className="text-white/70 text-sm">
              Get comprehensive summaries in seconds, not hours of manual reading
            </p>
          </LiquidCard>
          
          <LiquidCard className="p-6 text-center bg-white/10 backdrop-blur-sm border-white/20">
            <Download className="w-10 h-10 text-white mx-auto mb-4" />
            <h4 className="text-white font-semibold mb-2">Export Ready</h4>
            <p className="text-white/70 text-sm">
              Download your summaries as professional PDFs for easy sharing and storage
            </p>
          </LiquidCard>
        </div>
      </div>
    </div>
  );
};

export default StudyWithAI;
