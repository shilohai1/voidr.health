
import React, { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { LiquidCard } from '@/components/ui/liquid-glass-card';
import { useVideoGeneration } from '@/hooks/useVideoGeneration';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  Stethoscope, 
  Microscope, 
  Pill, 
  Dna, 
  Users,
  Download,
  Play
} from 'lucide-react';

const StudyWithAI = () => {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [videoStatus, setVideoStatus] = useState('');
  
  const { generateVideo, getVideoStatus, loading } = useVideoGeneration();
  const { toast } = useToast();

  const categories = [
    { name: 'Anatomy', icon: Heart },
    { name: 'Physiology', icon: Stethoscope },
    { name: 'Biochemistry', icon: Dna },
    { name: 'Pathology', icon: Microscope },
    { name: 'Microbiology', icon: Users },
    { name: 'Pharmacology', icon: Pill },
  ];

  const handleGenerateVideo = async () => {
    if (!prompt || !category || !difficulty) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating the video.",
        variant: "destructive"
      });
      return;
    }

    try {
      const enhancedPrompt = `${prompt} (Category: ${category}, Difficulty: ${difficulty})`;
      
      const result = await generateVideo({
        user_script: enhancedPrompt,
        voice_option: 'professional',
        video_style: difficulty.toLowerCase()
      });

      setVideoStatus('generating');
      toast({
        title: "Video Generation Started",
        description: "Your video is being generated. This may take a few minutes.",
      });

      // Poll for video status
      const pollStatus = async (videoId) => {
        const statusResult = await getVideoStatus(videoId);
        
        if (statusResult.status === 'completed') {
          setGeneratedVideo(statusResult);
          setVideoStatus('completed');
          toast({
            title: "Video Ready!",
            description: "Your educational video has been generated successfully.",
          });
        } else if (statusResult.status === 'failed') {
          setVideoStatus('failed');
          toast({
            title: "Generation Failed",
            description: "There was an error generating your video. Please try again.",
            variant: "destructive"
          });
        } else {
          setTimeout(() => pollStatus(videoId), 5000);
        }
      };

      if (result.video_id) {
        pollStatus(result.video_id);
      }

    } catch (error) {
      console.error('Video generation error:', error);
      toast({
        title: "Generation Error",
        description: error.message || "Failed to generate video. Please try again.",
        variant: "destructive"
      });
      setVideoStatus('failed');
    }
  };

  const handleDownload = (quality) => {
    if (generatedVideo?.video_url) {
      const link = document.createElement('a');
      link.href = generatedVideo.video_url;
      link.download = `study-video-${quality}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `Your video is downloading in ${quality} quality.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <DashboardSidebar />
      
      <div className="ml-16 p-8 transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Welcome to StudyWithAI</h1>
            <p className="text-xl text-gray-600">
              Create short educational medical videos instantly based on your prompts
            </p>
          </div>

          <LiquidCard className="p-8 mb-8">
            <div className="space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your medical topic or prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Explain the cardiac cycle and its phases..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose a category
                </label>
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowCategories(true)}
                    onMouseLeave={() => setShowCategories(false)}
                    className="w-full p-4 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  >
                    {category || 'Select a category...'}
                  </button>
                  
                  {showCategories && (
                    <div 
                      className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ease-out"
                      onMouseEnter={() => setShowCategories(true)}
                      onMouseLeave={() => setShowCategories(false)}
                    >
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.name}
                            onClick={() => {
                              setCategory(cat.name);
                              setShowCategories(false);
                            }}
                            className="w-full p-4 text-left hover:bg-gray-50 flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg transition-all duration-200"
                          >
                            <Icon className="w-5 h-5 text-primary" />
                            <span className="text-black">{cat.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <div className="flex space-x-4">
                  {['Basic', 'Clinical'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        difficulty === level
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <LiquidButton
                onClick={handleGenerateVideo}
                disabled={!prompt || !category || !difficulty || loading}
                className="w-full"
              >
                {loading ? 'Generating...' : 'Generate Video'}
              </LiquidButton>

              {/* Status Display */}
              {videoStatus && (
                <div className="text-center py-4">
                  {videoStatus === 'generating' && (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="text-gray-600">Processing your video...</span>
                    </div>
                  )}
                  {videoStatus === 'failed' && (
                    <p className="text-red-600">Video generation failed. Please try again.</p>
                  )}
                </div>
              )}
            </div>
          </LiquidCard>

          {/* Video Result */}
          {generatedVideo && videoStatus === 'completed' && (
            <LiquidCard className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Video is Ready!</h2>
                </div>
                
                {/* Video Preview */}
                <div className="relative bg-gray-900 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
                  {generatedVideo.video_url ? (
                    <video 
                      controls 
                      className="w-full h-full object-cover"
                      poster={generatedVideo.thumbnail_url}
                    >
                      <source src={generatedVideo.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Video Preview</p>
                    </div>
                  )}
                </div>

                {/* Video Details */}
                {generatedVideo.caption_text && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Video Script:</h3>
                    <p className="text-gray-700 text-sm">{generatedVideo.caption_text}</p>
                  </div>
                )}

                {/* Download Options */}
                <div className="flex justify-center space-x-4">
                  <LiquidButton 
                    onClick={() => handleDownload('720p')}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>720p (Free)</span>
                  </LiquidButton>
                  <LiquidButton 
                    onClick={() => handleDownload('1080p')}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>1080p (Premium)</span>
                  </LiquidButton>
                </div>
              </div>
            </LiquidCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyWithAI;
