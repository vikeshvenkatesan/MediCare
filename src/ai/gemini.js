// ============================================
// Medicare – Enhanced Gemini AI Client
// Master prompt with disease matching,
// confidence scoring, specialist recommendation
// ============================================

import { CONFIG, hasGeminiConfig } from '../config.js';
import { offlineDiagnose, getTranslatedResult } from '../data/symptom-dataset.js';
import { getLanguage } from '../i18n/index.js';

// ─── MASTER AI PROMPT ──────────────────────────────────
const SYMPTOM_PROMPT = `You are a medical AI assistant for Medicare, a rural telehealth platform.

Analyze patient symptoms written in simple English or regional language.

PROCESSING STEPS:
1. Convert common/everyday language into medical symptoms (e.g., "blocked nose" → "nasal congestion", "loose motion" → "diarrhea")
2. Compare extracted symptoms with known diseases
3. Identify the top 3 most likely diseases
4. Suggest the appropriate medical specialist
5. Recommend diagnostic tests
6. Estimate severity and urgency

Patient Symptoms: {user_input}

IMPORTANT RULES:
- Respond in clear, simple language suitable for rural patients
- The response must be generated in {language}
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

const LANGUAGE_MAP = {
    en: 'English',
    hi: 'Hindi',
    ta: 'Tamil',
    ml: 'Malayalam',
    te: 'Telugu',
    kn: 'Kannada',
    bn: 'Bengali',
    mr: 'Marathi'
};

// ─── MAIN ANALYSIS FUNCTION ─────────────────────────────
export async function analyzeSymptoms(symptomsText) {
    const lang = getLanguage();

    // Try Gemini API first
    if (hasGeminiConfig() && navigator.onLine) {
        try {
            const result = await callGeminiAPI(symptomsText, lang);
            return normalizeResult(result, false);
        } catch (error) {
            console.warn('Gemini API failed, falling back to offline:', error);
        }
    }

    // Fallback to offline engine
    const result = offlineDiagnose(symptomsText);
    return getTranslatedResult(result, lang);
}

// ─── NORMALIZE RESULT ────────────────────────────────────
// Ensure consistent shape whether from Gemini or offline
function normalizeResult(raw, isOffline) {
    return {
        condition: raw.condition || raw.possible_conditions?.[0]?.disease || 'Unknown',
        urgency: raw.urgency || raw.urgency_level || 'Medium',
        specialist: raw.specialist || raw.possible_conditions?.[0]?.specialist || 'General Physician',
        recommended_tests: raw.recommended_tests || raw.possible_conditions?.[0]?.recommended_tests || [],
        recommendation: raw.recommendation || raw.advice || 'Please consult a doctor.',
        confidence: parseConfidence(raw.possible_conditions?.[0]?.confidence) || 0,
        possible_conditions: raw.possible_conditions || [],
        extracted_symptoms: raw.extracted_symptoms || [],
        urgency_level: raw.urgency_level || raw.urgency || 'Medium',
        advice: raw.advice || raw.recommendation || '',
        isOffline
    };
}

function parseConfidence(val) {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseInt(val.replace('%', ''), 10) || 0;
    return 0;
}

// ─── GEMINI API CALL ─────────────────────────────────────
async function callGeminiAPI(symptomsText, lang) {
    const prompt = SYMPTOM_PROMPT
        .replace('{user_input}', symptomsText)
        .replace('{language}', LANGUAGE_MAP[lang] || 'English');

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`,
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

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('No response from Gemini');

    try {
        return JSON.parse(text);
    } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
        throw new Error('Could not parse Gemini response');
    }
}

// ─── OFFLINE SYNC ─────────────────────────────────────────
export function queueForSync(symptomData) {
    const queue = JSON.parse(localStorage.getItem('medicare_sync_queue') || '[]');
    queue.push({
        ...symptomData,
        timestamp: new Date().toISOString(),
        synced: false
    });
    localStorage.setItem('medicare_sync_queue', JSON.stringify(queue));
}

export async function syncQueuedData() {
    if (!navigator.onLine) return;
    const queue = JSON.parse(localStorage.getItem('medicare_sync_queue') || '[]');
    const unsynced = queue.filter(item => !item.synced);

    for (const item of unsynced) {
        item.synced = true;
        console.log('Synced:', item);
    }

    localStorage.setItem('medicare_sync_queue', JSON.stringify(queue));
}
