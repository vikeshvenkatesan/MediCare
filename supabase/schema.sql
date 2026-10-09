-- ============================================
-- Medicare Telehealth Platform
-- Supabase PostgreSQL Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor')),
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'ta', 'ml', 'te', 'kn', 'bn')),
  location JSONB DEFAULT '{}'::jsonb,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on phone for fast login lookups
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- DOCTORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS doctors (
  doctor_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  hospital TEXT,
  license_number TEXT UNIQUE NOT NULL,
  experience INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  availability BOOLEAN DEFAULT true,
  languages TEXT[] DEFAULT ARRAY['en'],
  consultation_fee INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_doctors_availability ON doctors(availability);

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
  appointment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(doctor_id) ON DELETE CASCADE,
  appointment_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
  video_room_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- ============================================
-- SYMPTOMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS symptoms (
  symptom_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  symptoms_text TEXT NOT NULL,
  ai_prediction TEXT,
  urgency_level TEXT CHECK (urgency_level IN ('Low', 'Medium', 'High')),
  ai_response JSONB DEFAULT '{}'::jsonb,
  is_offline BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_symptoms_user ON symptoms(user_id);
CREATE INDEX IF NOT EXISTS idx_symptoms_urgency ON symptoms(urgency_level);

-- ============================================
-- PRESCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS prescriptions (
  prescription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(appointment_id) ON DELETE SET NULL,
  doctor_id UUID REFERENCES doctors(doctor_id) ON DELETE CASCADE,
  patient_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  diagnosis TEXT,
  medicines JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON prescriptions(doctor_id);

-- ============================================
-- EMERGENCY ALERTS TABLE (bonus)
-- ============================================
CREATE TABLE IF NOT EXISTS emergency_alerts (
  alert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  location JSONB NOT NULL, -- { latitude, longitude, accuracy }
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'responding', 'resolved')),
  nearest_hospital TEXT,
  responder_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_emergency_user ON emergency_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_status ON emergency_alerts(status);

-- ============================================
-- MEDICAL HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS medical_history (
  history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('prescription', 'lab_report', 'scan_report', 'medical_history')),
  file_name TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_medical_history_patient ON medical_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_history_type ON medical_history(report_type);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;

-- Users: can read own data, admins can read all
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = user_id);

-- Doctors: public read for all, update only by self
CREATE POLICY "Doctors are publicly readable" ON doctors
  FOR SELECT USING (true);

CREATE POLICY "Doctors can update own profile" ON doctors
  FOR UPDATE USING (user_id = auth.uid());

-- Appointments: patients and doctors can see their own
CREATE POLICY "Patients see own appointments" ON appointments
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Doctors see own appointments" ON appointments
  FOR SELECT USING (
    doctor_id IN (SELECT doctor_id FROM doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "Patients can create appointments" ON appointments
  FOR INSERT WITH CHECK (patient_id = auth.uid());

-- Symptoms: users can manage own
CREATE POLICY "Users manage own symptoms" ON symptoms
  FOR ALL USING (user_id = auth.uid());

-- Prescriptions: patients can read own, doctors can create
CREATE POLICY "Patients read own prescriptions" ON prescriptions
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Doctors create prescriptions" ON prescriptions
  FOR INSERT WITH CHECK (
    doctor_id IN (SELECT doctor_id FROM doctors WHERE user_id = auth.uid())
  );

-- Emergency: users manage own alerts
CREATE POLICY "Users manage own emergency alerts" ON emergency_alerts
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- SEED DATA: Sample Doctors
-- ============================================
-- Note: In production, doctor user_ids should reference actual auth users
INSERT INTO doctors (name, specialization, hospital, license_number, experience, rating, availability, languages, consultation_fee)
VALUES
  ('Dr. Priya Sharma', 'General Medicine', 'District General Hospital', 'MCI-2018-45623', 12, 4.8, true, ARRAY['en','hi'], 300),
  ('Dr. Rajesh Kumar', 'Cardiology', 'Heart Care Center', 'MCI-2015-78901', 18, 4.9, true, ARRAY['en','hi','ta'], 500),
  ('Dr. Lakshmi Nair', 'Pediatrics', 'Children''s Medical Center', 'MCI-2016-34567', 15, 4.7, true, ARRAY['en','ml','ta'], 400),
  ('Dr. Suresh Reddy', 'Dermatology', 'Skin & Wellness Clinic', 'MCI-2019-12345', 8, 4.5, false, ARRAY['en','te','kn'], 350),
  ('Dr. Anita Desai', 'Orthopedics', 'Bone & Joint Hospital', 'MCI-2014-67890', 20, 4.9, true, ARRAY['en','hi','kn'], 600),
  ('Dr. Mohammed Faiz', 'General Medicine', 'Primary Health Center', 'MCI-2020-23456', 5, 4.4, true, ARRAY['en','hi','bn'], 200),
  ('Dr. Kavitha Sundaram', 'Pediatrics', 'Mother & Child Hospital', 'MCI-2017-89012', 10, 4.6, true, ARRAY['en','ta','te'], 350),
  ('Dr. Arjun Patel', 'Cardiology', 'Cardiac Research Institute', 'MCI-2013-45678', 22, 4.8, false, ARRAY['en','hi'], 700),
  ('Dr. Deepa Menon', 'Dermatology', 'Advanced Derma Clinic', 'MCI-2018-56789', 9, 4.6, true, ARRAY['en','ml'], 400),
  ('Dr. Venkatesh Rao', 'General Medicine', 'Community Health Center', 'MCI-2019-90123', 7, 4.3, true, ARRAY['en','kn','te'], 250),
  ('Dr. Sneha Chatterjee', 'Orthopedics', 'Sports Medicine Center', 'MCI-2016-01234', 14, 4.7, true, ARRAY['en','bn','hi'], 550),
  ('Dr. Arun Krishnan', 'General Medicine', 'Rural Health Clinic', 'MCI-2021-11111', 3, 4.2, true, ARRAY['en','ta','ml'], 150)
ON CONFLICT (license_number) DO NOTHING;
