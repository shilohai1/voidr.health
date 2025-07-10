
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

    const processVideo = async () => {
      try {
        console.log('Starting video processing for:', videoRecord.id)

        // Step 1: Refine Script (OpenAI)
        let refinedScript = user_script
        const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
        
        if (openaiApiKey) {
          try {
            console.log('Generating script with OpenAI...')
            const scriptPrompt = `You are an expert medical educator. Create a detailed, engaging script for a short educational video about: ${user_script}. 
Category: ${category || 'General Medicine'}
Difficulty: ${difficulty || 'Basic'}

The script should be:
- Educational and accurate
- Engaging for ${difficulty === 'Clinical' ? 'medical professionals' : 'students'}
- Suitable for a 10-15 second video
- Clear and concise
- Professional medical terminology when appropriate

Format the response as a spoken narrative only. Do not include scene directions or formatting.`

            const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                  { role: 'system', content: 'You are an expert medical educator creating educational video scripts.' },
                  { role: 'user', content: scriptPrompt }
                ],
                max_tokens: 500,
                temperature: 0.7
              })
            })

            if (openaiResponse.ok) {
              const openaiData = await openaiResponse.json()
              refinedScript = openaiData.choices[0]?.message?.content || user_script
              console.log('Script generated successfully')
            } else {
              console.error('OpenAI error:', await openaiResponse.text())
            }
          } catch (err) {
            console.error('OpenAI script generation error:', err)
          }
        }

        // Step 2: Generate Audio (ElevenLabs)
        let audioUrl = null
        const elevenApiKey = Deno.env.get('ELEVENLABS_API_KEY')
        
        if (elevenApiKey && refinedScript) {
          try {
            console.log('Generating audio with ElevenLabs...')
            const voiceId = '21m00Tcm4TlvDq8ikWAM' // Rachel voice
            
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
                  stability: 0.5,
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
                console.log('Audio generated and uploaded successfully')
              } else {
                console.error('Audio upload error:', uploadErr)
              }
            } else {
              console.error('ElevenLabs error:', await audioRes.text())
            }
          } catch (err) {
            console.error('ElevenLabs audio generation error:', err)
          }
        }

        // Step 3: Generate Video (RunwayML)
        let videoUrl = null
        let thumbnailUrl = null
        const runwayApiKey = Deno.env.get('RUNWAYML_API_KEY')

        if (runwayApiKey) {
          try {
            console.log('Generating video with RunwayML...')
            
            const visualPrompt = `Professional medical education video: ${category || 'medical topic'}. 
${difficulty === 'Clinical' ? 'Advanced clinical visualization with detailed medical diagrams' : 'Clear, simple medical illustrations suitable for students'}. 
Clean, modern medical style with professional graphics. Educational content about ${user_script}. 
Medical textbook illustration style, professional healthcare setting.`

            console.log('Using visual prompt:', visualPrompt)

            // Use the correct RunwayML API endpoint (v1, not v1)
            const createRes = await fetch('https://api.runwayml.com/v1/image_to_video', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${runwayApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                promptText: visualPrompt,
                seed: Math.floor(Math.random() * 1000000),
                exploreMode: false,
                watermark: false,
                enhance_prompt: true,
                seconds: 4,
                gen3a_turbo: true
              })
            })

            console.log('RunwayML create response status:', createRes.status)

            if (createRes.ok) {
              const createData = await createRes.json()
              console.log('RunwayML task created:', createData)
              
              const taskId = createData.id
              let attempts = 0
              const maxAttempts = 60 // 5 minutes maximum

              // Poll for completion
              while (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds

                const statusRes = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
                  headers: { 
                    Authorization: `Bearer ${runwayApiKey}`,
                    'Content-Type': 'application/json'
                  }
                })

                if (statusRes.ok) {
                  const statusData = await statusRes.json()
                  console.log(`RunwayML status attempt ${attempts + 1}:`, statusData.status)

                  if (statusData.status === 'SUCCEEDED') {
                    if (statusData.output && statusData.output.length > 0) {
                      videoUrl = statusData.output[0]
                      thumbnailUrl = statusData.output[0] // Use same URL for thumbnail
                      console.log('Video generated successfully:', videoUrl)
                    }
                    break
                  } else if (statusData.status === 'FAILED') {
                    console.error('RunwayML generation failed:', statusData.failure_reason || statusData.failureReason)
                    break
                  }
                } else {
                  console.error('RunwayML status check failed:', await statusRes.text())
                }

                attempts++
              }

              if (attempts >= maxAttempts) {
                console.error('RunwayML generation timed out after', maxAttempts, 'attempts')
              }
            } else {
              const errorText = await createRes.text()
              console.error('RunwayML create request failed:', createRes.status, errorText)
            }
          } catch (err) {
            console.error('RunwayML video generation error:', err)
          }
        }

        // Update video record with results
        const updateData = {
          refined_script: refinedScript,
          voice_url: audioUrl,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          caption_text: refinedScript,
          status: videoUrl ? 'completed' : 'failed',
          updated_at: new Date().toISOString()
        }

        console.log('Updating video record with:', updateData)

        const { error: updateError } = await supabaseClient
          .from('videos')
          .update(updateData)
          .eq('id', videoRecord.id)

        if (updateError) {
          console.error('Update error:', updateError)
        } else {
          console.log('Video record updated successfully')
        }

        // Increment usage count
        try {
          await supabaseClient.rpc('increment_usage_count', { user_uuid: user.id })
        } catch (err) {
          console.error('Usage count increment error:', err)
        }

      } catch (err) {
        console.error('Process video error:', err)
        
        // Update status to failed
        await supabaseClient
          .from('videos')
          .update({ 
            status: 'failed', 
            updated_at: new Date().toISOString() 
          })
          .eq('id', videoRecord.id)
      }
    }

    // Start background processing
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
    console.error('Main function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
