// ============================================
// Medicare – Enhanced Symptom & Disease Dataset
// Comprehensive rule-based engine with synonym
// normalization, disease matching, and confidence scoring
// ============================================

// ─── SYMPTOM SYNONYM NORMALIZER ──────────────────────────
// Converts everyday patient language into medical terms
export const symptomSynonyms = {
    'blocked nose': 'nasal congestion',
    'stuffy nose': 'nasal congestion',
    'runny nose': 'rhinorrhea',
    'feeling tired': 'fatigue',
    'tiredness': 'fatigue',
    'weakness': 'fatigue',
    'no energy': 'fatigue',
    'head spinning': 'dizziness',
    'feeling dizzy': 'dizziness',
    'giddiness': 'dizziness',
    'throwing up': 'vomiting',
    'puking': 'vomiting',
    'loose motion': 'diarrhea',
    'loose stools': 'diarrhea',
    'breathing problem': 'shortness of breath',
    'breathing difficulty': 'shortness of breath',
    'cant breathe': 'shortness of breath',
    'hard to breathe': 'shortness of breath',
    'chest tightness': 'chest pain',
    'burning chest': 'heartburn',
    'sore throat': 'pharyngitis',
    'throat pain': 'pharyngitis',
    'high temperature': 'fever',
    'high fever': 'fever',
    'body pain': 'body ache',
    'body ache': 'body ache',
    'muscle pain': 'body ache',
    'stomach ache': 'abdominal pain',
    'stomach pain': 'abdominal pain',
    'tummy pain': 'abdominal pain',
    'skin rash': 'rash',
    'red spots': 'rash',
    'itching': 'pruritus',
    'joint pain': 'arthralgia',
    'back pain': 'backache',
    'lower back pain': 'backache',
    'eye pain': 'ocular pain',
    'red eye': 'conjunctival injection',
    'ear pain': 'otalgia',
    'tooth pain': 'toothache',
    'gum pain': 'toothache',
    'weight loss': 'unexplained weight loss',
    'cant sleep': 'insomnia',
    'no sleep': 'insomnia',
    'feeling sad': 'depression',
    'feeling low': 'depression',
    'worried all time': 'anxiety',
    'panic': 'anxiety',
    'sweating a lot': 'excessive sweating',
    'night sweats': 'excessive sweating',
    'blurred vision': 'visual disturbance',
    'blood in urine': 'hematuria',
    'burning urination': 'dysuria',
    'frequent urination': 'polyuria',
    'swelling': 'edema',
    'wheezing': 'wheezing',
    'coughing blood': 'hemoptysis',
    'blood in stool': 'rectal bleeding',
};

// ─── DISEASE DATABASE ────────────────────────────────────
// Based on the master prompt disease dataset
export const diseaseDatabase = [
    {
        id: 'D001',
        name: 'Common Cold',
        category: 'Viral',
        symptoms: ['sneezing', 'rhinorrhea', 'nasal congestion', 'pharyngitis', 'cough', 'fatigue'],
        specialist: 'General Physician',
        tests: ['Physical Exam'],
        severity: 'Low',
        urgency: 'Low',
        recommendation: 'Rest, drink warm fluids, gargle with salt water. Over-the-counter cold medicines can help. Consult a doctor if symptoms worsen after 5 days.',
    },
    {
        id: 'D002',
        name: 'Influenza (Flu)',
        category: 'Viral',
        symptoms: ['fever', 'body ache', 'cough', 'fatigue', 'headache', 'chills'],
        specialist: 'General Physician',
        tests: ['Rapid Flu Test'],
        severity: 'Medium',
        urgency: 'Medium',
        recommendation: 'Rest and stay hydrated. Take paracetamol for fever. Antiviral medications may help if started within 48 hours. Consult a general physician.',
    },

    {
        id: 'D004',
        name: 'Dengue Fever',
        category: 'Viral',
        symptoms: ['fever', 'arthralgia', 'headache', 'rash', 'body ache', 'nausea', 'fatigue'],
        specialist: 'General Physician',
        tests: ['CBC Test', 'NS1 Antigen Test', 'Dengue IgM/IgG'],
        severity: 'High',
        urgency: 'High',
        recommendation: 'IMMEDIATE MEDICAL ATTENTION NEEDED. Stay hydrated. Avoid aspirin/ibuprofen. Monitor platelet count. Go to hospital if bleeding occurs.',
    },
    {
        id: 'D005',
        name: 'Malaria',
        category: 'Parasitic',
        symptoms: ['fever', 'chills', 'excessive sweating', 'headache', 'nausea', 'body ache', 'fatigue'],
        specialist: 'General Physician',
        tests: ['Blood Smear', 'Rapid Diagnostic Test (RDT)'],
        severity: 'High',
        urgency: 'High',
        recommendation: 'SEEK MEDICAL ATTENTION. Get blood smear test done immediately. Antimalarial treatment must be started as early as possible.',
    },
    {
        id: 'D006',
        name: 'Typhoid Fever',
        category: 'Bacterial',
        symptoms: ['fever', 'abdominal pain', 'fatigue', 'headache', 'diarrhea', 'loss of appetite'],
        specialist: 'Gastroenterologist',
        tests: ['Widal Test', 'Blood Culture', 'Typhidot Test'],
        severity: 'Medium',
        urgency: 'Medium',
        recommendation: 'Consult a doctor for antibiotics. Rest and stay hydrated. Eat clean, boiled food. Complete the full course of antibiotics.',
    },
    {
        id: 'D007',
        name: 'Asthma',
        category: 'Respiratory',
        symptoms: ['shortness of breath', 'wheezing', 'chest pain', 'cough'],
        specialist: 'Pulmonologist',
        tests: ['Spirometry', 'Peak Flow Test'],
        severity: 'Medium',
        urgency: 'Medium',
        recommendation: 'Use prescribed inhaler. Avoid dust, smoke, and cold air. Sit upright if having an attack. Seek emergency care if inhaler does not help.',
    },
    {
        id: 'D008',
        name: 'Bronchitis',
        category: 'Respiratory',
        symptoms: ['cough', 'mucus', 'chest pain', 'fatigue', 'shortness of breath'],
        specialist: 'Pulmonologist',
        tests: ['Chest X-ray', 'Sputum Test'],
        severity: 'Medium',
        urgency: 'Medium',
        recommendation: 'Rest, drink fluids, use steam inhalation. Avoid smoking. Consult a pulmonologist if cough persists more than 2 weeks.',
    },
    {
        id: 'D009',
        name: 'Pneumonia',
        category: 'Respiratory',
        symptoms: ['fever', 'cough', 'shortness of breath', 'chest pain', 'fatigue', 'chills'],
        specialist: 'Pulmonologist',
        tests: ['Chest X-ray', 'Blood Test', 'Sputum Culture'],
        severity: 'High',
        urgency: 'High',
        recommendation: 'SEEK IMMEDIATE MEDICAL ATTENTION. Antibiotics are required. Hospital admission may be needed. Do not delay treatment.',
    },
    {
        id: 'D010',
        name: 'Migraine',
        category: 'Neurological',
        symptoms: ['headache', 'nausea', 'visual disturbance', 'dizziness', 'vomiting'],
        specialist: 'Neurologist',
        tests: ['Neurological Exam', 'CT/MRI (if severe)'],
        severity: 'Medium',
        urgency: 'Medium',
        recommendation: 'Rest in a dark, quiet room. Take prescribed pain medication. Stay hydrated. Consult a neurologist if attacks are frequent.',
    },
    {
        id: 'D011',
        name: 'Gastroenteritis',
        category: 'Gastrointestinal',
        symptoms: ['vomiting', 'diarrhea', 'abdominal pain', 'nausea', 'fever', 'fatigue'],
        specialist: 'Gastroenterologist',
        tests: ['Stool Test', 'Physical Exam'],
        severity: 'Medium',
        urgency: 'Medium',
        recommendation: 'Stay hydrated with ORS solution. Eat light, bland food (khichdi, rice water). Avoid spicy/oily food. Consult doctor if vomiting persists 24+ hours.',
    },
    {
        id: 'D012',
        name: 'Urinary Tract Infection',
        category: 'Urological',
        symptoms: ['dysuria', 'polyuria', 'hematuria', 'abdominal pain', 'fever'],
        specialist: 'General Physician',
        tests: ['Urine Test', 'Urine Culture'],
        severity: 'Medium',
        urgency: 'Medium',
        recommendation: 'Drink plenty of water. Consult a doctor for antibiotics. Complete the full antibiotic course. Do not hold urine for long periods.',
    },
    {
        id: 'D013',
        name: 'Allergic Reaction / Dermatitis',
        category: 'Dermatological',
        symptoms: ['rash', 'pruritus', 'edema', 'sneezing', 'rhinorrhea'],
        specialist: 'Dermatologist',
        tests: ['Allergy Test', 'Skin Prick Test'],
        severity: 'Low',
        urgency: 'Low',
        recommendation: 'Avoid known allergens. Apply calamine lotion. Take antihistamine medication. Consult a dermatologist if rash spreads or breathing affected.',
    },
    {
        id: 'D014',
        name: 'Hypertension',
        category: 'Cardiovascular',
        symptoms: ['headache', 'dizziness', 'visual disturbance', 'chest pain', 'shortness of breath'],
        specialist: 'Cardiologist',
        tests: ['Blood Pressure Check', 'ECG', 'Blood Test'],
        severity: 'Medium',
        urgency: 'Medium',
        recommendation: 'Check blood pressure regularly. Reduce salt intake. Exercise daily. Avoid stress and smoking. Consult a cardiologist for medication.',
    },
    {
        id: 'D015',
        name: 'Diabetes (Type 2)',
        category: 'Endocrine',
        symptoms: ['polyuria', 'fatigue', 'unexplained weight loss', 'visual disturbance', 'excessive sweating'],
        specialist: 'Endocrinologist',
        tests: ['Fasting Blood Sugar', 'HbA1c', 'Oral Glucose Tolerance Test'],
        severity: 'Medium',
        urgency: 'Medium',
        recommendation: 'Get blood sugar tested. Maintain balanced diet with low sugar. Exercise regularly. Consult an endocrinologist for proper treatment plan.',
    },
    {
        id: 'D016',
        name: 'Depression / Anxiety',
        category: 'Psychiatric',
        symptoms: ['depression', 'anxiety', 'insomnia', 'fatigue', 'loss of appetite'],
        specialist: 'Psychiatrist',
        tests: ['Mental Health Screening', 'PHQ-9 Assessment'],
        severity: 'Medium',
        urgency: 'Medium',
        recommendation: 'Talk to a trusted person. Maintain regular sleep. Practice breathing exercises. Consult a psychiatrist or call KIRAN helpline (1800-599-0019).',
    },
    {
        id: 'D017',
        name: 'Conjunctivitis',
        category: 'Ophthalmological',
        symptoms: ['conjunctival injection', 'ocular pain', 'visual disturbance', 'pruritus'],
        specialist: 'General Physician',
        tests: ['Eye Examination'],
        severity: 'Low',
        urgency: 'Low',
        recommendation: 'Wash eyes with clean water. Do not touch/rub eyes. Use prescribed eye drops. Avoid sharing towels. Consult an eye doctor.',
    },
    {
        id: 'D018',
        name: 'Musculoskeletal Pain',
        category: 'Orthopedic',
        symptoms: ['arthralgia', 'backache', 'body ache', 'edema'],
        specialist: 'Orthopedic',
        tests: ['X-ray', 'Physical Exam'],
        severity: 'Low',
        urgency: 'Low',
        recommendation: 'Rest the affected area. Apply ice or warm compress. Take over-the-counter pain relievers. Consult an orthopedic doctor if pain persists beyond a week.',
    },
    {
        id: 'D019',
        name: 'Ear Infection (Otitis)',
        category: 'ENT',
        symptoms: ['otalgia', 'fever', 'dizziness', 'headache'],
        specialist: 'General Physician',
        tests: ['Ear Examination', 'Hearing Test'],
        severity: 'Low',
        urgency: 'Low',
        recommendation: 'Keep ear dry. Do not insert objects. Take prescribed pain reliever. Consult an ENT specialist if discharge or hearing loss occurs.',
    },
    {
        id: 'D020',
        name: 'Trauma / Physical Injury',
        category: 'Emergency',
        symptoms: ['bleeding', 'fracture', 'edema', 'body ache'],
        specialist: 'Orthopedic',
        tests: ['X-ray', 'CT Scan'],
        severity: 'High',
        urgency: 'High',
        recommendation: 'EMERGENCY: Apply clean pressure to stop bleeding. Immobilize injured area. Call 108 for ambulance. Go to nearest hospital immediately.',
    },
    {
        id: 'D021',
        name: 'Heart Attack / Cardiac Emergency',
        category: 'Cardiovascular',
        symptoms: ['chest pain', 'shortness of breath', 'excessive sweating', 'nausea', 'dizziness', 'body ache'],
        specialist: 'Cardiologist',
        tests: ['ECG', 'Troponin Test', 'Angiography'],
        severity: 'High',
        urgency: 'High',
        recommendation: 'CALL 108 IMMEDIATELY. Chew an aspirin tablet if available. Sit upright, stay calm. Do NOT drive yourself to hospital. This is a life-threatening emergency.',
    },
    {
        id: 'D022',
        name: 'Pediatric Fever / Childhood Infection',
        category: 'Pediatric',
        symptoms: ['fever', 'cough', 'rhinorrhea', 'diarrhea', 'rash', 'vomiting'],
        specialist: 'Pediatrician',
        tests: ['CBC', 'Physical Exam'],
        severity: 'Medium',
        urgency: 'Medium',
        recommendation: 'Give age-appropriate dose of paracetamol. Keep child hydrated. Sponge with lukewarm water. Consult pediatrician if fever exceeds 102°F.',
    },
    {
        id: 'D023',
        name: 'Gynecological Issue',
        category: 'Gynecological',
        symptoms: ['abdominal pain', 'bleeding', 'fatigue', 'nausea', 'backache'],
        specialist: 'Gynecologist',
        tests: ['Ultrasound', 'Blood Test', 'Pap Smear'],
        severity: 'Medium',
        urgency: 'Medium',
        recommendation: 'Consult a gynecologist. Keep track of symptoms and menstrual cycle. Do not ignore persistent abdominal pain or unusual bleeding.',
    },
];

// ─── FULL KEYWORD EXTRACTOR ──────────────────────────────
// Extracts all recognized symptoms from free-text input
function extractSymptoms(text) {
    const input = text.toLowerCase();
    const found = new Set();

    // Step 1: Check synonym mappings (longer phrases first)
    const sortedSynonyms = Object.entries(symptomSynonyms).sort((a, b) => b[0].length - a[0].length);
    for (const [commonTerm, medicalTerm] of sortedSynonyms) {
        if (input.includes(commonTerm)) {
            found.add(medicalTerm);
        }
    }

    // Step 2: Direct symptom keyword matching
    const directKeywords = [
        'fever', 'cough', 'headache', 'nausea', 'vomiting', 'diarrhea',
        'chills', 'rash', 'sneezing', 'wheezing', 'bleeding', 'fracture',
        'mucus', 'edema', 'insomnia', 'anxiety', 'depression',
        'loss of taste', 'loss of smell', 'loss of appetite',
    ];
    for (const kw of directKeywords) {
        if (input.includes(kw)) found.add(kw);
    }

    return [...found];
}

// ─── MULTI-DISEASE MATCHING ENGINE ──────────────────────
// Returns top matches sorted by confidence
export function offlineDiagnose(symptomsText) {
    const extractedSymptoms = extractSymptoms(symptomsText);

    if (extractedSymptoms.length === 0) {
        return {
            possible_conditions: [],
            extracted_symptoms: [],
            urgency_level: 'Medium',
            advice: 'Your symptoms could not be matched with our offline database. Please consult a doctor for proper diagnosis.',
            isOffline: true
        };
    }

    // Score each disease
    const matches = [];
    for (const disease of diseaseDatabase) {
        let matchCount = 0;
        const matchedSymptoms = [];
        for (const symptom of extractedSymptoms) {
            if (disease.symptoms.some(ds => ds.includes(symptom) || symptom.includes(ds))) {
                matchCount++;
                matchedSymptoms.push(symptom);
            }
        }
        if (matchCount > 0) {
            const confidence = Math.round((matchCount / disease.symptoms.length) * 100);
            matches.push({
                disease: disease.name,
                disease_id: disease.id,
                confidence: `${Math.min(confidence, 95)}%`,
                confidenceScore: Math.min(confidence, 95),
                specialist: disease.specialist,
                recommended_tests: disease.tests,
                severity: disease.severity,
                category: disease.category,
                recommendation: disease.recommendation,
                matched_symptoms: matchedSymptoms,
            });
        }
    }

    // Sort by confidence descending
    matches.sort((a, b) => b.confidenceScore - a.confidenceScore);
    const topMatches = matches.slice(0, 3);

    // Determine overall urgency from top match
    const topUrgency = topMatches[0]?.severity || 'Medium';

    return {
        possible_conditions: topMatches,
        extracted_symptoms: extractedSymptoms,
        urgency_level: topUrgency,
        condition: topMatches[0]?.disease || 'Unknown Condition',
        urgency: topUrgency,
        specialist: topMatches[0]?.specialist || 'General Physician',
        recommended_tests: topMatches[0]?.recommended_tests || [],
        recommendation: topMatches[0]?.recommendation || 'Please consult a doctor.',
        confidence: topMatches[0]?.confidenceScore || 0,
        advice: topMatches.length > 0
            ? `Based on your symptoms, the most likely condition is ${topMatches[0].disease}. ${topMatches[0].recommendation}`
            : 'Please consult a doctor for proper diagnosis.',
        isOffline: true
    };
}

// ─── TRANSLATED RESULT ────────────────────────────────────
export function getTranslatedResult(result, lang) {
    // The Gemini API handles translation. For offline, results are in English.
    // Future: Add per-disease translations
    return result;
}
