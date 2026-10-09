// ============================================
// Medicare Telehealth – Configuration
// Replace placeholder values with your actual keys
// ============================================

export const CONFIG = {
    // Supabase
    SUPABASE_URL: 'https://lfzlqcyxvyhjqzmwzwmd.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmemxxY3l4dnloanF6bXd6d21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDQ3NzQsImV4cCI6MjA4ODI4MDc3NH0._CHBQcLa1kujTYeYuRpxCU5fjypR74ZImbJD2G4htWQ',

    // Google Gemini AI
    GEMINI_API_KEY: 'AIzaSyD3-vgv97DR7sH7UV1wPZu4wWevxNYBNWM',
    GEMINI_MODEL: 'gemini-2.0-flash',

    // Agora (Video Calls)
    AGORA_APP_ID: 'YOUR_AGORA_APP_ID',

    // Google Maps
    GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',

    // App Settings
    DEFAULT_LANGUAGE: 'en',
    SUPPORTED_LANGUAGES: ['en', 'hi', 'ta', 'ml', 'te', 'kn', 'bn', 'mr'],
    APP_NAME: 'Medicare',
    APP_VERSION: '2.0.0'
};

// Check if real API keys are configured
export function hasSupabaseConfig() {
    return !CONFIG.SUPABASE_URL.includes('YOUR_');
}

export function hasGeminiConfig() {
    return !CONFIG.GEMINI_API_KEY.includes('YOUR_');
}

export function hasAgoraConfig() {
    return !CONFIG.AGORA_APP_ID.includes('YOUR_');
}
