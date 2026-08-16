'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useScholarshipData } from '@/context/ScholarshipDataContext';
import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DocumentPreviewModal } from '@/components/common/DocumentPreviewModal';
import { AuditRecordModal } from '@/components/common/AuditRecordModal';
import { DocumentAttachment, VerificationCheckItem, AuditRecord } from '@/types';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function CollegeReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const {
    applications,
    verifyCollegeApplication,
    queryCollegeApplication,
    rejectCollegeApplication,
    auditRecords,
    verifyOnChain,
  } = useScholarshipData();

  const appId = params?.id as string;
  const application = applications.find((a) => a.id === appId) || applications[0];

  const [checklist, setChecklist] = useState<VerificationCheckItem[]>(
    application?.checklist?.length > 0
      ? application.checklist
      : [
          { id: 'c1', label: 'Enrollment & Bonafide Regular Student Status', category: 'academic', status: 'pending' },
          { id: 'c2', label: 'Minimum 75% Attendance in Previous Term (88.4% logged)', category: 'attendance', status: 'passed' },
          { id: 'c3', label: 'Marksheet Authenticity (>80% / 8.0 CGPA match)', category: 'academic', status: 'passed' },
          { id: 'c4', label: 'Annual Income Certificate Validity (< ₹4.5 Lakh)', category: 'financial', status: 'pending' },
          { id: 'c5', label: 'Aadhaar-Seeded Bank Account Verification', category: 'identity', status: 'passed' },
          { id: 'c6', label: 'No Parallel Central Scholarship Undertaking', category: 'financial', status: 'pending' },
        ]
  );

  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [officerNotes, setOfficerNotes] = useState(
    'All academic credentials, semester fees, and attendance criteria verified with ERP database. Recommended for Central Ministry fund sanction.'
  );
  const [queryModalOpen, setQueryModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!application) {
    return (
      <AppShell>
        <div className="p-12 text-center space-y-4">
          <p className="text-sm text-secondary">Application not found in college queue.</p>
          <Link href="/college/dashboard" className="text-xs font-semibold text-primary underline">
            Return to Verification Queue
          </Link>
        </div>
      </AppShell>
    );
  }

  const activeDoc = application.documents[activeDocIndex] || application.documents[0];

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus = item.status === 'passed' ? 'pending' : 'passed';
        return { ...item, status: nextStatus };
      })
    );
  };

  const handleVerifyAndForward = async () => {
    setIsVerifying(true);
    try {
      const result = await verifyOnChain(application.studentId);
      if (result.success) {
        alert(`✅ On-chain verification successful!\nTx Hash: ${result.txHash}`);
      } else {
        alert(`⚠️ Blockchain call note: ${result.error}`);
      }
    } finally {
      setIsVerifying(false);
    }

    verifyCollegeApplication(
      application.id,
      checklist,
      officerNotes,
      currentUser.name || 'Dr. Rajeshwari Menon'
    );
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {}
    router.push('/college/dashboard');
  };

  const handleRaiseQuery = () => {
    if (!actionReason) return;
    queryCollegeApplication(application.id, actionReason, currentUser.name);
    setQueryModalOpen(false);
    alert('Clarification request sent to student.');
    router.push('/college/dashboard');
  };

  const handleReject = () => {
    if (!actionReason) return;
    rejectCollegeApplication(application.id, actionReason, currentUser.name);
    setRejectModalOpen(false);
    alert('Application marked rejected.');
    router.push('/college/dashboard');
  };

  const allPassed = checklist.every((c) => c.status === 'passed');

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <Link
              href="/college/dashboard"
              className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider font-label text-secondary">
                  Institutional Verification Scrutiny
                </span>
                <StatusBadge status={application.status} />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-headline text-on-surface">
                {application.studentName} — {application.scholarshipTitle}
              </h1>
              <p className="text-xs text-secondary font-mono">
                App ID: {application.applicationNumber} • Roll No: {application.studentId} • AISHE: {application.collegeAISHE}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const record = auditRecords.find((r) => r.applicationId === application.id) || auditRecords[0];
                setSelectedAudit(record);
              }}
              className="px-3.5 py-2 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Audit Hash</span>
            </button>
          </div>
        </div>

        {/* Split Screen Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Document Inspection */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl border border-outline-variant/80 shadow-sm overflow-hidden flex flex-col min-h-[640px]">
            <div className="p-3 bg-surface-container-low border-b border-surface-container flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold uppercase font-label text-secondary whitespace-nowrap px-2">
                Attached Documents:
              </span>
              {application.documents.map((doc, idx) => (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    activeDocIndex === idx
                      ? 'bg-surface-container-lowest text-primary font-bold shadow-sm border border-outline-variant/50'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate max-w-[130px]">{doc.name}</span>
                </button>
              ))}
            </div>

            {activeDoc && (
              <div className="flex-1 p-6 bg-surface-container-high/30 flex flex-col justify-between overflow-auto">
                <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-2xl border-2 border-outline-variant/70 shadow-md space-y-4">
                  <div className="flex justify-between items-start pb-3 border-b border-dashed border-outline-variant">
                    <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold font-label">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      DIGILOCKER VERIFIED CERTIFICATE
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      AUTHENTIC 100% MATCH
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <h3 className="font-bold text-base font-headline uppercase text-on-surface">
                      {activeDoc.category}
                    </h3>
                    <p className="text-xs text-secondary">{activeDoc.name}</p>
                  </div>

                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50 space-y-2">
                    <div className="text-[11px] font-bold text-primary uppercase font-label">
                      OCR Extracted Attributes vs Student Form
                    </div>
                    {activeDoc.ocrExtractedData ? (
                      Object.entries(activeDoc.ocrExtractedData).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-xs py-1 border-b border-surface-container-highest last:border-0">
                          <span className="text-secondary font-medium">{k}:</span>
                          <span className="text-on-surface font-bold">{v}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-secondary py-1">Directly fetched from Central Digilocker Depository.</p>
                    )}
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Matched with IIT Delhi Student ERP (Academic Roll 2022CSB1042)</span>
                    </div>
                    <p className="text-[10px] text-emerald-800">
                      Attendance: 88.4% • Regular Enrollment Confirmed • Fees Cleared
                    </p>
                  </div>
                </div>

                <div className="pt-4 text-center text-xs text-secondary font-mono">
                  Document Electronic Signature: 0x8a91...bc99 (Verified by Nodal Officer)
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Checklist & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/80 shadow-sm space-y-6">
              <div className="pb-3 border-b border-surface-container flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-base font-headline text-on-surface">
                    Verification Checklist
                  </h3>
                  <p className="text-xs text-secondary">Check all items to enable approval.</p>
                </div>
                <span className="text-xs font-bold text-primary font-mono">
                  {checklist.filter((c) => c.status === 'passed').length} / {checklist.length} Passed
                </span>
              </div>

              <div className="space-y-2.5">
                {checklist.map((item) => {
                  const isPassed = item.status === 'passed';
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isPassed
                          ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                          : 'bg-surface-container-low border-outline-variant/50 text-on-surface hover:border-primary'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isPassed}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600"
                      />
                      <div className="flex-1 text-xs">
                        <p className={`font-semibold ${isPassed ? 'text-emerald-950' : 'text-on-surface'}`}>
                          {item.label}
                        </p>
                        <span className="text-[10px] text-secondary capitalize font-label">
                          Category: {item.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-surface-container">
                <label className="block text-xs font-semibold text-on-surface font-label">
                  Institutional Scrutiny Remarks & Recommendation
                </label>
                <textarea
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Enter verification notes for central ministry portal..."
                />
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleVerifyAndForward}
                  disabled={isVerifying}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isVerifying ? 'Verifying on Blockchain...' : 'Verify & Forward to Ministry'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActionReason('');
                      setQueryModalOpen(true);
                    }}
                    className="py-2.5 px-3 border border-amber-600/40 text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Raise Query</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActionReason('');
                      setRejectModalOpen(true);
                    }}
                    className="py-2.5 px-3 border border-rose-600/40 text-rose-900 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Query Modal */}
      {queryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 border border-outline-variant shadow-2xl space-y-4">
            <h3 className="font-bold text-base font-headline text-on-surface">Raise Query to Student</h3>
            <p className="text-xs text-secondary">
              The student will receive an immediate notification to furnish clarification or upload missing documents.
            </p>
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              rows={3}
              placeholder="e.g. Please upload latest semester fee receipt with transaction reference..."
              className="w-full text-xs p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setQueryModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-secondary hover:bg-surface-container rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRaiseQuery}
                className="px-4 py-2 bg-amber-800 text-white rounded-lg text-xs font-semibold"
              >
                Send Query
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 border border-outline-variant shadow-2xl space-y-4">
            <h3 className="font-bold text-base font-headline text-rose-900">Reject Application</h3>
            <p className="text-xs text-secondary">
              State the rejection justification. This will be permanently recorded in the cryptographic audit log.
            </p>
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              rows={3}
              placeholder="Reason for rejection (e.g. Attendance below mandatory minimum 75%)..."
              className="w-full text-xs p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-secondary hover:bg-surface-container rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-rose-800 text-white rounded-lg text-xs font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Record Modal */}
      <AuditRecordModal
        record={selectedAudit}
        isOpen={!!selectedAudit}
        onClose={() => setSelectedAudit(null)}
      />
    </AppShell>
  );
}
