
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface VideoGenerationRequest {
  user_script: string;
  voice_option: string;
  video_style: string;
  category: string;
  difficulty: string;
}

interface VideoStatus {
  video_id: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  video_url?: string;
  thumbnail_url?: string;
  caption_text?: string;
  voice_url?: string;
  original_script?: string;
  refined_script?: string;
  created_at?: string;
  updated_at?: string;
}

export const useVideoGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const generateVideo = async (request: VideoGenerationRequest) => {
    if (!session) {
      throw new Error('Authentication required');
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Starting video generation with request:', request);
      
      const { data, error } = await supabase.functions.invoke('generate-video', {
        body: {
          user_script: request.user_script,
          voice_option: request.voice_option,
          video_style: request.video_style,
          category: request.category,
          difficulty: request.difficulty
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Video generation started successfully:', data);
      return data;
    } catch (err) {
      console.error('Video generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate video';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getVideoStatus = async (videoId: string): Promise<VideoStatus> => {
    if (!session) {
      throw new Error('Authentication required');
    }

    try {
      console.log('Checking video status for ID:', videoId);
      
      const { data, error } = await supabase.functions.invoke('get-video-status', {
        body: { video_id: videoId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Get video status error:', error);
        throw error;
      }

      console.log('Video status retrieved:', data);
      return data;
    } catch (err) {
      console.error('Get video status error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get video status';
      throw new Error(errorMessage);
    }
  };

  return {
    generateVideo,
    getVideoStatus,
    loading,
    error,
  };
};
