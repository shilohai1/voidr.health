import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Your admin user ID - replace this with your actual Supabase user ID
const ADMIN_USER_ID = "0a6786a3-3495-4f82-8a4a-e5149a1d8302"; // You'll need to replace this

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Check billing usage
    const usageResponse = await fetch('https://api.openai.com/v1/dashboard/billing/usage', {
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

    // Get current month usage
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
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
