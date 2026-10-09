// ============================================
// Medicare – Digital Prescription Screen
// ============================================

import { t } from '../i18n/index.js';
import { navigate } from '../router.js';
import { mockPrescriptions } from '../data/mock-doctors.js';

export function renderPrescription(container, params) {
    const rxId = params?.[0] || 'rx1';
    const rx = mockPrescriptions.find(p => p.prescription_id === rxId) || mockPrescriptions[0];

    container.innerHTML = `
    <div class="prescription-screen">
      <div class="symptom-screen-header animate-in">
        <button class="btn btn-ghost" id="back-btn" style="padding-left:0; margin-bottom: var(--space-sm);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          ${t('common_back')}
        </button>
        <h1>${t('rx_title')}</h1>
      </div>

      <div class="prescription-card animate-in-delay-1">
        <div class="prescription-header" style="position:relative;">
          <span class="rx-symbol">℞</span>
          <h3>${rx.diagnosis}</h3>
          <p>${t('rx_prescribed_by')}: ${rx.doctor_name}</p>
          <p style="margin-top:4px; opacity:0.7; font-size: 0.75rem;">${t('rx_date')}: ${new Date(rx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        <div class="prescription-body">
          <h3 class="heading-sm mb-md">${t('rx_medicines')}</h3>

          ${rx.medicines.map((med, i) => `
            <div class="medicine-item">
              <div class="medicine-number">${i + 1}</div>
              <div class="medicine-details">
                <h4>${med.name}</h4>
                <p>${med.dosage} · ${med.duration}</p>
                <div class="medicine-dosage">
                  <span class="dosage-chip">⏰ ${med.timing}</span>
                  <span class="dosage-chip">📅 ${med.duration}</span>
                </div>
              </div>
            </div>
          `).join('')}

          ${rx.notes ? `
            <div class="divider"></div>
            <h3 class="heading-sm mb-sm">${t('rx_notes')}</h3>
            <p class="body-md text-muted">${rx.notes}</p>
          ` : ''}
        </div>
      </div>

      <button class="btn btn-primary btn-full btn-lg mt-md animate-in-delay-2" id="download-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        ${t('rx_download')}
      </button>

      ${mockPrescriptions.length > 1 ? `
        <div class="mt-lg animate-in-delay-3">
          <h3 class="heading-sm mb-md">Other Prescriptions</h3>
          ${mockPrescriptions.filter(p => p.prescription_id !== rxId).map(p => `
            <div class="card card-interactive mb-sm" data-rx-id="${p.prescription_id}" style="cursor:pointer;">
              <div class="flex items-center gap-md">
                <div class="activity-icon" style="background:var(--primary-bg);color:var(--primary);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div>
                  <h4 class="body-md" style="font-weight:600;">${p.diagnosis}</h4>
                  <p class="body-xs text-muted">${p.doctor_name} · ${new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

    document.getElementById('back-btn')?.addEventListener('click', () => navigate('dashboard'));
    document.getElementById('download-btn')?.addEventListener('click', () => {
        // Simulate download
        const btn = document.getElementById('download-btn');
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Downloaded!';
        btn.style.background = 'var(--success)';
        setTimeout(() => {
            btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${t('rx_download')}`;
            btn.style.background = '';
        }, 2000);
    });

    container.querySelectorAll('[data-rx-id]').forEach(card => {
        card.addEventListener('click', () => navigate(`prescription/${card.dataset.rxId}`));
    });
}
