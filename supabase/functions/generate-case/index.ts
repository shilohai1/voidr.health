
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { action, caseData } = await req.json();

    if (action === 'generate-case') {
      const { difficulty = 'medium', specialty = 'general' } = caseData || {};
      
      const prompt = `Generate a realistic medical case scenario for a ${difficulty} difficulty level in ${specialty} medicine. 
      
      Please respond with ONLY a valid JSON object in this exact format:
      {
        "patient_name": "realistic name",
        "age": 45,
        "gender": "male",
        "presenting_complaint": "chief complaint in 1-2 sentences",
        "vitals": {
          "temperature": "98.6°F",
          "blood_pressure": "120/80",
          "heart_rate": "72 bpm",
          "respiratory_rate": "16/min",
          "oxygen_saturation": "98%"
        },
        "context": "brief background/history",
        "medical_history": "relevant past medical history",
        "correct_diagnosis": "primary diagnosis",
        "urgency_level": "routine"
      }
      
      Make it realistic and educational for medical students preparing for USMLE/OSCE/PLAB.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a medical education expert creating realistic patient scenarios. Always respond with valid JSON only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      console.log('OpenAI response content:', content);
      
      let caseScenario;
      try {
        // Clean the content to ensure it's valid JSON
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        caseScenario = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Content that failed to parse:', content);
        
        // Fallback case if JSON parsing fails
        caseScenario = {
          patient_name: "John Smith",
          age: 42,
          gender: "male",
          presenting_complaint: "Patient presents with acute chest pain that started 2 hours ago while at rest.",
          vitals: {
            temperature: "98.6°F",
            blood_pressure: "140/90",
            heart_rate: "95 bpm",
            respiratory_rate: "18/min",
            oxygen_saturation: "97%"
          },
          context: "Patient was watching TV when sudden onset of crushing chest pain occurred.",
          medical_history: "Hypertension, smoking history of 20 pack-years, family history of coronary artery disease.",
          correct_diagnosis: "Acute Myocardial Infarction",
          urgency_level: "critical"
        };
      }

      // Store in database
      const { data: newCase, error } = await supabase
        .from('case_scenarios')
        .insert({
          ...caseScenario,
          difficulty_level: difficulty,
          specialty: specialty
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      return new Response(JSON.stringify({ case: newCase }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'provide-feedback') {
      const { attempt, scenario } = caseData;
      
      const prompt = `As a medical educator, provide detailed feedback on this case attempt:

      Patient: ${scenario.patient_name}, ${scenario.age}yo ${scenario.gender}
      Presenting complaint: ${scenario.presenting_complaint}
      Correct diagnosis: ${scenario.correct_diagnosis}
      
      Student's approach:
      - Questions asked: ${JSON.stringify(attempt.questions_asked)}
      - Investigations ordered: ${JSON.stringify(attempt.investigations_ordered)}
      - Diagnosis: ${attempt.user_diagnosis}
      - Management: ${JSON.stringify(attempt.management_plan)}
      
      Provide constructive feedback highlighting:
      1. What they did well
      2. What they missed
      3. Appropriate next steps
      4. Learning points
      
      Keep it encouraging but educational.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a supportive medical educator providing feedback to students.' },
            { role: 'user', content: prompt }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const feedback = data.choices[0].message.content;

      return new Response(JSON.stringify({ feedback }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in generate-case function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
