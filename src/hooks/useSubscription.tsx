import React, { useEffect, useState, useContext, createContext } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../integrations/supabase/client'

export type PlanType = 'free' | 'clinical_starter' | 'clinical_pro' | 'wise_starter' | 'wise_pro' | 'launch_bundle'

interface UsageLimit {
  notes_limit: number
  simulations_limit: number
  pdf_enabled: boolean
  is_unlimited_notes: boolean
  is_unlimited_simulations: boolean
}

const PLAN_LIMITS: Record<PlanType, UsageLimit> = {
  free: {
    notes_limit: 2,
    simulations_limit: 5,
    pdf_enabled: false,
    is_unlimited_notes: false,
    is_unlimited_simulations: false
  },
  clinical_starter: {
    notes_limit: 30,
    simulations_limit: 10,
    pdf_enabled: true,
    is_unlimited_notes: false,
    is_unlimited_simulations: false
  },
  clinical_pro: {
    notes_limit: 0, // Unlimited
    simulations_limit: 10,
    pdf_enabled: true,
    is_unlimited_notes: true,
    is_unlimited_simulations: false
  },
  wise_starter: {
    notes_limit: 2,
    simulations_limit: 30,
    pdf_enabled: false,
    is_unlimited_notes: false,
    is_unlimited_simulations: false
  },
  wise_pro: {
    notes_limit: 2,
    simulations_limit: 0, // Unlimited
    pdf_enabled: false,
    is_unlimited_notes: false,
    is_unlimited_simulations: true
  },
  launch_bundle: {
    notes_limit: 30,
    simulations_limit: 50,
    pdf_enabled: true,
    is_unlimited_notes: false,
    is_unlimited_simulations: false
  }
}

interface SubscriptionData {
  plan: PlanType
  notes_used: number
  simulations_used: number
  notes_remaining: number
  simulations_remaining: number
  pdf_enabled: boolean
  is_unlimited_notes: boolean
  is_unlimited_simulations: boolean
}

const SubscriptionContext = createContext<any>(null);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    plan: 'free',
    notes_used: 0,
    simulations_used: 0,
    notes_remaining: PLAN_LIMITS.free.notes_limit,
    simulations_remaining: PLAN_LIMITS.free.simulations_limit,
    pdf_enabled: PLAN_LIMITS.free.pdf_enabled,
    is_unlimited_notes: PLAN_LIMITS.free.is_unlimited_notes,
    is_unlimited_simulations: PLAN_LIMITS.free.is_unlimited_simulations
  });

  const fetchSubscriptionData = async () => {
    if (!user) return

    try {
      console.log('Fetching subscription data for user:', user.id);
      // Get subscription data
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (subError) throw subError

      // Get usage data for current month for both notes and simulations
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      const resetDate = startOfMonth.toISOString().slice(0, 10) // YYYY-MM-DD

      // Fetch notes usage
      const { data: notesUsage, error: notesError } = await supabase
        .from('usage_tracking')
        .select('usage_count')
        .eq('user_id', user.id)
        .eq('product_name', 'clinicbot')
        .eq('usage_type', 'notes')
        .eq('reset_date', resetDate)
        .maybeSingle()
      console.log('Notes usage:', notesUsage, 'Error:', notesError);

      // Fetch simulations usage
      const { data: simulationsUsage, error: simulationsError } = await supabase
        .from('usage_tracking')
        .select('usage_count')
        .eq('user_id', user.id)
        .eq('product_name', 'casewise')
        .eq('usage_type', 'simulations')
        .eq('reset_date', resetDate)
        .maybeSingle()
      console.log('Simulations usage:', simulationsUsage, 'Error:', simulationsError);

      if ((notesError && notesError.code !== 'PGRST116') || (simulationsError && simulationsError.code !== 'PGRST116')) {
        throw notesError || simulationsError
      }

      const plan = (subscription?.plan_name as PlanType) || 'free'
      const planLimits = PLAN_LIMITS[plan]
      const notesUsed = notesUsage?.usage_count || 0
      const simulationsUsed = simulationsUsage?.usage_count || 0

      setSubscriptionData({
        plan,
        notes_used: notesUsed,
        simulations_used: simulationsUsed,
        notes_remaining: planLimits.is_unlimited_notes ? -1 : Math.max(0, planLimits.notes_limit - notesUsed),
        simulations_remaining: planLimits.is_unlimited_simulations ? -1 : Math.max(0, planLimits.simulations_limit - simulationsUsed),
        pdf_enabled: planLimits.pdf_enabled,
        is_unlimited_notes: planLimits.is_unlimited_notes,
        is_unlimited_simulations: planLimits.is_unlimited_simulations
      })
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    }
  }

  const incrementUsage = async (type: 'notes' | 'simulations', product: 'clinicbot' | 'casewise' = 'clinicbot') => {
    if (!user) return false

    try {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      const resetDate = startOfMonth.toISOString().slice(0, 10) // YYYY-MM-DD

      console.log('Incrementing usage for user:', user.id, 'product:', product, 'type:', type);
      // Check if we have a usage record for this user, product, type, and month
      const { data: existingUsage, error: fetchError } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_name', product)
        .eq('usage_type', type)
        .eq('reset_date', resetDate)
        .maybeSingle()

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

      if (existingUsage) {
        // Update existing usage record
        const { error: updateError } = await supabase
          .from('usage_tracking')
          .update({
            usage_count: existingUsage.usage_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUsage.id)

        if (updateError) throw updateError
      } else {
        // Create new usage record
        const { error: insertError } = await supabase
          .from('usage_tracking')
          .insert({
            user_id: user.id,
            product_name: product,
            usage_type: type,
            usage_count: 1,
            reset_date: resetDate,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError
        }
      }

      // Refresh subscription data
      await fetchSubscriptionData()
      return true
    } catch (error) {
      console.error('Error incrementing usage:', error)
      return false
    }
  }

  const canUseFeature = (feature: 'casewise' | 'clinicbot', type: 'notes' | 'simulations') => {
    if (type === 'notes') {
      return {
        allowed: subscriptionData.is_unlimited_notes || subscriptionData.notes_remaining > 0,
        remaining: subscriptionData.is_unlimited_notes ? -1 : subscriptionData.notes_remaining,
        limit: subscriptionData.is_unlimited_notes ? -1 : PLAN_LIMITS[subscriptionData.plan].notes_limit
      };
    } else {
      return {
        allowed: subscriptionData.is_unlimited_simulations || subscriptionData.simulations_remaining > 0,
        remaining: subscriptionData.is_unlimited_simulations ? -1 : subscriptionData.simulations_remaining,
        limit: subscriptionData.is_unlimited_simulations ? -1 : PLAN_LIMITS[subscriptionData.plan].simulations_limit
      };
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
    // Optionally, listen for storage events to sync across tabs
    // window.addEventListener('storage', fetchSubscriptionData);
    // return () => window.removeEventListener('storage', fetchSubscriptionData);
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{
      ...subscriptionData,
      incrementUsage,
      canUseFeature,
      refreshSubscriptionData: fetchSubscriptionData
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
