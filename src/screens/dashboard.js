// ============================================
// Medicare – Patient Dashboard Screen
// ============================================

import { t } from '../i18n/index.js';
import { renderLanguageSelector } from '../i18n/index.js';
import { navigate } from '../router.js';

export function renderDashboard(container) {
  const user = JSON.parse(localStorage.getItem('medicare_user') || '{}');
  const name = user.name || 'Patient';

  container.innerHTML = `
    <div class="dashboard animate-in">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="dashboard-greeting">
          <h1>${t('dash_greeting')}, ${name} 👋</h1>
          <p>${t('dash_how_feeling')}</p>
        </div>
        <div class="dashboard-header-actions">
          ${renderLanguageSelector()}
          <button class="btn-icon btn-secondary" id="logout-btn" title="Logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>

      <!-- Health Status Card -->
      <div class="health-card animate-in-delay-1">
        <h3>${t('dash_health_card_title')}</h3>
        <div class="health-status">${t('dash_health_status')} ✅</div>
        <div class="health-meta">${t('dash_health_meta')}</div>
      </div>

      <!-- Quick Actions -->
      <div class="section-header animate-in-delay-2">
        <h2>Quick Actions</h2>
      </div>
      <div class="quick-actions animate-in-delay-2">
        <div class="quick-action" data-action="symptom-checker">
          <div class="quick-action-icon teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <p>${t('dash_check_symptoms')}</p>
        </div>
        <div class="quick-action" data-action="doctor-list">
          <div class="quick-action-icon cyan">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <p>${t('dash_find_doctor')}</p>
        </div>
        <div class="quick-action" data-action="emergency-sos">
          <div class="quick-action-icon red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <p>${t('dash_emergency_sos')}</p>
        </div>
        <div class="quick-action" data-action="medical-records">
          <div class="quick-action-icon amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <p>${t('dash_medical_records')}</p>
        </div>
        <div class="quick-action" data-action="patient-profile">
          <div class="quick-action-icon" style="background:linear-gradient(135deg,#e0e7ff,#c7d2fe);color:#4f46e5;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <p>${t('prof_title')}</p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="section-header animate-in-delay-3">
        <h2>${t('dash_recent_activity')}</h2>
        <button class="see-all" id="see-all-records">View All</button>
      </div>
      <div class="card animate-in-delay-3">
        <div class="recent-activity-item">
          <div class="activity-icon" style="background: var(--teal-100); color: var(--teal-600);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div class="activity-info">
            <h4>AI Symptom Analysis</h4>
            <p>Viral fever – Medium urgency</p>
          </div>
          <span class="activity-time">2d ago</span>
        </div>
        <div class="recent-activity-item">
          <div class="activity-icon" style="background: #cffafe; color: var(--cyan-600);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          </div>
          <div class="activity-info">
            <h4>Consultation with Dr. Priya Sharma</h4>
            <p>General Medicine</p>
          </div>
          <span class="activity-time">3d ago</span>
        </div>
        <div class="recent-activity-item">
          <div class="activity-icon" style="background: var(--success-bg); color: var(--success);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="activity-info">
            <h4>Prescription Received</h4>
            <p>3 medicines prescribed</p>
          </div>
          <span class="activity-time">3d ago</span>
        </div>
      </div>

      <!-- Offline Status Banner -->
      <div id="offline-banner" class="card mt-md ${navigator.onLine ? 'hidden' : ''}" style="background: var(--warning-bg); border-color: var(--warning);">
        <div class="flex items-center gap-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0119 12.55"/><path d="M5 12.55a10.94 10.94 0 015.17-2.39"/><path d="M10.71 5.05A16 16 0 0122.56 9"/><path d="M1.42 9a15.91 15.91 0 014.7-2.88"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
          <span class="body-sm" style="color: var(--gray-700); font-weight: 600;">${t('common_offline')}</span>
        </div>
      </div>
    </div>
  `;

  // Quick action clicks
  container.querySelectorAll('.quick-action').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.action));
  });

  // See all records
  document.getElementById('see-all-records')?.addEventListener('click', () => navigate('medical-records'));

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('medicare_user');
    navigate('login');
  });

  // Online/offline listeners
  window.addEventListener('online', () => document.getElementById('offline-banner')?.classList.add('hidden'));
  window.addEventListener('offline', () => document.getElementById('offline-banner')?.classList.remove('hidden'));
}
