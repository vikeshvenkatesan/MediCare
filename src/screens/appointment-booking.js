// ============================================
// Medicare – Appointment Booking Screen
// ============================================

import { t } from '../i18n/index.js';
import { navigate } from '../router.js';
import { mockDoctors } from '../data/mock-doctors.js';

export function renderAppointmentBooking(container, params) {
    const doctorId = params?.[0] || 'd1';
    const doctor = mockDoctors.find(d => d.doctor_id === doctorId) || mockDoctors[0];

    let selectedDate = 0;
    let selectedTime = null;
    let isConfirmed = false;

    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            day: d.toLocaleDateString('en', { weekday: 'short' }),
            date: d.getDate(),
            month: d.toLocaleDateString('en', { month: 'short' }),
            full: d.toISOString().split('T')[0]
        };
    });

    const timeSlots = {
        morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
        afternoon: ['12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM', '02:30 PM', '03:00 PM'],
        evening: ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM']
    };

    function render() {
        if (isConfirmed) {
            renderConfirmation();
            return;
        }

        container.innerHTML = `
      <div class="appointment-booking">
        <div class="symptom-screen-header animate-in">
          <button class="btn btn-ghost" id="back-btn" style="padding-left:0; margin-bottom: var(--space-sm);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            ${t('common_back')}
          </button>
          <h1>${t('appt_title')}</h1>
        </div>

        <!-- Doctor Card -->
        <div class="booking-doctor-card animate-in-delay-1">
          <div class="doctor-avatar" style="width:56px;height:56px;border-radius:var(--radius-lg);font-size:1.75rem;">
            ${doctor.avatar}
          </div>
          <div>
            <h3 class="heading-sm">${doctor.name}</h3>
            <p class="body-sm" style="color:var(--primary-dark);">${doctor.specialization}</p>
            <div class="flex items-center gap-sm mt-sm">
              <span class="badge badge-primary">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--warning)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ${doctor.rating}
              </span>
              <span class="body-xs text-muted">${doctor.experience} ${t('doc_experience')}</span>
            </div>
          </div>
        </div>

        <!-- Date Picker -->
        <div class="animate-in-delay-2">
          <h3 class="heading-sm mb-md">${t('appt_select_date')}</h3>
          <div class="date-picker">
            ${dates.map((d, i) => `
              <div class="date-option ${i === selectedDate ? 'selected' : ''}" data-date-idx="${i}">
                <div class="day">${d.day}</div>
                <div class="date">${d.date}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Time Slots -->
        <div class="animate-in-delay-3">
          <h3 class="heading-sm mb-md">${t('appt_select_time')}</h3>

          <p class="body-xs text-muted mb-sm" style="font-weight:600;">${t('appt_morning')}</p>
          <div class="time-slots mb-md">
            ${timeSlots.morning.map(time => `
              <div class="time-slot ${selectedTime === time ? 'selected' : ''}" data-time="${time}">${time}</div>
            `).join('')}
          </div>

          <p class="body-xs text-muted mb-sm" style="font-weight:600;">${t('appt_afternoon')}</p>
          <div class="time-slots mb-md">
            ${timeSlots.afternoon.map(time => `
              <div class="time-slot ${selectedTime === time ? 'selected' : ''}" data-time="${time}">${time}</div>
            `).join('')}
          </div>

          <p class="body-xs text-muted mb-sm" style="font-weight:600;">${t('appt_evening')}</p>
          <div class="time-slots mb-md">
            ${timeSlots.evening.map(time => `
              <div class="time-slot ${selectedTime === time ? 'selected' : ''}" data-time="${time}">${time}</div>
            `).join('')}
          </div>
        </div>

        <!-- Confirm -->
        <button class="btn btn-primary btn-full btn-lg mt-md animate-in-delay-4" id="confirm-btn" ${!selectedTime ? 'disabled style="opacity:0.5;"' : ''}>
          ${t('appt_confirm')}
        </button>
      </div>
    `;

        attachEvents();
    }

    function renderConfirmation() {
        const selectedDateObj = dates[selectedDate];
        container.innerHTML = `
      <div class="appointment-confirmed" style="text-align:center; padding-top: var(--space-3xl);">
        <div class="animate-in" style="margin-bottom: var(--space-xl);">
          <div style="width:80px;height:80px;border-radius:50%;background:var(--success-bg);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-lg);">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1 class="heading-xl">${t('appt_confirmed')}</h1>
          <p class="body-md text-muted mt-sm">${t('appt_confirmed_msg')}</p>
        </div>

        <div class="card animate-in-delay-1" style="text-align:left;">
          <div class="flex items-center gap-md mb-md">
            <div class="doctor-avatar">${doctor.avatar}</div>
            <div>
              <h3 class="heading-sm">${doctor.name}</h3>
              <p class="body-sm text-muted">${doctor.specialization}</p>
            </div>
          </div>
          <div class="divider"></div>
          <div class="flex justify-between mb-sm">
            <span class="body-sm text-muted">Date</span>
            <span class="body-sm" style="font-weight:600;">${selectedDateObj.day}, ${selectedDateObj.date} ${selectedDateObj.month}</span>
          </div>
          <div class="flex justify-between">
            <span class="body-sm text-muted">Time</span>
            <span class="body-sm" style="font-weight:600;">${selectedTime}</span>
          </div>
        </div>

        <button class="btn btn-primary btn-full btn-lg mt-lg animate-in-delay-2" id="join-call-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          ${t('appt_join_call')}
        </button>
        <button class="btn btn-secondary btn-full mt-sm animate-in-delay-3" id="go-dashboard-btn">
          ${t('nav_home')}
        </button>
      </div>
    `;

        document.getElementById('join-call-btn')?.addEventListener('click', () => navigate(`video-consultation/${doctorId}`));
        document.getElementById('go-dashboard-btn')?.addEventListener('click', () => navigate('dashboard'));
    }

    function attachEvents() {
        document.getElementById('back-btn')?.addEventListener('click', () => navigate('doctor-list'));

        container.querySelectorAll('.date-option').forEach(opt => {
            opt.addEventListener('click', () => {
                selectedDate = parseInt(opt.dataset.dateIdx);
                render();
            });
        });

        container.querySelectorAll('.time-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                selectedTime = slot.dataset.time;
                render();
            });
        });

        document.getElementById('confirm-btn')?.addEventListener('click', () => {
            if (selectedTime) {
                isConfirmed = true;
                render();
            }
        });
    }

    render();
}
