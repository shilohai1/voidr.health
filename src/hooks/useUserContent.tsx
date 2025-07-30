
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserContent {
  user_profile: any;
  videos: any[];
  summaries: any[];
  total_videos: number;
  total_summaries: number;
}

export const useUserContent = () => {
  const [content, setContent] = useState<UserContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session, user } = useAuth();

  const fetchUserContent = async () => {
    if (!session || !user) {
      console.log('No session or user available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching user content...');
      const { data, error } = await supabase.functions.invoke('get-user-content', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to fetch user content');
      }

      console.log('User content fetched successfully:', data);
      setContent(data);
    } catch (err) {
      console.error('Error in fetchUserContent:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user content';
      setError(errorMessage);
      // Set empty content to prevent UI errors
      setContent({
        user_profile: null,
        videos: [],
        summaries: [],
        total_videos: 0,
        total_summaries: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session && user) {
      fetchUserContent();
    } else {
      // Reset content when no user
      setContent(null);
      setError(null);
    }
  }, [session, user]);

  return {
    content,
    loading,
    error,
    refreshContent: fetchUserContent,
  };
};
