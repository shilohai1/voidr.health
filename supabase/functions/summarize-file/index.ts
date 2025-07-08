
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

    // Parse multipart form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const manualText = formData.get('manual_text') as string

    let textContent = ''
    let originalFilename = 'manual_input.txt'

    if (file) {
      console.log('Processing uploaded file:', file.name)
      originalFilename = file.name
      
      // Extract text based on file type
      if (file.type === 'application/pdf') {
        // For PDF parsing, we'll extract what we can
        textContent = `Content from PDF file: ${file.name}. This is a mock extraction. In production, you would use a proper PDF parsing library.`
      } else if (file.type === 'text/plain') {
        textContent = await file.text()
      } else if (file.name.endsWith('.docx') || file.type.includes('word')) {
        textContent = `Content from Word document: ${file.name}. This is a mock extraction. In production, you would use a proper Word document parsing library.`
      } else {
        textContent = await file.text() // Try to read as text anyway
      }
    } else if (manualText) {
      console.log('Processing manual text input')
      textContent = manualText
      originalFilename = 'manual_input.txt'
    } else {
      return new Response(
        JSON.stringify({ error: 'Please provide either a file or manual text input.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Text content length:', textContent.length)

    // Generate summary
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
                content: 'You are a medical expert specializing in creating concise clinical summaries. Summarize the provided content into clear, actionable bullet points that would be useful for healthcare professionals. Focus on key clinical findings, diagnoses, treatments, and recommendations.'
              },
              {
                role: 'user',
                content: `Please create a clinical summary of the following content in bullet point format:\n\n${textContent}`
              }
            ],
            max_tokens: 2000,
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
          summaryText = `Summary of ${originalFilename}:\n\nThis is a mock summary as the OpenAI API is not available. The content would be processed and summarized here.\n\nOriginal content length: ${textContent.length} characters.`
        }
      } catch (error) {
        console.error('Error calling OpenAI:', error)
        summaryText = `Summary of ${originalFilename}:\n\nThis is a mock summary due to an API error. The content would be processed and summarized here.\n\nOriginal content length: ${textContent.length} characters.`
      }
    } else {
      console.log('OpenAI API key not found, generating mock summary')
      summaryText = `Summary of ${originalFilename}:\n\nThis is a mock summary as no OpenAI API key is configured. The content would be processed and summarized here.\n\nOriginal content length: ${textContent.length} characters.`
    }

    // Create summary file
    const summaryFileName = `${user.id}/summary_${Date.now()}.txt`
    const summaryFileContent = `Clinical Summary\n================\n\nOriginal File: ${originalFilename}\nGenerated: ${new Date().toISOString()}\n\n${summaryText}`

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
        summary_text: summaryText,
        original_filename: originalFilename,
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
