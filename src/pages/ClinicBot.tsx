
import React, { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { Slider } from '@/components/ui/slider';
import { useFileSummarization } from '@/hooks/useFileSummarization';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Download, CheckCircle } from 'lucide-react';

const ClinicBot = () => {
  const [input, setInput] = useState('');
  const [wordCount, setWordCount] = useState([500]);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  
  const { generateSummary, downloadSummaryAsPDF, isLoading, summary } = useFileSummarization();
  const { toast } = useToast();

  const uploadOptions = [
    { name: 'Upload PDF', type: 'pdf', accept: '.pdf' },
    { name: 'Upload Word Document', type: 'word', accept: '.doc,.docx' },
  ];

  const handleFileUpload = (event, fileType) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setInput(`File uploaded: ${file.name}`);
      setShowUploadOptions(false);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handleGenerate = async () => {
    if (!input && !uploadedFile) {
      toast({
        title: "Missing Input",
        description: "Please enter text or upload a file to summarize.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (uploadedFile) {
        await generateSummary(uploadedFile);
      } else {
        // For manual text, we need to create a text file
        const blob = new Blob([input], { type: 'text/plain' });
        const file = new File([blob], 'manual_input.txt', { type: 'text/plain' });
        await generateSummary(file);
      }

      if (summary) {
        setGeneratedSummary({
          summary_text: summary,
          wordCount: wordCount[0],
          originalText: input,
          fileName: uploadedFile?.name || 'Manual Input'
        });

        toast({
          title: "Summary Generated",
          description: "Your clinical summary has been created successfully.",
        });
      }

    } catch (error) {
      console.error('Summarization error:', error);
      toast({
        title: "Generation Error",
        description: error.message || "Failed to generate summary. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async () => {
    if (!summary || !uploadedFile) return;

    try {
      await downloadSummaryAsPDF(summary, uploadedFile.name);
    } catch (error) {
      toast({
        title: "Download Error",
        description: "Failed to download the summary. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeWatermark = () => {
    toast({
      title: "Premium Feature",
      description: "Upgrade to premium to remove watermarks from your summaries.",
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#5fcfb9",
        backgroundImage:
          "linear-gradient(246deg, rgba(95, 207, 185, 1) 0%, rgba(88, 177, 209, 1) 100%)",
      }}
    >
      <DashboardSidebar />
      
      <div className="ml-16 p-4 md:p-8 transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-12 text-center">
            <img
              src="/lovable-uploads/ef109c7d-da65-4b73-8c54-766471cc628c.png"
              alt="ClinicBot Interface"
              className="w-full max-w-md mx-auto mb-6 rounded-2xl shadow-lg"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">Welcome to ClinicBot</h1>
            <p className="text-lg md:text-xl text-gray-600">
              Summarise your clinic files, lecture notes and documents into Short notes
            </p>
          </div>

          <LiquidCard className="p-6 md:p-8 mb-8">
            <div className="space-y-6">
              {/* Input Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your notes or upload a document
                </label>
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={uploadedFile ? `File uploaded: ${uploadedFile.name}` : "Enter your clinical notes, lecture content, or any medical text you want to summarize..."}
                    className="w-full h-32 md:h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    disabled={!!uploadedFile}
                  />
                  
                  {/* Upload Dropdown */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setShowUploadOptions(!showUploadOptions)}
                      className="p-2 text-gray-500 hover:text-primary transition-colors duration-200"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                    
                    {showUploadOptions && (
                      <div className="absolute right-0 top-10 z-10 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] transition-all duration-200">
                        {uploadOptions.map((option) => (
                          <label
                            key={option.type}
                            className="block w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-all duration-200 cursor-pointer text-black"
                          >
                            <input
                              type="file"
                              accept={option.accept}
                              onChange={(e) => handleFileUpload(e, option.type)}
                              className="hidden"
                            />
                            {option.name}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Clear uploaded file button */}
                  {uploadedFile && (
                    <button
                      onClick={() => {
                        setUploadedFile(null);
                        setInput('');
                      }}
                      className="absolute bottom-4 right-4 text-sm text-red-600 hover:text-red-800 transition-colors"
                    >
                      Clear file
                    </button>
                  )}
                </div>
              </div>

              {/* Word Count Slider - Only show for manual text input */}
              {!uploadedFile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Target word count: {wordCount[0]} words
                  </label>
                  <div className="px-2">
                    <Slider
                      value={wordCount}
                      onValueChange={setWordCount}
                      max={1000}
                      min={100}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>100 words</span>
                      <span>1000 words</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <LiquidButton
                onClick={handleGenerate}
                disabled={(!input && !uploadedFile) || isLoading}
                className="w-full"
              >
                {isLoading ? 'Generating Summary...' : 'Generate Summary'}
              </LiquidButton>

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-gray-600">Processing your content...</span>
                  </div>
                </div>
              )}
            </div>
          </LiquidCard>

          {/* Generated Summary */}
          {summary && (
            <LiquidCard className="p-6 md:p-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Generated Summary</h2>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600">Complete</span>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{wordCount[0]}</div>
                    <div className="text-sm text-gray-600">Target Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{uploadedFile?.name || 'Manual Input'}</div>
                    <div className="text-sm text-gray-600">Source</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">✓</div>
                    <div className="text-sm text-gray-600">Processed</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border relative">
                  {/* Watermark */}
                  <div className="absolute top-2 right-2 text-xs text-gray-400 opacity-50">
                    Generated by ClinicBot
                  </div>
                  
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Summary:</h3>
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {summary}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {/* Remove Watermark Button */}
                  <LiquidButton 
                    onClick={removeWatermark}
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    Remove Watermark
                  </LiquidButton>

                  {/* Download PDF Button */}
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </LiquidCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicBot;
