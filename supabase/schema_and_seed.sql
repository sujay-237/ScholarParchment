-- ============================================================================
-- Scholarship Management & Direct Benefit Transfer (DBT) Portal
-- Supabase PostgreSQL Database Schema & Seed Data Script
-- Includes:
--   - 5 Student Accounts
--   - 1 College Nodal Officer Account
--   - 1 Central Ministry Officer Account
--   - Database tables: users, students, scholarships, applications,
--     student_verifications, scholarship_allocations, disbursement_batches,
--     payments, audit_records
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to ensure clean schema types
DROP TABLE IF EXISTS audit_records CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS disbursement_batches CASCADE;
DROP TABLE IF EXISTS scholarship_allocations CASCADE;
DROP TABLE IF EXISTS student_verifications CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS scholarships CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE (System Authenticated Accounts)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT 'Password@123',
    role TEXT NOT NULL CHECK (role IN ('student', 'college', 'ministry')),
    name TEXT NOT NULL,
    student_id TEXT,
    institution TEXT,
    department TEXT,
    designation TEXT,
    aadhaar_last4 TEXT,
    avatar_url TEXT,
    wallet_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. STUDENTS TABLE (Detailed Student Profiles)
CREATE TABLE students (
    id TEXT PRIMARY KEY,
    student_id TEXT UNIQUE NOT NULL,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    gender TEXT NOT NULL,
    dob DATE NOT NULL,
    category TEXT NOT NULL,
    annual_income NUMERIC NOT NULL,
    aadhaar_number TEXT NOT NULL,
    college_id TEXT NOT NULL,
    college_name TEXT NOT NULL,
    college_aishe TEXT NOT NULL,
    course TEXT NOT NULL,
    current_year TEXT NOT NULL,
    cgpa_percentage NUMERIC NOT NULL,
    bank_account JSONB NOT NULL,
    wallet_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. SCHOLARSHIPS TABLE (Central Schemes)
CREATE TABLE scholarships (
    id TEXT PRIMARY KEY,
    scheme_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    ministry TEXT NOT NULL,
    department TEXT NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    amount_formatted TEXT NOT NULL,
    frequency TEXT NOT NULL,
    deadline DATE NOT NULL,
    days_remaining INTEGER NOT NULL,
    category TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    eligible_courses JSONB NOT NULL,
    minimum_gpa_or_marks NUMERIC NOT NULL,
    max_family_income NUMERIC NOT NULL,
    total_seats INTEGER NOT NULL,
    applied_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('open', 'closing_soon', 'closed')),
    key_benefits JSONB NOT NULL,
    required_docs JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. APPLICATIONS TABLE (Scholarship Applications)
CREATE TABLE applications (
    id TEXT PRIMARY KEY,
    application_number TEXT UNIQUE NOT NULL,
    scholarship_id TEXT REFERENCES scholarships(id) ON DELETE CASCADE,
    scholarship_title TEXT NOT NULL,
    ministry TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_phone TEXT NOT NULL,
    gender TEXT NOT NULL,
    dob DATE NOT NULL,
    category TEXT NOT NULL,
    annual_income NUMERIC NOT NULL,
    aadhaar_number TEXT NOT NULL,
    college_id TEXT NOT NULL,
    college_name TEXT NOT NULL,
    college_aishe TEXT NOT NULL,
    course TEXT NOT NULL,
    current_year TEXT NOT NULL,
    cgpa_percentage NUMERIC NOT NULL,
    bank_account JSONB NOT NULL,
    submitted_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    status TEXT NOT NULL CHECK (status IN ('college_pending', 'college_verified', 'college_queried', 'college_rejected', 'ministry_approved', 'disbursed')),
    documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
    history JSONB NOT NULL DEFAULT '[]'::jsonb,
    integrity_hash TEXT NOT NULL,
    college_review_notes TEXT,
    college_verified_by TEXT,
    college_verified_date TIMESTAMP WITH TIME ZONE,
    ministry_sanction_number TEXT,
    ministry_approved_by TEXT,
    ministry_approval_date TIMESTAMP WITH TIME ZONE,
    disbursement_batch_id TEXT,
    disbursement_date TIMESTAMP WITH TIME ZONE,
    utr_number TEXT,
    payment_mode TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. STUDENT VERIFICATIONS TABLE
CREATE TABLE student_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    college_id TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'pending',
    verification_tx_hash TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 6. SCHOLARSHIP ALLOCATIONS TABLE
CREATE TABLE scholarship_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    allocated_amount NUMERIC NOT NULL,
    token_symbol TEXT DEFAULT 'ETH',
    allocation_tx_hash TEXT,
    allocation_block_number INTEGER,
    allocation_status TEXT NOT NULL DEFAULT 'pending',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 7. DISBURSEMENT BATCHES TABLE
CREATE TABLE disbursement_batches (
    id TEXT PRIMARY KEY,
    batch_number TEXT UNIQUE NOT NULL,
    scheme_code TEXT NOT NULL,
    scheme_title TEXT NOT NULL,
    total_applications INTEGER NOT NULL,
    total_amount NUMERIC NOT NULL,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    approved_date TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL CHECK (status IN ('draft', 'pending_approval', 'approved', 'processing', 'completed', 'failed')),
    pfms_reference_id TEXT NOT NULL,
    authorized_by TEXT NOT NULL,
    applications JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 8. PAYMENTS TABLE (DBT Records)
CREATE TABLE payments (
    id TEXT PRIMARY KEY,
    transaction_id TEXT UNIQUE NOT NULL,
    utr_number TEXT NOT NULL,
    application_number TEXT NOT NULL,
    scholarship_title TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    credit_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    bank_name TEXT NOT NULL,
    account_ending TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'pending', 'failed')),
    mode TEXT NOT NULL,
    integrity_hash TEXT NOT NULL,
    stage_timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 9. AUDIT RECORDS TABLE (Cryptographic Ledger Trail)
CREATE TABLE audit_records (
    id TEXT PRIMARY KEY,
    record_type TEXT NOT NULL,
    application_id TEXT NOT NULL,
    application_number TEXT NOT NULL,
    student_name TEXT NOT NULL,
    scheme_title TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action_details TEXT NOT NULL,
    previous_state TEXT NOT NULL,
    new_state TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    block_height INTEGER NOT NULL,
    block_hash TEXT NOT NULL,
    prev_block_hash TEXT NOT NULL,
    digital_signature TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================================================================
-- SEED DATA INSERTS
-- ============================================================================

-- Insert 7 Users (5 Students, 1 College Officer, 1 Ministry Officer)
INSERT INTO users (id, email, password, role, name, student_id, institution, department, designation, aadhaar_last4, avatar_url, wallet_address) VALUES
('STU-2026-8941', 'aarav.sharma@iitd.ac.in', 'Password@123', 'student', 'Aarav Sharma', '2022CSB1042', 'Indian Institute of Technology Delhi', 'Computer Science & Engineering', NULL, '8842', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'),
('STU-2026-8942', 'priya.patel@vjti.ac.in', 'Password@123', 'student', 'Priya Patel', '2023ECB2011', 'Veermata Jijabai Technological Institute', 'Electronics & Communication Engineering', NULL, '9102', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', '0x3C44CdD06a900c291838F728018061d4b8006093'),
('STU-2026-8943', 'rahul.verma@nitt.edu', 'Password@123', 'student', 'Rahul Verma', '2021MEB3055', 'National Institute of Technology Tiruchirappalli', 'Mechanical Engineering', NULL, '4431', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', '0x90F79bf6EB2c4f80806530203660480564614392'),
('STU-2026-8944', 'ananya.sen@ju.ac.in', 'Password@123', 'student', 'Ananya Sen', '2024CSE1089', 'Jadavpur University Kolkata', 'Computer Science & Technology', NULL, '6120', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'),
('STU-2026-8945', 'vikram.singh@bits.edu', 'Password@123', 'student', 'Vikram Singh', '2022EEE4012', 'BITS Pilani', 'Electrical & Electronics Engineering', NULL, '3319', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc'),

('COL-OFF-109', 'verifications@iitd.ac.in', 'Password@123', 'college', 'Dr. Rajeshwari Menon', NULL, 'Indian Institute of Technology Delhi (AISHE: U-0100)', NULL, 'Dean of Student Welfare & Nodal Verification Officer', NULL, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'),

('MIN-DIR-042', 'director.scholarships@education.gov.in', 'Password@123', 'ministry', 'Shri Vikramaditya Roy, IAS', NULL, 'Ministry of Education, Govt. of India', 'Department of Higher Education', 'Joint Secretary & Director General of Central Schemes', NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');

-- Insert 5 Detailed Students
INSERT INTO students (id, student_id, user_id, full_name, email, phone, gender, dob, category, annual_income, aadhaar_number, college_id, college_name, college_aishe, course, current_year, cgpa_percentage, bank_account, wallet_address) VALUES
('STU-2026-8941', '2022CSB1042', 'STU-2026-8941', 'Aarav Sharma', 'aarav.sharma@iitd.ac.in', '+91 98765 43210', 'Male', '2004-05-18', 'General (EWS)', 240000, 'XXXX-XXXX-8842', 'IIT-DELHI-001', 'Indian Institute of Technology Delhi', 'U-0100', 'B.Tech in Computer Science', '3rd Year (Semester 5)', 8.92, '{"accountNumber": "••••••••8912", "ifsc": "SBIN0001077", "bankName": "State Bank of India", "accountHolder": "AARAV SHARMA", "aadhaarLinked": true}'::jsonb, '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'),
('STU-2026-8942', '2023ECB2011', 'STU-2026-8942', 'Priya Patel', 'priya.patel@vjti.ac.in', '+91 98123 45678', 'Female', '2005-02-14', 'OBC', 320000, 'XXXX-XXXX-9102', 'VJTI-MUM-002', 'Veermata Jijabai Technological Institute', 'U-0245', 'B.Tech in Electronics Engineering', '2nd Year (Semester 3)', 9.15, '{"accountNumber": "••••••••4419", "ifsc": "HDFC0000060", "bankName": "HDFC Bank", "accountHolder": "PRIYA PATEL", "aadhaarLinked": true}'::jsonb, '0x3C44CdD06a900c291838F728018061d4b8006093'),
('STU-2026-8943', '2021MEB3055', 'STU-2026-8943', 'Rahul Verma', 'rahul.verma@nitt.edu', '+91 97654 32109', 'Male', '2003-11-09', 'SC', 180000, 'XXXX-XXXX-4431', 'NIT-TRICHY-003', 'National Institute of Technology Tiruchirappalli', 'U-0310', 'B.Tech in Mechanical Engineering', '4th Year (Semester 7)', 8.45, '{"accountNumber": "••••••••1102", "ifsc": "IOBA0000182", "bankName": "Indian Overseas Bank", "accountHolder": "RAHUL VERMA", "aadhaarLinked": true}'::jsonb, '0x90F79bf6EB2c4f80806530203660480564614392'),
('STU-2026-8944', '2024CSE1089', 'STU-2026-8944', 'Ananya Sen', 'ananya.sen@ju.ac.in', '+91 96543 21098', 'Female', '2006-08-22', 'General', 410000, 'XXXX-XXXX-6120', 'JU-KOL-004', 'Jadavpur University Kolkata', 'U-0122', 'B.Tech in Computer Science', '1st Year (Semester 1)', 9.40, '{"accountNumber": "••••••••7823", "ifsc": "PUNB0012900", "bankName": "Punjab National Bank", "accountHolder": "ANANYA SEN", "aadhaarLinked": true}'::jsonb, '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'),
('STU-2026-8945', '2022EEE4012', 'STU-2026-8945', 'Vikram Singh', 'vikram.singh@bits.edu', '+91 95432 10987', 'Male', '2004-03-30', 'ST', 210000, 'XXXX-XXXX-3319', 'BITS-PILANI-005', 'BITS Pilani', 'U-0089', 'B.E. in Electrical & Electronics', '3rd Year (Semester 5)', 8.70, '{"accountNumber": "••••••••5591", "ifsc": "ICIC0000104", "bankName": "ICICI Bank", "accountHolder": "VIKRAM SINGH", "aadhaarLinked": true}'::jsonb, '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc');

-- Insert 3 Scholarships
INSERT INTO scholarships (id, scheme_code, title, ministry, department, description, amount, amount_formatted, frequency, deadline, days_remaining, category, target_audience, eligible_courses, minimum_gpa_or_marks, max_family_income, total_seats, applied_count, status, key_benefits, required_docs) VALUES
('sch-pm-usp-01', 'PM-USP-CS-2026', 'Central Sector Scheme of Scholarship for College and University Students (PM-USP)', 'Ministry of Education', 'Department of Higher Education', 'Providing financial assistance to meritorious students from low-income families to meet day-to-day expenses while pursuing higher studies.', 20000, '₹20,000 / Year', 'Annual', '2026-10-31', 78, 'Higher Education', 'Top 20th percentile in Class XII board examination', '["B.Tech / B.E.", "MBBS", "B.Sc / M.Sc", "B.Com / M.Com", "B.A / M.A"]'::jsonb, 80, 450000, 82000, 41250, 'open', '["₹12,000/yr for Graduation", "₹20,000/yr for PG/Prof courses", "Direct Bank Transfer (DBT) credit"]'::jsonb, '["Class 12 Marksheet", "Income Certificate (< ₹4.5 Lakh)", "College Bonafide Certificate", "Aadhaar Card"]'::jsonb),
('sch-pragati-stem-02', 'AICTE-PRAGATI-2026', 'PRAGATI Scholarship Scheme for Girl Students (Technical Degree/Diploma)', 'Ministry of Education / AICTE', 'All India Council for Technical Education', 'Empowering young women to pursue technical education by covering college fees, books, and essential computing equipment.', 50000, '₹50,000 / Year', 'Annual', '2026-09-15', 32, 'Girls STEM', 'Female students admitted in 1st year of AICTE approved technical degrees', '["B.Tech / B.E.", "B.Pharm", "B.Arch", "MCA"]'::jsonb, 65, 800000, 10000, 7890, 'closing_soon', '["₹50,000 per annum for tuition & equipment", "Continuation across 4 full academic years"]'::jsonb, '["10th & 12th Marksheet", "Income Certificate (< ₹8 Lakh)", "AICTE College Admission Proof"]'::jsonb),
('sch-post-matric-sc-03', 'PMS-SC-CENTRAL-2026', 'Post-Matric Scholarship Scheme for SC & ST Students (Central Assured)', 'Ministry of Social Justice & Empowerment', 'Department of Social Justice', 'Comprehensive financial support covering compulsory non-refundable fees, academic allowance, and disability rider.', 75000, '₹75,000 / Year', 'Annual', '2026-11-30', 108, 'Post-Matric', 'SC/ST domicile students pursuing recognized post-matriculation courses', '["All Undergraduate & Postgraduate Professional Courses"]'::jsonb, 50, 250000, 600000, 231400, 'open', '["Full tuition fee reimbursement", "Maintenance allowance up to ₹13,500/yr"]'::jsonb, '["Caste Certificate", "Income Certificate (< ₹2.5 Lakh)", "Fee Receipt"]'::jsonb);

-- Insert Applications for the 5 Students
INSERT INTO applications (id, application_number, scholarship_id, scholarship_title, ministry, amount, student_id, student_name, student_email, student_phone, gender, dob, category, annual_income, aadhaar_number, college_id, college_name, college_aishe, course, current_year, cgpa_percentage, bank_account, submitted_date, status, documents, checklist, history, integrity_hash, college_review_notes, college_verified_by, college_verified_date, ministry_sanction_number, ministry_approved_by, ministry_approval_date, disbursement_batch_id, disbursement_date, utr_number, payment_mode) VALUES
('APP-2026-1001', 'NSP/2026/PM-USP/89412', 'sch-pm-usp-01', 'Central Sector Scheme of Scholarship for College and University Students (PM-USP)', 'Ministry of Education', 20000, 'STU-2026-8941', 'Aarav Sharma', 'aarav.sharma@iitd.ac.in', '+91 98765 43210', 'Male', '2004-05-18', 'General (EWS)', 240000, 'XXXX-XXXX-8842', 'IIT-DELHI-001', 'Indian Institute of Technology Delhi', 'U-0100', 'B.Tech in Computer Science', '3rd Year (Semester 5)', 8.92, '{"accountNumber": "••••••••8912", "ifsc": "SBIN0001077", "bankName": "State Bank of India", "accountHolder": "AARAV SHARMA", "aadhaarLinked": true}'::jsonb, '2026-07-10T09:30:00Z', 'college_pending', 
'[{"id": "doc-1", "name": "Class 12 Board Marksheet", "type": "pdf", "size": "1.2 MB", "status": "verified", "digiLockerVerified": true}, {"id": "doc-2", "name": "Income Certificate FY 2025-26", "type": "pdf", "size": "850 KB", "status": "verified", "digiLockerVerified": true}]'::jsonb,
'[{"id": "c1", "label": "Enrollment & Bonafide Regular Status", "category": "academic", "status": "pending"}, {"id": "c2", "label": "Minimum 75% Attendance", "category": "attendance", "status": "pending"}, {"id": "c3", "label": "Marksheet Authenticity", "category": "academic", "status": "pending"}, {"id": "c4", "label": "Annual Income Certificate Validity", "category": "financial", "status": "pending"}, {"id": "c5", "label": "Aadhaar-Seeded Bank Account", "category": "identity", "status": "passed"}]'::jsonb,
'[{"stage": "student_submission", "status": "Application Submitted", "actor": "Aarav Sharma", "role": "Applicant", "timestamp": "2026-07-10T09:30:00Z", "remarks": "Submitted with e-KYC documents.", "transactionHash": "0xa9f8c12e3b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f"}]'::jsonb,
'0xa9f8c12e3b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

('APP-2026-1002', 'NSP/2026/PRAGATI/91024', 'sch-pragati-stem-02', 'PRAGATI Scholarship Scheme for Girl Students (Technical Degree/Diploma)', 'Ministry of Education / AICTE', 50000, 'STU-2026-8942', 'Priya Patel', 'priya.patel@vjti.ac.in', '+91 98123 45678', 'Female', '2005-02-14', 'OBC', 320000, 'XXXX-XXXX-9102', 'VJTI-MUM-002', 'Veermata Jijabai Technological Institute', 'U-0245', 'B.Tech in Electronics Engineering', '2nd Year (Semester 3)', 9.15, '{"accountNumber": "••••••••4419", "ifsc": "HDFC0000060", "bankName": "HDFC Bank", "accountHolder": "PRIYA PATEL", "aadhaarLinked": true}'::jsonb, '2026-07-12T11:15:00Z', 'college_verified',
'[{"id": "doc-3", "name": "AICTE Admission Letter", "type": "pdf", "size": "980 KB", "status": "verified", "digiLockerVerified": true}]'::jsonb,
'[{"id": "c1", "label": "Enrollment Status", "category": "academic", "status": "passed"}, {"id": "c2", "label": "Minimum 75% Attendance", "category": "attendance", "status": "passed"}, {"id": "c3", "label": "Marksheet Authenticity", "category": "academic", "status": "passed"}]'::jsonb,
'[{"stage": "student_submission", "status": "Application Submitted", "actor": "Priya Patel", "role": "Applicant", "timestamp": "2026-07-12T11:15:00Z", "remarks": "Submitted successfully.", "transactionHash": "0xb8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7"}, {"stage": "college_scrutiny", "status": "Verified by Institute Nodal Officer", "actor": "Dr. Rajeshwari Menon", "role": "College Nodal Officer", "timestamp": "2026-07-15T14:20:00Z", "remarks": "All documents verified.", "transactionHash": "0xc7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6"}]'::jsonb,
'0xc7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6', 'All academic certificates verified.', 'Dr. Rajeshwari Menon', '2026-07-15T14:20:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL),

('APP-2026-1003', 'NSP/2026/PMS-SC/44319', 'sch-post-matric-sc-03', 'Post-Matric Scholarship Scheme for SC & ST Students (Central Assured)', 'Ministry of Social Justice & Empowerment', 75000, 'STU-2026-8943', 'Rahul Verma', 'rahul.verma@nitt.edu', '+91 97654 32109', 'Male', '2003-11-09', 'SC', 180000, 'XXXX-XXXX-4431', 'NIT-TRICHY-003', 'National Institute of Technology Tiruchirappalli', 'U-0310', 'B.Tech in Mechanical Engineering', '4th Year (Semester 7)', 8.45, '{"accountNumber": "••••••••1102", "ifsc": "IOBA0000182", "bankName": "Indian Overseas Bank", "accountHolder": "RAHUL VERMA", "aadhaarLinked": true}'::jsonb, '2026-06-20T10:00:00Z', 'disbursed',
'[{"id": "doc-4", "name": "SC Caste Certificate", "type": "pdf", "size": "1.1 MB", "status": "verified", "digiLockerVerified": true}]'::jsonb,
'[{"id": "c1", "label": "Caste Verification", "category": "identity", "status": "passed"}, {"id": "c2", "label": "Attendance", "category": "attendance", "status": "passed"}]'::jsonb,
'[{"stage": "student_submission", "status": "Application Submitted", "actor": "Rahul Verma", "role": "Applicant", "timestamp": "2026-06-20T10:00:00Z", "remarks": "Submitted.", "transactionHash": "0xd1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2"}, {"stage": "dbt_disbursement", "status": "Direct Benefit Transfer Credited", "actor": "PFMS Central Clearing House", "role": "PFMS Gateway", "timestamp": "2026-07-01T16:00:00Z", "remarks": "Credited via APBS. UTR: SBIN0091827364", "transactionHash": "0xe2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3"}]'::jsonb,
'0xe2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3', 'Verified.', 'Dr. Rajeshwari Menon', '2026-06-22T10:00:00Z', 'SANCTION/GOI/2026/48910', 'Shri Vikramaditya Roy, IAS', '2026-06-25T11:00:00Z', 'BATCH-2026-9011', '2026-07-01T16:00:00Z', 'SBIN0091827364', 'Aadhaar Payment Bridge System (APBS DBT)');

-- Insert Verifications & Allocations
INSERT INTO student_verifications (student_id, college_id, verification_status, verification_tx_hash, verified_at) VALUES
('STU-2026-8941', 'IIT-DELHI-001', 'pending', NULL, NULL),
('STU-2026-8942', 'VJTI-MUM-002', 'verified', '0xc7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6', '2026-07-15T14:20:00Z'),
('STU-2026-8943', 'NIT-TRICHY-003', 'verified', '0xd1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2', '2026-06-22T10:00:00Z');

INSERT INTO scholarship_allocations (student_id, allocated_amount, token_symbol, allocation_tx_hash, allocation_block_number, allocation_status) VALUES
('STU-2026-8941', 20000, 'ETH', NULL, NULL, 'pending'),
('STU-2026-8942', 50000, 'ETH', NULL, NULL, 'pending'),
('STU-2026-8943', 75000, 'ETH', '0xe2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3', 1849201, 'allocated');

-- Insert Disbursement Batch
INSERT INTO disbursement_batches (id, batch_number, scheme_code, scheme_title, total_applications, total_amount, created_date, approved_date, status, pfms_reference_id, authorized_by, applications) VALUES
('BATCH-2026-9011', 'DBT-PFMS-2026-40192', 'PMS-SC-CENTRAL-2026', 'Post-Matric Scholarship Scheme for SC & ST Students (Central Assured)', 1, 75000, '2026-06-28T10:00:00Z', '2026-07-01T16:00:00Z', 'completed', 'PFMS/2026/DSC/940182', 'Shri Vikramaditya Roy, IAS', '["APP-2026-1003"]'::jsonb);

-- Insert Payment Record
INSERT INTO payments (id, transaction_id, utr_number, application_number, scholarship_title, amount, credit_date, bank_name, account_ending, status, mode, integrity_hash, stage_timeline) VALUES
('PAY-2026-001', 'TXN-DBT-901824', 'SBIN0091827364', 'NSP/2026/PMS-SC/44319', 'Post-Matric Scholarship Scheme for SC & ST Students (Central Assured)', 75000, '2026-07-01T16:00:00Z', 'Indian Overseas Bank', '1102', 'success', 'DBT Direct', '0xe2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
'[{"stage": "Ministry Sanction Order", "timestamp": "2026-06-25T11:00:00Z", "completed": true}, {"stage": "PFMS Payment Gateway File Generated", "timestamp": "2026-06-28T10:00:00Z", "completed": true}, {"stage": "NPCI Aadhaar Mapping Match", "timestamp": "2026-07-01T14:00:00Z", "completed": true}, {"stage": "Amount Credited to Bank Account", "timestamp": "2026-07-01T16:00:00Z", "completed": true}]'::jsonb);

-- Insert Audit Records
INSERT INTO audit_records (id, record_type, application_id, application_number, student_name, scheme_title, timestamp, actor_id, actor_name, actor_role, action_details, previous_state, new_state, ip_address, block_height, block_hash, prev_block_hash, digital_signature) VALUES
('AUD-2026-001', 'APPLICATION_SUBMITTED', 'APP-2026-1001', 'NSP/2026/PM-USP/89412', 'Aarav Sharma', 'Central Sector Scheme of Scholarship (PM-USP)', '2026-07-10T09:30:00Z', 'STU-2026-8941', 'Aarav Sharma', 'student', 'Application submitted with ID NSP/2026/PM-USP/89412. Forwarded to IIT Delhi for scrutiny.', 'DRAFT', 'COLLEGE_PENDING', '103.27.9.112', 1849201, '0xa9f8c12e3b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f', '0x0000000000000000000000000000000000000000000000000000000000000000', 'SIG_ED25519_STU_STU-2026-8941_7a9f');
