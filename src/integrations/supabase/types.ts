export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      case_attempts: {
        Row: {
          completed: boolean | null
          created_at: string
          feedback: string | null
          id: string
          investigations_ordered: Json | null
          management_plan: Json | null
          questions_asked: Json | null
          scenario_id: string
          score: number | null
          time_taken: number | null
          updated_at: string
          user_diagnosis: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          feedback?: string | null
          id?: string
          investigations_ordered?: Json | null
          management_plan?: Json | null
          questions_asked?: Json | null
          scenario_id: string
          score?: number | null
          time_taken?: number | null
          updated_at?: string
          user_diagnosis?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          feedback?: string | null
          id?: string
          investigations_ordered?: Json | null
          management_plan?: Json | null
          questions_asked?: Json | null
          scenario_id?: string
          score?: number | null
          time_taken?: number | null
          updated_at?: string
          user_diagnosis?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_attempts_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "case_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      case_scenarios: {
        Row: {
          age: number
          context: string | null
          correct_diagnosis: string
          created_at: string
          difficulty_level: string
          gender: string
          id: string
          medical_history: string | null
          patient_name: string
          presenting_complaint: string
          specialty: string | null
          updated_at: string
          urgency_level: string
          vitals: Json
        }
        Insert: {
          age: number
          context?: string | null
          correct_diagnosis: string
          created_at?: string
          difficulty_level?: string
          gender: string
          id?: string
          medical_history?: string | null
          patient_name: string
          presenting_complaint: string
          specialty?: string | null
          updated_at?: string
          urgency_level?: string
          vitals?: Json
        }
        Update: {
          age?: number
          context?: string | null
          correct_diagnosis?: string
          created_at?: string
          difficulty_level?: string
          gender?: string
          id?: string
          medical_history?: string | null
          patient_name?: string
          presenting_complaint?: string
          specialty?: string | null
          updated_at?: string
          urgency_level?: string
          vitals?: Json
        }
        Relationships: []
      }
      case_wise_stats: {
        Row: {
          average_score: number | null
          best_streak: number | null
          cases_this_month: number | null
          completed_cases: number | null
          created_at: string
          current_streak: number | null
          daily_streak: number | null
          id: string
          last_activity_date: string | null
          last_case_date: string | null
          total_cases: number | null
          total_time_spent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_score?: number | null
          best_streak?: number | null
          cases_this_month?: number | null
          completed_cases?: number | null
          created_at?: string
          current_streak?: number | null
          daily_streak?: number | null
          id?: string
          last_activity_date?: string | null
          last_case_date?: string | null
          total_cases?: number | null
          total_time_spent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_score?: number | null
          best_streak?: number | null
          cases_this_month?: number | null
          completed_cases?: number | null
          created_at?: string
          current_streak?: number | null
          daily_streak?: number | null
          id?: string
          last_activity_date?: string | null
          last_case_date?: string | null
          total_cases?: number | null
          total_time_spent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_premium: boolean | null
          name: string | null
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          is_premium?: boolean | null
          name?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_premium?: boolean | null
          name?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string
          cancelled_at: string | null
          created_at: string
          currency: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_name: string
          price: number
          product_name: string
          status: string
          subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle: string
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_name: string
          price: number
          product_name: string
          status?: string
          subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle?: string
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_name?: string
          price?: number
          product_name?: string
          status?: string
          subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      summaries: {
        Row: {
          created_at: string
          id: string
          original_filename: string
          summary_file_url: string | null
          summary_text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          original_filename: string
          summary_file_url?: string | null
          summary_text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          original_filename?: string
          summary_file_url?: string | null
          summary_text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      symptom_entries: {
        Row: {
          age_group: string
          conditions: Json | null
          created_at: string
          gender: string
          id: string
          parsed_symptoms: Json | null
          risk_level: string | null
          symptom_details: string | null
          symptom_location: string | null
          symptom_onset: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age_group: string
          conditions?: Json | null
          created_at?: string
          gender: string
          id?: string
          parsed_symptoms?: Json | null
          risk_level?: string | null
          symptom_details?: string | null
          symptom_location?: string | null
          symptom_onset: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age_group?: string
          conditions?: Json | null
          created_at?: string
          gender?: string
          id?: string
          parsed_symptoms?: Json | null
          risk_level?: string | null
          symptom_details?: string | null
          symptom_location?: string | null
          symptom_onset?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      usage_tracking: {
        Row: {
          created_at: string
          id: string
          product_name: string
          reset_date: string
          updated_at: string
          usage_count: number
          usage_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_name: string
          reset_date?: string
          updated_at?: string
          usage_count?: number
          usage_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_name?: string
          reset_date?: string
          updated_at?: string
          usage_count?: number
          usage_type?: string
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          caption_text: string | null
          created_at: string
          id: string
          original_script: string
          refined_script: string | null
          status: string
          thumbnail_url: string | null
          updated_at: string
          user_id: string
          video_style: string
          video_url: string | null
          voice_option: string
          voice_url: string | null
        }
        Insert: {
          caption_text?: string | null
          created_at?: string
          id?: string
          original_script: string
          refined_script?: string | null
          status?: string
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
          video_style: string
          video_url?: string | null
          voice_option: string
          voice_url?: string | null
        }
        Update: {
          caption_text?: string | null
          created_at?: string
          id?: string
          original_script?: string
          refined_script?: string | null
          status?: string
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
          video_style?: string
          video_url?: string | null
          voice_option?: string
          voice_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_usage_count: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      initialize_case_wise_stats: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      update_case_wise_stats: {
        Args: {
          user_uuid: string
          new_score: number
          time_spent: number
          completed: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
