
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
    console.log('Starting video generation request...')
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the JWT token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('Authentication error:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User authenticated:', user.id)

    const { user_script, voice_option, video_style, category, difficulty }: VideoRequest = await req.json()

    if (!user_script || !voice_option || !video_style) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_script, voice_option, video_style' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Creating video record for user:', user.id)

    // Create initial video record
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
      console.error('Error creating video record:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create video record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Video record created:', videoRecord.id)

    // Start background processing
    const processVideo = async () => {
      try {
        console.log('Starting video generation for video ID:', videoRecord.id)

        // Step 1: Generate detailed script with OpenAI
        let refinedScript = user_script;
        
        const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
        if (openaiApiKey) {
          console.log('Generating detailed script with OpenAI...')
          try {
            const scriptPrompt = `You are an expert medical educator. Create a detailed, engaging script for a short educational video about: ${user_script}. 
            Category: ${category || 'General Medicine'}
            Difficulty: ${difficulty || 'Basic'}
            
            The script should be:
            - Educational and accurate
            - Engaging for ${difficulty === 'Clinical' ? 'medical students and professionals' : 'beginners'}
            - 60-90 seconds when spoken
            - Clear and concise
            - Structured with clear sections
            
            Format the response as a narrative script that can be read aloud. Do not include stage directions or visual descriptions, just the spoken content.`

            const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                  {
                    role: 'system',
                    content: 'You are an expert medical educator who creates engaging educational content.'
                  },
                  {
                    role: 'user',
                    content: scriptPrompt
                  }
                ],
                max_tokens: 1000,
                temperature: 0.7
              })
            })

            if (openaiResponse.ok) {
              const openaiData = await openaiResponse.json()
              refinedScript = openaiData.choices[0]?.message?.content || user_script
              console.log('Detailed script generated successfully')
            } else {
              console.error('OpenAI API error:', await openaiResponse.text())
            }
          } catch (error) {
            console.error('Error calling OpenAI:', error)
          }
        } else {
          console.log('OpenAI API key not found, using original script')
        }

        // Step 2: Generate voiceover with ElevenLabs
        let audioUrl = null;
        const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
        
        if (elevenLabsApiKey) {
          console.log('Generating voiceover with ElevenLabs...')
          try {
            const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Professional voice
            const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
              method: 'POST',
              headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': elevenLabsApiKey,
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

            if (elevenLabsResponse.ok) {
              const audioBuffer = await elevenLabsResponse.arrayBuffer()
              const audioFileName = `${user.id}/audio_${videoRecord.id}.mp3`

              // Upload audio to Supabase Storage
              const { error: audioUploadError } = await supabaseClient.storage
                .from('audio')
                .upload(audioFileName, audioBuffer, {
                  contentType: 'audio/mpeg',
                  upsert: true
                })

              if (!audioUploadError) {
                const { data: audioUrlData } = supabaseClient.storage
                  .from('audio')
                  .getPublicUrl(audioFileName)
                audioUrl = audioUrlData.publicUrl
                console.log('Audio generated and uploaded successfully')
              } else {
                console.error('Audio upload error:', audioUploadError)
              }
            } else {
              console.error('ElevenLabs API error:', await elevenLabsResponse.text())
            }
          } catch (error) {
            console.error('Error generating voiceover:', error)
          }
        } else {
          console.log('ElevenLabs API key not found, skipping audio generation')
        }

        // Step 3: Generate video with RunwayML
        let videoUrl = null;
        let thumbnailUrl = null;
        const runwayApiKey = Deno.env.get('RUNWAYML_API_KEY');
        
        if (runwayApiKey) {
          console.log('Generating video with RunwayML...')
          
          // Create visual prompt for video generation
          const visualPrompt = `Medical educational content: ${category || 'medical'} topic. Professional medical illustration style, clean educational graphics, ${difficulty === 'Clinical' ? 'advanced medical diagrams' : 'simple medical visuals'}, modern healthcare design, instructional video format.`
          
          try {
            // Create video generation task
            const runwayResponse = await fetch('https://api.runwayml.com/v1/image_to_video', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${runwayApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                promptText: visualPrompt,
                model: 'gen3a_turbo',
                aspectRatio: '16:9',
                duration: 10,
                watermark: false
              })
            })

            console.log('RunwayML response status:', runwayResponse.status)
            
            if (runwayResponse.ok) {
              const runwayData = await runwayResponse.json()
              const taskId = runwayData.id
              console.log('RunwayML task created successfully:', taskId)

              // Poll for completion
              let attempts = 0;
              const maxAttempts = 60; // 5 minutes max wait
              
              while (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
                
                try {
                  const statusResponse = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
                    headers: {
                      'Authorization': `Bearer ${runwayApiKey}`,
                    }
                  })

                  if (statusResponse.ok) {
                    const statusData = await statusResponse.json()
                    console.log('RunwayML status:', statusData.status, 'Progress:', statusData.progress)
                    
                    if (statusData.status === 'SUCCEEDED') {
                      videoUrl = statusData.output?.[0]
                      thumbnailUrl = statusData.output?.[0] // Use video URL as thumbnail for now
                      console.log('Video generated successfully:', videoUrl)
                      break
                    } else if (statusData.status === 'FAILED') {
                      console.error('RunwayML generation failed:', statusData.failure_reason || statusData.failureReason)
                      break
                    }
                  } else {
                    console.error('Status check failed:', await statusResponse.text())
                  }
                } catch (pollError) {
                  console.error('Error during status polling:', pollError)
                }
                
                attempts++
              }

              if (!videoUrl && attempts >= maxAttempts) {
                console.log('Video generation timed out after maximum attempts')
              }
            } else {
              const errorText = await runwayResponse.text()
              console.error('RunwayML API error:', runwayResponse.status, errorText)
            }
          } catch (error) {
            console.error('Error generating video with RunwayML:', error)
          }
        } else {
          console.log('RunwayML API key not found')
        }

        // Update video record with results
        const updateData = {
          refined_script: refinedScript,
          voice_url: audioUrl,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          caption_text: refinedScript, // Use refined script as captions
          status: videoUrl ? 'completed' : 'failed',
          updated_at: new Date().toISOString()
        }

        const { error: updateError } = await supabaseClient
          .from('videos')
          .update(updateData)
          .eq('id', videoRecord.id)

        if (updateError) {
          console.error('Update error:', updateError)
          throw new Error(`Update error: ${updateError.message}`)
        }

        // Increment user usage count
        try {
          await supabaseClient.rpc('increment_usage_count', { user_uuid: user.id })
        } catch (error) {
          console.error('Error incrementing usage count:', error)
        }

        console.log('Video generation completed successfully for video ID:', videoRecord.id)

      } catch (error) {
        console.error('Error in video processing:', error)
        
        // Update status to failed
        await supabaseClient
          .from('videos')
          .update({ status: 'failed', updated_at: new Date().toISOString() })
          .eq('id', videoRecord.id)
      }
    }

    // Start background processing
    processVideo()

    // Return immediate response
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
    console.error('Error in generate-video function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
