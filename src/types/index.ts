export type UserRole = 'student' | 'college' | 'ministry' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  institution?: string;
  department?: string;
  designation?: string;
  studentId?: string;
  aadhaarLast4?: string;
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'college_pending'
  | 'college_verified'
  | 'college_queried'
  | 'college_rejected'
  | 'ministry_pending'
  | 'ministry_approved'
  | 'disbursed'
  | 'rejected';

export interface DocumentAttachment {
  id: string;
  name: string;
  type: 'marksheet_10' | 'marksheet_12' | 'income_cert' | 'caste_cert' | 'domicile_cert' | 'bank_passbook' | 'bonafide_cert' | 'fee_receipt' | 'id_proof';
  category: string;
  size: string;
  uploadDate: string;
  verifiedStatus: 'pending' | 'verified' | 'flagged' | 'rejected';
  verificationNotes?: string;
  ocrExtractedData?: Record<string, string>;
  fileUrl?: string;
}

export interface VerificationCheckItem {
  id: string;
  label: string;
  category: 'academic' | 'identity' | 'financial' | 'attendance';
  status: 'passed' | 'failed' | 'pending' | 'warning';
  notes?: string;
  checkedBy?: string;
  checkedAt?: string;
}

export interface VerificationHistory {
  stage: 'student_submission' | 'college_scrutiny' | 'ministry_sanction' | 'dbt_disbursement';
  status: string;
  actor: string;
  role: string;
  timestamp: string;
  remarks: string;
  transactionHash: string;
}

export interface Scholarship {
  id: string;
  schemeCode: string;
  title: string;
  ministry: string;
  department: string;
  description: string;
  amount: number;
  amountFormatted: string;
  frequency: 'Annual' | 'One-Time' | 'Per Semester' | 'Monthly';
  deadline: string;
  daysRemaining: number;
  category: 'Merit-cum-Means' | 'Pre-Matric' | 'Post-Matric' | 'Higher Education' | 'Special Ability' | 'Girls STEM';
  targetAudience: string;
  eligibleCourses: string[];
  minimumGpaOrMarks: number;
  maxFamilyIncome: number;
  totalSeats: number;
  appliedCount: number;
  status: 'open' | 'closing_soon' | 'closed';
  guidelinesUrl?: string;
  keyBenefits: string[];
  requiredDocs: string[];
}

export interface Application {
  id: string;
  applicationNumber: string;
  scholarshipId: string;
  scholarshipTitle: string;
  ministry: string;
  amount: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  gender: string;
  dob: string;
  category: string;
  annualIncome: number;
  aadhaarNumber: string;
  collegeId: string;
  collegeName: string;
  collegeAISHE: string;
  course: string;
  currentYear: string;
  cgpaPercentage: number;
  bankAccount: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    accountHolder: string;
    aadhaarLinked: boolean;
  };
  submittedDate: string;
  status: ApplicationStatus;
  documents: DocumentAttachment[];
  checklist: VerificationCheckItem[];
  history: VerificationHistory[];
  collegeReviewNotes?: string;
  collegeVerifiedBy?: string;
  collegeVerifiedDate?: string;
  ministrySanctionNumber?: string;
  ministryApprovedBy?: string;
  ministryApprovalDate?: string;
  disbursementBatchId?: string;
  disbursementDate?: string;
  utrNumber?: string;
  paymentMode?: string;
  integrityHash: string;
}

export interface DisbursementBatch {
  id: string;
  batchNumber: string;
  schemeCode: string;
  schemeTitle: string;
  totalApplications: number;
  totalAmount: number;
  createdDate: string;
  status: 'draft' | 'pending_approval' | 'processing' | 'completed' | 'failed';
  pfmsReferenceId?: string;
  authorizedBy: string;
  approvedDate?: string;
  applications: string[];
}

export interface PaymentRecord {
  id: string;
  transactionId: string;
  utrNumber: string;
  applicationNumber: string;
  scholarshipTitle: string;
  amount: number;
  creditDate: string;
  bankName: string;
  accountEnding: string;
  status: 'success' | 'processing' | 'failed';
  mode: 'DBT Direct' | 'PFMS NACH' | 'NEFT';
  stageTimeline: {
    stage: string;
    timestamp: string;
    completed: boolean;
  }[];
  integrityHash: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  roleTarget: UserRole | 'all';
  link?: string;
  actionLabel?: string;
}

export interface AuditRecord {
  id: string;
  recordType: 'APPLICATION_SUBMITTED' | 'COLLEGE_VERIFIED' | 'COLLEGE_QUERY' | 'MINISTRY_APPROVED' | 'DISBURSEMENT_INITIATED' | 'PAYMENT_CREDITED';
  applicationId: string;
  applicationNumber: string;
  studentName: string;
  schemeTitle: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  actionDetails: string;
  previousState: string;
  newState: string;
  ipAddress: string;
  blockHeight?: number;
  blockHash: string;
  prevBlockHash: string;
  digitalSignature: string;
}
