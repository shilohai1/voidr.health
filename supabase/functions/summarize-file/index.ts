
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting file summarization request...')
    
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

    // Parse the request body
    const requestBody = await req.json()
    const { file, filename, mimeType, wordCount = 500 } = requestBody

    let textContent = ''
    let originalFilename = filename || 'manual_input.txt'

    if (file) {
      console.log('Processing file data...')
      
      // Decode base64 file
      const fileBuffer = Uint8Array.from(atob(file), c => c.charCodeAt(0))
      
      // Extract text based on file type
      if (mimeType === 'application/pdf') {
        textContent = `Content from PDF file: ${originalFilename}. This is a mock extraction. In production, you would use a proper PDF parsing library.`
      } else if (mimeType === 'text/plain') {
        textContent = new TextDecoder().decode(fileBuffer)
      } else if (mimeType?.includes('word')) {
        textContent = `Content from Word document: ${originalFilename}. This is a mock extraction. In production, you would use a proper Word document parsing library.`
      } else {
        textContent = new TextDecoder().decode(fileBuffer)
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'No file or text content provided.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Text content length:', textContent.length)
    console.log('Target word count:', wordCount)

    // Generate summary with word count constraint
    let summaryText = '';
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (openaiApiKey) {
      console.log('Generating summary with OpenAI...')
      try {
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
                content: `You are a medical expert specializing in creating concise clinical summaries. Create a well-structured summary that is EXACTLY ${wordCount} words or as close as possible. Focus on key clinical findings, diagnoses, treatments, and recommendations. Use clear, professional medical language with proper formatting including bullet points and sections where appropriate.`
              },
              {
                role: 'user',
                content: `Please create a comprehensive medical summary of the following content in exactly ${wordCount} words. Structure it with clear headings and bullet points for easy reading:\n\n${textContent}`
              }
            ],
            max_tokens: Math.max(wordCount * 2, 1000),
            temperature: 0.3
          })
        })

        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json()
          summaryText = openaiData.choices[0]?.message?.content || 'Failed to generate summary'
          console.log('Summary generated successfully')
        } else {
          const errorData = await openaiResponse.text()
          console.error('OpenAI API error:', errorData)
          summaryText = `Summary of ${originalFilename} (Target: ${wordCount} words):\n\nThis is a mock summary as the OpenAI API encountered an error. The content would be processed and summarized to approximately ${wordCount} words.\n\nOriginal content length: ${textContent.length} characters.`
        }
      } catch (error) {
        console.error('Error calling OpenAI:', error)
        summaryText = `Summary of ${originalFilename} (Target: ${wordCount} words):\n\nThis is a mock summary due to an API error. The content would be processed and summarized to approximately ${wordCount} words.\n\nOriginal content length: ${textContent.length} characters.`
      }
    } else {
      console.log('OpenAI API key not found, generating mock summary')
      summaryText = `Summary of ${originalFilename} (Target: ${wordCount} words):\n\nThis is a mock summary as no OpenAI API key is configured. The content would be processed and summarized to approximately ${wordCount} words.\n\nOriginal content length: ${textContent.length} characters.`
    }

    // Create summary file content
    const summaryFileName = `${user.id}/summary_${Date.now()}.txt`
    const summaryFileContent = `Clinical Summary\n================\n\nOriginal File: ${originalFilename}\nTarget Length: ${wordCount} words\nGenerated: ${new Date().toISOString()}\n\n${summaryText}`

    // Upload summary to Supabase Storage
    let downloadUrl = null;
    try {
      const { error: uploadError } = await supabaseClient.storage
        .from('summaries')
        .upload(summaryFileName, summaryFileContent, {
          contentType: 'text/plain'
        })

      if (!uploadError) {
        // Get signed URL for download
        const { data: signedUrl, error: urlError } = await supabaseClient.storage
          .from('summaries')
          .createSignedUrl(summaryFileName, 3600) // 1 hour expiry

        if (!urlError) {
          downloadUrl = signedUrl.signedUrl
        } else {
          console.error('Signed URL error:', urlError)
        }
      } else {
        console.error('Storage upload error:', uploadError)
      }
    } catch (error) {
      console.error('Error uploading to storage:', error)
    }

    // Save summary record to database
    const { data: summaryRecord, error: dbError } = await supabaseClient
      .from('summaries')
      .insert({
        user_id: user.id,
        original_filename: originalFilename,
        summary_file_url: downloadUrl,
        summary_text: summaryText
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      return new Response(
        JSON.stringify({ error: `Database error: ${dbError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Increment user usage count
    try {
      await supabaseClient.rpc('increment_usage_count', { user_uuid: user.id })
    } catch (error) {
      console.error('Error incrementing usage count:', error)
    }

    console.log('Summary generation completed successfully')

    return new Response(
      JSON.stringify({
        summary_id: summaryRecord.id,
        download_url: downloadUrl,
        summary: summaryText,
        original_filename: originalFilename,
        word_count: wordCount,
        message: 'Summary generated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in summarize-file function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
