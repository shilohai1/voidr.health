
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VideoRequest {
  user_script: string;
  voice_option: string;
  video_style: string;
  category?: string;
  difficulty?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return "Coming Soon" message instead of processing the video
    return new Response(
      JSON.stringify({ 
        error: 'StudyWithAI is currently under development and will be available soon!',
        message: 'This feature is coming soon. Stay tuned for updates!'
      }),
      { 
        status: 503, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

    // Commented out the original video processing code
    /*
    const { user_script, voice_option, video_style, category, difficulty }: VideoRequest = await req.json()

    if (!user_script || !voice_option || !video_style) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Creating video record for user:', user.id)

    const { data: videoRecord, error: insertError } = await supabaseClient
      .from('videos')
      .insert({
        user_id: user.id,
        original_script: user_script,
        voice_option,
        video_style,
        status: 'generating'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create video record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Video record created:', videoRecord.id)

    // Background processing would continue here...
    */

  } catch (error) {
    console.error('Main function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'StudyWithAI is currently under development and will be available soon!',
        message: 'This feature is coming soon. Stay tuned for updates!'
      }),
      {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
