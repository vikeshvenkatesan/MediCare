// ============================================
// Medicare – i18n Engine
// ============================================

import { translations, languageNames } from './translations.js';
import { CONFIG } from '../config.js';

let currentLanguage = localStorage.getItem('medicare_lang') || CONFIG.DEFAULT_LANGUAGE;

export function t(key) {
    const lang = translations[currentLanguage];
    if (lang && lang[key]) return lang[key];
    // Fallback to English
    if (translations.en[key]) return translations.en[key];
    return key;
}

export function setLanguage(lang) {
    if (CONFIG.SUPPORTED_LANGUAGES.includes(lang)) {
        currentLanguage = lang;
        localStorage.setItem('medicare_lang', lang);
        updateAllLabels();
        return true;
    }
    return false;
}

export function getLanguage() {
    return currentLanguage;
}

export function getLanguageName(code) {
    return languageNames[code] || code;
}

export function getAllLanguages() {
    return CONFIG.SUPPORTED_LANGUAGES.map(code => ({
        code,
        name: languageNames[code] || code
    }));
}

// Update all elements with data-i18n attribute
export function updateAllLabels() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
}

// Language selector HTML
export function renderLanguageSelector() {
    return `
    <div class="lang-selector" id="lang-selector" title="${t('common_language')}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
      <span>${getLanguageName(currentLanguage)}</span>
    </div>
  `;
}

// Language picker modal HTML
export function renderLanguageModal() {
    const langs = getAllLanguages();
    return `
    <div class="modal-overlay" id="lang-modal">
      <div class="modal-content">
        <div class="modal-handle"></div>
        <h2 class="heading-lg" style="margin-bottom: var(--space-lg);">${t('common_language')}</h2>
        <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
          ${langs.map(l => `
            <button class="lang-option card card-interactive ${l.code === currentLanguage ? 'selected' : ''}" 
                    data-lang="${l.code}" 
                    style="text-align: left; padding: var(--space-md); ${l.code === currentLanguage ? 'border-color: var(--primary); background: var(--primary-bg);' : ''}">
              <span style="font-weight: 600;">${l.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function initLanguageSelector() {
    document.addEventListener('click', (e) => {
        const selector = e.target.closest('#lang-selector');
        if (selector) {
            document.body.insertAdjacentHTML('beforeend', renderLanguageModal());
            const modal = document.getElementById('lang-modal');
            modal.addEventListener('click', (ev) => {
                const opt = ev.target.closest('.lang-option');
                if (opt) {
                    setLanguage(opt.dataset.lang);
                    modal.remove();
                    // Re-render current screen
                    window.dispatchEvent(new HashChangeEvent('hashchange'));
                }
                if (ev.target === modal) modal.remove();
            });
        }
    });
}
