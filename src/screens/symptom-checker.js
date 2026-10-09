// ============================================
// Medicare – Enhanced Symptom Checker Screen
// Shows multi-disease matches with confidence,
// specialist recommendation, and suggested tests
// ============================================

import { t, getLanguage } from '../i18n/index.js';
import { navigate } from '../router.js';
import { analyzeSymptoms, queueForSync } from '../ai/gemini.js';
import { startListening, stopListening, getIsListening, speak, isSpeechSupported } from '../ai/voice-assistant.js';

export function renderSymptomChecker(container) {
  let analysisResult = null;
  let isAnalyzing = false;
  let symptomsText = '';
  let isListeningNow = false;

  function render() {
    container.innerHTML = `
      <div class="symptom-checker-screen">
        <div class="symptom-screen-header animate-in">
          <button class="btn btn-ghost" id="back-btn" style="padding-left:0; margin-bottom: var(--space-sm);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            ${t('common_back')}
          </button>
          <h1>${t('symptom_title')}</h1>
          <p>${t('symptom_subtitle')}</p>
        </div>

        <!-- Input Card -->
        <div class="card animate-in-delay-1" style="margin-top: var(--space-md);">
          <textarea class="input" id="symptom-input" rows="4"
            placeholder="${t('symptom_placeholder')}"
            style="resize:none; font-size: 1rem; line-height: 1.6;">${symptomsText}</textarea>

          <div class="divider"></div>

          <div style="display:flex; align-items:center; gap: var(--space-sm); justify-content: space-between;">
            <div style="display:flex; align-items:center; gap: var(--space-sm);">
              ${isSpeechSupported() ? `
                <button class="btn ${isListeningNow ? 'btn-danger' : 'btn-primary'}" id="voice-btn"
                  style="width:44px;height:44px;border-radius:50%;padding:0;display:flex;align-items:center;justify-content:center;${isListeningNow ? 'animation: pulse 1s infinite;' : ''}">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                    <path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
                  </svg>
                </button>
                <span class="body-xs text-muted">${isListeningNow ? '🔴 Listening...' : t('symptom_voice_hint')}</span>
              ` : ''}
            </div>
            <button class="btn btn-primary btn-lg" id="analyze-btn" ${isAnalyzing ? 'disabled' : ''}>
              ${isAnalyzing ? '<span class="spinner" style="width:20px;height:20px;border-width:2px;"></span>' : t('symptom_analyze')}
            </button>
          </div>
        </div>

        <!-- Results -->
        ${analysisResult ? renderResult() : ''}

        <!-- Disclaimer -->
        <div class="body-xs text-muted animate-in-delay-3" style="text-align:center; margin-top: var(--space-lg); padding: 0 var(--space-md);">
          ⚠️ ${t('symptom_disclaimer')}
        </div>
      </div>
    `;
    attachEvents();
  }

  function renderResult() {
    const r = analysisResult;
    const urgencyColors = { Low: 'var(--success)', Medium: 'var(--warning)', High: 'var(--danger)' };
    const urgencyBg = { Low: 'var(--success-bg)', Medium: 'var(--warning-bg)', High: 'var(--danger-bg)' };
    const urgencyColor = urgencyColors[r.urgency] || 'var(--warning)';
    const urgencyBgColor = urgencyBg[r.urgency] || 'var(--warning-bg)';

    // Build condition cards — all shown equally as possibilities
    const conditions = r.possible_conditions?.length > 0
      ? r.possible_conditions.slice(0, 3)
      : [{ disease: r.condition, confidence: r.confidence ? `${r.confidence}%` : null, specialist: r.specialist, recommended_tests: r.recommended_tests, severity: r.urgency, recommendation: r.recommendation }];

    let html = `
      <!-- Header Card -->
      <div class="card animate-in-delay-2" style="margin-top: var(--space-lg); border-left: 4px solid ${urgencyColor};">
        <div style="display:flex; align-items:center; gap: var(--space-sm); margin-bottom: var(--space-md);">
          <div style="width:40px;height:40px;border-radius:var(--radius-md);background:linear-gradient(135deg,var(--teal-500),var(--cyan-600));display:flex;align-items:center;justify-content:center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div>
            <h3 class="heading-sm">AI Health Assessment</h3>
            <span class="badge" style="background:${r.isOffline ? 'var(--warning-bg)' : 'var(--success-bg)'}; color:${r.isOffline ? 'var(--warning)' : 'var(--success)'}; font-size:0.625rem;">
              ${r.isOffline ? '📴 Offline Mode' : '🌐 Gemini AI'}
            </span>
          </div>
        </div>

        <!-- Extracted Symptoms -->
        ${r.extracted_symptoms?.length > 0 ? `
          <div style="margin-bottom: var(--space-md);">
            <p class="body-xs text-muted" style="text-transform:uppercase; letter-spacing:0.05em; font-weight:600; margin-bottom: 6px;">Symptoms Identified</p>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${r.extracted_symptoms.map(s => `<span class="badge badge-primary" style="font-size:0.7rem;">${s}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Urgency -->
        <div style="padding: var(--space-sm); border-radius: var(--radius-md); background:${urgencyBgColor}; text-align:center; margin-bottom: var(--space-md);">
          <p class="body-xs text-muted" style="margin-bottom:4px;">Overall Urgency</p>
          <span style="font-weight:700; color:${urgencyColor}; font-size:1rem;">● ${r.urgency}</span>
        </div>

        <!-- Disclaimer banner -->
        <div style="background:var(--warning-bg); border-radius:var(--radius-sm); padding:8px 12px; margin-bottom:var(--space-md);">
          <p class="body-xs" style="color:var(--warning); font-weight:600; margin:0;">
            ⚠️ These are possible conditions based on your symptoms — not a medical diagnosis. Please consult a doctor for confirmation.
          </p>
        </div>

        <!-- General Recommendation -->
        <div>
          <p class="body-xs text-muted" style="text-transform:uppercase; letter-spacing:0.05em; font-weight:600; margin-bottom:6px;">What You Should Do</p>
          <p class="body-md" style="line-height:1.6; color: var(--gray-800);">${r.recommendation}</p>
        </div>
      </div>

      <!-- All Possible Conditions — shown equally -->
      <div class="animate-in-delay-3" style="margin-top: var(--space-md);">
        <h3 class="heading-sm" style="margin-bottom: var(--space-sm);">
          Possible Conditions <span class="body-xs text-muted" style="font-weight:400;">(${conditions.length} match${conditions.length > 1 ? 'es' : ''})</span>
        </h3>
        ${conditions.map((c, i) => `
          <div class="card" style="margin-bottom: var(--space-sm); padding: var(--space-md); ${i === 0 ? 'border-left: 3px solid var(--primary);' : ''}">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="width:24px;height:24px;border-radius:50%;background:var(--gray-100);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:var(--gray-600);">${i + 1}</span>
                <h4 class="body-md" style="font-weight:600;">${c.disease}</h4>
              </div>
              <span class="badge" style="background:${urgencyBg[c.severity] || 'var(--warning-bg)'}; color:${urgencyColors[c.severity] || 'var(--warning)'}; font-size:0.625rem;">
                ${c.severity}
              </span>
            </div>
            <div style="display:flex; gap: var(--space-md); flex-wrap:wrap; margin-bottom:6px;">
              ${c.confidence ? `<span class="body-xs text-muted">📊 Match: <strong>${c.confidence}</strong></span>` : ''}
              <span class="body-xs text-muted">👨‍⚕️ ${c.specialist}</span>
            </div>
            ${c.recommended_tests?.length ? `
              <div style="display:flex; flex-wrap:wrap; gap:4px;">
                ${c.recommended_tests.map(t => `<span class="body-xs" style="background:var(--info-bg);color:var(--info);padding:2px 8px;border-radius:4px;">🔬 ${t}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Action Buttons -->
      <div class="animate-in-delay-3" style="display:flex; gap: var(--space-sm); margin-top: var(--space-md);">
        <button class="btn btn-primary btn-full" id="find-doctor-btn">
          👨‍⚕️ ${t('dash_find_doctor')}
        </button>
        <button class="btn btn-secondary" id="speak-result-btn" style="width:48px;height:48px;border-radius:50%;padding:0;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
        </button>
      </div>

      ${r.urgency === 'High' ? `
        <button class="btn btn-danger btn-full animate-in-delay-3" id="sos-btn" style="margin-top: var(--space-sm);">
          🚨 Emergency SOS
        </button>
      ` : ''}
    `;

    return html;
  }

  function attachEvents() {
    document.getElementById('back-btn')?.addEventListener('click', () => navigate('dashboard'));

    document.getElementById('symptom-input')?.addEventListener('input', (e) => {
      symptomsText = e.target.value;
    });

    document.getElementById('analyze-btn')?.addEventListener('click', async () => {
      const input = document.getElementById('symptom-input')?.value?.trim();
      if (!input) return;

      symptomsText = input;
      isAnalyzing = true;
      render();

      try {
        const result = await analyzeSymptoms(input);
        analysisResult = result;

        // Queue for sync if offline
        if (result.isOffline) {
          queueForSync({ symptoms_text: input, ai_prediction: result.condition, urgency_level: result.urgency });
        }
      } catch (err) {
        console.error('Analysis error:', err);
        analysisResult = {
          condition: 'Analysis Error',
          urgency: 'Medium',
          recommendation: 'An error occurred during analysis. Please try again or consult a doctor.',
          isOffline: true
        };
      }

      isAnalyzing = false;
      render();
    });

    // Voice input
    document.getElementById('voice-btn')?.addEventListener('click', () => {
      if (isListeningNow) {
        stopListening();
        isListeningNow = false;
        render();
      } else {
        isListeningNow = true;
        render();
        startListening(
          (text, isFinal) => {
            symptomsText = text;
            if (isFinal) {
              isListeningNow = false;
              render();
            }
          },
          (err) => {
            console.error('Speech error:', err);
            isListeningNow = false;
            render();
          }
        );
      }
    });

    // Speak result
    document.getElementById('speak-result-btn')?.addEventListener('click', () => {
      if (analysisResult) {
        const text = `${analysisResult.condition}. Urgency level: ${analysisResult.urgency}. ${analysisResult.recommendation}`;
        speak(text, getLanguage());
      }
    });

    // Find doctor
    document.getElementById('find-doctor-btn')?.addEventListener('click', () => {
      navigate('doctor-list');
    });

    // SOS
    document.getElementById('sos-btn')?.addEventListener('click', () => {
      navigate('emergency-sos');
    });
  }

  render();
}
