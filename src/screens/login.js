// ============================================
// Medicare – Login / Registration Screen
// Uses Supabase Phone OTP when configured,
// falls back to demo mode otherwise
// ============================================

import { t } from '../i18n/index.js';
import { renderLanguageSelector } from '../i18n/index.js';
import { navigate } from '../router.js';
import { hasSupabaseConfig } from '../config.js';
import { sendOTP as supabaseSendOTP, verifyOTP as supabaseVerifyOTP } from '../supabase.js';

export function renderLogin(container) {
  const isSupabaseReady = hasSupabaseConfig();

  const state = {
    step: 'phone',        // phone → otp → role
    phone: '',
    name: '',
    role: 'patient',
    isLogin: true,
    generatedOTP: '',     // demo-mode only
    otpError: '',
    isSending: false,     // loading state
    isVerifying: false,
    useSupabase: isSupabaseReady  // true = real OTP, false = demo
  };

  function render() {
    container.innerHTML = `
      <div class="login-screen">
        <div class="animate-in">
          <div class="login-logo">
            <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="16" fill="url(#loginGrad)"/>
              <path d="M32 16v32M16 32h32" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
              <defs><linearGradient id="loginGrad" x1="0" y1="0" x2="64" y2="64"><stop stop-color="#14b8a6"/><stop offset="1" stop-color="#0891b2"/></linearGradient></defs>
            </svg>
          </div>
          <h1 class="heading-xl">${t('login_title')}</h1>
          <p class="body-md text-muted mt-sm">${t('login_subtitle')}</p>
        </div>

        <div class="login-form animate-in-delay-2">
          ${state.step === 'phone' ? renderPhoneStep() : ''}
          ${state.step === 'otp' ? renderOTPStep() : ''}
          ${state.step === 'role' ? renderRoleStep() : ''}
        </div>

        <div class="mt-lg animate-in-delay-3">
          ${renderLanguageSelector()}
        </div>
      </div>
    `;

    attachEvents();
  }

  function renderPhoneStep() {
    return `
      ${!state.isLogin ? `
        <div class="input-group">
          <label class="input-label">${t('login_name')}</label>
          <input type="text" class="input" id="name-input" placeholder="${t('login_name_placeholder')}" value="${state.name}">
        </div>
      ` : ''}
      <div class="input-group ${!state.isLogin ? 'mt-sm' : ''}">
        <label class="input-label">${t('login_phone')}</label>
        <div class="phone-input-wrap">
          <div class="phone-prefix">+91</div>
          <input type="tel" class="input" id="phone-input" placeholder="${t('login_phone_placeholder')}" 
                 maxlength="10" value="${state.phone}" autocomplete="tel">
        </div>
      </div>

      ${state.otpError ? `
        <p class="body-xs" style="color: var(--danger); text-align: center; margin-top: 8px;">
          ❌ ${state.otpError}
        </p>
      ` : ''}

      <button class="btn btn-primary btn-full btn-lg mt-md" id="send-otp-btn" ${state.isSending ? 'disabled' : ''}>
        ${state.isSending
        ? '<span class="spinner" style="width:20px;height:20px;border-width:2px;"></span> Sending...'
        : t('login_send_otp')}
      </button>

      <!-- Mode indicator -->
      <div style="text-align:center; margin-top: 8px;">
        <span class="body-xs" style="color: ${state.useSupabase ? 'var(--success)' : 'var(--warning)'}; font-weight:600;">
          ${state.useSupabase ? '🔒 Supabase OTP (Real SMS)' : '🧪 Demo Mode (No SMS)'}
        </span>
      </div>

      <p class="body-sm text-muted mt-md" style="cursor:pointer; text-align:center;" id="toggle-mode">
        ${state.isLogin ? t('login_no_account') : t('login_have_account')}
      </p>
    `;
  }

  function renderOTPStep() {
    // Supabase sends 6-digit OTP, demo uses 4-digit
    const otpLength = state.useSupabase ? 6 : 4;

    return `
      <p class="body-md text-muted mb-sm">${t('login_enter_otp')}</p>
      
      ${state.useSupabase ? `
        <!-- Real Supabase OTP info -->
        <div style="background: var(--primary-bg); border: 1px solid var(--primary); border-radius: var(--radius-md); padding: 10px 14px; margin-bottom: var(--space-md); text-align: center;">
          <p class="body-sm" style="color: var(--primary-dark); font-weight: 600; margin: 0;">
            📱 OTP sent via SMS to +91 ${state.phone}
          </p>
          <p class="body-xs text-muted" style="margin-top: 4px;">
            Enter the ${otpLength}-digit code you received
          </p>
        </div>
      ` : `
        <!-- Demo OTP shown on screen -->
        <div style="background: var(--success-bg); border: 1px solid var(--success); border-radius: var(--radius-md); padding: 10px 14px; margin-bottom: var(--space-md); text-align: center;">
          <p class="body-xs text-muted" style="margin-bottom: 4px;">📱 Demo OTP sent to +91 ${state.phone || 'XXXXXXXXXX'}</p>
          <p style="font-size: 1.5rem; font-weight: 800; letter-spacing: 0.5em; color: var(--success); margin: 0;">
            ${state.generatedOTP}
          </p>
        </div>
      `}

      <div class="otp-inputs">
        ${Array.from({ length: otpLength }, (_, i) =>
      `<input type="text" class="otp-input" maxlength="1" data-idx="${i}" inputmode="numeric">`
    ).join('')}
      </div>

      ${state.otpError ? `
        <p class="body-xs" style="color: var(--danger); text-align: center; margin-top: 8px;">
          ❌ ${state.otpError}
        </p>
      ` : ''}

      ${!state.useSupabase ? `
        <button class="btn btn-ghost mt-sm" id="auto-fill-otp" style="width: 100%; text-align: center; color: var(--primary);">
          ✨ Auto-fill OTP (Demo)
        </button>
      ` : `
        <button class="btn btn-ghost mt-sm" id="resend-otp" style="width: 100%; text-align: center; color: var(--primary);">
          🔄 Resend OTP
        </button>
      `}

      <button class="btn btn-primary btn-full btn-lg mt-md" id="verify-otp-btn" ${state.isVerifying ? 'disabled' : ''}>
        ${state.isVerifying
        ? '<span class="spinner" style="width:20px;height:20px;border-width:2px;"></span> Verifying...'
        : t('login_verify')}
      </button>
      <button class="btn btn-ghost mt-sm" id="back-to-phone" style="width: 100%; text-align: center;">
        ← ${t('common_back')}
      </button>
    `;
  }

  function renderRoleStep() {
    return `
      <h3 class="heading-md mb-md">${t('login_select_role')}</h3>
      <div class="role-selector">
        <div class="role-option ${state.role === 'patient' ? 'selected' : ''}" data-role="patient">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <p>${t('login_role_patient')}</p>
        </div>
        <div class="role-option ${state.role === 'doctor' ? 'selected' : ''}" data-role="doctor">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <p>${t('login_role_doctor')}</p>
        </div>
      </div>
      <button class="btn btn-primary btn-full btn-lg mt-lg" id="complete-login">
        ${state.isLogin ? t('login_verify') : t('login_register')}
      </button>
    `;
  }

  function attachEvents() {
    // ── Send OTP ──
    const sendBtn = document.getElementById('send-otp-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', async () => {
        const phoneInput = document.getElementById('phone-input');
        state.phone = phoneInput?.value?.trim() || '';
        const nameInput = document.getElementById('name-input');
        if (nameInput) state.name = nameInput.value.trim();

        // Validate phone number
        if (state.phone.length < 10) {
          state.otpError = 'Please enter a valid 10-digit phone number';
          render();
          return;
        }

        state.otpError = '';

        if (state.useSupabase) {
          // ── Real Supabase OTP ──
          state.isSending = true;
          render();

          const fullPhone = `+91${state.phone}`;
          const result = await supabaseSendOTP(fullPhone);

          state.isSending = false;

          if (result.success) {
            state.step = 'otp';
            render();
            setTimeout(() => document.querySelector('.otp-input')?.focus(), 100);
          } else {
            state.otpError = result.error || 'Failed to send OTP. Please try again.';
            render();
          }
        } else {
          // ── Demo mode ──
          state.generatedOTP = String(Math.floor(1000 + Math.random() * 9000));
          state.step = 'otp';
          render();
          setTimeout(() => document.querySelector('.otp-input')?.focus(), 100);
        }
      });
    }

    // ── OTP input auto-advance ──
    document.querySelectorAll('.otp-input').forEach(input => {
      input.addEventListener('input', (e) => {
        if (e.target.value.length === 1) {
          const next = e.target.nextElementSibling;
          if (next && next.classList.contains('otp-input')) next.focus();
        }
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value) {
          const prev = e.target.previousElementSibling;
          if (prev && prev.classList.contains('otp-input')) prev.focus();
        }
      });
      // Allow paste
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text').trim();
        const digits = pasted.replace(/\D/g, '').split('');
        document.querySelectorAll('.otp-input').forEach((inp, i) => {
          inp.value = digits[i] || '';
        });
      });
    });

    // ── Auto-fill (demo) ──
    const autoFill = document.getElementById('auto-fill-otp');
    if (autoFill) {
      autoFill.addEventListener('click', () => {
        const digits = state.generatedOTP.split('');
        document.querySelectorAll('.otp-input').forEach((input, i) => {
          input.value = digits[i] || '';
        });
      });
    }

    // ── Resend OTP (Supabase) ──
    const resendBtn = document.getElementById('resend-otp');
    if (resendBtn) {
      resendBtn.addEventListener('click', async () => {
        const fullPhone = `+91${state.phone}`;
        state.otpError = '';
        state.isSending = true;
        render();
        const result = await supabaseSendOTP(fullPhone);
        state.isSending = false;
        if (result.success) {
          state.otpError = '';
          showToast('OTP resent successfully! 📱');
        } else {
          state.otpError = result.error || 'Failed to resend OTP.';
        }
        render();
        setTimeout(() => document.querySelector('.otp-input')?.focus(), 100);
      });
    }

    // ── Verify OTP ──
    const verifyBtn = document.getElementById('verify-otp-btn');
    if (verifyBtn) {
      verifyBtn.addEventListener('click', async () => {
        const otpLength = state.useSupabase ? 6 : 4;
        const entered = Array.from(document.querySelectorAll('.otp-input'))
          .map(i => i.value)
          .join('');

        if (entered.length < otpLength) {
          state.otpError = `Please enter the complete ${otpLength}-digit OTP`;
          render();
          return;
        }

        if (state.useSupabase) {
          // ── Real Supabase verify ──
          state.isVerifying = true;
          state.otpError = '';
          render();

          const fullPhone = `+91${state.phone}`;
          const result = await supabaseVerifyOTP(fullPhone, entered);

          state.isVerifying = false;

          if (result.success) {
            // Supabase auth succeeded
            if (!state.isLogin) {
              state.step = 'role';
              render();
            } else {
              completeLogin(result.user);
            }
          } else {
            state.otpError = result.error || 'Invalid OTP. Please try again.';
            render();
          }
        } else {
          // ── Demo mode verify ──
          if (entered !== state.generatedOTP) {
            state.otpError = 'Incorrect OTP. Please try again.';
            render();
            return;
          }
          state.otpError = '';
          if (!state.isLogin) {
            state.step = 'role';
            render();
          } else {
            completeLogin();
          }
        }
      });
    }

    // ── Back button ──
    const backBtn = document.getElementById('back-to-phone');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        state.step = 'phone';
        state.otpError = '';
        render();
      });
    }

    // ── Toggle login/register ──
    const toggleMode = document.getElementById('toggle-mode');
    if (toggleMode) {
      toggleMode.addEventListener('click', () => {
        state.isLogin = !state.isLogin;
        state.step = 'phone';
        state.otpError = '';
        render();
      });
    }

    // ── Role selection ──
    document.querySelectorAll('.role-option').forEach(opt => {
      opt.addEventListener('click', () => {
        state.role = opt.dataset.role;
        render();
      });
    });

    const completeBtn = document.getElementById('complete-login');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => completeLogin());
    }
  }

  function completeLogin(supabaseUser) {
    const userData = {
      id: supabaseUser?.id || `demo_${Date.now()}`,
      name: state.name || 'Patient',
      phone: state.phone || '9876543210',
      role: state.role,
      loggedIn: true,
      authMethod: state.useSupabase ? 'supabase' : 'demo'
    };
    localStorage.setItem('medicare_user', JSON.stringify(userData));
    showToast('Welcome to Medicare! 🩺');

    if (state.role === 'doctor') {
      navigate('doctor-dashboard');
    } else {
      navigate('dashboard');
    }
  }

  render();
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
