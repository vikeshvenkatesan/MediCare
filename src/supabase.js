// ============================================
// Medicare – Supabase Client
// Handles authentication and database access
// ============================================

import { createClient } from '@supabase/supabase-js';
import { CONFIG, hasSupabaseConfig } from './config.js';

let supabase = null;

/**
 * Get the Supabase client instance.
 * Returns null if Supabase is not configured.
 */
export function getSupabase() {
    if (!hasSupabaseConfig()) return null;
    if (!supabase) {
        supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
    }
    return supabase;
}

// ── Phone OTP Auth ──────────────────────────

/**
 * Send OTP to phone number via Supabase Auth.
 * @param {string} phone - Phone number with country code, e.g. "+919876543210"
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendOTP(phone) {
    const sb = getSupabase();
    if (!sb) return { success: false, error: 'Supabase not configured' };

    try {
        const { error } = await sb.auth.signInWithOtp({ phone });
        if (error) return { success: false, error: error.message };
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Verify the OTP entered by the user.
 * @param {string} phone - Phone number with country code
 * @param {string} token - The 6-digit OTP
 * @returns {Promise<{success: boolean, user?: object, session?: object, error?: string}>}
 */
export async function verifyOTP(phone, token) {
    const sb = getSupabase();
    if (!sb) return { success: false, error: 'Supabase not configured' };

    try {
        const { data, error } = await sb.auth.verifyOtp({
            phone,
            token,
            type: 'sms'
        });
        if (error) return { success: false, error: error.message };
        return { success: true, user: data.user, session: data.session };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Sign out the current user.
 */
export async function signOut() {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    localStorage.removeItem('medicare_user');
}

/**
 * Get the current authenticated user.
 */
export async function getCurrentUser() {
    const sb = getSupabase();
    if (!sb) return null;
    const { data: { user } } = await sb.auth.getUser();
    return user;
}
