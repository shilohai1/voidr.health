
-- Create symptom_entries table
CREATE TABLE public.symptom_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  age_group TEXT NOT NULL CHECK (age_group IN ('Adult', 'Child')),
  symptom_onset TEXT NOT NULL,
  symptom_location TEXT,
  symptom_details TEXT,
  parsed_symptoms JSONB,
  conditions JSONB,
  risk_level TEXT CHECK (risk_level IN ('low', 'moderate', 'high', 'emergency')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.symptom_entries ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own symptom entries
CREATE POLICY "Users can view their own symptom entries" 
  ON public.symptom_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own symptom entries
CREATE POLICY "Users can create their own symptom entries" 
  ON public.symptom_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own symptom entries
CREATE POLICY "Users can update their own symptom entries" 
  ON public.symptom_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own symptom entries
CREATE POLICY "Users can delete their own symptom entries" 
  ON public.symptom_entries 
  FOR DELETE 
  USING (auth.uid() = user_id);
