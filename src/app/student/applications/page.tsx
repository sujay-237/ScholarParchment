'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useScholarshipData } from '@/context/ScholarshipDataContext';
import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DocumentPreviewModal } from '@/components/common/DocumentPreviewModal';
import { AuditRecordModal } from '@/components/common/AuditRecordModal';
import { DocumentAttachment, AuditRecord } from '@/types';
import {
  FileEdit,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  ChevronRight,
  Landmark,
  Eye,
  Calendar,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function StudentApplicationsPage() {
  const { currentUser } = useAuth();
  const { applications, auditRecords } = useScholarshipData();
  const [filterTab, setFilterTab] = useState<'all' | 'in_review' | 'approved' | 'disbursed'>('all');
  const [selectedDoc, setSelectedDoc] = useState<DocumentAttachment | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null);

  const myApplications = applications.filter(
    (a) => a.studentId === currentUser.id || a.studentName === 'Aarav Sharma'
  );

  const filteredApps = myApplications.filter((app) => {
    if (filterTab === 'in_review') {
      return app.status === 'college_pending' || app.status === 'college_verified' || app.status === 'submitted';
    }
    if (filterTab === 'approved') {
      return app.status === 'ministry_approved';
    }
    if (filterTab === 'disbursed') {
      return app.status === 'disbursed';
    }
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">
              Application Workspace
            </h1>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              Manage, monitor, and submit new scholarship grant requests with DigiLocker verified proofs.
            </p>
          </div>

          <Link
            href="/student/explorer"
            className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Scheme Application</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-surface-container pb-2 text-xs">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              filterTab === 'all'
                ? 'bg-primary text-white font-semibold'
                : 'text-secondary hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            All Applications ({myApplications.length})
          </button>
          <button
            onClick={() => setFilterTab('in_review')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              filterTab === 'in_review'
                ? 'bg-amber-800 text-white font-semibold'
                : 'text-secondary hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            In Scrutiny / Review
          </button>
          <button
            onClick={() => setFilterTab('approved')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              filterTab === 'approved'
                ? 'bg-blue-800 text-white font-semibold'
                : 'text-secondary hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            Ministry Sanctioned
          </button>
          <button
            onClick={() => setFilterTab('disbursed')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              filterTab === 'disbursed'
                ? 'bg-emerald-800 text-white font-semibold'
                : 'text-secondary hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            DBT Disbursed
          </button>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/80 shadow-sm hover:border-primary/60 transition-all space-y-5"
            >
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={app.status} />
                    <span className="text-xs font-mono text-secondary">
                      App ID: {app.applicationNumber}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-headline text-on-surface">
                    {app.scholarshipTitle}
                  </h3>
                  <p className="text-xs text-secondary">
                    {app.ministry} • Institution: {app.collegeName}
                  </p>
                </div>

                <div className="text-right whitespace-nowrap">
                  <span className="text-xl font-bold font-headline text-primary">
                    {formatCurrency(app.amount)}
                  </span>
                  <p className="text-[10px] text-secondary font-label">Grant Amount</p>
                </div>
              </div>

              {/* Progress Stepper Line */}
              <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold font-label text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    Verification Lifecycle Timeline
                  </span>
                  <button
                    onClick={() => {
                      const record = auditRecords.find((r) => r.applicationId === app.id) || auditRecords[0];
                      setSelectedAudit(record);
                    }}
                    className="text-primary hover:underline text-[11px] flex items-center gap-1 font-mono"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Audit Hash: {app.integrityHash.slice(0, 14)}...
                  </button>
                </div>

                {/* Stages Progression */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 text-xs">
                  <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-on-surface text-[11px]">Submitted</p>
                      <p className="text-[10px] text-secondary">{formatDate(app.submittedDate)}</p>
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    app.status === 'college_verified' || app.status === 'ministry_approved' || app.status === 'disbursed'
                      ? 'bg-surface-container-lowest border-emerald-300 text-emerald-800'
                      : app.status === 'college_pending'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-surface-container border-transparent opacity-60'
                  }`}>
                    {app.status === 'college_verified' || app.status === 'ministry_approved' || app.status === 'disbursed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-[11px]">College Scrutiny</p>
                      <p className="text-[10px] text-secondary">
                        {app.collegeVerifiedDate ? formatDate(app.collegeVerifiedDate) : 'In Queue'}
                      </p>
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    app.status === 'ministry_approved' || app.status === 'disbursed'
                      ? 'bg-surface-container-lowest border-emerald-300 text-emerald-800'
                      : 'bg-surface-container border-transparent opacity-60'
                  }`}>
                    {app.status === 'ministry_approved' || app.status === 'disbursed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-secondary shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-[11px]">Ministry Sanction</p>
                      <p className="text-[10px] text-secondary">
                        {app.ministrySanctionNumber ? 'Sanctioned' : 'Awaiting'}
                      </p>
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    app.status === 'disbursed'
                      ? 'bg-surface-container-lowest border-emerald-300 text-emerald-800'
                      : 'bg-surface-container border-transparent opacity-60'
                  }`}>
                    {app.status === 'disbursed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Landmark className="w-4 h-4 text-secondary shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-[11px]">DBT Disbursed</p>
                      <p className="text-[10px] text-secondary">
                        {app.utrNumber ? `UTR: ${app.utrNumber.slice(0, 8)}...` : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Documents Row */}
              {app.documents.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-secondary uppercase font-label">
                    Certified Attached Documents ({app.documents.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {app.documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs text-on-surface border border-outline-variant/60 flex items-center gap-2 transition-colors group"
                      >
                        <FileText className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="truncate max-w-[180px]">{doc.name}</span>
                        <Eye className="w-3 h-3 text-secondary" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* College Notes if any */}
              {app.collegeReviewNotes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
                  <strong>Nodal Officer Remarks ({app.collegeVerifiedBy || 'IIT Delhi'}):</strong>{' '}
                  {app.collegeReviewNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Document Inspector Modal */}
      <DocumentPreviewModal
        document={selectedDoc}
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />

      {/* Audit Modal */}
      <AuditRecordModal
        record={selectedAudit}
        isOpen={!!selectedAudit}
        onClose={() => setSelectedAudit(null)}
      />
    </AppShell>
  );
}
