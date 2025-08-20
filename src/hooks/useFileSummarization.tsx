
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useFileSummarization = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const { session } = useAuth();

  const generateSummary = async (file: File, wordCount: number = 500) => {
    if (!session) {
      toast.error('Please sign in to use this feature');
      return;
    }

    setIsLoading(true);
    setSummary('');

    try {
      const fileData = await file.arrayBuffer();
      const bytes = new Uint8Array(fileData);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64File = btoa(binary);

      const { data, error } = await supabase.functions.invoke('summarize-file', {
        body: {
          file: base64File,
          filename: file.name,
          mimeType: file.type,
          wordCount: wordCount,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Function invocation error:', error);
        throw new Error(error.message || 'Failed to generate summary');
      }

      if (!data?.summary) {
        throw new Error('No summary received from the service');
      }

      setSummary(data.summary);
      toast.success(`Summary generated successfully! (${wordCount} words)`);
    } catch (error) {
      console.error('Error generating summary:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTextSummary = async (text: string, wordCount: number = 500) => {
    if (!session) {
      toast.error('Please sign in to use this feature');
      return;
    }
    setIsLoading(true);
    setSummary('');
    try {
      const { data, error } = await supabase.functions.invoke('summarize-file', {
        body: {
          text: text,
          wordCount: wordCount,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (error) {
        console.error('Function invocation error:', error);
        throw new Error(error.message || 'Failed to generate summary');
      }
      if (!data?.summary) {
        throw new Error('No summary received from the service');
      }
      setSummary(data.summary);
      toast.success(`Summary generated successfully! (${wordCount} words)`);
    } catch (error) {
      console.error('Error generating summary:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSummaryAsPDF = async (summaryText: string, filename: string) => {
    try {
      // Create a simple PDF content
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Summary - ${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .title { color: #333; font-size: 24px; margin-bottom: 10px; }
            .subtitle { color: #666; font-size: 14px; }
            .content { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">ClinicBot Summary</h1>
            <p class="subtitle">Generated on ${new Date().toLocaleDateString()}</p>
            <p class="subtitle">Original file: ${filename}</p>
          </div>
          <div class="content">${summaryText}</div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `summary-${filename.replace(/\.[^/.]+$/, '')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Summary downloaded successfully!');
    } catch (error) {
      console.error('Error downloading summary:', error);
      toast.error('Failed to download summary');
    }
  };

  return {
    generateSummary,
    generateTextSummary,
    downloadSummaryAsPDF,
    isLoading,
    summary,
    setSummary,
  };
};
