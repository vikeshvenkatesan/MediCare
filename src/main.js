// ============================================
// Medicare – Main Entry Point
// ============================================

import { initRouter, registerRoute, navigate } from './router.js';
import { initLanguageSelector, updateAllLabels } from './i18n/index.js';
import { syncQueuedData } from './ai/gemini.js';

// Import screens
import { renderLogin } from './screens/login.js';
import { renderRoleSelection } from './screens/role-selection.js';
import { renderDoctorRegistration } from './screens/doctor-registration.js';
import { renderDashboard } from './screens/dashboard.js';
import { renderDoctorDashboard } from './screens/doctor-dashboard.js';
import { renderPatientProfile } from './screens/patient-profile.js';
import { renderSymptomChecker } from './screens/symptom-checker.js';
import { renderDoctorList } from './screens/doctor-list.js';
import { renderAppointmentBooking } from './screens/appointment-booking.js';
import { renderVideoConsultation } from './screens/video-consultation.js';
import { renderPrescription } from './screens/prescription.js';
import { renderEmergencySOS } from './screens/emergency-sos.js';
import { renderMedicalRecords } from './screens/medical-records.js';

// Initialize Application
function init() {
    // Register all routes
    registerRoute('login', renderLogin);
    registerRoute('role-selection', renderRoleSelection);
    registerRoute('doctor-registration', renderDoctorRegistration);
    registerRoute('dashboard', renderDashboard);
    registerRoute('doctor-dashboard', renderDoctorDashboard);
    registerRoute('patient-profile', renderPatientProfile);
    registerRoute('symptom-checker', renderSymptomChecker);
    registerRoute('doctor-list', renderDoctorList);
    registerRoute('appointment-booking', renderAppointmentBooking);
    registerRoute('video-consultation', renderVideoConsultation);
    registerRoute('prescription', renderPrescription);
    registerRoute('emergency-sos', renderEmergencySOS);
    registerRoute('medical-records', renderMedicalRecords);

    // Initialize language selector
    initLanguageSelector();

    // Dismiss splash and show app
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const appContainer = document.getElementById('app-container');

        splash?.classList.add('fade-out');
        appContainer?.classList.remove('hidden');

        setTimeout(() => splash?.remove(), 600);

        // Initialize router (renders correct screen)
        initRouter();

        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('medicare_user') || '{}');
        if (!user.loggedIn && !window.location.hash.includes('login') && !window.location.hash.includes('role-selection') && !window.location.hash.includes('doctor-registration')) {
            navigate('login');
        } else if (user.loggedIn && (!window.location.hash || window.location.hash === '#login')) {
            // Role-based dashboard routing
            if (user.role === 'doctor') {
                navigate('doctor-dashboard');
            } else {
                navigate('dashboard');
            }
        }

        // Update all i18n labels
        updateAllLabels();
    }, 1500);

    // Sync queued offline data when online
    window.addEventListener('online', () => {
        syncQueuedData();
        showConnectivityToast('Back online! Syncing data...');
    });

    window.addEventListener('offline', () => {
        showConnectivityToast('You are offline. Using local data.');
    });

    // Try syncing on start if online
    if (navigator.onLine) {
        syncQueuedData();
    }
}

function showConnectivityToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${navigator.onLine ? 'toast-success' : 'toast-warning'}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
