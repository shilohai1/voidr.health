-- Fix mutable search_path on selected public functions
-- Ref: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable
-- This migration safely finds all matching function signatures and applies a fixed search_path.

DO $$
DECLARE
  func record;
BEGIN
  FOR func IN
    SELECT p.oid::regprocedure AS regproc
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'after_symptom_analysis_increment',
        'after_clinicbot_summary_increment',
        'after_case_attempt_created',
        'after_case_attempt_completed',
        'ensure_profile_exists',
        'handle_new_user',
        'handle_new_user_subscription'
      )
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = pg_catalog, public', func.regproc);
  END LOOP;
END
$$;


