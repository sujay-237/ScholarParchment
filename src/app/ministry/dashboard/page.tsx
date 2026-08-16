'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useScholarshipData } from '@/context/ScholarshipDataContext';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AuditRecordModal } from '@/components/common/AuditRecordModal';
import { AuditRecord, Application } from '@/types';
import {
  FileSignature,
  CheckCircle2,
  Clock,
  Landmark,
  Layers,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function MinistryDashboardPage() {
  const { currentUser } = useAuth();
  const {
    applications,
    batches,
    approveMinistryApplication,
    createDisbursementBatch,
    auditRecords,
    allocateOnChain,
  } = useScholarshipData();

  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null);
  const [isSanctioning, setIsSanctioning] = useState<string | null>(null);

  const collegeVerifiedApps = applications.filter(
    (a) => a.status === 'college_verified' || a.status === 'ministry_pending'
  );

  const sanctionedApps = applications.filter(
    (a) => a.status === 'ministry_approved'
  );

  const handleApproveSanction = async (app: Application) => {
    setIsSanctioning(app.id);
    try {
      // Convert INR amount to Wei (e.g. 20,000 INR -> 0.02 ETH = 2e16 wei)
      const weiAmount = (BigInt(app.amount) * BigInt(10 ** 12)).toString();
      const result = await allocateOnChain(app.studentId, weiAmount);
      if (result.success) {
        alert(`✅ On-chain allocation successful!\nTx Hash: ${result.txHash}`);
      } else {
        alert(`⚠️ Blockchain call note: ${result.error}`);
      }
    } finally {
      setIsSanctioning(null);
    }

    approveMinistryApplication(
      app.id,
      `Sanction approved under Head 2202 by ${currentUser.name}`,
      currentUser.name || 'Shri Vikramaditya Roy, IAS'
    );
    try {
      confetti({ particleCount: 80, spread: 60 });
    } catch {}
  };

  const handleCreateBatchFromSanctioned = () => {
    if (sanctionedApps.length === 0) {
      alert('No sanctioned applications pending batch creation. Sanction applications first!');
      return;
    }
    const appIds = sanctionedApps.map((a) => a.id);
    createDisbursementBatch(
      'PMS-CENTRAL-2026',
      'Central Combined Merit Sanctions Batch',
      appIds,
      currentUser.name || 'Shri Vikramaditya Roy, IAS'
    );
    alert(`Created new disbursement batch with ${sanctionedApps.length} beneficiaries!`);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low p-6 rounded-3xl border border-outline-variant/60">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">
                Ministry Command Center
              </h1>
              <span className="bg-tertiary-container text-on-tertiary-container text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase font-label">
                Department of Higher Education
              </span>
            </div>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              Joint Secretary & Sanctioning Authority: <strong className="text-on-surface">{currentUser.name}</strong> • Govt. of India
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ministry/disbursements"
              className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <FileSignature className="w-4 h-4" />
              <span>Disbursement Workspace</span>
            </Link>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Scheme Budget"
            value="₹ 1,200 Cr"
            subtitle="Central Head 2202 (FY 2026-27)"
            icon={Landmark}
            iconBg="bg-primary-container"
            iconColor="text-on-primary-container"
          />
          <StatCard
            title="Disbursed via DBT"
            value="₹ 892.5 Cr"
            subtitle="74.3% Budget Utilized"
            icon={CheckCircle2}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-800"
          />
          <StatCard
            title="College Verified Queue"
            value={`${collegeVerifiedApps.length} Students`}
            subtitle="Awaiting Ministry Sanction"
            icon={Clock}
            iconBg="bg-blue-100"
            iconColor="text-blue-800"
          />
          <StatCard
            title="Active Batches"
            value={batches.length}
            subtitle="PFMS APBS Gateway Files"
            icon={Layers}
            iconBg="bg-surface-container-high"
            iconColor="text-secondary"
          />
        </div>

        {/* Primary Review Queue Section */}
        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/80 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-surface-container">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-headline text-on-surface">
                  Verified Applications Awaiting Central Sanction
                </h2>
                <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-0.5 rounded-full font-label">
                  {collegeVerifiedApps.length} Ready
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Students whose bona fide attendance and marksheets have been certified by institute Nodal Officers.
              </p>
            </div>

            {sanctionedApps.length > 0 && (
              <button
                onClick={handleCreateBatchFromSanctioned}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Layers className="w-4 h-4" />
                <span>Group {sanctionedApps.length} Sanctioned into PFMS Batch</span>
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-container text-[11px] font-bold text-secondary font-label uppercase tracking-wider bg-surface-container-low">
                  <th className="py-3 px-4 rounded-l-xl">Applicant & ID</th>
                  <th className="py-3 px-4">Scheme & Ministry</th>
                  <th className="py-3 px-4">College Verification</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {collegeVerifiedApps.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-on-surface text-sm font-headline">
                        {app.studentName}
                      </div>
                      <div className="font-mono text-[10px] text-secondary">
                        {app.applicationNumber} • {app.collegeName}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-medium text-on-surface line-clamp-1 max-w-xs">
                        {app.scholarshipTitle}
                      </div>
                      <div className="text-[10px] text-secondary">{app.category} • CGPA: {app.cgpaPercentage}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-emerald-800 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified by {app.collegeVerifiedBy || 'IIT Delhi'}</span>
                      </div>
                      <div className="text-[10px] text-secondary line-clamp-1">
                        {app.collegeReviewNotes || 'Attendance & Marksheet certified.'}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-primary text-sm font-headline whitespace-nowrap">
                      {formatCurrency(app.amount)}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleApproveSanction(app)}
                        disabled={isSanctioning === app.id}
                        className="px-3.5 py-1.5 bg-primary text-white hover:bg-primary/90 disabled:bg-primary/50 rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto shadow-sm transition-all"
                      >
                        <FileSignature className="w-3.5 h-3.5" />
                        <span>{isSanctioning === app.id ? 'Allocating...' : 'Issue Sanction Order'}</span>
                      </button>
                    </td>
                  </tr>
                ))}

                {collegeVerifiedApps.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-secondary text-xs">
                      No new applications pending Ministry sanction at this time.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* National Budget Allocations & State Heatmap Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/80 shadow-sm space-y-4">
            <h3 className="font-bold text-base font-headline text-on-surface flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Scheme-wise Budget Disbursement Rates</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-medium text-on-surface">PM-USP Higher Education Scheme</span>
                  <span className="font-mono font-bold text-primary">₹ 420 Cr / ₹ 500 Cr (84%)</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="w-[84%] h-full bg-primary rounded-full" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-medium text-on-surface">AICTE Pragati Girls STEM Scheme</span>
                  <span className="font-mono font-bold text-primary">₹ 140 Cr / ₹ 180 Cr (77%)</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="w-[77%] h-full bg-primary rounded-full" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-medium text-on-surface">Post-Matric Central Scheme (SC/ST)</span>
                  <span className="font-mono font-bold text-primary">₹ 332 Cr / ₹ 520 Cr (64%)</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="w-[64%] h-full bg-primary rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/80 shadow-sm space-y-4">
            <h3 className="font-bold text-base font-headline text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>National PFMS APBS Gateway Health</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                <span className="text-[10px] text-secondary font-label uppercase">Aadhaar Mapper Success</span>
                <p className="text-xl font-bold font-headline text-emerald-800 mt-0.5">99.82 %</p>
                <span className="text-[10px] text-secondary">Zero Failure Reversals</span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                <span className="text-[10px] text-secondary font-label uppercase">Avg Disbursement Turnaround</span>
                <p className="text-xl font-bold font-headline text-primary mt-0.5">3.2 Days</p>
                <span className="text-[10px] text-secondary">From Sanction to Credit</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Direct integration with Reserve Bank of India APBS clearing engine operational.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Record Modal */}
      <AuditRecordModal
        record={selectedAudit}
        isOpen={!!selectedAudit}
        onClose={() => setSelectedAudit(null)}
      />
    </AppShell>
  );
}
