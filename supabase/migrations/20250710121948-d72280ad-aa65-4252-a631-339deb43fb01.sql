
-- Create table for case wise scenarios
CREATE TABLE public.case_scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  presenting_complaint TEXT NOT NULL,
  vitals JSONB NOT NULL DEFAULT '{}',
  context TEXT,
  medical_history TEXT,
  correct_diagnosis TEXT NOT NULL,
  difficulty_level TEXT NOT NULL DEFAULT 'medium',
  specialty TEXT,
  urgency_level TEXT NOT NULL DEFAULT 'routine',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user case attempts
CREATE TABLE public.case_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id UUID NOT NULL REFERENCES public.case_scenarios(id) ON DELETE CASCADE,
  questions_asked JSONB DEFAULT '[]',
  investigations_ordered JSONB DEFAULT '[]',
  user_diagnosis TEXT,
  management_plan JSONB DEFAULT '[]',
  score INTEGER DEFAULT 0,
  time_taken INTEGER DEFAULT 0, -- in seconds
  completed BOOLEAN DEFAULT FALSE,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user case wise stats
CREATE TABLE public.case_wise_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_cases INTEGER DEFAULT 0,
  completed_cases INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0.00,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  cases_this_month INTEGER DEFAULT 0,
  last_case_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.case_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_wise_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for case_scenarios (public read for all authenticated users)
CREATE POLICY "All authenticated users can view scenarios" 
  ON public.case_scenarios 
  FOR SELECT 
  TO authenticated
  USING (true);

-- RLS Policies for case_attempts
CREATE POLICY "Users can view their own case attempts" 
  ON public.case_attempts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own case attempts" 
  ON public.case_attempts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own case attempts" 
  ON public.case_attempts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for case_wise_stats
CREATE POLICY "Users can view their own case wise stats" 
  ON public.case_wise_stats 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own case wise stats" 
  ON public.case_wise_stats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own case wise stats" 
  ON public.case_wise_stats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Function to initialize user stats
CREATE OR REPLACE FUNCTION public.initialize_case_wise_stats(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.case_wise_stats (user_id)
  VALUES (user_uuid)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Function to update case wise stats
CREATE OR REPLACE FUNCTION public.update_case_wise_stats(
  user_uuid uuid,
  new_score integer,
  time_spent integer,
  completed boolean
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  current_stats RECORD;
  new_streak integer := 0;
BEGIN
  -- Get current stats or create if doesn't exist
  SELECT * FROM public.case_wise_stats WHERE user_id = user_uuid INTO current_stats;
  
  IF current_stats IS NULL THEN
    PERFORM public.initialize_case_wise_stats(user_uuid);
    SELECT * FROM public.case_wise_stats WHERE user_id = user_uuid INTO current_stats;
  END IF;

  -- Calculate new streak
  IF completed AND new_score >= 70 THEN
    new_streak := current_stats.current_streak + 1;
  ELSE
    new_streak := 0;
  END IF;

  -- Update stats
  UPDATE public.case_wise_stats SET
    total_cases = current_stats.total_cases + 1,
    completed_cases = current_stats.completed_cases + (CASE WHEN completed THEN 1 ELSE 0 END),
    average_score = (
      (current_stats.average_score * current_stats.completed_cases + 
       (CASE WHEN completed THEN new_score ELSE 0 END)) / 
      GREATEST(1, current_stats.completed_cases + (CASE WHEN completed THEN 1 ELSE 0 END))
    ),
    current_streak = new_streak,
    best_streak = GREATEST(current_stats.best_streak, new_streak),
    total_time_spent = current_stats.total_time_spent + time_spent,
    cases_this_month = (
      CASE 
        WHEN DATE_TRUNC('month', NOW()) = DATE_TRUNC('month', current_stats.last_case_date) 
        THEN current_stats.cases_this_month + 1
        ELSE 1
      END
    ),
    last_case_date = NOW(),
    updated_at = NOW()
  WHERE user_id = user_uuid;
END;
$$;
