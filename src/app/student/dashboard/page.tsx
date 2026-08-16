'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useScholarshipData } from '@/context/ScholarshipDataContext';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AuditRecordModal } from '@/components/common/AuditRecordModal';
import { AuditRecord } from '@/types';
import {
  GraduationCap,
  Sparkles,
  Search,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  Landmark,
  ShieldCheck,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function StudentDashboardPage() {
  const { currentUser } = useAuth();
  const { applications, scholarships, payments, auditRecords } = useScholarshipData();
  const [selectedAuditRecord, setSelectedAuditRecord] = useState<AuditRecord | null>(null);

  // Student specific applications
  const myApplications = applications.filter(
    (a) => a.studentId === currentUser.id || a.studentName === 'Aarav Sharma'
  );

  const activeApp = myApplications.find((a) => a.status !== 'disbursed' && a.status !== 'rejected') || myApplications[0];

  const totalDisbursed = payments.reduce((sum, p) => sum + p.amount, 0);

  const getStageProgress = (status: string) => {
    switch (status) {
      case 'draft':
        return 10;
      case 'submitted':
      case 'college_pending':
        return 35;
      case 'college_verified':
      case 'ministry_pending':
        return 70;
      case 'ministry_approved':
        return 88;
      case 'disbursed':
        return 100;
      default:
        return 20;
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/60">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">
                Welcome back, {currentUser.name}!
              </h1>
              <span className="bg-primary-container text-on-primary-container text-[11px] font-bold px-2 py-0.5 rounded-full uppercase font-label">
                Verified Student
              </span>
            </div>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              Roll No: <span className="font-mono">{currentUser.studentId || '2022CSB1042'}</span> • {currentUser.institution}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/student/explorer"
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-xs flex items-center gap-2 shadow-sm transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Explore New Scholarships</span>
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Applications"
            value={myApplications.length}
            subtitle="Central & Institute Schemes"
            icon={FileText}
            iconBg="bg-primary-container"
            iconColor="text-on-primary-container"
          />
          <StatCard
            title="Total Aid Received"
            value={formatCurrency(totalDisbursed)}
            subtitle="Disbursed via DBT APBS"
            icon={Landmark}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-800"
          />
          <StatCard
            title="Verification Status"
            value={activeApp ? activeApp.status.replace('_', ' ').toUpperCase() : 'ALL CLEAR'}
            subtitle="Stage 2: Institute Scrutiny"
            icon={ShieldCheck}
            iconBg="bg-amber-100"
            iconColor="text-amber-800"
          />
          <StatCard
            title="Upcoming Deadlines"
            value="3 Schemes"
            subtitle="Closing within 30 days"
            icon={Calendar}
            iconBg="bg-surface-container-high"
            iconColor="text-secondary"
          />
        </div>

        {/* Primary Workspace Section: Active Application Tracker */}
        {activeApp && (
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-surface-container">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider font-label text-primary">
                    Live Application Lifecycle
                  </span>
                  <StatusBadge status={activeApp.status} />
                </div>
                <h2 className="text-xl font-bold font-headline text-on-surface">
                  {activeApp.scholarshipTitle}
                </h2>
                <p className="text-xs text-secondary mt-0.5">
                  Application ID: <span className="font-mono">{activeApp.applicationNumber}</span> • Submitted on {formatDate(activeApp.submittedDate)}
                </p>
              </div>

              <div className="text-right flex items-center gap-2">
                <Link
                  href={`/student/applications`}
                  className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold transition-colors"
                >
                  View Workspace & Documents
                </Link>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-secondary font-label">
                <span>Application Progress</span>
                <span className="font-bold text-on-surface">{getStageProgress(activeApp.status)}% Completed</span>
              </div>
              <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                <div
                  style={{ width: `${getStageProgress(activeApp.status)}%` }}
                  className="h-full bg-primary rounded-full transition-all duration-500"
                />
              </div>

              {/* 4 Stage Timeline Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-surface-container-low rounded-xl border border-emerald-300/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Submission</span>
                  </div>
                  <p className="text-[11px] text-secondary mt-1">e-KYC & Digilocker Attached</p>
                </div>

                <div className={`p-3 rounded-xl border ${
                  activeApp.status === 'college_verified' || activeApp.status === 'ministry_approved' || activeApp.status === 'disbursed'
                    ? 'bg-surface-container-low border-emerald-300/60 text-emerald-800'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {activeApp.status === 'college_verified' || activeApp.status === 'ministry_approved' || activeApp.status === 'disbursed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-600" />
                    )}
                    <span>2. College Scrutiny</span>
                  </div>
                  <p className="text-[11px] text-secondary mt-1">
                    {activeApp.status === 'college_pending' ? 'In Queue with Nodal Officer' : 'Verified by Institute'}
                  </p>
                </div>

                <div className={`p-3 rounded-xl border ${
                  activeApp.status === 'ministry_approved' || activeApp.status === 'disbursed'
                    ? 'bg-surface-container-low border-emerald-300/60 text-emerald-800'
                    : 'bg-surface-container-lowest border-surface-container text-secondary'
                }`}>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {activeApp.status === 'ministry_approved' || activeApp.status === 'disbursed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-secondary/60" />
                    )}
                    <span>3. Ministry Sanction</span>
                  </div>
                  <p className="text-[11px] text-secondary mt-1">DSC Digitally Signed Order</p>
                </div>

                <div className={`p-3 rounded-xl border ${
                  activeApp.status === 'disbursed'
                    ? 'bg-surface-container-low border-emerald-300/60 text-emerald-800'
                    : 'bg-surface-container-lowest border-surface-container text-secondary'
                }`}>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {activeApp.status === 'disbursed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Landmark className="w-4 h-4 text-secondary/60" />
                    )}
                    <span>4. Direct Benefit (DBT)</span>
                  </div>
                  <p className="text-[11px] text-secondary mt-1">PFMS Direct Bank Credit</p>
                </div>
              </div>
            </div>

            {/* Application Details Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40">
                <span className="text-[11px] text-secondary font-label uppercase">Sanction Amount</span>
                <p className="text-lg font-bold font-headline text-primary mt-0.5">
                  {formatCurrency(activeApp.amount)}
                </p>
                <span className="text-[10px] text-secondary">Annual Direct Credit</span>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40">
                <span className="text-[11px] text-secondary font-label uppercase">Bank DBT Mapping</span>
                <p className="text-sm font-semibold text-on-surface mt-0.5">
                  {activeApp.bankAccount.bankName}
                </p>
                <span className="text-[10px] text-emerald-700 font-mono">
                  A/c {activeApp.bankAccount.accountNumber} • NPCI Active
                </span>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40">
                <span className="text-[11px] text-secondary font-label uppercase">Audit Integrity Hash</span>
                <p className="text-xs font-mono text-primary truncate mt-0.5">
                  {activeApp.integrityHash}
                </p>
                <button
                  onClick={() => {
                    const record = auditRecords.find((r) => r.applicationId === activeApp.id) || auditRecords[0];
                    setSelectedAuditRecord(record);
                  }}
                  className="text-[11px] text-primary font-semibold hover:underline mt-0.5 block"
                >
                  Verify Cryptographic Certificate →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Scholarships & Recent Transactions Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recommended Scholarships (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg font-headline text-on-surface">
                  Recommended Schemes for You
                </h3>
                <p className="text-xs text-secondary">
                  Matched based on your IIT Delhi enrollment and B.Tech CSE profile.
                </p>
              </div>
              <Link
                href="/student/explorer"
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <span>View All ({scholarships.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {scholarships.slice(0, 3).map((sch) => (
                <div
                  key={sch.id}
                  className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 hover:border-primary hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-container text-on-primary-container uppercase font-label">
                        {sch.category}
                      </span>
                      <h4 className="font-bold text-sm font-headline text-on-surface mt-1.5">
                        {sch.title}
                      </h4>
                      <p className="text-xs text-secondary mt-0.5">{sch.ministry}</p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <span className="text-base font-bold font-headline text-primary">
                        {sch.amountFormatted}
                      </span>
                      <p className="text-[10px] text-secondary">{sch.frequency}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-surface-container text-xs">
                    <div className="flex items-center gap-2 text-secondary">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Closes in {sch.daysRemaining} days</span>
                    </div>

                    <Link
                      href={`/student/apply/${sch.id}`}
                      className="px-3.5 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Payments & Disbursement Records (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg font-headline text-on-surface">
                  DBT Payment Records
                </h3>
                <p className="text-xs text-secondary">Direct RBI APBS transfers</p>
              </div>
              <Link
                href="/student/payments"
                className="text-xs text-primary font-semibold hover:underline"
              >
                Full History
              </Link>
            </div>

            <div className="space-y-3">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-xs text-on-surface">{p.scholarshipTitle}</p>
                      <p className="text-[10px] text-secondary font-mono mt-0.5">UTR: {p.utrNumber}</p>
                    </div>
                    <span className="text-sm font-bold font-headline text-emerald-800">
                      +{formatCurrency(p.amount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-surface-container text-[11px] text-secondary">
                    <span>{formatDate(p.creditDate)} • {p.bankName}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      ✓ Credited
                    </span>
                  </div>
                </div>
              ))}

              <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/60 text-xs text-secondary space-y-2">
                <div className="flex items-center gap-2 font-bold text-on-surface font-label">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Aadhaar Payment Bridge Ready</span>
                </div>
                <p className="text-[11px]">
                  Your Aadhaar ending in <span className="font-mono font-bold">8842</span> is linked to State Bank of India for DBT transfers without third-party delay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cryptographic Audit Modal */}
      <AuditRecordModal
        record={selectedAuditRecord}
        isOpen={!!selectedAuditRecord}
        onClose={() => setSelectedAuditRecord(null)}
      />
    </AppShell>
  );
}
