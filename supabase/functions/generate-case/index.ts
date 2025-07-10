
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
      
      Format as JSON with:
      {
        "patient_name": "realistic name",
        "age": number,
        "gender": "male/female", 
        "presenting_complaint": "chief complaint in 1-2 sentences",
        "vitals": {
          "temperature": "value with unit",
          "blood_pressure": "systolic/diastolic",
          "heart_rate": "bpm",
          "respiratory_rate": "per min",
          "oxygen_saturation": "percentage"
        },
        "context": "brief background/history",
        "medical_history": "relevant past medical history",
        "correct_diagnosis": "primary diagnosis",
        "urgency_level": "routine/urgent/critical"
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
            { role: 'system', content: 'You are a medical education expert creating realistic patient scenarios.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8,
        }),
      });

      const data = await response.json();
      const caseScenario = JSON.parse(data.choices[0].message.content);

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

      if (error) throw error;

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
