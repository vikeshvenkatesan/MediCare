// ============================================
// Medicare – Doctor List Screen
// ============================================

import { t } from '../i18n/index.js';
import { navigate } from '../router.js';
import { mockDoctors, specializations as allSpecs } from '../data/mock-doctors.js';

export function renderDoctorList(container) {
  let activeFilter = 'All';
  const specializations = ['All', ...allSpecs];

  function render() {
    const filtered = activeFilter === 'All'
      ? mockDoctors
      : mockDoctors.filter(d => d.specialization === activeFilter);

    container.innerHTML = `
      <div class="doctor-list-screen">
        <div class="symptom-screen-header animate-in">
          <button class="btn btn-ghost" id="back-btn" style="padding-left:0; margin-bottom: var(--space-sm);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            ${t('common_back')}
          </button>
          <h1>${t('doc_title')}</h1>
          <p>${t('doc_subtitle')}</p>
        </div>

        <!-- Search -->
        <div class="input-with-icon mt-md animate-in-delay-1">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="input" id="search-doctor" placeholder="${t('common_search')}..." type="text">
        </div>

        <!-- Filters -->
        <div class="doctor-filters mt-md animate-in-delay-1">
          ${specializations.map(s => `
            <button class="filter-chip ${s === activeFilter ? 'active' : ''}" data-filter="${s}">
              ${s}
            </button>
          `).join('')}
        </div>

        <!-- Doctor Cards -->
        <div class="doctor-cards mt-md" id="doctor-cards">
          ${filtered.map((doc, i) => `
            <div class="doctor-card animate-in-delay-${Math.min(i + 1, 4)}" data-doctor-id="${doc.doctor_id}">
              <div class="doctor-avatar">${doc.avatar}</div>
              <div class="doctor-info">
                <h3>${doc.name}</h3>
                <p class="specialization">${doc.specialization}</p>
                <div class="doctor-meta">
                  <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--warning)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ${doc.rating}
                  </span>
                  <span>${doc.experience} ${t('doc_experience')}</span>
                  <span>
                    <span class="availability-dot ${doc.availability ? 'online' : 'offline'}"></span>
                    ${doc.availability ? t('doc_available') : t('doc_unavailable')}
                  </span>
                </div>
              </div>
              ${doc.availability ? `
                <button class="btn btn-primary btn-sm book-btn" data-doctor-id="${doc.doctor_id}">
                  ${t('doc_book')}
                </button>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    document.getElementById('back-btn')?.addEventListener('click', () => navigate('dashboard'));

    container.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        activeFilter = chip.dataset.filter;
        render();
      });
    });

    container.querySelectorAll('.book-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(`appointment-booking/${btn.dataset.doctorId}`);
      });
    });

    container.querySelectorAll('.doctor-card').forEach(card => {
      card.addEventListener('click', () => {
        const doc = mockDoctors.find(d => d.doctor_id === card.dataset.doctorId);
        if (doc?.availability) navigate(`appointment-booking/${card.dataset.doctorId}`);
      });
    });

    document.getElementById('search-doctor')?.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      container.querySelectorAll('.doctor-card').forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const spec = card.querySelector('.specialization').textContent.toLowerCase();
        card.style.display = (name.includes(query) || spec.includes(query)) ? 'flex' : 'none';
      });
    });
  }

  render();
}
