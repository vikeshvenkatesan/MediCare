// ============================================
// Medicare – Role Selection Screen
// ============================================

import { t } from '../i18n/index.js';
import { renderLanguageSelector } from '../i18n/index.js';
import { navigate } from '../router.js';

export function renderRoleSelection(container) {
    let selectedRole = null;

    function render() {
        container.innerHTML = `
      <div class="role-selection-screen">
        <div class="animate-in">
          <div class="login-logo">
            <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="16" fill="url(#roleGrad)"/>
              <path d="M32 16v32M16 32h32" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
              <defs><linearGradient id="roleGrad" x1="0" y1="0" x2="64" y2="64"><stop stop-color="#14b8a6"/><stop offset="1" stop-color="#0891b2"/></linearGradient></defs>
            </svg>
          </div>
          <h1 class="heading-xl">${t('role_title')}</h1>
          <p class="body-md text-muted mt-sm">${t('role_subtitle')}</p>
        </div>

        <div class="role-cards animate-in-delay-1">
          <div class="role-card ${selectedRole === 'patient' ? 'selected' : ''}" data-role="patient">
            <div class="role-card-icon patient-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="role-card-content">
              <h3>${t('role_patient_title')}</h3>
              <p>${t('role_patient_desc')}</p>
            </div>
            <div class="role-check">
              ${selectedRole === 'patient' ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
          </div>

          <div class="role-card ${selectedRole === 'doctor' ? 'selected' : ''}" data-role="doctor">
            <div class="role-card-icon doctor-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div class="role-card-content">
              <h3>${t('role_doctor_title')}</h3>
              <p>${t('role_doctor_desc')}</p>
            </div>
            <div class="role-check">
              ${selectedRole === 'doctor' ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
          </div>
        </div>

        <button class="btn btn-primary btn-full btn-lg mt-lg animate-in-delay-2" id="role-continue-btn" ${!selectedRole ? 'disabled style="opacity:0.5;"' : ''}>
          ${t('role_continue')}
        </button>

        <div class="mt-lg animate-in-delay-3">
          ${renderLanguageSelector()}
        </div>

        <p class="body-sm text-muted mt-md animate-in-delay-3" style="cursor:pointer" id="back-to-login">
          ${t('login_have_account')}
        </p>
      </div>
    `;

        attachEvents();
    }

    function attachEvents() {
        container.querySelectorAll('.role-card').forEach(card => {
            card.addEventListener('click', () => {
                selectedRole = card.dataset.role;
                render();
            });
        });

        document.getElementById('role-continue-btn')?.addEventListener('click', () => {
            if (!selectedRole) return;
            // Store role selection for the registration flow
            sessionStorage.setItem('medicare_reg_role', selectedRole);
            if (selectedRole === 'doctor') {
                navigate('doctor-registration');
            } else {
                navigate('login');
            }
        });

        document.getElementById('back-to-login')?.addEventListener('click', () => {
            navigate('login');
        });
    }

    render();
}
