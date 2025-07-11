
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Download,
  CheckCircle,
  AlertCircle,
  Brain,
  Clock,
  FileCheck
} from 'lucide-react';
import { useFileSummarization } from '@/hooks/useFileSummarization';
import { useAuth } from '@/contexts/AuthContext';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { Link } from 'react-router-dom';

const StudyWithAI = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { generateSummary, downloadSummaryAsPDF, isLoading, summary } = useFileSummarization();
  const { user } = useAuth();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

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
    if (!selectedFile) return;
    await generateSummary(selectedFile);
  };

  const handleDownload = () => {
    if (summary && selectedFile) {
      downloadSummaryAsPDF(summary, selectedFile.name);
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
                  className="h-8 w-auto"
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
          {/* Upload Section */}
          <LiquidCard className="p-8 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="text-center mb-6">
              <FileText className="w-16 h-16 text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Upload Your Document</h2>
              <p className="text-white/70">
                Upload medical documents, research papers, or case studies for instant AI summarization
              </p>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-white bg-white/20' 
                  : 'border-white/30 hover:border-white/50 hover:bg-white/10'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
              
              {selectedFile ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <FileCheck className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">{selectedFile.name}</span>
                  </div>
                  <p className="text-white/60 text-sm">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <LiquidButton
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="text-sm bg-white/20 hover:bg-white/30 text-white"
                  >
                    Choose Different File
                  </LiquidButton>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-white text-lg">
                    Drag and drop your file here, or
                  </p>
                  
                  <LiquidButton
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/20 hover:bg-white/30 text-white"
                  >
                    Browse Files
                  </LiquidButton>
                  
                  <p className="text-white/60 text-sm">
                    Supports PDF, Word documents, and text files (up to 10MB)
                  </p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {/* Summarize Button */}
            {selectedFile && (
              <div className="mt-6">
                <LiquidButton
                  onClick={handleSummarize}
                  disabled={isLoading}
                  className="w-full text-lg py-4 bg-white/20 hover:bg-white/30 text-white disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Analyzing Document...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Summary
                    </>
                  )}
                </LiquidButton>
              </div>
            )}
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
                  <span>Processing your document...</span>
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
                  Upload a document to get started
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
