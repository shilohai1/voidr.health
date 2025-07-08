
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SummarizationResult {
  summary_id: string;
  download_url: string;
  summary_text: string;
  original_filename: string;
  message: string;
}

export const useFileSummarization = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const summarizeFile = async (file?: File, manualText?: string): Promise<SummarizationResult> => {
    if (!session) {
      throw new Error('Authentication required');
    }

    if (!file && !manualText) {
      throw new Error('Either file or manual text is required');
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      if (file) {
        formData.append('file', file);
      }
      
      if (manualText) {
        formData.append('manual_text', manualText);
      }

      const { data, error } = await supabase.functions.invoke('summarize-file', {
        body: formData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to summarize content';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    summarizeFile,
    loading,
    error,
  };
};
