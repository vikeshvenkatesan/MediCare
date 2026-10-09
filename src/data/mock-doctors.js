// ============================================
// Medicare – Enhanced Mock Doctor Data
// 20 doctors across 10 specializations
// ============================================

export const mockDoctors = [
    // ─── GENERAL PHYSICIANS ───────────────────
    {
        doctor_id: 'd1', name: 'Dr. Priya Sharma', specialization: 'General Physician',
        hospital: 'District General Hospital', license_number: 'MCI-2018-45623',
        experience: 12, rating: 4.8, availability: true, avatar: '👩‍⚕️',
        languages: ['en', 'hi'], consultationFee: 300, total_patients: 2340
    },
    {
        doctor_id: 'd6', name: 'Dr. Mohammed Faiz', specialization: 'General Physician',
        hospital: 'Primary Health Center', license_number: 'MCI-2020-23456',
        experience: 5, rating: 4.4, availability: true, avatar: '👨‍⚕️',
        languages: ['en', 'hi', 'bn'], consultationFee: 200, total_patients: 890
    },
    {
        doctor_id: 'd12', name: 'Dr. Arun Krishnan', specialization: 'General Physician',
        hospital: 'Rural Health Clinic', license_number: 'MCI-2021-11111',
        experience: 3, rating: 4.2, availability: true, avatar: '👨‍⚕️',
        languages: ['en', 'ta', 'ml'], consultationFee: 150, total_patients: 420
    },

    // ─── CARDIOLOGISTS ────────────────────────
    {
        doctor_id: 'd2', name: 'Dr. Rajesh Kumar', specialization: 'Cardiologist',
        hospital: 'Heart Care Center', license_number: 'MCI-2015-78901',
        experience: 18, rating: 4.9, availability: true, avatar: '👨‍⚕️',
        languages: ['en', 'hi', 'ta'], consultationFee: 500, total_patients: 4560
    },
    {
        doctor_id: 'd8', name: 'Dr. Arjun Patel', specialization: 'Cardiologist',
        hospital: 'Cardiac Research Institute', license_number: 'MCI-2013-45678',
        experience: 22, rating: 4.8, availability: false, avatar: '👨‍⚕️',
        languages: ['en', 'hi'], consultationFee: 700, total_patients: 5200
    },

    // ─── NEUROLOGIST ──────────────────────────
    {
        doctor_id: 'd13', name: 'Dr. Sanjay Gupta', specialization: 'Neurologist',
        hospital: 'Neuro Sciences Institute', license_number: 'MCI-2012-33333',
        experience: 20, rating: 4.9, availability: true, avatar: '👨‍⚕️',
        languages: ['en', 'hi', 'mr'], consultationFee: 600, total_patients: 3100
    },

    // ─── DERMATOLOGISTS ───────────────────────
    {
        doctor_id: 'd4', name: 'Dr. Suresh Reddy', specialization: 'Dermatologist',
        hospital: 'Skin & Wellness Clinic', license_number: 'MCI-2019-12345',
        experience: 8, rating: 4.5, availability: false, avatar: '👨‍⚕️',
        languages: ['en', 'te', 'kn'], consultationFee: 350, total_patients: 1800
    },
    {
        doctor_id: 'd9', name: 'Dr. Deepa Menon', specialization: 'Dermatologist',
        hospital: 'Advanced Derma Clinic', license_number: 'MCI-2018-56789',
        experience: 9, rating: 4.6, availability: true, avatar: '👩‍⚕️',
        languages: ['en', 'ml'], consultationFee: 400, total_patients: 2100
    },

    // ─── ORTHOPEDICS ──────────────────────────
    {
        doctor_id: 'd5', name: 'Dr. Anita Desai', specialization: 'Orthopedic',
        hospital: 'Bone & Joint Hospital', license_number: 'MCI-2014-67890',
        experience: 20, rating: 4.9, availability: true, avatar: '👩‍⚕️',
        languages: ['en', 'hi', 'kn'], consultationFee: 600, total_patients: 4100
    },
    {
        doctor_id: 'd11', name: 'Dr. Sneha Chatterjee', specialization: 'Orthopedic',
        hospital: 'Sports Medicine Center', license_number: 'MCI-2016-01234',
        experience: 14, rating: 4.7, availability: true, avatar: '👩‍⚕️',
        languages: ['en', 'bn', 'hi'], consultationFee: 550, total_patients: 2900
    },

    // ─── PEDIATRICIANS ────────────────────────
    {
        doctor_id: 'd3', name: 'Dr. Lakshmi Nair', specialization: 'Pediatrician',
        hospital: "Children's Medical Center", license_number: 'MCI-2016-34567',
        experience: 15, rating: 4.7, availability: true, avatar: '👩‍⚕️',
        languages: ['en', 'ml', 'ta'], consultationFee: 400, total_patients: 3500
    },
    {
        doctor_id: 'd7', name: 'Dr. Kavitha Sundaram', specialization: 'Pediatrician',
        hospital: 'Mother & Child Hospital', license_number: 'MCI-2017-89012',
        experience: 10, rating: 4.6, availability: true, avatar: '👩‍⚕️',
        languages: ['en', 'ta', 'te'], consultationFee: 350, total_patients: 2400
    },

    // ─── GYNECOLOGIST ─────────────────────────
    {
        doctor_id: 'd14', name: 'Dr. Meera Joshi', specialization: 'Gynecologist',
        hospital: "Women's Health Center", license_number: 'MCI-2015-44444',
        experience: 16, rating: 4.8, availability: true, avatar: '👩‍⚕️',
        languages: ['en', 'hi', 'mr'], consultationFee: 450, total_patients: 3800
    },

    // ─── PSYCHIATRIST ─────────────────────────
    {
        doctor_id: 'd15', name: 'Dr. Rahul Verma', specialization: 'Psychiatrist',
        hospital: 'Mental Health & Wellness Clinic', license_number: 'MCI-2017-55555',
        experience: 11, rating: 4.5, availability: true, avatar: '👨‍⚕️',
        languages: ['en', 'hi', 'bn'], consultationFee: 400, total_patients: 1500
    },

    // ─── ENDOCRINOLOGIST ──────────────────────
    {
        doctor_id: 'd16', name: 'Dr. Sunita Prabhu', specialization: 'Endocrinologist',
        hospital: 'Diabetes & Thyroid Center', license_number: 'MCI-2016-66666',
        experience: 13, rating: 4.7, availability: true, avatar: '👩‍⚕️',
        languages: ['en', 'kn', 'te'], consultationFee: 500, total_patients: 2700
    },

    // ─── PULMONOLOGIST ────────────────────────
    {
        doctor_id: 'd17', name: 'Dr. Vikram Singh', specialization: 'Pulmonologist',
        hospital: 'Chest & Lung Care Hospital', license_number: 'MCI-2014-77777',
        experience: 17, rating: 4.8, availability: true, avatar: '👨‍⚕️',
        languages: ['en', 'hi'], consultationFee: 550, total_patients: 3200
    },

    // ─── GASTROENTEROLOGIST ───────────────────
    {
        doctor_id: 'd18', name: 'Dr. Anjali Kapoor', specialization: 'Gastroenterologist',
        hospital: 'Digestive Health Institute', license_number: 'MCI-2018-88888',
        experience: 9, rating: 4.6, availability: true, avatar: '👩‍⚕️',
        languages: ['en', 'hi', 'ta'], consultationFee: 450, total_patients: 1900
    },

    // ─── EXTRA GPs ────────────────────────────
    {
        doctor_id: 'd10', name: 'Dr. Venkatesh Rao', specialization: 'General Physician',
        hospital: 'Community Health Center', license_number: 'MCI-2019-90123',
        experience: 7, rating: 4.3, availability: true, avatar: '👨‍⚕️',
        languages: ['en', 'kn', 'te'], consultationFee: 250, total_patients: 1200
    },
    {
        doctor_id: 'd19', name: 'Dr. Nandini Rao', specialization: 'General Physician',
        hospital: 'Village Primary Health Unit', license_number: 'MCI-2022-99999',
        experience: 2, rating: 4.1, availability: true, avatar: '👩‍⚕️',
        languages: ['en', 'kn', 'ml'], consultationFee: 100, total_patients: 300
    },
];

// All supported specializations
export const specializations = [
    'General Physician',
    'Cardiologist',
    'Neurologist',
    'Dermatologist',
    'Orthopedic',
    'Pediatrician',
    'Gynecologist',
    'Psychiatrist',
    'Endocrinologist',
    'Pulmonologist',
    'Gastroenterologist'
];

// Sample prescriptions
export const mockPrescriptions = [
    {
        prescription_id: 'rx1', appointment_id: 'apt1', doctor_id: 'd1',
        doctor_name: 'Dr. Priya Sharma', patient_id: 'current',
        medicines: [
            { name: 'Paracetamol 500mg', dosage: 'Twice daily', duration: '5 days', timing: 'After meals' },
            { name: 'Cetirizine 10mg', dosage: 'Once daily', duration: '3 days', timing: 'Night' },
            { name: 'Vitamin C 1000mg', dosage: 'Once daily', duration: '10 days', timing: 'Morning' }
        ],
        notes: 'Patient has viral fever with mild allergic symptoms. Rest and adequate hydration recommended. Follow up in 5 days if symptoms persist.',
        diagnosis: 'Viral Fever with Allergic Rhinitis',
        created_at: '2026-02-28'
    },
    {
        prescription_id: 'rx2', appointment_id: 'apt2', doctor_id: 'd5',
        doctor_name: 'Dr. Anita Desai', patient_id: 'current',
        medicines: [
            { name: 'Diclofenac 50mg', dosage: 'Twice daily', duration: '7 days', timing: 'After meals' },
            { name: 'Calcium + Vitamin D3', dosage: 'Once daily', duration: '30 days', timing: 'Morning' }
        ],
        notes: 'Mild muscle strain in lower back. Avoid heavy lifting for 2 weeks. Regular stretching exercises recommended.',
        diagnosis: 'Lower Back Muscle Strain',
        created_at: '2026-02-15'
    }
];

// Sample records
export const mockRecords = [
    { id: 'r1', type: 'consultation', title: 'General Consultation', description: 'Consultation with Dr. Priya Sharma for fever symptoms', date: '2026-02-28', doctor: 'Dr. Priya Sharma' },
    { id: 'r2', type: 'prescription', title: 'Prescription Issued', description: 'Medicines prescribed for viral fever treatment', date: '2026-02-28', doctor: 'Dr. Priya Sharma' },
    { id: 'r3', type: 'diagnosis', title: 'AI Symptom Analysis', description: 'AI analysis: Possible viral fever, Medium urgency', date: '2026-02-27', doctor: 'AI Assistant' },
    { id: 'r4', type: 'consultation', title: 'Orthopedic Consultation', description: 'Consultation with Dr. Anita Desai for back pain', date: '2026-02-15', doctor: 'Dr. Anita Desai' },
    { id: 'r5', type: 'prescription', title: 'Prescription Issued', description: 'Medicines prescribed for muscle strain', date: '2026-02-15', doctor: 'Dr. Anita Desai' },
];
