'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useScholarshipData } from '@/context/ScholarshipDataContext';
import { AppShell } from '@/components/layout/AppShell';
import { DocumentAttachment } from '@/types';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Upload,
  ShieldCheck,
  Building,
  User,
  Landmark,
  Save,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function ApplyWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const { scholarships, submitApplication } = useScholarshipData();

  const schemeId = params?.id as string;
  const scheme = scholarships.find((s) => s.id === schemeId) || scholarships[0];

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdAppNumber, setCreatedAppNumber] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal & Academic
    studentName: currentUser.name || 'Aarav Sharma',
    dob: '2004-05-18',
    gender: 'Male',
    category: 'General (EWS)',
    aadhaarNumber: 'XXXX-XXXX-8842',
    phone: '+91 98765 43210',
    email: currentUser.email || 'aarav.sharma@iitd.ac.in',
    collegeName: 'Indian Institute of Technology Delhi',
    collegeAISHE: 'U-0100',
    course: 'B.Tech in Computer Science and Engineering',
    currentYear: '3rd Year (Semester 5)',
    cgpaPercentage: 8.92,

    // Step 2: Financial & Family
    annualIncome: 240000,
    fatherName: 'Suresh Sharma',
    fatherOccupation: 'Small Business / Agriculture',
    incomeCertNumber: 'INC/2026/DELHI/9921',
    issuingAuthority: 'Tehsildar Office, South-West Delhi',

    // Step 3: Bank KYC
    accountHolder: 'AARAV SHARMA',
    bankName: 'State Bank of India',
    accountNumber: '389201948912',
    ifsc: 'SBIN0001077',
    aadhaarLinked: true,
  });

  // Attached Documents
  const [attachedDocs, setAttachedDocs] = useState<DocumentAttachment[]>([
    {
      id: 'doc-01',
      name: 'Class_12_CBSE_Marksheet_Aarav.pdf',
      type: 'marksheet_12',
      category: 'Academic Proof',
      size: '1.2 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      verifiedStatus: 'verified',
      ocrExtractedData: {
        'Aggregate Score': '94.6%',
        'Board': 'CBSE New Delhi',
        'Passing Year': '2022',
      },
    },
    {
      id: 'doc-02',
      name: 'Annual_Income_Tehsildar_2026.pdf',
      type: 'income_cert',
      category: 'Income Proof',
      size: '840 KB',
      uploadDate: new Date().toISOString().split('T')[0],
      verifiedStatus: 'verified',
      ocrExtractedData: {
        'Declared Income': '₹2,40,000',
        'Valid Till': '31-03-2027',
      },
    },
    {
      id: 'doc-03',
      name: 'IITD_Bonafide_FeeReceipt_2026.pdf',
      type: 'bonafide_cert',
      category: 'Institutional Bonafide',
      size: '1.8 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      verifiedStatus: 'pending',
    },
  ]);

  const handleSimulateDocUpload = (type: DocumentAttachment['type'], name: string, category: string) => {
    const newDoc: DocumentAttachment = {
      id: `doc-${Date.now()}`,
      name,
      type,
      category,
      size: '1.1 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      verifiedStatus: 'verified',
      ocrExtractedData: {
        'DigiLocker URI': `in.gov.digilocker:${Date.now()}`,
        'Integrity Check': 'Passed (100% Match)',
      },
    };
    setAttachedDocs((prev) => [...prev, newDoc]);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const newApp = await submitApplication({
      scholarshipId: scheme.id,
      scholarshipTitle: scheme.title,
      ministry: scheme.ministry,
      amount: scheme.amount,
      studentId: currentUser.id,
      studentName: formData.studentName,
      studentEmail: formData.email,
      studentPhone: formData.phone,
      gender: formData.gender,
      dob: formData.dob,
      category: formData.category,
      annualIncome: formData.annualIncome,
      collegeName: formData.collegeName,
      collegeAISHE: formData.collegeAISHE,
      course: formData.course,
      currentYear: formData.currentYear,
      cgpaPercentage: formData.cgpaPercentage,
      bankAccount: {
        accountNumber: formData.accountNumber,
        ifsc: formData.ifsc,
        bankName: formData.bankName,
        accountHolder: formData.accountHolder,
        aadhaarLinked: formData.aadhaarLinked,
      },
      documents: attachedDocs,
    });

    setCreatedAppNumber(newApp.applicationNumber);
    setIsSubmitting(false);
    setIsSuccess(true);

      // Fire celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
  };

  const steps = [
    { num: 1, label: 'Academic & Personal' },
    { num: 2, label: 'Income & Category' },
    { num: 3, label: 'DigiLocker Vault' },
    { num: 4, label: 'Review & Submit' },
  ];

  if (isSuccess) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto py-12 text-center space-y-6 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider font-label text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              Application Successfully Submitted
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">
              Forwarded for Institutional Scrutiny
            </h2>
            <p className="text-xs sm:text-sm text-secondary">
              Your application for <strong className="text-on-surface">{scheme.title}</strong> has been logged onto the verification ledger.
            </p>
          </div>

          <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/60 text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-secondary">Application Number:</span>
              <span className="font-mono font-bold text-on-surface">{createdAppNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Assigned Nodal Authority:</span>
              <span className="font-semibold text-on-surface">IIT Delhi Verification Cell</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Expected Verification:</span>
              <span className="text-on-surface">Within 7 Working Days</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/student/applications"
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl text-xs font-semibold shadow hover:bg-primary/90 transition-colors"
            >
              Go to Application Workspace
            </Link>
            <Link
              href="/records"
              className="w-full sm:w-auto px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold transition-colors"
            >
              View Verification Hash in Ledger
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header with Back button */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <Link
              href="/student/explorer"
              className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider font-label text-primary">
                Application Workspace
              </span>
              <h1 className="text-xl sm:text-2xl font-bold font-headline text-on-surface">
                {scheme.title}
              </h1>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-sm font-bold font-headline text-primary">
              {scheme.amountFormatted}
            </span>
            <p className="text-[10px] text-secondary">{scheme.ministry}</p>
          </div>
        </div>

        {/* Stepper Header */}
        <div className="grid grid-cols-4 gap-2 bg-surface-container-low p-2 rounded-2xl border border-outline-variant/50">
          {steps.map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setCurrentStep(step.num)}
                className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  isCurrent
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-sm border border-outline-variant/40'
                    : isDone
                    ? 'text-emerald-800'
                    : 'text-secondary opacity-70'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-highest text-secondary'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3" /> : step.num}
                </div>
                <span className="hidden md:inline">{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Step 1: Personal & Academic Credentials */}
        {currentStep === 1 && (
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/80 shadow-sm space-y-6">
            <div className="pb-4 border-b border-surface-container">
              <h2 className="text-lg font-bold font-headline text-on-surface">
                Step 1: Personal & Academic Credentials
              </h2>
              <p className="text-xs text-secondary">
                Pre-populated from your verified National Academic Depository (NAD) & Aadhaar e-KYC.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-on-surface font-label block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface font-label block mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface font-label block mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other / Transgender</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-on-surface font-label block mb-1">Reservation Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                >
                  <option>General</option>
                  <option>General (EWS)</option>
                  <option>OBC-NCL</option>
                  <option>SC</option>
                  <option>ST</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-on-surface font-label block mb-1">Enrolled Educational Institution</label>
                <input
                  type="text"
                  value={formData.collegeName}
                  readOnly
                  className="w-full p-3 bg-surface-container-high/40 border border-outline-variant rounded-xl text-on-surface cursor-not-allowed font-medium"
                />
                <span className="text-[10px] text-secondary mt-0.5 block">AISHE Code: {formData.collegeAISHE} (Verified)</span>
              </div>

              <div>
                <label className="font-semibold text-on-surface font-label block mb-1">Course & Degree</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface font-label block mb-1">Current Academic Year</label>
                <input
                  type="text"
                  value={formData.currentYear}
                  onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface font-label block mb-1">Cumulative CGPA / Score</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cgpaPercentage}
                  onChange={(e) => setFormData({ ...formData, cgpaPercentage: parseFloat(e.target.value) })}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-bold text-primary"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span>Save & Continue to Step 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Financial Details & Income Proof */}
        {currentStep === 2 && (
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/80 shadow-sm space-y-6">
            <div className="pb-4 border-b border-surface-container">
              <h2 className="text-lg font-bold font-headline text-on-surface">
                Step 2: Financial Assessment & Means Eligibility
              </h2>
              <p className="text-xs text-secondary">
                Ensure annual gross family income conforms to the scheme ceiling ({formatCurrency(scheme.maxFamilyIncome)}/yr).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-on-surface font-label block mb-1">
                  Annual Gross Family Income (in INR ₹)
                </label>
                <input
                  type="number"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-bold text-base"
                />
                {formData.annualIncome <= scheme.maxFamilyIncome ? (
                  <span className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Within Scheme Income Limit
                  </span>
                ) : (
                  <span className="text-[11px] text-rose-700 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Exceeds ceiling of {formatCurrency(scheme.maxFamilyIncome)}
                  </span>
                )}
              </div>

              <div>
                <label className="font-semibold text-on-surface font-label block mb-1">
                  Income Certificate Barcode / Number
                </label>
                <input
                  type="text"
                  value={formData.incomeCertNumber}
                  onChange={(e) => setFormData({ ...formData, incomeCertNumber: e.target.value })}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface font-label block mb-1">
                  Issuing Competent Authority (Tehsildar / SDM / Revenue Officer)
                </label>
                <input
                  type="text"
                  value={formData.issuingAuthority}
                  onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface font-label block mb-1">
                  Father / Guardian Primary Occupation
                </label>
                <input
                  type="text"
                  value={formData.fatherOccupation}
                  onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-semibold text-on-surface"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span>Save & Continue to Step 3</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: DigiLocker Document Vault */}
        {currentStep === 3 && (
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/80 shadow-sm space-y-6">
            <div className="pb-4 border-b border-surface-container flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold font-headline text-on-surface">
                  Step 3: DigiLocker Verified Document Attachments
                </h2>
                <p className="text-xs text-secondary">
                  Attach certificates verified against central repositories with tamper-proof electronic seals.
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase font-label">
                DigiLocker Connected
              </span>
            </div>

            <div className="space-y-3">
              {attachedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary-container text-on-primary-container">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">{doc.name}</p>
                      <p className="text-[11px] text-secondary">
                        {doc.category} • {doc.size} • Uploaded on {doc.uploadDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      DigiLocker Verified
                    </span>
                  </div>
                </div>
              ))}

              {/* Add Additional Document Trigger */}
              <div className="p-4 border-2 border-dashed border-outline-variant rounded-2xl text-center space-y-2 bg-surface-container-lowest">
                <Upload className="w-6 h-6 text-primary mx-auto" />
                <p className="text-xs font-semibold text-on-surface">Attach Additional Certificate / Affidavit</p>
                <div className="flex justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleSimulateDocUpload(
                        'id_proof',
                        'Aadhaar_Offline_eKYC_XML.pdf',
                        'Identity & Address Proof'
                      )
                    }
                    className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-medium"
                  >
                    + Fetch Aadhaar e-KYC
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSimulateDocUpload(
                        'fee_receipt',
                        'Semester_Fee_Receipt_IITD.pdf',
                        'Institutional Fee Receipt'
                      )
                    }
                    className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-medium"
                  >
                    + Attach Fee Receipt
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-semibold text-on-surface"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span>Save & Continue to Step 4</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review, DBT Bank Verification & Final Submission */}
        {currentStep === 4 && (
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/80 shadow-sm space-y-6">
            <div className="pb-4 border-b border-surface-container">
              <h2 className="text-lg font-bold font-headline text-on-surface">
                Step 4: Final Summary & Digital Signature Confirmation
              </h2>
              <p className="text-xs text-secondary">
                Please review all information prior to creating an immutable application entry on the ledger.
              </p>
            </div>

            {/* Scheme Summary */}
            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/60 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase font-label">Applying For</span>
                <h3 className="font-bold text-base font-headline text-on-surface">{scheme.title}</h3>
                <p className="text-xs text-secondary">{scheme.ministry}</p>
              </div>
              <span className="text-lg font-bold text-primary">{scheme.amountFormatted}</span>
            </div>

            {/* Candidate & Bank Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 space-y-2">
                <span className="font-bold text-secondary uppercase font-label text-[10px]">
                  Applicant Credentials
                </span>
                <div className="space-y-1">
                  <p><strong>Name:</strong> {formData.studentName}</p>
                  <p><strong>Institute:</strong> {formData.collegeName}</p>
                  <p><strong>Course:</strong> {formData.course}</p>
                  <p><strong>CGPA / Marks:</strong> {formData.cgpaPercentage}</p>
                  <p><strong>Category:</strong> {formData.category}</p>
                </div>
              </div>

              <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 space-y-2">
                <span className="font-bold text-secondary uppercase font-label text-[10px]">
                  Aadhaar APBS Bank Mapping
                </span>
                <div className="space-y-1">
                  <p><strong>Bank:</strong> {formData.bankName}</p>
                  <p><strong>Account Holder:</strong> {formData.accountHolder}</p>
                  <p><strong>A/c Number:</strong> {formData.accountNumber}</p>
                  <p><strong>IFSC:</strong> {formData.ifsc}</p>
                  <p className="text-emerald-700 font-bold">✓ NPCI Aadhaar Seeding Active</p>
                </div>
              </div>
            </div>

            {/* Undertaking Declaration */}
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Declaration & Legal Undertaking</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                I hereby declare that I am not receiving any other scholarship/stipend from Central/State Government for the same course of study. The particulars provided above are authentic and backed by certified DigiLocker documents.
              </p>
            </div>

            <div className="flex justify-between pt-4 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-semibold text-on-surface"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
              >
                {isSubmitting ? (
                  <span>Submitting to Institutional Verification Queue...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
