// ============================================
// Medicare – Patient Profile Screen
// ============================================

import { t, getLanguage, getLanguageName, getAllLanguages, setLanguage } from '../i18n/index.js';
import { navigate } from '../router.js';

const mockUploadedDocs = [
    { id: 'doc1', name: 'Blood Test Report.pdf', type: 'lab_report', date: '2026-02-20', size: '1.2 MB' },
    { id: 'doc2', name: 'X-Ray Scan.jpg', type: 'scan_report', date: '2026-02-10', size: '3.4 MB' },
    { id: 'doc3', name: 'Previous Prescription.pdf', type: 'prescription', date: '2026-01-28', size: '0.5 MB' },
];

export function renderPatientProfile(container) {
    const user = JSON.parse(localStorage.getItem('medicare_user') || '{}');
    let isEditing = false;
    let editState = {
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
    };
    let docs = [...mockUploadedDocs];
    let activeTab = 'all';

    function render() {
        const filteredDocs = activeTab === 'all' ? docs : docs.filter(d => d.type === activeTab);
        const langName = getLanguageName(getLanguage());

        container.innerHTML = `
      <div class="profile-screen">
        <div class="symptom-screen-header animate-in">
          <button class="btn btn-ghost" id="back-btn" style="padding-left:0; margin-bottom: var(--space-sm);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            ${t('common_back')}
          </button>
          <h1>${t('prof_title')}</h1>
          <p>${t('prof_subtitle')}</p>
        </div>

        <!-- Profile Card -->
        <div class="profile-card animate-in-delay-1">
          <div class="profile-avatar-section">
            <div class="profile-avatar-large">
              ${(user.name || 'P').charAt(0).toUpperCase()}
            </div>
            <div class="profile-name-section">
              <h2>${user.name || 'Patient'}</h2>
              <p class="body-sm text-muted">📱 ${user.phone || '+91 9876543210'}</p>
            </div>
            <button class="btn btn-secondary btn-sm" id="edit-profile-btn">
              ${isEditing ? t('common_cancel') : t('prof_edit')}
            </button>
          </div>

          ${isEditing ? `
            <div class="profile-edit-form mt-md">
              <div class="input-group">
                <label class="input-label">${t('prof_name')}</label>
                <input type="text" class="input" id="edit-name" value="${editState.name}">
              </div>
              <div class="input-group">
                <label class="input-label">${t('prof_phone')}</label>
                <input type="tel" class="input" id="edit-phone" value="${editState.phone}">
              </div>
              <div class="input-group">
                <label class="input-label">${t('prof_location')}</label>
                <input type="text" class="input" id="edit-location" placeholder="${t('prof_location_placeholder')}" value="${editState.location}">
              </div>
              <div class="input-group">
                <label class="input-label">${t('prof_language')}</label>
                <select class="input select-input" id="edit-language">
                  ${getAllLanguages().map(l => `
                    <option value="${l.code}" ${l.code === getLanguage() ? 'selected' : ''}>${l.name}</option>
                  `).join('')}
                </select>
              </div>
              <button class="btn btn-primary btn-full mt-md" id="save-profile-btn">
                ${t('prof_save')}
              </button>
            </div>
          ` : `
            <div class="profile-details mt-md">
              <div class="profile-detail-row">
                <span class="detail-label">${t('prof_language')}</span>
                <span class="detail-value">${langName}</span>
              </div>
              <div class="profile-detail-row">
                <span class="detail-label">${t('prof_location')}</span>
                <span class="detail-value">${user.location || 'Not set'}</span>
              </div>
              <div class="profile-detail-row">
                <span class="detail-label">Role</span>
                <span class="badge badge-primary">${user.role === 'doctor' ? t('login_role_doctor') : t('login_role_patient')}</span>
              </div>
            </div>
          `}
        </div>

        <!-- Health Documents -->
        <div class="section-header mt-lg animate-in-delay-2">
          <h2>${t('prof_health_docs')}</h2>
          <button class="btn btn-primary btn-sm" id="upload-doc-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            ${t('prof_upload')}
          </button>
        </div>

        <!-- Upload hint -->
        <p class="body-xs text-muted mb-sm animate-in-delay-2">${t('prof_upload_hint')}</p>

        <!-- Document Tabs -->
        <div class="doctor-filters mb-md animate-in-delay-2">
          <button class="filter-chip ${activeTab === 'all' ? 'active' : ''}" data-tab="all">All</button>
          <button class="filter-chip ${activeTab === 'prescription' ? 'active' : ''}" data-tab="prescription">${t('prof_prescriptions')}</button>
          <button class="filter-chip ${activeTab === 'lab_report' ? 'active' : ''}" data-tab="lab_report">${t('prof_lab_reports')}</button>
          <button class="filter-chip ${activeTab === 'scan_report' ? 'active' : ''}" data-tab="scan_report">${t('prof_scan_reports')}</button>
        </div>

        <!-- Document List -->
        <div class="document-list animate-in-delay-3">
          ${filteredDocs.length > 0 ? filteredDocs.map((doc, i) => {
            const typeColors = {
                prescription: { bg: 'var(--success-bg)', color: 'var(--success)', label: t('prof_prescriptions') },
                lab_report: { bg: '#dbeafe', color: '#2563eb', label: t('prof_lab_reports') },
                scan_report: { bg: '#fce7f3', color: '#db2777', label: t('prof_scan_reports') },
                medical_history: { bg: 'var(--primary-bg)', color: 'var(--primary)', label: t('prof_medical_history') }
            };
            const style = typeColors[doc.type] || typeColors.medical_history;
            return `
              <div class="document-item" style="animation-delay: ${i * 0.08}s">
                <div class="doc-icon" style="background:${style.bg};color:${style.color};">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div class="doc-info">
                  <h4>${doc.name}</h4>
                  <div class="doc-meta">
                    <span class="badge" style="background:${style.bg};color:${style.color};font-size:0.625rem;">${style.label}</span>
                    <span>${new Date(doc.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>${doc.size}</span>
                  </div>
                </div>
                <button class="btn-icon" title="Download">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
              </div>
            `;
        }).join('') : `
            <div class="empty-state" style="padding: var(--space-xl);">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <p class="text-muted mt-md">${t('prof_no_docs')}</p>
            </div>
          `}
        </div>

        <!-- Hidden File Input -->
        <input type="file" id="doc-file-input" accept=".pdf,.jpg,.jpeg,.png" style="display:none;">
      </div>
    `;

        attachEvents();
    }

    function attachEvents() {
        document.getElementById('back-btn')?.addEventListener('click', () => navigate('dashboard'));

        document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
            isEditing = !isEditing;
            if (isEditing) {
                editState = { name: user.name || '', phone: user.phone || '', location: user.location || '' };
            }
            render();
        });

        document.getElementById('save-profile-btn')?.addEventListener('click', () => {
            const newName = document.getElementById('edit-name')?.value || '';
            const newPhone = document.getElementById('edit-phone')?.value || '';
            const newLocation = document.getElementById('edit-location')?.value || '';
            const newLang = document.getElementById('edit-language')?.value || 'en';

            user.name = newName;
            user.phone = newPhone;
            user.location = newLocation;
            localStorage.setItem('medicare_user', JSON.stringify(user));
            setLanguage(newLang);
            isEditing = false;
            showToast(t('prof_saved'));
            render();
        });

        // Tab filters
        container.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                activeTab = chip.dataset.tab;
                render();
            });
        });

        // Upload
        document.getElementById('upload-doc-btn')?.addEventListener('click', () => {
            document.getElementById('doc-file-input')?.click();
        });

        document.getElementById('doc-file-input')?.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (file) {
                docs.unshift({
                    id: 'doc_' + Date.now(),
                    name: file.name,
                    type: file.name.toLowerCase().includes('prescription') ? 'prescription' :
                        file.name.toLowerCase().includes('scan') ? 'scan_report' : 'lab_report',
                    date: new Date().toISOString().split('T')[0],
                    size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
                });
                showToast('Document uploaded successfully! 📄');
                render();
            }
        });
    }

    function showToast(message) {
        let tContainer = document.querySelector('.toast-container');
        if (!tContainer) {
            tContainer = document.createElement('div');
            tContainer.className = 'toast-container';
            document.body.appendChild(tContainer);
        }
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
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
