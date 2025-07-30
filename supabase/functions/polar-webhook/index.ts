import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const polarWebhookSecret = Deno.env.get('POLAR_WEBHOOK_SECRET')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface PolarSubscription {
  id: string
  user_id: string
  status: string
  plan_id: string
  created_at: string
  updated_at: string
}

const planMapping: Record<string, string> = {
  'polar_cl_cV1a6rzBp9o3R2OjH6F0pIxNevppLcd1n0sff0I5eGI': 'clinical_starter',
  'polar_cl_w58BlnB3fhSZhMK07JZGA3EuocVjS1HppU1U14AtqHe': 'clinical_pro',
  'polar_cl_qZEyoG4QHG5584E73QQ28Py5Pt77MYeUnAgQv1vj8MK': 'wise_starter',
  'polar_cl_xB2RTXzohCHZmp9I6kzrCZwqxFgYHvUIuUhTM0dAoZl': 'wise_pro',
  'polar_cl_dtyIfCwh9E6x9e42RTPAf7ZEV810wim8s0C650JQ37B': 'launch_bundle'
}

serve(async (req) => {
  try {
    // Verify webhook signature
    const signature = req.headers.get('x-polar-signature')
    if (!signature) {
      return new Response('Missing signature', { status: 401 })
    }

    const body = await req.text()
    const hmac = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(polarWebhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const expectedSignature = await crypto.subtle.sign(
      'HMAC',
      hmac,
      new TextEncoder().encode(body)
    )
    const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (signature !== expectedSignatureHex) {
      return new Response('Invalid signature', { status: 401 })
    }

    const event = JSON.parse(body)
    const subscription = event.data as PolarSubscription

    // Map Polar.sh plan ID to our plan type
    const planType = planMapping[subscription.plan_id] || 'free'

    switch (event.type) {
      case 'subscription.created':
      case 'subscription.updated':
        if (subscription.status === 'active') {
          // Update or create subscription record
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: subscription.user_id,
              subscription_id: subscription.id,
              plan_type: planType,
              status: subscription.status,
              created_at: subscription.created_at,
              updated_at: subscription.updated_at
            })

          if (error) throw error
        }
        break

      case 'subscription.deleted':
      case 'subscription.cancelled':
        // Set user back to free plan
        const { error } = await supabase
          .from('subscriptions')
          .update({
            plan_type: 'free',
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('subscription_id', subscription.id)

        if (error) throw error
        break
    }

    return new Response('Webhook processed successfully', { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Internal server error', { status: 500 })
  }
}) 
