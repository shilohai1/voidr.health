
-- Create videos table for StudyWithAI
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  original_script TEXT NOT NULL,
  refined_script TEXT,
  voice_option TEXT NOT NULL,
  video_style TEXT NOT NULL,
  voice_url TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  caption_text TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create summaries table for ClinicBot
CREATE TABLE public.summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  original_filename TEXT NOT NULL,
  summary_file_url TEXT,
  summary_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) for videos table
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own videos" 
  ON public.videos 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own videos" 
  ON public.videos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" 
  ON public.videos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add Row Level Security (RLS) for summaries table
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own summaries" 
  ON public.summaries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own summaries" 
  ON public.summaries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own summaries" 
  ON public.summaries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create storage buckets for audio files and summaries
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('audio', 'audio', false),
  ('summaries', 'summaries', false);

-- Create storage policies for audio bucket
CREATE POLICY "Users can upload their own audio files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own audio files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for summaries bucket
CREATE POLICY "Users can upload their own summary files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'summaries' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own summary files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'summaries' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add usage_count and is_premium columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN usage_count INTEGER DEFAULT 0,
ADD COLUMN is_premium BOOLEAN DEFAULT false;

-- Create function to increment usage count
CREATE OR REPLACE FUNCTION public.increment_usage_count(user_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET usage_count = usage_count + 1 
  WHERE id = user_uuid;
END;
$$;
