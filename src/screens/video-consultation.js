// ============================================
// Medicare – Video Consultation Screen
// ============================================

import { t } from '../i18n/index.js';
import { navigate } from '../router.js';
import { mockDoctors } from '../data/mock-doctors.js';

export function renderVideoConsultation(container, params) {
    const doctorId = params?.[0] || 'd1';
    const doctor = mockDoctors.find(d => d.doctor_id === doctorId) || mockDoctors[0];

    let isMuted = false;
    let isCameraOff = false;
    let callDuration = 0;
    let durationInterval = null;
    let isConnecting = true;

    function formatDuration(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function render() {
        container.innerHTML = `
      <div class="video-screen">
        <!-- Main Video Area -->
        <div class="video-main animate-in">
          ${isConnecting ? `
            <div class="placeholder-text">
              <div class="spinner" style="width:40px;height:40px;border-width:4px;border-color:var(--gray-600);border-top-color:var(--primary);margin:0 auto var(--space-md);"></div>
              <p style="font-size: 1rem; font-weight: 500;">${t('video_connecting')}</p>
              <p style="font-size: 0.875rem; color: var(--gray-500); margin-top: var(--space-xs);">${doctor.name}</p>
            </div>
          ` : `
            <div class="placeholder-text">
              <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,var(--teal-500),var(--cyan-600));display:flex;align-items:center;justify-content:center;font-size:3rem;margin:0 auto var(--space-md);">
                ${doctor.avatar}
              </div>
              <p style="font-size: 1.125rem; font-weight: 600;">${doctor.name}</p>
              <p style="font-size: 0.8125rem; color: var(--gray-400);">${doctor.specialization}</p>
            </div>
          `}

          <!-- PIP (Self View) -->
          <div class="video-pip">
            <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--gray-700);">
              ${isCameraOff ? `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 01-2-2V8a2 2 0 012-2h3m3-3h6l2 3h4a2 2 0 012 2v9.34"/></svg>
              ` : `
                <div style="font-size:1.5rem;">😊</div>
              `}
            </div>
          </div>

          <!-- Call Info -->
          ${!isConnecting ? `
            <div class="video-info">
              <div class="flex items-center gap-sm">
                <span style="width:8px;height:8px;border-radius:50%;background:var(--success);"></span>
                ${t('video_connected')} · ${formatDuration(callDuration)}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Controls -->
        <div class="video-controls animate-in-delay-1">
          <button class="video-control-btn mute ${isMuted ? 'active' : ''}" id="mute-btn" title="${t('video_mute')}" style="${isMuted ? 'background:var(--danger);color:#fff;' : ''}">
            ${isMuted ? `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12L9 9z"/><path d="M19 10v2a7 7 0 01-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            ` : `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            `}
          </button>

          <button class="video-control-btn camera ${isCameraOff ? 'active' : ''}" id="camera-btn" title="${t('video_camera')}" style="${isCameraOff ? 'background:var(--danger);color:#fff;' : ''}">
            ${isCameraOff ? `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 01-2-2V8a2 2 0 012-2h3m3-3h6l2 3h4a2 2 0 012 2v9.34"/></svg>
            ` : `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            `}
          </button>

          <button class="video-control-btn end-call" id="end-call-btn" title="${t('video_end')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.73.8 2 2 0 011.72 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 013.93 2H7a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91"/></svg>
          </button>

          <button class="video-control-btn chat-toggle" id="write-rx-btn" title="Write Prescription">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </button>
        </div>
      </div>
    `;

        attachEvents();
    }

    function attachEvents() {
        document.getElementById('mute-btn')?.addEventListener('click', () => {
            isMuted = !isMuted;
            render();
        });

        document.getElementById('camera-btn')?.addEventListener('click', () => {
            isCameraOff = !isCameraOff;
            render();
        });

        document.getElementById('end-call-btn')?.addEventListener('click', () => {
            if (durationInterval) clearInterval(durationInterval);
            navigate('prescription');
        });

        document.getElementById('write-rx-btn')?.addEventListener('click', () => {
            navigate('prescription');
        });
    }

    render();

    // Simulate connection
    setTimeout(() => {
        isConnecting = false;
        render();

        durationInterval = setInterval(() => {
            callDuration++;
            const info = container.querySelector('.video-info');
            if (info) {
                info.innerHTML = `<div class="flex items-center gap-sm"><span style="width:8px;height:8px;border-radius:50%;background:var(--success);"></span>${t('video_connected')} · ${formatDuration(callDuration)}</div>`;
            }
        }, 1000);
    }, 2000);
}
