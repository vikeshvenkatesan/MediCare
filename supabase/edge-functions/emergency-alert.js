// ============================================
// Medicare – Supabase Edge Function
// Emergency Alert Processing
// ============================================
// Deploy: supabase functions deploy emergency-alert

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
    // CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            },
        });
    }

    try {
        const { user_id, location, timestamp } = await req.json();

        if (!location || !location.latitude || !location.longitude) {
            return new Response(JSON.stringify({ error: 'Location data required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // In production:
        // 1. Store alert in emergency_alerts table
        // 2. Find nearest hospital using location data
        // 3. Send push notification to emergency responders
        // 4. Send SMS to emergency contacts
        // 5. Return nearest hospital info and ETA

        const response = {
            status: 'alert_sent',
            alert_id: crypto.randomUUID(),
            nearest_hospital: {
                name: 'District General Hospital',
                distance: '3.2 km',
                phone: '108',
                eta: '12 minutes'
            },
            emergency_guidance: [
                'Stay calm and remain at your current location',
                'Keep your phone charged and nearby',
                'If possible, move to an open area for easy access',
                'If breathing difficulty, sit upright'
            ],
            location_received: {
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy || 'N/A'
            },
            timestamp: timestamp || new Date().toISOString()
        };

        // Optionally store in database
        // const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        // const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
        // await supabase.from('emergency_alerts').insert({ user_id, location, status: 'active', nearest_hospital: response.nearest_hospital.name });

        return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
    }
});
