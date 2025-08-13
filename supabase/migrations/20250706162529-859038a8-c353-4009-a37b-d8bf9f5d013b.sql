
-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create videos table for StudyWithAI
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_script TEXT NOT NULL,
  refined_script TEXT,
  voice_url TEXT,
  video_url TEXT,
  caption_text TEXT,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  voice_option TEXT,
  video_style TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create summaries table for ClinicBot
CREATE TABLE public.summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_filename TEXT NOT NULL,
  summary_file_url TEXT NOT NULL,
  original_file_url TEXT,
  summary_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stripe_payments table
CREATE TABLE public.stripe_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT NOT NULL UNIQUE,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'cancelled')),
  amount INTEGER,
  currency TEXT DEFAULT 'usd',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for videos table
CREATE POLICY "Users can view their own videos" ON public.videos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own videos" ON public.videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" ON public.videos
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for summaries table
CREATE POLICY "Users can view their own summaries" ON public.summaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own summaries" ON public.summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for stripe_payments table
CREATE POLICY "Users can view their own payments" ON public.stripe_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" ON public.stripe_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('videos', 'videos', false),
  ('summaries', 'summaries', false),
  ('thumbnails', 'thumbnails', false),
  ('audio', 'audio', false);

-- Create storage policies
CREATE POLICY "Users can upload their own videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own summaries" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'summaries' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own summaries" ON storage.objects
  FOR SELECT USING (bucket_id = 'summaries' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own thumbnails" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own thumbnails" ON storage.objects
  FOR SELECT USING (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own audio" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own audio" ON storage.objects
  FOR SELECT USING (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to handle new user registration
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO public.users (id, email)
--   VALUES (NEW.id, NEW.email);
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to increment usage count
CREATE OR REPLACE FUNCTION public.increment_usage_count(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users 
  SET usage_count = usage_count + 1, updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
