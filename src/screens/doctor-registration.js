// ============================================
// Medicare – Doctor Registration Screen
// ============================================

import { t } from '../i18n/index.js';
import { navigate } from '../router.js';

const SPECIALIZATIONS = [
    'General Physician',
    'Cardiologist',
    'Neurologist',
    'Dermatologist',
    'Pediatrician',
    'Orthopedic Doctor'
];

export function renderDoctorRegistration(container) {
    const state = {
        name: '',
        specialization: '',
        hospital: '',
        experience: '',
        license: '',
        uploads: { degree: null, license: null, specialization: null }
    };

    function render() {
        container.innerHTML = `
      <div class="doctor-reg-screen">
        <div class="symptom-screen-header animate-in">
          <button class="btn btn-ghost" id="back-btn" style="padding-left:0; margin-bottom: var(--space-sm);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            ${t('common_back')}
          </button>
          <h1>${t('dreg_title')}</h1>
          <p>${t('dreg_subtitle')}</p>
        </div>

        <div class="doctor-reg-form animate-in-delay-1">
          <!-- Name -->
          <div class="input-group">
            <label class="input-label">${t('dreg_name')}</label>
            <input type="text" class="input" id="dreg-name" placeholder="Dr. " value="${state.name}">
          </div>

          <!-- Specialization -->
          <div class="input-group">
            <label class="input-label">${t('dreg_specialization')}</label>
            <select class="input select-input" id="dreg-spec">
              <option value="" disabled ${!state.specialization ? 'selected' : ''}>${t('dreg_select_spec')}</option>
              ${SPECIALIZATIONS.map(s => `
                <option value="${s}" ${state.specialization === s ? 'selected' : ''}>${s}</option>
              `).join('')}
            </select>
          </div>

          <!-- Hospital -->
          <div class="input-group">
            <label class="input-label">${t('dreg_hospital')}</label>
            <input type="text" class="input" id="dreg-hospital" placeholder="e.g., District Hospital" value="${state.hospital}">
          </div>

          <!-- Experience -->
          <div class="input-group">
            <label class="input-label">${t('dreg_experience')}</label>
            <input type="number" class="input" id="dreg-exp" placeholder="e.g., 10" min="0" max="60" value="${state.experience}">
          </div>

          <!-- License Number -->
          <div class="input-group">
            <label class="input-label">${t('dreg_license')}</label>
            <input type="text" class="input" id="dreg-license" placeholder="e.g., MCI-2020-12345" value="${state.license}">
          </div>
        </div>

        <!-- Document Upload Section -->
        <div class="upload-section animate-in-delay-2">
          <h3 class="heading-sm mb-md">Verification Documents</h3>

          <div class="upload-card" data-upload="degree">
            <div class="upload-icon ${state.uploads.degree ? 'uploaded' : ''}">
              ${state.uploads.degree ? `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              ` : `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              `}
            </div>
            <div>
              <p class="upload-label">${t('dreg_upload_degree')}</p>
              <p class="upload-hint">${state.uploads.degree ? '✅ Uploaded' : t('dreg_upload_hint')}</p>
            </div>
          </div>

          <div class="upload-card" data-upload="license">
            <div class="upload-icon ${state.uploads.license ? 'uploaded' : ''}">
              ${state.uploads.license ? `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              ` : `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              `}
            </div>
            <div>
              <p class="upload-label">${t('dreg_upload_license')}</p>
              <p class="upload-hint">${state.uploads.license ? '✅ Uploaded' : t('dreg_upload_hint')}</p>
            </div>
          </div>

          <div class="upload-card" data-upload="specialization">
            <div class="upload-icon ${state.uploads.specialization ? 'uploaded' : ''}">
              ${state.uploads.specialization ? `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              ` : `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              `}
            </div>
            <div>
              <p class="upload-label">${t('dreg_upload_spec')}</p>
              <p class="upload-hint">${state.uploads.specialization ? '✅ Uploaded' : t('dreg_upload_hint')}</p>
            </div>
          </div>
        </div>

        <!-- Hidden file input -->
        <input type="file" id="file-upload-input" accept=".pdf,.jpg,.jpeg,.png" style="display:none;">

        <!-- Submit -->
        <button class="btn btn-primary btn-full btn-lg mt-lg animate-in-delay-3" id="dreg-submit-btn">
          ${t('dreg_submit')}
        </button>
      </div>
    `;

        attachEvents();
    }

    let currentUploadType = null;

    function attachEvents() {
        document.getElementById('back-btn')?.addEventListener('click', () => navigate('role-selection'));

        // Upload cards
        container.querySelectorAll('.upload-card').forEach(card => {
            card.addEventListener('click', () => {
                currentUploadType = card.dataset.upload;
                document.getElementById('file-upload-input')?.click();
            });
        });

        document.getElementById('file-upload-input')?.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (file && currentUploadType) {
                state.uploads[currentUploadType] = file.name;
                render();
            }
        });

        // Submit
        document.getElementById('dreg-submit-btn')?.addEventListener('click', () => {
            state.name = document.getElementById('dreg-name')?.value || '';
            state.specialization = document.getElementById('dreg-spec')?.value || '';
            state.hospital = document.getElementById('dreg-hospital')?.value || '';
            state.experience = document.getElementById('dreg-exp')?.value || '';
            state.license = document.getElementById('dreg-license')?.value || '';

            if (!state.name || !state.specialization) {
                showToast('Please fill in your name and specialization.', 'warning');
                return;
            }

            // Store doctor data
            const doctorData = {
                name: state.name,
                phone: '9876543210',
                role: 'doctor',
                loggedIn: true,
                specialization: state.specialization,
                hospital: state.hospital,
                experience: parseInt(state.experience) || 0,
                license: state.license,
                availability: true,
                uploads: state.uploads
            };
            localStorage.setItem('medicare_user', JSON.stringify(doctorData));
            showToast('Registration Successful! Welcome, Doctor 🩺', 'success');
            navigate('doctor-dashboard');
        });
    }

    function showToast(message, type = 'success') {
        let tContainer = document.querySelector('.toast-container');
        if (!tContainer) {
            tContainer = document.createElement('div');
            tContainer.className = 'toast-container';
            document.body.appendChild(tContainer);
        }
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        tContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    render();
}
