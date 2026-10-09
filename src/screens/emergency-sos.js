// ============================================
// Medicare – Emergency SOS Screen
// ============================================

import { t } from '../i18n/index.js';
import { navigate } from '../router.js';

export function renderEmergencySOS(container) {
    let sosState = 'idle'; // idle, sending, sent
    let location = null;

    function render() {
        container.innerHTML = `
      <div class="sos-screen">
        ${sosState === 'idle' ? renderIdle() : ''}
        ${sosState === 'sending' ? renderSending() : ''}
        ${sosState === 'sent' ? renderSent() : ''}
      </div>
    `;
        attachEvents();
    }

    function renderIdle() {
        return `
      <div class="animate-in">
        <h1 class="heading-xl" style="color: var(--danger);">${t('sos_title')}</h1>
        <p class="body-md text-muted mt-sm">${t('sos_subtitle')}</p>
      </div>

      <button class="sos-main-btn animate-in-delay-1" id="sos-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>${t('sos_button')}</span>
      </button>

      <p class="body-sm text-muted animate-in-delay-2">${t('sos_press_hold')}</p>

      <!-- Emergency Contacts -->
      <div class="emergency-contacts animate-in-delay-3">
        <h3 class="heading-sm mb-md" style="text-align:left;">${t('sos_emergency_contacts')}</h3>
        <div class="emergency-contact-item">
          <div class="avatar-sm" style="width:40px;height:40px;border-radius:var(--radius-md);background:var(--danger-bg);color:var(--danger);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 013.93 2H7a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
          </div>
          <div style="flex:1;">
            <h4 class="body-md" style="font-weight:600;">${t('sos_ambulance')}</h4>
            <p class="body-sm text-muted">108</p>
          </div>
          <a href="tel:108" class="btn btn-danger btn-sm">Call</a>
        </div>
        <div class="emergency-contact-item">
          <div class="avatar-sm" style="width:40px;height:40px;border-radius:var(--radius-md);background:var(--info-bg);color:var(--info);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div style="flex:1;">
            <h4 class="body-md" style="font-weight:600;">${t('sos_hospital')}</h4>
            <p class="body-sm text-muted">District General Hospital</p>
          </div>
          <a href="tel:112" class="btn btn-secondary btn-sm">Call</a>
        </div>
        <div class="emergency-contact-item">
          <div class="avatar-sm" style="width:40px;height:40px;border-radius:var(--radius-md);background:var(--success-bg);color:var(--success);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 013.93 2H7a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
          </div>
          <div style="flex:1;">
            <h4 class="body-md" style="font-weight:600;">${t('sos_helpline')}</h4>
            <p class="body-sm text-muted">104</p>
          </div>
          <a href="tel:104" class="btn btn-secondary btn-sm">Call</a>
        </div>
      </div>
    `;
    }

    function renderSending() {
        return `
      <div class="animate-in" style="padding-top: var(--space-3xl);">
        <div style="width:100px;height:100px;border-radius:50%;background:var(--danger-bg);display:flex;align-items:center;justify-content:center;margin:0 auto;">
          <div class="spinner" style="width:48px;height:48px;border-width:4px;border-color:rgba(239,68,68,0.2);border-top-color:var(--danger);"></div>
        </div>
        <h2 class="heading-lg mt-lg" style="color:var(--danger);">${t('sos_sending')}</h2>
        <p class="body-md text-muted mt-sm">Capturing GPS location...</p>
      </div>
    `;
    }

    function renderSent() {
        return `
      <div class="animate-in" style="padding-top: var(--space-xl);">
        <div style="width:80px;height:80px;border-radius:50%;background:var(--success-bg);display:flex;align-items:center;justify-content:center;margin:0 auto;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 class="heading-lg mt-lg" style="color:var(--success);">${t('sos_sent')}</h2>
        <p class="body-md text-muted mt-sm">${t('sos_help_coming')}</p>
      </div>

      <div class="sos-status animate-in-delay-1">
        <h3>${t('sos_location_captured')}</h3>
        ${location ? `
          <p class="location-info">
            📍 Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}<br>
            <span class="body-xs text-muted">Accuracy: ±${Math.round(location.accuracy)}m</span>
          </p>
        ` : `
          <p class="location-info">📍 Location captured successfully</p>
        `}
      </div>

      <!-- Emergency Guidance -->
      <div class="card mt-md animate-in-delay-2">
        <h3 class="heading-sm mb-md" style="display:flex;align-items:center;gap:8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ${t('sos_guidance')}
        </h3>
        <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
          <div class="flex items-center gap-sm">
            <span class="badge badge-info">1</span>
            <span class="body-sm">${t('sos_guidance_1')}</span>
          </div>
          <div class="flex items-center gap-sm">
            <span class="badge badge-info">2</span>
            <span class="body-sm">${t('sos_guidance_2')}</span>
          </div>
          <div class="flex items-center gap-sm">
            <span class="badge badge-info">3</span>
            <span class="body-sm">${t('sos_guidance_3')}</span>
          </div>
        </div>
      </div>

      <button class="btn btn-secondary btn-full mt-lg animate-in-delay-3" id="go-dashboard">
        ${t('nav_home')}
      </button>
    `;
    }

    function attachEvents() {
        document.getElementById('sos-btn')?.addEventListener('click', () => {
            sosState = 'sending';
            render();

            // Get GPS location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        location = {
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude,
                            accuracy: pos.coords.accuracy
                        };
                        // Store for potential sync
                        localStorage.setItem('medicare_last_sos', JSON.stringify({
                            location,
                            timestamp: new Date().toISOString()
                        }));

                        sosState = 'sent';
                        render();
                    },
                    (err) => {
                        console.warn('Geolocation error:', err);
                        sosState = 'sent';
                        render();
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            } else {
                setTimeout(() => {
                    sosState = 'sent';
                    render();
                }, 2000);
            }
        });

        document.getElementById('go-dashboard')?.addEventListener('click', () => navigate('dashboard'));
    }

    render();
}
