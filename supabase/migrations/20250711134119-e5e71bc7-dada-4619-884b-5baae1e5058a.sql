
-- Update the case_wise_stats table to include daily streak tracking
ALTER TABLE public.case_wise_stats 
ADD COLUMN IF NOT EXISTS daily_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_date date;

-- Update the update_case_wise_stats function to handle daily streak logic
CREATE OR REPLACE FUNCTION public.update_case_wise_stats(user_uuid uuid, new_score integer, time_spent integer, completed boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  current_stats RECORD;
  new_streak integer := 0;
  new_daily_streak integer := 0;
  current_date date := CURRENT_DATE;
BEGIN
  -- Get current stats or create if doesn't exist
  SELECT * FROM public.case_wise_stats WHERE user_id = user_uuid INTO current_stats;
  
  IF current_stats IS NULL THEN
    PERFORM public.initialize_case_wise_stats(user_uuid);
    SELECT * FROM public.case_wise_stats WHERE user_id = user_uuid INTO current_stats;
  END IF;

  -- Calculate new streak (existing logic)
  IF completed AND new_score >= 70 THEN
    new_streak := current_stats.current_streak + 1;
  ELSE
    new_streak := 0;
  END IF;

  -- Calculate daily streak
  IF current_stats.last_activity_date IS NULL THEN
    -- First time using the simulator
    new_daily_streak := 1;
  ELSIF current_stats.last_activity_date = current_date THEN
    -- Same day, maintain streak
    new_daily_streak := current_stats.daily_streak;
  ELSIF current_stats.last_activity_date = current_date - INTERVAL '1 day' THEN
    -- Consecutive day, increment streak
    new_daily_streak := current_stats.daily_streak + 1;
  ELSE
    -- Streak broken, reset to 1
    new_daily_streak := 1;
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
    daily_streak = new_daily_streak,
    total_time_spent = current_stats.total_time_spent + time_spent,
    cases_this_month = (
      CASE 
        WHEN DATE_TRUNC('month', NOW()) = DATE_TRUNC('month', current_stats.last_case_date) 
        THEN current_stats.cases_this_month + 1
        ELSE 1
      END
    ),
    last_case_date = NOW(),
    last_activity_date = current_date,
    updated_at = NOW()
  WHERE user_id = user_uuid;
END;
$function$
