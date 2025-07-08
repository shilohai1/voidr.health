
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface VideoGenerationRequest {
  user_script: string;
  voice_option: string;
  video_style: string;
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
      const { data, error } = await supabase.functions.invoke('generate-video', {
        body: request,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
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
      const { data, error } = await supabase.functions.invoke('get-video-status', {
        body: { video_id: videoId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
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
