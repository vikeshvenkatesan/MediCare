// ============================================
// Medicare – Doctor Dashboard Screen
// ============================================

import { t } from '../i18n/index.js';
import { renderLanguageSelector } from '../i18n/index.js';
import { navigate } from '../router.js';

const mockAppointments = [
    { id: 'a1', patientName: 'Ramesh Kumar', symptoms: 'Fever, body pain', time: '10:00 AM', status: 'scheduled', avatar: '👨' },
    { id: 'a2', patientName: 'Lakshmi Devi', symptoms: 'Headache, dizziness', time: '11:30 AM', status: 'scheduled', avatar: '👩' },
    { id: 'a3', patientName: 'Suresh Babu', symptoms: 'Cough, cold', time: '02:00 PM', status: 'scheduled', avatar: '👦' },
];

export function renderDoctorDashboard(container) {
    const user = JSON.parse(localStorage.getItem('medicare_user') || '{}');
    const name = user.name || 'Doctor';
    let isAvailable = user.availability !== false;

    function render() {
        container.innerHTML = `
      <div class="doctor-dashboard animate-in">
        <!-- Header -->
        <div class="dashboard-header">
          <div class="dashboard-greeting">
            <h1>${t('ddash_welcome')}, ${name.split(' ').pop()} 👋</h1>
            <p>${user.specialization || 'General Medicine'} · ${user.hospital || 'Hospital'}</p>
          </div>
          <div class="dashboard-header-actions">
            ${renderLanguageSelector()}
            <button class="btn-icon btn-secondary" id="logout-btn" title="Logout">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>

        <!-- Availability Toggle -->
        <div class="availability-toggle-card animate-in-delay-1">
          <div class="availability-info">
            <h3>${t('ddash_availability')}</h3>
            <p class="body-sm ${isAvailable ? 'text-success' : 'text-danger'}">
              <span class="availability-dot ${isAvailable ? 'online' : 'offline'}"></span>
              ${isAvailable ? t('ddash_available') : t('ddash_not_available')}
            </p>
          </div>
          <label class="toggle-switch" id="availability-toggle">
            <input type="checkbox" ${isAvailable ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>

        <!-- Stats Cards -->
        <div class="stat-cards animate-in-delay-1">
          <div class="stat-card">
            <div class="stat-number text-gradient">3</div>
            <div class="stat-label">${t('ddash_patients_today')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number text-gradient">47</div>
            <div class="stat-label">${t('ddash_total_consult')}</div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="section-header animate-in-delay-2">
          <h2>Quick Actions</h2>
        </div>
        <div class="quick-actions animate-in-delay-2">
          <div class="quick-action" data-action="prescription-writer">
            <div class="quick-action-icon teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <p>${t('ddash_write_rx')}</p>
          </div>
          <div class="quick-action" data-action="doctor-list">
            <div class="quick-action-icon cyan">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <p>${t('ddash_view_patients')}</p>
          </div>
          <div class="quick-action" data-action="medical-records">
            <div class="quick-action-icon amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <p>${t('dash_medical_records')}</p>
          </div>
          <div class="quick-action" data-action="emergency-sos">
            <div class="quick-action-icon red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <p>${t('dash_emergency_sos')}</p>
          </div>
        </div>

        <!-- Upcoming Appointments -->
        <div class="section-header animate-in-delay-3">
          <h2>${t('ddash_upcoming')}</h2>
        </div>
        <div class="appointment-list animate-in-delay-3">
          ${mockAppointments.length > 0 ? mockAppointments.map((appt, i) => `
            <div class="appointment-card" data-appt-id="${appt.id}" style="animation-delay: ${i * 0.1}s">
              <div class="appointment-avatar">${appt.avatar}</div>
              <div class="appointment-info">
                <h4>${appt.patientName}</h4>
                <p class="body-sm text-muted">${appt.symptoms}</p>
              </div>
              <div class="appointment-time">
                <span class="badge badge-primary">${appt.time}</span>
                <button class="btn btn-primary btn-sm mt-sm" data-start-call="${appt.id}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                  Call
                </button>
              </div>
            </div>
          `).join('') : `
            <div class="empty-state">
              <p class="text-muted">${t('ddash_no_appointments')}</p>
            </div>
          `}
        </div>
      </div>
    `;

        attachEvents();
    }

    function attachEvents() {
        // Availability toggle
        document.querySelector('#availability-toggle input')?.addEventListener('change', (e) => {
            isAvailable = e.target.checked;
            user.availability = isAvailable;
            localStorage.setItem('medicare_user', JSON.stringify(user));
            render();
        });

        // Quick action clicks
        container.querySelectorAll('.quick-action').forEach(el => {
            el.addEventListener('click', () => {
                const action = el.dataset.action;
                if (action === 'prescription-writer') {
                    navigate('prescription');
                } else {
                    navigate(action);
                }
            });
        });

        // Start call
        container.querySelectorAll('[data-start-call]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigate('video-consultation/d1');
            });
        });

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            localStorage.removeItem('medicare_user');
            navigate('login');
        });
    }

    render();
}
