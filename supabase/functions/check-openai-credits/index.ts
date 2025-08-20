import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// The allowed admin user id must be set as an env var in Supabase function settings
const ADMIN_USER_ID = Deno.env.get('ADMIN_USER_ID');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate caller and restrict access to admin only
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!ADMIN_USER_ID || user.id !== ADMIN_USER_ID) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    // Get OpenAI API key from environment
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        message: 'Please check your Supabase environment variables'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check billing usage for current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const start = startOfMonth.toISOString().slice(0, 10);
    const end = endOfMonth.toISOString().slice(0, 10);

    const usageResponse = await fetch(`https://api.openai.com/v1/dashboard/billing/usage?start_date=${start}&end_date=${end}`, {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
    });

    if (!usageResponse.ok) {
      const errorText = await usageResponse.text();
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch usage data',
        details: errorText
      }), {
        status: usageResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const usageData = await usageResponse.json();

    // Check subscription info
    const subscriptionResponse = await fetch('https://api.openai.com/v1/dashboard/billing/subscription', {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
    });

    let subscriptionData = null;
    if (subscriptionResponse.ok) {
      subscriptionData = await subscriptionResponse.json();
    }

    // Calculate remaining credits
    const totalGranted = subscriptionData?.hard_limit_usd || 0;
    const totalUsed = usageData.total_usage / 100; // Convert from cents to dollars
    const remainingCredits = totalGranted - totalUsed;

    // Get current month usage (already scoped above)
    const currentMonthUsage = usageData.daily_costs?.reduce((total: number, day: any) => {
      const dayDate = new Date(day.timestamp);
      if (dayDate >= startOfMonth && dayDate <= endOfMonth) {
        return total + (day.line_items?.reduce((sum: number, item: any) => sum + item.cost, 0) || 0);
      }
      return total;
    }, 0) / 100; // Convert from cents to dollars

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      credits: {
        total_granted: totalGranted,
        total_used: totalUsed,
        remaining: remainingCredits,
        current_month_usage: currentMonthUsage,
        usage_percentage: totalGranted > 0 ? (totalUsed / totalGranted) * 100 : 0
      },
      subscription: subscriptionData ? {
        plan: subscriptionData.plan?.id,
        status: subscriptionData.status,
        next_billing_date: subscriptionData.next_billing_date
      } : null,
      usage_breakdown: usageData.daily_costs?.slice(-7)?.map((day: any) => ({
        date: day.timestamp,
        cost: (day.line_items?.reduce((sum: number, item: any) => sum + item.cost, 0) || 0) / 100
      })) || []
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error checking OpenAI credits:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to check credits',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
