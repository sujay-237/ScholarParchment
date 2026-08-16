import { Application, AuditRecord, DisbursementBatch, NotificationItem, PaymentRecord, Scholarship, User } from '@/types';

// System default users matching the 5 Students, 1 College Officer, 1 Ministry Officer
export const mockUsers: Record<string, User> = {
  student: {
    id: 'STU-2026-8941',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@iitd.ac.in',
    role: 'student',
    studentId: '2022CSB1042',
    institution: 'Indian Institute of Technology Delhi',
    department: 'Computer Science & Engineering',
    aadhaarLast4: '8842',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  college: {
    id: 'COL-OFF-109',
    name: 'Dr. Rajeshwari Menon',
    email: 'verifications@iitd.ac.in',
    role: 'college',
    institution: 'Indian Institute of Technology Delhi (AISHE: U-0100)',
    designation: 'Dean of Student Welfare & Nodal Verification Officer',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  ministry: {
    id: 'MIN-DIR-042',
    name: 'Shri Vikramaditya Roy, IAS',
    email: 'director.scholarships@education.gov.in',
    role: 'ministry',
    department: 'Department of Higher Education, Ministry of Education, Govt. of India',
    designation: 'Joint Secretary & Director General of Central Schemes',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
};

export const mockScholarships: Scholarship[] = [];
export const mockApplications: Application[] = [];
export const mockDisbursementBatches: DisbursementBatch[] = [];
export const mockPayments: PaymentRecord[] = [];
export const mockAuditRecords: AuditRecord[] = [];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Portal Connected to Supabase',
    message: 'All application records, user accounts, and verification logs are stored in Supabase database tables.',
    timestamp: new Date().toISOString(),
    read: false,
    type: 'info',
    roleTarget: 'all',
  },
];
