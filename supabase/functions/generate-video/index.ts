
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

    const { user_script, voice_option, video_style, category, difficulty }: VideoRequest = await req.json()

    if (!user_script || !voice_option || !video_style) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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
      return new Response(
        JSON.stringify({ error: 'Failed to create video record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const processVideo = async () => {
      try {
        // Step 1: Refine Script (OpenAI)
        let refinedScript = user_script
        const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
        if (openaiApiKey) {
          try {
            const scriptPrompt = `You are an expert medical educator. Create a detailed, engaging script for a short educational video about: ${user_script}. 
Category: ${category || 'General Medicine'}
Difficulty: ${difficulty || 'Basic'}

Format the response as a spoken narrative only. Do not include scene directions.`

            const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                  { role: 'system', content: 'You are an expert medical educator.' },
                  { role: 'user', content: scriptPrompt }
                ],
                max_tokens: 1000,
                temperature: 0.7
              })
            })

            if (openaiResponse.ok) {
              const openaiData = await openaiResponse.json()
              refinedScript = openaiData.choices[0]?.message?.content || user_script
            }
          } catch (_) {}
        }

        // Step 2: Generate Audio (ElevenLabs)
        let audioUrl = null
        const elevenApiKey = Deno.env.get('ELEVENLABS_API_KEY')
        if (elevenApiKey) {
          try {
            const voiceId = '21m00Tcm4TlvDq8ikWAM'
            const audioRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
              method: 'POST',
              headers: {
                Accept: 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': elevenApiKey
              },
              body: JSON.stringify({
                text: refinedScript,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                  stability: 0.6,
                  similarity_boost: 0.8,
                  style: 0.2,
                  use_speaker_boost: true
                }
              })
            })

            if (audioRes.ok) {
              const audioBuffer = await audioRes.arrayBuffer()
              const audioFileName = `${user.id}/audio_${videoRecord.id}.mp3`

              const { error: uploadErr } = await supabaseClient.storage
                .from('audio')
                .upload(audioFileName, audioBuffer, {
                  contentType: 'audio/mpeg',
                  upsert: true
                })

              if (!uploadErr) {
                const { data: urlData } = supabaseClient.storage.from('audio').getPublicUrl(audioFileName)
                audioUrl = urlData.publicUrl
              }
            }
          } catch (_) {}
        }

        // Step 3: Generate Video (RunwayML)
        let videoUrl = null
        let thumbnailUrl = null
        const runwayApiKey = Deno.env.get('RUNWAYML_API_KEY')

        if (runwayApiKey) {
          try {
            const visualPrompt = `Create a professional medical educational video about ${category || 'medical topic'}. Style: clean, modern medical illustration with simple diagrams and text overlays. Content should be ${difficulty === 'Clinical' ? 'advanced medical visualization' : 'beginner-friendly medical graphics'}. Duration: 10 seconds. Professional medical education style.`

            const createRes = await fetch('https://api.runwayml.com/v1/text_to_video', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${runwayApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                text_prompt: visualPrompt,
                model: 'gen3a_turbo',
                aspect_ratio: '16:9',
                duration: 10,
                watermark: false
              })
            })

            if (createRes.ok) {
              const { id: taskId } = await createRes.json()
              let attempts = 0

              while (attempts < 60) {
                await new Promise(r => setTimeout(r, 5000))

                const statusRes = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
                  headers: { Authorization: `Bearer ${runwayApiKey}` }
                })

                if (statusRes.ok) {
                  const statusData = await statusRes.json()

                  if (statusData.status === 'SUCCEEDED') {
                    const output = statusData.output
                    if (typeof output === 'string') {
                      videoUrl = output
                      thumbnailUrl = output
                    } else if (Array.isArray(output) && output.length > 0) {
                      videoUrl = output[0]
                      thumbnailUrl = output[0]
                    } else if (output?.url) {
                      videoUrl = output.url
                      thumbnailUrl = output.url
                    }
                    break
                  } else if (statusData.status === 'FAILED') {
                    console.error('RunwayML failed:', statusData.failure_reason || statusData.failureReason)
                    break
                  }
                }

                attempts++
              }
            }
          } catch (err) {
            console.error('RunwayML error:', err)
          }
        }

        const updateData = {
          refined_script: refinedScript,
          voice_url: audioUrl,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          caption_text: refinedScript,
          status: videoUrl ? 'completed' : 'failed',
          updated_at: new Date().toISOString()
        }

        await supabaseClient.from('videos').update(updateData).eq('id', videoRecord.id)

        try {
          await supabaseClient.rpc('increment_usage_count', { user_uuid: user.id })
        } catch (_) {}
      } catch (err) {
        console.error('Process error:', err)
        await supabaseClient
          .from('videos')
          .update({ status: 'failed', updated_at: new Date().toISOString() })
          .eq('id', videoRecord.id)
      }
    }

    processVideo()

    return new Response(
      JSON.stringify({
        video_id: videoRecord.id,
        status: 'generating',
        message: 'Video generation started. This may take a few minutes.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
