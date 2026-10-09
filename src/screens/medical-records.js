// ============================================
// Medicare – Medical Records Screen
// ============================================

import { t } from '../i18n/index.js';
import { navigate } from '../router.js';
import { mockRecords } from '../data/mock-doctors.js';

export function renderMedicalRecords(container) {
    const iconMap = {
        consultation: { bg: '#cffafe', color: 'var(--cyan-600)', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
        prescription: { bg: 'var(--success-bg)', color: 'var(--success)', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
        diagnosis: { bg: 'var(--primary-bg)', color: 'var(--primary)', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>' }
    };

    container.innerHTML = `
    <div class="medical-records-screen">
      <div class="symptom-screen-header animate-in">
        <button class="btn btn-ghost" id="back-btn" style="padding-left:0; margin-bottom: var(--space-sm);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          ${t('common_back')}
        </button>
        <h1>${t('rec_title')}</h1>
        <p>${t('rec_subtitle')}</p>
      </div>

      <!-- Summary Cards -->
      <div class="flex gap-sm mt-md mb-lg animate-in-delay-1">
        <div class="card" style="flex:1; text-align:center; padding: var(--space-md);">
          <p class="body-xs text-muted">${t('rec_consultation')}</p>
          <p class="heading-lg text-gradient">${mockRecords.filter(r => r.type === 'consultation').length}</p>
        </div>
        <div class="card" style="flex:1; text-align:center; padding: var(--space-md);">
          <p class="body-xs text-muted">${t('rec_prescription')}</p>
          <p class="heading-lg text-gradient">${mockRecords.filter(r => r.type === 'prescription').length}</p>
        </div>
        <div class="card" style="flex:1; text-align:center; padding: var(--space-md);">
          <p class="body-xs text-muted">${t('rec_diagnosis')}</p>
          <p class="heading-lg text-gradient">${mockRecords.filter(r => r.type === 'diagnosis').length}</p>
        </div>
      </div>

      <!-- Timeline -->
      ${mockRecords.length > 0 ? `
        <div class="records-timeline animate-in-delay-2">
          ${mockRecords.map((record, i) => {
        const icon = iconMap[record.type] || iconMap.consultation;
        return `
              <div class="record-item" style="animation-delay: ${i * 0.1}s;" data-record-id="${record.id}">
                <div class="record-dot"></div>
                <div class="record-card">
                  <div class="record-date">${new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div class="flex items-center gap-sm mb-sm">
                    <div class="activity-icon" style="background:${icon.bg};color:${icon.color};width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;">
                      ${icon.icon}
                    </div>
                    <div>
                      <div class="record-title">${record.title}</div>
                      <span class="badge badge-primary" style="font-size:0.625rem;">${t(`rec_${record.type}`)}</span>
                    </div>
                  </div>
                  <div class="record-desc">${record.description}</div>
                  <p class="body-xs text-muted mt-sm">👨‍⚕️ ${record.doctor}</p>
                </div>
              </div>
            `;
    }).join('')}
        </div>
      ` : `
        <div class="empty-state animate-in-delay-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <h3>${t('rec_no_records')}</h3>
          <p>${t('dash_check_symptoms')}</p>
        </div>
      `}
    </div>
  `;

    document.getElementById('back-btn')?.addEventListener('click', () => navigate('dashboard'));

    // Click on record to view details
    container.querySelectorAll('[data-record-id]').forEach(item => {
        item.addEventListener('click', () => {
            const record = mockRecords.find(r => r.id === item.dataset.recordId);
            if (record?.type === 'prescription') {
                navigate('prescription');
            }
        });
    });
}
