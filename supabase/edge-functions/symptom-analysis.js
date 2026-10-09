// ============================================
// Supabase Edge Function – Enhanced Symptom Analysis
// Uses master AI prompt with multi-disease matching
// ============================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { symptoms, language = 'English', user_id } = await req.json();

        if (!symptoms) {
            return new Response(
                JSON.stringify({ error: 'Symptoms text is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Master AI Prompt
        const prompt = `You are a medical AI assistant for Medicare, a rural telehealth platform.

Analyze patient symptoms written in simple English or regional language.

PROCESSING STEPS:
1. Convert common/everyday language into medical symptoms (e.g., "blocked nose" → "nasal congestion", "loose motion" → "diarrhea")
2. Compare extracted symptoms with known diseases
3. Identify the top 3 most likely diseases
4. Suggest the appropriate medical specialist
5. Recommend diagnostic tests
6. Estimate severity and urgency

Patient Symptoms: ${symptoms}

IMPORTANT RULES:
- Respond in clear, simple language suitable for rural patients
- The response must be generated in ${language}
- Do NOT provide a final medical diagnosis — only possibilities
- Include a disclaimer that this is AI-based guidance, not a doctor's diagnosis

Return your response as a JSON object with this EXACT format:
{
  "possible_conditions": [
    {
      "disease": "Disease Name",
      "confidence": "80%",
      "specialist": "Specialist Type",
      "recommended_tests": ["Test 1", "Test 2"],
      "severity": "Low/Medium/High"
    }
  ],
  "extracted_symptoms": ["symptom1", "symptom2"],
  "urgency_level": "Low/Medium/High",
  "condition": "Most likely disease",
  "urgency": "Low/Medium/High",
  "specialist": "Recommended specialist",
  "recommended_tests": ["Test 1"],
  "recommendation": "Simple clear advice for the patient",
  "advice": "Brief actionable advice"
}`;

        // Call Gemini API
        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 800,
                        responseMimeType: 'application/json'
                    }
                })
            }
        );

        const geminiData = await geminiRes.json();
        const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

        let analysis;
        try {
            analysis = JSON.parse(text);
        } catch {
            const match = text?.match(/\{[\s\S]*\}/);
            analysis = match ? JSON.parse(match[0]) : { error: 'Could not parse AI response' };
        }

        // Store in database if user_id provided
        if (user_id && SUPABASE_URL && SUPABASE_KEY) {
            const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
            await supabase.from('symptoms').insert({
                user_id,
                symptoms_text: symptoms,
                ai_prediction: analysis.condition || analysis.possible_conditions?.[0]?.disease,
                urgency_level: analysis.urgency_level || analysis.urgency,
            });
        }

        return new Response(
            JSON.stringify(analysis),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
