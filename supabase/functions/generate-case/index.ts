
// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const medicalConditions = [
  'Acute STEMI', 'NSTEMI', 'Unstable angina', 'Acute appendicitis', 'Community-acquired pneumonia',
  'Hospital-acquired pneumonia', 'Acute CVA (stroke)', 'TIA', 'Sepsis', 'Septic shock',
  'Acute cholecystitis', 'Acute pancreatitis', 'Acute renal colic', 'UTI/pyelonephritis',
  'Acute asthma exacerbation', 'COPD exacerbation', 'Pulmonary embolism', 'DVT',
  'Acute gastroenteritis', 'IBD flare', 'Acute migraine', 'Tension headache',
  'Diabetic ketoacidosis', 'Hyperosmolar hyperglycemic state', 'Hypoglycemia',
  'Acute heart failure', 'Atrial fibrillation', 'SVT', 'VT', 'Pneumothorax',
  'Acute abdomen', 'Bowel obstruction', 'GI bleeding', 'Meningitis', 'Encephalitis'
];

// Map specialties to representative conditions
const SPECIALTY_CONDITIONS: Record<string, string[]> = {
  'General Medicine': [
    'Community-acquired pneumonia', 'Sepsis', 'DKA', 'Acute heart failure', 'COPD exacerbation',
    'Pulmonary embolism', 'Hyperosmolar hyperglycemic state', 'Upper GI bleeding'
  ],
  "Pediatrics (Children’s Health)": [
    'Bronchiolitis', 'Croup', 'Acute otitis media', 'Intussusception', 'Pyloric stenosis',
    'Febrile seizure', 'Henoch–Schönlein purpura'
  ],
  'Obstetrics & Gynecology (OB-GYN)': [
    'Ectopic pregnancy', 'Placental abruption', 'Preeclampsia', 'PID', 'Ovarian torsion'
  ],
  'Dermatology (Skin)': [
    'Cellulitis', 'Erysipelas', 'Psoriasis flare', 'Stevens–Johnson syndrome'
  ],
  'Psychiatry & Mental Health': [
    'Major depressive disorder', 'Generalized anxiety disorder', 'Bipolar mania', 'Delirium'
  ],
  'Family Medicine / Primary Care': [
    'Community-acquired pneumonia', 'UTI', 'Migraine', 'Type 2 diabetes mellitus', 'Hypertension emergency'
  ],
  'General Surgery': [
    'Acute appendicitis', 'Acute cholecystitis', 'Small bowel obstruction', 'Pancreatitis'
  ],
  'Orthopedics (Bones & Joints)': [
    'Septic arthritis', 'Hip fracture', 'Compartment syndrome', 'Osteomyelitis'
  ],
  'Neurosurgery': [
    'Subdural hematoma', 'Epidural hematoma', 'SAH', 'Traumatic brain injury'
  ],
  'Cardiothoracic Surgery': [
    'Aortic dissection', 'Cardiac tamponade', 'Postoperative pneumonia'
  ],
  'Plastic & Reconstructive Surgery': [
    'Necrotizing soft tissue infection', 'Burns – inhalational injury'
  ],
  'ENT (Ear, Nose, Throat) / Otorhinolaryngology': [
    'Peritonsillar abscess', 'Epistaxis', 'Ludwig angina'
  ],
  'Urology': [
    'Acute renal colic', 'Testicular torsion', 'Pyelonephritis'
  ],
  'Radiology & Imaging (X-ray, MRI, CT, Ultrasound)': [
    'Stroke (CT head focus)', 'PE (CTPA focus)', 'Appendicitis (CT/US focus)'
  ],
  'Pathology & Laboratory Medicine': [
    'AML (lab focus)', 'DIC (coagulation profile focus)'
  ],
  'Microbiology & Infectious Diseases': [
    'Sepsis of unknown origin', 'TB reactivation', 'Endocarditis'
  ],
  'Nuclear Medicine': [
    'Thyrotoxicosis (RAIU focus)', 'PE (V/Q focus)'
  ],
  'Emergency Medicine (Casualty / ER)': [
    'STEMI', 'Stroke', 'Sepsis', 'Polytrauma', 'Status asthmaticus'
  ],
  'Intensive Care Unit (ICU)': [
    'Septic shock', 'ARDS', 'DKA with cerebral edema', 'Ventilator associated pneumonia'
  ],
  'Trauma & Accident Care': [
    'Tension pneumothorax', 'Hemorrhagic shock from pelvic fracture', 'Spinal cord injury'
  ],
  'Anesthesiology': [
    'Malignant hyperthermia', 'Difficult airway', 'Local anesthetic systemic toxicity'
  ],
  'Cardiology (Heart)': [
    'Acute STEMI', 'NSTEMI', 'Atrial fibrillation with RVR', 'Acute heart failure', 'Pericarditis'
  ],
  'Gastroenterology (Stomach & Gut)': [
    'Upper GI bleeding', 'IBD flare', 'Acute pancreatitis', 'Acute cholangitis'
  ],
  'Endocrinology (Hormones & Diabetes)': [
    'Diabetic ketoacidosis', 'Thyroid storm', 'Adrenal crisis', 'Hyperosmolar state'
  ],
  'Pulmonology (Lungs)': [
    'COPD exacerbation', 'Pulmonary embolism', 'Pneumothorax', 'Severe pneumonia'
  ],
  'Nephrology (Kidneys)': [
    'AKI from ATN', 'Hyperkalemia', 'Nephrotic syndrome', 'Pyelonephritis'
  ],
  'Rheumatology (Joints & Autoimmune)': [
    'SLE flare', 'Gouty arthritis', 'Rheumatoid arthritis flare', 'Vasculitis (ANCA)'
  ],
  'Oncology (Cancer Care)': [
    'Tumor lysis syndrome', 'Febrile neutropenia', 'SVC syndrome'
  ],
  'Hematology (Blood Disorders)': [
    'DVT/PE', 'ITP', 'TTP', 'Sickle cell vaso-occlusive crisis'
  ],
  'Physiotherapy & Rehabilitation': [
    'Guillain–Barré syndrome – rehab planning', 'Post-stroke spasticity management'
  ],
  'Nutrition & Dietetics': [
    'Refeeding syndrome', 'Severe malnutrition assessment'
  ],
  'Pharmacy': [
    'Warfarin toxicity', 'Digoxin toxicity', 'Lithium toxicity'
  ],
  'Occupational Therapy': [
    'Post-hip-fracture ADL assessment'
  ],
  'Speech & Hearing Therapy': [
    'Post-stroke dysphagia assessment'
  ],
  'Public Health & Preventive Medicine': [
    'Outbreak investigation – norovirus', 'TB contact tracing scenario'
  ],
};

const patientNames = [
  'John Smith', 'Mary Johnson', 'David Wilson', 'Sarah Brown', 'Michael Davis',
  'Emma Taylor', 'James Anderson', 'Lisa White', 'Robert Thompson', 'Jennifer Garcia',
  'William Martinez', 'Patricia Rodriguez', 'Christopher Lewis', 'Elizabeth Walker',
  'Daniel Hall', 'Susan Allen', 'Matthew Young', 'Jessica King', 'Anthony Wright',
  'Helen Scott', 'Mark Green', 'Carol Adams', 'Steven Baker', 'Nancy Nelson'
];

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
      // 1. Fetch user subscription and usage
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_name', 'casewise')
        .eq('status', 'active')
        .single();
      // Default to free plan if no subscription
      const plan = subscription?.plan_name || 'free';
      // Plan limits
      const PLAN_LIMITS = {
        free: 5,
        clinical_starter: 10,
        clinical_pro: 10,
        wise_starter: 30,
        wise_pro: -1, // unlimited
        launch_bundle: 50
      };
      // Get current month (YYYY-MM)
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
      // Fetch usage for this month
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_name', 'casewise')
        .eq('usage_type', 'simulations')
        .eq('reset_date', `${currentMonth}-01`)
        .single();
      const usageCount = usage?.usage_count || 0;
      const planLimit = PLAN_LIMITS[plan] ?? 10;
      if (planLimit !== -1 && usageCount >= planLimit) {
        return new Response(JSON.stringify({ error: 'Simulation limit reached for this month.' }), { status: 403, headers: corsHeaders });
      }

      const { difficulty = 'medium', specialty = 'general' } = caseData || {};

      const pool = SPECIALTY_CONDITIONS[specialty] && SPECIALTY_CONDITIONS[specialty].length > 0
        ? SPECIALTY_CONDITIONS[specialty]
        : medicalConditions;
      const randomCondition = pool[Math.floor(Math.random() * pool.length)];
      const randomName = patientNames[Math.floor(Math.random() * patientNames.length)];

      // Age/gender constraints for certain specialties
      let randomAge = Math.floor(Math.random() * 60) + 20; // default 20-80 years
      let randomGender = Math.random() > 0.5 ? 'male' : 'female';
      if (specialty === "Pediatrics (Children’s Health)") {
        randomAge = Math.floor(Math.random() * 16) + 1; // 1-16 years
      }
      if (specialty === 'Obstetrics & Gynecology (OB-GYN)') {
        randomGender = 'female';
        randomAge = Math.floor(Math.random() * 30) + 18; // 18-48 years
      }

      const difficultyInstruction = (
        difficulty === 'easy' ?
          'Make the presentation classic and straightforward with clear positive findings and minimal confounders. Include a narrow differential and obvious next steps.' :
        difficulty === 'hard' ?
          'Make the presentation atypical and nuanced with realistic confounders/comorbidities. Include red-herring symptoms, overlapping differentials, and require careful clinical reasoning.' :
          'Make the presentation realistic with some complexity and common pitfalls, balancing clues and noise.'
      );

      const prompt = `Generate a realistic medical case scenario in the specialty of ${specialty} for ${randomCondition} in a ${randomAge}-year-old ${randomGender} patient named ${randomName}.
      
      ${difficultyInstruction}
      Use proper medical terminology, abbreviations, and realistic clinical presentations. Aim for professional accuracy suitable for medical students and junior doctors (USMLE/OSCE/PLAB standard).
      
      Please respond with ONLY a valid JSON object in this exact format:
      {
        "patient_name": "${randomName}",
        "age": ${randomAge},
        "gender": "${randomGender}",
        "presenting_complaint": "realistic chief complaint with proper medical terminology (2-3 sentences)",
        "vitals": {
          "temperature": "realistic temp with units",
          "blood_pressure": "realistic BP",
          "heart_rate": "realistic HR with bpm",
          "respiratory_rate": "realistic RR with /min",
          "oxygen_saturation": "realistic O2 sat with %"
        },
        "context": "relevant clinical context and circumstances",
        "medical_history": "relevant PMH, medications, allergies, social history",
        "correct_diagnosis": "${randomCondition}",
        "urgency_level": "critical/urgent/routine based on condition"
      }`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a senior consultant physician creating realistic patient scenarios for medical education. Use proper medical terminology and abbreviations.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.9,
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
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        caseScenario = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Content that failed to parse:', content);
        
        // Generate a fallback case with random elements
        const fallbackCondition = medicalConditions[Math.floor(Math.random() * medicalConditions.length)];
        caseScenario = {
          patient_name: randomName,
          age: randomAge,
          gender: randomGender,
          presenting_complaint: `Patient presents with symptoms consistent with ${fallbackCondition}. Clinical presentation requires immediate assessment.`,
          vitals: {
            temperature: "37.2°C",
            blood_pressure: "140/90 mmHg",
            heart_rate: "95 bpm",
            respiratory_rate: "18/min",
            oxygen_saturation: "97%"
          },
          context: "Patient presented to ED with acute onset of symptoms.",
          medical_history: "No significant past medical history. No known drug allergies.",
          correct_diagnosis: fallbackCondition,
          urgency_level: "urgent"
        };
      }

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

      // After successful case generation and DB insert:
      // Increment usage
      if (planLimit !== -1) {
        // Upsert usage_tracking row for this month
        await supabase.from('usage_tracking').upsert({
          user_id: user.id,
          product_name: 'casewise',
          usage_type: 'simulations',
          reset_date: `${currentMonth}-01`,
          usage_count: usageCount + 1
        }, { onConflict: ['user_id', 'product_name', 'usage_type', 'reset_date'] });
      }

      return new Response(JSON.stringify({ case: newCase }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'patient-response') {
      const { question, scenario } = caseData;
      
      const prompt = `You are ${scenario.patient_name}, a ${scenario.age}-year-old ${scenario.gender} patient with ${scenario.correct_diagnosis}.
      
      Context: ${scenario.context}
      Medical History: ${scenario.medical_history}
      Presenting complaint: ${scenario.presenting_complaint}
      
      A doctor is asking you: "${question}"
      
      Respond as the patient would, using natural language but providing medically relevant information. Be realistic about what a patient would know and how they would describe symptoms. Keep responses concise (1-2 sentences).`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a patient responding to medical questions. Be realistic and natural.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const patientResponse = data.choices[0].message.content;

      // Generate voiceover using ElevenLabs
      let audioContent: string | null = null;
      if (elevenLabsApiKey) {
        try {
          const voiceResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/pNczCjzI2devNBz1zQrb', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${elevenLabsApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: patientResponse,
              model_id: 'eleven_multilingual_v2',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
              }
            }),
          });

          if (voiceResponse.ok) {
            const audioBuffer = await voiceResponse.arrayBuffer();
            audioContent = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
          }
        } catch (error) {
          console.error('ElevenLabs error:', error);
        }
      }

      return new Response(JSON.stringify({ 
        response: patientResponse,
        audioContent 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'test-feedback') {
      const { investigation, scenario } = caseData;
      
      const prompt = `As a senior consultant physician, provide immediate feedback on ordering "${investigation}" for a patient with ${scenario.correct_diagnosis}.
      
      Patient: ${scenario.patient_name}, ${scenario.age}yo ${scenario.gender}
      Presenting complaint: ${scenario.presenting_complaint}
      
      Give a brief (1 sentence) clinical reasoning comment - either positive reinforcement if it's a good choice, or constructive guidance if it's not optimal. Use medical terminology. IMPORTANT: Do NOT use any markdown formatting symbols like #, *, **, or backticks. Return only plain text.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a senior consultant providing brief, educational feedback on investigation choices.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.6,
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

    if (action === 'provide-feedback') {
      const { attempt, scenario } = caseData;
      
      const prompt = `As a senior consultant physician and medical educator, provide concise feedback on this case attempt in EXACTLY 200-250 words:

      Patient: ${scenario.patient_name}, ${scenario.age}yo ${scenario.gender}
      Presenting complaint: ${scenario.presenting_complaint}
      Correct diagnosis: ${scenario.correct_diagnosis}
      
      Student's approach:
      - Questions asked: ${JSON.stringify(attempt.questions_asked)}
      - Investigations ordered: ${JSON.stringify(attempt.investigations_ordered)}
      - Diagnosis: ${attempt.user_diagnosis}
      - Score: ${attempt.score}%
      
      Provide structured feedback in bullet points covering:
      • Diagnostic accuracy and clinical reasoning
      • History-taking approach - what was done well and what was missed
      • Investigation strategy - appropriateness and cost-effectiveness
      • Key learning points and differential diagnoses to consider
      • Next steps in management
      
      Use proper medical terminology and be constructive but educational. Format as bullet points for easy reading. IMPORTANT: Do NOT use any markdown formatting symbols like #, *, **, or backticks. Return only plain text with bullet points (•) and keep response between 200-250 words exactly.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a senior consultant physician providing educational feedback to medical students.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
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
