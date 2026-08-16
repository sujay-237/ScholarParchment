'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Application,
  AuditRecord,
  DisbursementBatch,
  PaymentRecord,
  Scholarship,
  VerificationCheckItem,
} from '@/types';
import { generateHash } from '@/lib/utils';
import { useNotifications } from './NotificationContext';
import { supabase } from '@/lib/supabase';

interface ScholarshipDataContextType {
  scholarships: Scholarship[];
  applications: Application[];
  batches: DisbursementBatch[];
  payments: PaymentRecord[];
  auditRecords: AuditRecord[];
  isLoading: boolean;
  submitApplication: (app: Partial<Application>) => Promise<Application>;
  verifyCollegeApplication: (
    appId: string,
    checklist: VerificationCheckItem[],
    notes: string,
    officerName: string
  ) => Promise<void>;
  queryCollegeApplication: (
    appId: string,
    queryNotes: string,
    officerName: string
  ) => Promise<void>;
  rejectCollegeApplication: (
    appId: string,
    rejectNotes: string,
    officerName: string
  ) => Promise<void>;
  approveMinistryApplication: (
    appId: string,
    sanctionRemarks: string,
    officerName: string
  ) => Promise<void>;
  createDisbursementBatch: (
    schemeCode: string,
    schemeTitle: string,
    applicationIds: string[],
    officerName: string
  ) => Promise<DisbursementBatch>;
  executeDisbursementBatch: (batchId: string, officerName: string) => Promise<void>;
  getApplicationById: (id: string) => Application | undefined;
  getScholarshipById: (id: string) => Scholarship | undefined;
  getAuditRecordsForApp: (appId: string) => AuditRecord[];
  verifyOnChain: (studentId: string) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  allocateOnChain: (studentId: string, amount: string) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  disburseOnChain: (studentAddress: string) => Promise<{ success: boolean; txHash?: string; error?: string }>;
}

const ScholarshipDataContext = createContext<ScholarshipDataContextType | undefined>(undefined);

// Initial Fallback Data matching Supabase Seed SQL
const SEED_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sch-pm-usp-01',
    schemeCode: 'PM-USP-CS-2026',
    title: 'Central Sector Scheme of Scholarship for College and University Students (PM-USP)',
    ministry: 'Ministry of Education',
    department: 'Department of Higher Education',
    description: 'Providing financial assistance to meritorious students from low-income families to meet day-to-day expenses while pursuing higher studies.',
    amount: 20000,
    amountFormatted: '₹20,000 / Year',
    frequency: 'Annual',
    deadline: '2026-10-31',
    daysRemaining: 78,
    category: 'Higher Education',
    targetAudience: 'Top 20th percentile in Class XII board examination',
    eligibleCourses: ['B.Tech / B.E.', 'MBBS', 'B.Sc / M.Sc', 'B.Com / M.Com', 'B.A / M.A'],
    minimumGpaOrMarks: 80,
    maxFamilyIncome: 450000,
    totalSeats: 82000,
    appliedCount: 41250,
    status: 'open',
    keyBenefits: ['₹12,000/yr for Graduation', '₹20,000/yr for PG/Prof courses', 'Direct Bank Transfer (DBT) credit'],
    requiredDocs: ['Class 12 Marksheet', 'Income Certificate (< ₹4.5 Lakh)', 'College Bonafide Certificate', 'Aadhaar Card'],
  },
  {
    id: 'sch-pragati-stem-02',
    schemeCode: 'AICTE-PRAGATI-2026',
    title: 'PRAGATI Scholarship Scheme for Girl Students (Technical Degree/Diploma)',
    ministry: 'Ministry of Education / AICTE',
    department: 'All India Council for Technical Education',
    description: 'Empowering young women to pursue technical education by covering college fees, books, and essential computing equipment.',
    amount: 50000,
    amountFormatted: '₹50,000 / Year',
    frequency: 'Annual',
    deadline: '2026-09-15',
    daysRemaining: 32,
    category: 'Girls STEM',
    targetAudience: 'Female students admitted in 1st year of AICTE approved technical degrees',
    eligibleCourses: ['B.Tech / B.E.', 'B.Pharm', 'B.Arch', 'MCA'],
    minimumGpaOrMarks: 65,
    maxFamilyIncome: 800000,
    totalSeats: 10000,
    appliedCount: 7890,
    status: 'closing_soon',
    keyBenefits: ['₹50,000 per annum for tuition & equipment', 'Continuation across 4 full academic years'],
    requiredDocs: ['10th & 12th Marksheet', 'Income Certificate (< ₹8 Lakh)', 'AICTE College Admission Proof'],
  },
  {
    id: 'sch-post-matric-sc-03',
    schemeCode: 'PMS-SC-CENTRAL-2026',
    title: 'Post-Matric Scholarship Scheme for SC & ST Students (Central Assured)',
    ministry: 'Ministry of Social Justice & Empowerment',
    department: 'Department of Social Justice',
    description: 'Comprehensive financial support covering compulsory non-refundable fees, academic allowance, and disability rider.',
    amount: 75000,
    amountFormatted: '₹75,000 / Year',
    frequency: 'Annual',
    deadline: '2026-11-30',
    daysRemaining: 108,
    category: 'Post-Matric',
    targetAudience: 'SC/ST domicile students pursuing recognized post-matriculation courses',
    eligibleCourses: ['All Undergraduate & Postgraduate Professional Courses'],
    minimumGpaOrMarks: 50,
    maxFamilyIncome: 250000,
    totalSeats: 600000,
    appliedCount: 231400,
    status: 'open',
    keyBenefits: ['Full tuition fee reimbursement', 'Maintenance allowance up to ₹13,500/yr'],
    requiredDocs: ['Caste Certificate', 'Income Certificate (< ₹2.5 Lakh)', 'Fee Receipt'],
  },
];

const SEED_APPLICATIONS: Application[] = [
  {
    id: 'APP-2026-1001',
    applicationNumber: 'NSP/2026/PM-USP/89412',
    scholarshipId: 'sch-pm-usp-01',
    scholarshipTitle: 'Central Sector Scheme of Scholarship for College and University Students (PM-USP)',
    ministry: 'Ministry of Education',
    amount: 20000,
    studentId: 'STU-2026-8941',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@iitd.ac.in',
    studentPhone: '+91 98765 43210',
    gender: 'Male',
    dob: '2004-05-18',
    category: 'General (EWS)',
    annualIncome: 240000,
    aadhaarNumber: 'XXXX-XXXX-8842',
    collegeId: 'IIT-DELHI-001',
    collegeName: 'Indian Institute of Technology Delhi',
    collegeAISHE: 'U-0100',
    course: 'B.Tech in Computer Science',
    currentYear: '3rd Year (Semester 5)',
    cgpaPercentage: 8.92,
    bankAccount: {
      accountNumber: '••••••••8912',
      ifsc: 'SBIN0001077',
      bankName: 'State Bank of India',
      accountHolder: 'AARAV SHARMA',
      aadhaarLinked: true,
    },
    submittedDate: '2026-07-10T09:30:00Z',
    status: 'college_pending',
    documents: [
      { id: 'doc-1', name: 'Class 12 Board Marksheet', type: 'marksheet_12', category: 'Academic', size: '1.2 MB', uploadDate: '2026-07-10', verifiedStatus: 'verified' },
      { id: 'doc-2', name: 'Income Certificate FY 2025-26', type: 'income_cert', category: 'Financial', size: '850 KB', uploadDate: '2026-07-10', verifiedStatus: 'verified' },
    ],
    checklist: [
      { id: 'c1', label: 'Enrollment & Bonafide Regular Status', category: 'academic', status: 'pending' },
      { id: 'c2', label: 'Minimum 75% Attendance', category: 'attendance', status: 'pending' },
      { id: 'c3', label: 'Marksheet Authenticity', category: 'academic', status: 'pending' },
      { id: 'c4', label: 'Annual Income Certificate Validity', category: 'financial', status: 'pending' },
      { id: 'c5', label: 'Aadhaar-Seeded Bank Account', category: 'identity', status: 'passed' },
    ],
    history: [
      {
        stage: 'student_submission',
        status: 'Application Submitted',
        actor: 'Aarav Sharma',
        role: 'Applicant',
        timestamp: '2026-07-10T09:30:00Z',
        remarks: 'Submitted with e-KYC documents.',
        transactionHash: '0xa9f8c12e3b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
      },
    ],
    integrityHash: '0xa9f8c12e3b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
  },
  {
    id: 'APP-2026-1002',
    applicationNumber: 'NSP/2026/PRAGATI/91024',
    scholarshipId: 'sch-pragati-stem-02',
    scholarshipTitle: 'PRAGATI Scholarship Scheme for Girl Students (Technical Degree/Diploma)',
    ministry: 'Ministry of Education / AICTE',
    amount: 50000,
    studentId: 'STU-2026-8942',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@vjti.ac.in',
    studentPhone: '+91 98123 45678',
    gender: 'Female',
    dob: '2005-02-14',
    category: 'OBC',
    annualIncome: 320000,
    aadhaarNumber: 'XXXX-XXXX-9102',
    collegeId: 'VJTI-MUM-002',
    collegeName: 'Veermata Jijabai Technological Institute',
    collegeAISHE: 'U-0245',
    course: 'B.Tech in Electronics Engineering',
    currentYear: '2nd Year (Semester 3)',
    cgpaPercentage: 9.15,
    bankAccount: {
      accountNumber: '••••••••4419',
      ifsc: 'HDFC0000060',
      bankName: 'HDFC Bank',
      accountHolder: 'PRIYA PATEL',
      aadhaarLinked: true,
    },
    submittedDate: '2026-07-12T11:15:00Z',
    status: 'college_verified',
    documents: [
      { id: 'doc-3', name: 'AICTE Admission Letter', type: 'bonafide_cert', category: 'Academic', size: '980 KB', uploadDate: '2026-07-12', verifiedStatus: 'verified' },
    ],
    checklist: [
      { id: 'c1', label: 'Enrollment Status', category: 'academic', status: 'passed' },
      { id: 'c2', label: 'Minimum 75% Attendance', category: 'attendance', status: 'passed' },
    ],
    history: [
      {
        stage: 'student_submission',
        status: 'Application Submitted',
        actor: 'Priya Patel',
        role: 'Applicant',
        timestamp: '2026-07-12T11:15:00Z',
        remarks: 'Submitted successfully.',
        transactionHash: '0xb8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7',
      },
      {
        stage: 'college_scrutiny',
        status: 'Verified by Institute Nodal Officer',
        actor: 'Dr. Rajeshwari Menon',
        role: 'College Nodal Officer',
        timestamp: '2026-07-15T14:20:00Z',
        remarks: 'All documents verified.',
        transactionHash: '0xc7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6',
      },
    ],
    collegeReviewNotes: 'All academic certificates verified.',
    collegeVerifiedBy: 'Dr. Rajeshwari Menon',
    collegeVerifiedDate: '2026-07-15T14:20:00Z',
    integrityHash: '0xc7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6',
  },
  {
    id: 'APP-2026-1003',
    applicationNumber: 'NSP/2026/PMS-SC/44319',
    scholarshipId: 'sch-post-matric-sc-03',
    scholarshipTitle: 'Post-Matric Scholarship Scheme for SC & ST Students (Central Assured)',
    ministry: 'Ministry of Social Justice & Empowerment',
    amount: 75000,
    studentId: 'STU-2026-8943',
    studentName: 'Rahul Verma',
    studentEmail: 'rahul.verma@nitt.edu',
    studentPhone: '+91 97654 32109',
    gender: 'Male',
    dob: '2003-11-09',
    category: 'SC',
    annualIncome: 180000,
    aadhaarNumber: 'XXXX-XXXX-4431',
    collegeId: 'NIT-TRICHY-003',
    collegeName: 'National Institute of Technology Tiruchirappalli',
    collegeAISHE: 'U-0310',
    course: 'B.Tech in Mechanical Engineering',
    currentYear: '4th Year (Semester 7)',
    cgpaPercentage: 8.45,
    bankAccount: {
      accountNumber: '••••••••1102',
      ifsc: 'IOBA0000182',
      bankName: 'Indian Overseas Bank',
      accountHolder: 'RAHUL VERMA',
      aadhaarLinked: true,
    },
    submittedDate: '2026-06-20T10:00:00Z',
    status: 'disbursed',
    documents: [],
    checklist: [],
    history: [
      {
        stage: 'student_submission',
        status: 'Application Submitted',
        actor: 'Rahul Verma',
        role: 'Applicant',
        timestamp: '2026-06-20T10:00:00Z',
        remarks: 'Submitted.',
        transactionHash: '0xd1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2',
      },
      {
        stage: 'dbt_disbursement',
        status: 'Direct Benefit Transfer Credited',
        actor: 'PFMS Central Clearing House',
        role: 'PFMS Gateway',
        timestamp: '2026-07-01T16:00:00Z',
        remarks: 'Credited via APBS. UTR: SBIN0091827364',
        transactionHash: '0xe2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
      },
    ],
    collegeReviewNotes: 'Verified.',
    collegeVerifiedBy: 'Dr. Rajeshwari Menon',
    collegeVerifiedDate: '2026-06-22T10:00:00Z',
    ministrySanctionNumber: 'SANCTION/GOI/2026/48910',
    ministryApprovedBy: 'Shri Vikramaditya Roy, IAS',
    ministryApprovalDate: '2026-06-25T11:00:00Z',
    disbursementBatchId: 'BATCH-2026-9011',
    disbursementDate: '2026-07-01T16:00:00Z',
    utrNumber: 'SBIN0091827364',
    paymentMode: 'Aadhaar Payment Bridge System (APBS DBT)',
    integrityHash: '0xe2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
  },
];

export const ScholarshipDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scholarships, setScholarships] = useState<Scholarship[]>(SEED_SCHOLARSHIPS);
  const [applications, setApplications] = useState<Application[]>(SEED_APPLICATIONS);
  const [batches, setBatches] = useState<DisbursementBatch[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { addNotification } = useNotifications();

  // Load state from Supabase database
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        setIsLoading(true);
        // 1. Fetch scholarships
        const { data: dbSch } = await supabase.from('scholarships').select('*');
        if (dbSch && dbSch.length > 0) {
          setScholarships(
            dbSch.map((s: any) => ({
              id: s.id,
              schemeCode: s.scheme_code,
              title: s.title,
              ministry: s.ministry,
              department: s.department,
              description: s.description,
              amount: Number(s.amount),
              amountFormatted: s.amount_formatted,
              frequency: s.frequency,
              deadline: s.deadline,
              daysRemaining: s.days_remaining,
              category: s.category,
              targetAudience: s.target_audience,
              eligibleCourses: typeof s.eligible_courses === 'string' ? JSON.parse(s.eligible_courses) : s.eligible_courses,
              minimumGpaOrMarks: Number(s.minimum_gpa_or_marks),
              maxFamilyIncome: Number(s.max_family_income),
              totalSeats: s.total_seats,
              appliedCount: s.applied_count,
              status: s.status,
              keyBenefits: typeof s.key_benefits === 'string' ? JSON.parse(s.key_benefits) : s.key_benefits,
              requiredDocs: typeof s.required_docs === 'string' ? JSON.parse(s.required_docs) : s.required_docs,
            }))
          );
        }

        // 2. Fetch applications
        const { data: dbApps } = await supabase.from('applications').select('*');
        if (dbApps && dbApps.length > 0) {
          setApplications(
            dbApps.map((a: any) => ({
              id: a.id,
              applicationNumber: a.application_number,
              scholarshipId: a.scholarship_id,
              scholarshipTitle: a.scholarship_title,
              ministry: a.ministry,
              amount: Number(a.amount),
              studentId: a.student_id,
              studentName: a.student_name,
              studentEmail: a.student_email,
              studentPhone: a.student_phone,
              gender: a.gender,
              dob: a.dob,
              category: a.category,
              annualIncome: Number(a.annual_income),
              aadhaarNumber: a.aadhaar_number,
              collegeId: a.college_id,
              collegeName: a.college_name,
              collegeAISHE: a.college_aishe,
              course: a.course,
              currentYear: a.current_year,
              cgpaPercentage: Number(a.cgpa_percentage),
              bankAccount: typeof a.bank_account === 'string' ? JSON.parse(a.bank_account) : a.bank_account,
              submittedDate: a.submitted_date,
              status: a.status,
              documents: typeof a.documents === 'string' ? JSON.parse(a.documents) : a.documents,
              checklist: typeof a.checklist === 'string' ? JSON.parse(a.checklist) : a.checklist,
              history: typeof a.history === 'string' ? JSON.parse(a.history) : a.history,
              integrityHash: a.integrity_hash,
              collegeReviewNotes: a.college_review_notes,
              collegeVerifiedBy: a.college_verified_by,
              collegeVerifiedDate: a.college_verified_date,
              ministrySanctionNumber: a.ministry_sanction_number,
              ministryApprovedBy: a.ministry_approved_by,
              ministryApprovalDate: a.ministry_approval_date,
              disbursementBatchId: a.disbursement_batch_id,
              disbursementDate: a.disbursement_date,
              utrNumber: a.utr_number,
              paymentMode: a.payment_mode,
            }))
          );
        }

        // 3. Fetch batches
        const { data: dbBatches } = await supabase.from('disbursement_batches').select('*');
        if (dbBatches && dbBatches.length > 0) {
          setBatches(
            dbBatches.map((b: any) => ({
              id: b.id,
              batchNumber: b.batch_number,
              schemeCode: b.scheme_code,
              schemeTitle: b.scheme_title,
              totalApplications: b.total_applications,
              totalAmount: Number(b.total_amount),
              createdDate: b.created_date,
              approvedDate: b.approved_date,
              status: b.status,
              pfmsReferenceId: b.pfms_reference_id,
              authorizedBy: b.authorized_by,
              applications: typeof b.applications === 'string' ? JSON.parse(b.applications) : b.applications,
            }))
          );
        }

        // 4. Fetch payments
        const { data: dbPayments } = await supabase.from('payments').select('*');
        if (dbPayments && dbPayments.length > 0) {
          setPayments(
            dbPayments.map((p: any) => ({
              id: p.id,
              transactionId: p.transaction_id,
              utrNumber: p.utr_number,
              applicationNumber: p.application_number,
              scholarshipTitle: p.scholarship_title,
              amount: Number(p.amount),
              creditDate: p.credit_date,
              bankName: p.bank_name,
              accountEnding: p.account_ending,
              status: p.status,
              mode: p.mode,
              integrityHash: p.integrity_hash,
              stageTimeline: typeof p.stage_timeline === 'string' ? JSON.parse(p.stage_timeline) : p.stage_timeline,
            }))
          );
        }

        // 5. Fetch audit records
        const { data: dbAudit } = await supabase.from('audit_records').select('*');
        if (dbAudit && dbAudit.length > 0) {
          setAuditRecords(
            dbAudit.map((r: any) => ({
              id: r.id,
              recordType: r.record_type,
              applicationId: r.application_id,
              applicationNumber: r.application_number,
              studentName: r.student_name,
              schemeTitle: r.scheme_title,
              timestamp: r.timestamp,
              actorId: r.actor_id,
              actorName: r.actor_name,
              actorRole: r.actor_role,
              actionDetails: r.action_details,
              previousState: r.previous_state,
              newState: r.new_state,
              ipAddress: r.ip_address,
              blockHeight: r.block_height,
              blockHash: r.block_hash,
              prevBlockHash: r.prev_block_hash,
              digitalSignature: r.digital_signature,
            }))
          );
        }
      } catch (err) {
        console.error('Failed fetching data from Supabase', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSupabaseData();
  }, []);

  const getApplicationById = (id: string) => {
    return applications.find((a) => a.id === id || a.applicationNumber === id);
  };

  const getScholarshipById = (id: string) => {
    return scholarships.find((s) => s.id === id || s.schemeCode === id);
  };

  const getAuditRecordsForApp = (appId: string) => {
    return auditRecords.filter((r) => r.applicationId === appId);
  };

  const submitApplication = async (appData: Partial<Application>): Promise<Application> => {
    const newId = `APP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const appNumber = `NSP/2026/${appData.scholarshipId?.substring(0, 6).toUpperCase() || 'SCH'}/${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toISOString();
    const hash = generateHash(newId + timestamp);

    const newApp: Application = {
      id: newId,
      applicationNumber: appNumber,
      scholarshipId: appData.scholarshipId || 'sch-pm-usp-01',
      scholarshipTitle: appData.scholarshipTitle || 'National Scholarship Scheme',
      ministry: appData.ministry || 'Ministry of Education',
      amount: appData.amount || 20000,
      studentId: appData.studentId || 'STU-2026-8941',
      studentName: appData.studentName || 'Aarav Sharma',
      studentEmail: appData.studentEmail || 'aarav.sharma@iitd.ac.in',
      studentPhone: appData.studentPhone || '+91 98765 43210',
      gender: appData.gender || 'Male',
      dob: appData.dob || '2004-05-18',
      category: appData.category || 'General (EWS)',
      annualIncome: appData.annualIncome || 240000,
      aadhaarNumber: appData.aadhaarNumber || 'XXXX-XXXX-8842',
      collegeId: appData.collegeId || 'IIT-DELHI-001',
      collegeName: appData.collegeName || 'Indian Institute of Technology Delhi',
      collegeAISHE: appData.collegeAISHE || 'U-0100',
      course: appData.course || 'B.Tech in Computer Science',
      currentYear: appData.currentYear || '3rd Year (Semester 5)',
      cgpaPercentage: appData.cgpaPercentage || 8.92,
      bankAccount: appData.bankAccount || {
        accountNumber: '••••••••8912',
        ifsc: 'SBIN0001077',
        bankName: 'State Bank of India',
        accountHolder: appData.studentName?.toUpperCase() || 'AARAV SHARMA',
        aadhaarLinked: true,
      },
      submittedDate: timestamp,
      status: 'college_pending',
      documents: appData.documents || [],
      checklist: [
        { id: 'c1', label: 'Enrollment & Bonafide Regular Status', category: 'academic', status: 'pending' },
        { id: 'c2', label: 'Minimum 75% Attendance in Previous Term', category: 'attendance', status: 'pending' },
        { id: 'c3', label: 'Marksheet & Grade Authenticity', category: 'academic', status: 'pending' },
        { id: 'c4', label: 'Annual Income Certificate Validity', category: 'financial', status: 'pending' },
        { id: 'c5', label: 'Aadhaar-Seeded Bank Account Verification', category: 'identity', status: 'passed' },
      ],
      history: [
        {
          stage: 'student_submission',
          status: 'Application Submitted',
          actor: appData.studentName || 'Student Applicant',
          role: 'Applicant',
          timestamp,
          remarks: 'Application submitted successfully with e-KYC documents.',
          transactionHash: hash,
        },
      ],
      integrityHash: hash,
    };

    setApplications((prev) => [newApp, ...prev]);

    // Insert into Supabase
    try {
      await supabase.from('applications').insert({
        id: newApp.id,
        application_number: newApp.applicationNumber,
        scholarship_id: newApp.scholarshipId,
        scholarship_title: newApp.scholarshipTitle,
        ministry: newApp.ministry,
        amount: newApp.amount,
        student_id: newApp.studentId,
        student_name: newApp.studentName,
        student_email: newApp.studentEmail,
        student_phone: newApp.studentPhone,
        gender: newApp.gender,
        dob: newApp.dob,
        category: newApp.category,
        annual_income: newApp.annualIncome,
        aadhaar_number: newApp.aadhaarNumber,
        college_id: newApp.collegeId,
        college_name: newApp.collegeName,
        college_aishe: newApp.collegeAISHE,
        course: newApp.course,
        current_year: newApp.currentYear,
        cgpa_percentage: newApp.cgpaPercentage,
        bank_account: newApp.bankAccount,
        submitted_date: newApp.submittedDate,
        status: newApp.status,
        documents: newApp.documents,
        checklist: newApp.checklist,
        history: newApp.history,
        integrity_hash: newApp.integrityHash,
      });
    } catch (e) {
      console.error('Failed writing application to Supabase', e);
    }

    addNotification({
      title: 'Application Submitted Successfully',
      message: `Your application ${newApp.applicationNumber} for ${newApp.scholarshipTitle} has been recorded.`,
      type: 'success',
      roleTarget: 'student',
      link: `/student/applications`,
    });

    return newApp;
  };

  const verifyCollegeApplication = async (
    appId: string,
    checklist: VerificationCheckItem[],
    notes: string,
    officerName: string
  ) => {
    const timestamp = new Date().toISOString();
    const hash = generateHash(appId + officerName + timestamp);

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          status: 'college_verified',
          checklist,
          collegeReviewNotes: notes,
          collegeVerifiedBy: officerName,
          collegeVerifiedDate: timestamp,
          history: [
            ...app.history,
            {
              stage: 'college_scrutiny' as const,
              status: 'Verified by Institute Nodal Officer',
              actor: officerName,
              role: 'College Nodal Officer',
              timestamp,
              remarks: notes || 'All academic, attendance, and category proofs verified successfully.',
              transactionHash: hash,
            },
          ],
          integrityHash: hash,
        };
      })
    );

    try {
      await supabase.from('applications').update({
        status: 'college_verified',
        checklist,
        college_review_notes: notes,
        college_verified_by: officerName,
        college_verified_date: timestamp,
        integrity_hash: hash,
      }).eq('id', appId);
    } catch (e) {
      console.error('Failed updating application in Supabase', e);
    }
  };

  const queryCollegeApplication = async (
    appId: string,
    queryNotes: string,
    officerName: string
  ) => {
    const timestamp = new Date().toISOString();
    const hash = generateHash(appId + 'query' + timestamp);

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          status: 'college_queried',
          collegeReviewNotes: queryNotes,
        };
      })
    );

    try {
      await supabase.from('applications').update({
        status: 'college_queried',
        college_review_notes: queryNotes,
      }).eq('id', appId);
    } catch (e) {
      console.error('Failed updating query in Supabase', e);
    }
  };

  const rejectCollegeApplication = async (
    appId: string,
    rejectNotes: string,
    officerName: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          status: 'college_rejected',
          collegeReviewNotes: rejectNotes,
        };
      })
    );

    try {
      await supabase.from('applications').update({
        status: 'college_rejected',
        college_review_notes: rejectNotes,
      }).eq('id', appId);
    } catch (e) {
      console.error('Failed updating rejection in Supabase', e);
    }
  };

  const approveMinistryApplication = async (
    appId: string,
    sanctionRemarks: string,
    officerName: string
  ) => {
    const timestamp = new Date().toISOString();
    const sanctionNo = `SANCTION/GOI/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`;
    const hash = generateHash(appId + sanctionNo + timestamp);

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          status: 'ministry_approved',
          ministrySanctionNumber: sanctionNo,
          ministryApprovedBy: officerName,
          ministryApprovalDate: timestamp,
          integrityHash: hash,
        };
      })
    );

    try {
      await supabase.from('applications').update({
        status: 'ministry_approved',
        ministry_sanction_number: sanctionNo,
        ministry_approved_by: officerName,
        ministry_approval_date: timestamp,
        integrity_hash: hash,
      }).eq('id', appId);
    } catch (e) {
      console.error('Failed approving application in Supabase', e);
    }
  };

  const createDisbursementBatch = async (
    schemeCode: string,
    schemeTitle: string,
    applicationIds: string[],
    officerName: string
  ): Promise<DisbursementBatch> => {
    const timestamp = new Date().toISOString();
    const batchId = `BATCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const batchNumber = `DBT-PFMS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const totalAmount = applicationIds.reduce((sum, id) => {
      const app = applications.find((a) => a.id === id);
      return sum + (app?.amount || 20000);
    }, 0);

    const newBatch: DisbursementBatch = {
      id: batchId,
      batchNumber,
      schemeCode,
      schemeTitle,
      totalApplications: applicationIds.length,
      totalAmount,
      createdDate: timestamp,
      status: 'pending_approval',
      pfmsReferenceId: `PFMS/${new Date().getFullYear()}/DSC/${Math.floor(100000 + Math.random() * 900000)}`,
      authorizedBy: officerName,
      applications: applicationIds,
    };

    setBatches((prev) => [newBatch, ...prev]);

    try {
      await supabase.from('disbursement_batches').insert({
        id: newBatch.id,
        batch_number: newBatch.batchNumber,
        scheme_code: newBatch.schemeCode,
        scheme_title: newBatch.schemeTitle,
        total_applications: newBatch.totalApplications,
        total_amount: newBatch.totalAmount,
        created_date: newBatch.createdDate,
        status: newBatch.status,
        pfms_reference_id: newBatch.pfmsReferenceId,
        authorized_by: newBatch.authorizedBy,
        applications: newBatch.applications,
      });
    } catch (e) {
      console.error('Failed writing batch to Supabase', e);
    }

    return newBatch;
  };

  const executeDisbursementBatch = async (batchId: string, officerName: string) => {
    const timestamp = new Date().toISOString();
    const batch = batches.find((b) => b.id === batchId);
    if (!batch) return;

    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? { ...b, status: 'completed', approvedDate: timestamp }
          : b
      )
    );

    try {
      await supabase.from('disbursement_batches').update({
        status: 'completed',
        approved_date: timestamp,
      }).eq('id', batchId);
    } catch (e) {
      console.error('Failed executing batch in Supabase', e);
    }
  };

  const verifyOnChain = async (studentId: string) => {
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Verification failed' };
      }
      return { success: true, txHash: data.transactionHash };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const allocateOnChain = async (studentId: string, amount: string) => {
    try {
      const res = await fetch('/api/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, amount }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Allocation failed' };
      }
      return { success: true, txHash: data.transactionHash };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const disburseOnChain = async (studentAddress: string) => {
    try {
      const res = await fetch('/api/disburse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentAddress }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Disbursement failed' };
      }
      return { success: true, txHash: data.transactionHash };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  return (
    <ScholarshipDataContext.Provider
      value={{
        scholarships,
        applications,
        batches,
        payments,
        auditRecords,
        isLoading,
        submitApplication,
        verifyCollegeApplication,
        queryCollegeApplication,
        rejectCollegeApplication,
        approveMinistryApplication,
        createDisbursementBatch,
        executeDisbursementBatch,
        getApplicationById,
        getScholarshipById,
        getAuditRecordsForApp,
        verifyOnChain,
        allocateOnChain,
        disburseOnChain,
      }}
    >
      {children}
    </ScholarshipDataContext.Provider>
  );
};

export const useScholarshipData = () => {
  const context = useContext(ScholarshipDataContext);
  if (!context) {
    throw new Error('useScholarshipData must be used within a ScholarshipDataProvider');
  }
  return context;
};
