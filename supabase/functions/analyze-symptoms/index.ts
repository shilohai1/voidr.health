
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SymptomData {
  gender: string;
  ageGroup: string;
  symptomOnset: string;
  symptomLocation: string;
  symptomDetails: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const symptomData: SymptomData = await req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Received symptom data:', symptomData);

    // Call OpenAI API for analysis
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `A patient reports:
- Gender: ${symptomData.gender}
- Age group: ${symptomData.ageGroup}
- Symptom onset: ${symptomData.symptomOnset}
- Symptom location: ${symptomData.symptomLocation}
- Additional details: ${symptomData.symptomDetails || 'None provided'}

As a medical AI assistant, extract key symptoms, assign probabilities to possible conditions, and determine a risk level (low, moderate, high, emergency). 

Return ONLY a valid JSON object in this exact format:
{
  "parsed_symptoms": ["symptom1", "symptom2", "symptom3"],
  "conditions": [
    { "name": "Condition A", "probability": 0.75 },
    { "name": "Condition B", "probability": 0.40 },
    { "name": "Condition C", "probability": 0.25 }
  ],
  "risk_level": "moderate"
}

Risk levels:
- low: Minor symptoms, no immediate concern
- moderate: Symptoms warrant medical attention within days
- high: Symptoms require prompt medical attention within 24 hours
- emergency: Symptoms require immediate emergency care

Ensure probabilities are realistic (0.0-1.0) and conditions are medically accurate.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a medical AI assistant. Provide analysis in the exact JSON format requested. Be conservative with risk assessments and always recommend professional medical consultation.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const analysisText = aiResponse.choices[0].message.content;
    
    console.log('OpenAI raw response:', analysisText);

    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('Raw response:', analysisText);
      
      // Fallback response
      analysisResult = {
        parsed_symptoms: ["Unable to parse symptoms from input"],
        conditions: [
          { name: "Please consult a healthcare provider for proper diagnosis", probability: 1.0 }
        ],
        risk_level: "moderate"
      };
    }

    // Validate the response structure
    if (!analysisResult.parsed_symptoms || !Array.isArray(analysisResult.parsed_symptoms)) {
      analysisResult.parsed_symptoms = ["Symptoms reported"];
    }
    
    if (!analysisResult.conditions || !Array.isArray(analysisResult.conditions)) {
      analysisResult.conditions = [{ name: "Consult a healthcare provider", probability: 1.0 }];
    }

    if (!['low', 'moderate', 'high', 'emergency'].includes(analysisResult.risk_level)) {
      analysisResult.risk_level = 'moderate';
    }

    console.log('Final analysis result:', analysisResult);

    // Log usage event (best-effort)
    try {
      if (user) {
        await supabase.from('symptom_analyses').insert({
          user_id: user.id,
          input_text: [symptomData.gender, symptomData.ageGroup, symptomData.symptomOnset, symptomData.symptomLocation, symptomData.symptomDetails].filter(Boolean).join(' | '),
          result: analysisResult
        });
      }
    } catch (e) {
      console.error('symptom_analyses insert failed:', e);
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-symptoms function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze symptoms',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
