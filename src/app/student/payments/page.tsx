'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useScholarshipData } from '@/context/ScholarshipDataContext';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/common/StatCard';
import { AuditRecordModal } from '@/components/common/AuditRecordModal';
import { PaymentRecord, AuditRecord } from '@/types';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Copy,
  Receipt,
  Printer,
  ChevronRight,
  Sparkles,
  Search,
} from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';

export default function StudentPaymentsPage() {
  const { payments, auditRecords } = useScholarshipData();
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(payments[0] || null);

  const totalDisbursed = payments.reduce((sum, p) => sum + p.amount, 0);

  const copyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    alert(`Copied UTR: ${utr}`);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">
                Direct Benefit Transfer (DBT) & Payments
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase font-label">
                PFMS APBS Integrated
              </span>
            </div>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              Live records of scholarship fund releases directly credited to your Aadhaar seeded bank account.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors no-print"
          >
            <Printer className="w-4 h-4" />
            <span>Print DBT Statement</span>
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total DBT Amount Credited"
            value={formatCurrency(totalDisbursed)}
            subtitle="Lifetime Scholarship Sanctions"
            icon={Landmark}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-800"
          />
          <StatCard
            title="Active NPCI Bank Link"
            value="State Bank of India"
            subtitle="A/c Ending in 8912 • Active Seeding"
            icon={ShieldCheck}
            iconBg="bg-primary-container"
            iconColor="text-on-primary-container"
          />
          <StatCard
            title="Disbursement Pipeline"
            value="1 Scheme in Queue"
            subtitle="PM-USP 2026 In Institutional Scrutiny"
            icon={Clock}
            iconBg="bg-amber-100"
            iconColor="text-amber-800"
          />
        </div>

        {/* Transactions Table & Digital Receipt Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Transactions List (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-bold text-lg font-headline text-on-surface">
              Disbursement Transactions History
            </h3>

            <div className="space-y-3">
              {payments.map((p) => {
                const isSelected = selectedPayment?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPayment(p)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer bg-surface-container-lowest ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 shadow-md bg-primary-container/5'
                        : 'border-outline-variant/60 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full uppercase font-label">
                            ✓ {p.mode}
                          </span>
                          <span className="text-[11px] font-mono text-secondary">
                            Ref: {p.transactionId}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm font-headline text-on-surface">
                          {p.scholarshipTitle}
                        </h4>
                        <p className="text-xs text-secondary font-mono">
                          PFMS UTR: <strong className="text-on-surface">{p.utrNumber}</strong>
                        </p>
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <span className="text-lg font-bold font-headline text-emerald-800">
                          +{formatCurrency(p.amount)}
                        </span>
                        <p className="text-[10px] text-secondary">{formatDate(p.creditDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-container text-xs">
                      <span className="text-secondary text-[11px]">
                        Bank: {p.bankName} (••••{p.accountEnding})
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const record = auditRecords.find((r) => r.applicationId === p.applicationNumber) || auditRecords[0];
                          setSelectedAudit(record);
                        }}
                        className="text-primary font-semibold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Audit Hash: {p.integrityHash.slice(0, 12)}...
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Electronic Sanction Receipt (Col 5) */}
          <div className="lg:col-span-5">
            {selectedPayment && (
              <div className="sticky top-20 p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-md space-y-6">
                <div className="pb-4 border-b border-surface-container flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-base font-headline text-on-surface">
                        Official DBT Electronic Receipt
                      </h3>
                    </div>
                    <p className="text-xs text-secondary mt-0.5">Government of India Public Finance Portal</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase font-label">
                    PAID / SETTLED
                  </span>
                </div>

                {/* Receipt Amount Box */}
                <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 text-center space-y-1">
                  <span className="text-xs text-secondary uppercase font-label">Total Credited Amount</span>
                  <p className="text-3xl font-bold font-headline text-emerald-800">
                    {formatCurrency(selectedPayment.amount)}
                  </p>
                  <p className="text-[11px] text-secondary font-mono">
                    Credited on {formatDateTime(selectedPayment.creditDate)}
                  </p>
                </div>

                {/* Receipt Field Rows */}
                <div className="space-y-2 text-xs divide-y divide-surface-container">
                  <div className="flex justify-between py-1.5">
                    <span className="text-secondary font-medium">Scholarship Scheme:</span>
                    <span className="font-semibold text-on-surface text-right max-w-[200px] truncate">
                      {selectedPayment.scholarshipTitle}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-secondary font-medium">Application Reference:</span>
                    <span className="font-mono text-on-surface">{selectedPayment.applicationNumber}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-secondary font-medium">PFMS UTR Number:</span>
                    <span className="font-mono font-bold text-primary flex items-center gap-1">
                      {selectedPayment.utrNumber}
                      <button onClick={() => copyUtr(selectedPayment.utrNumber)} title="Copy UTR">
                        <Copy className="w-3 h-3 text-secondary hover:text-primary" />
                      </button>
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-secondary font-medium">Beneficiary Bank:</span>
                    <span className="font-semibold text-on-surface">{selectedPayment.bankName}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-secondary font-medium">Masked Account:</span>
                    <span className="font-mono text-on-surface">•••• •••• {selectedPayment.accountEnding}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-secondary font-medium">Clearing Channel:</span>
                    <span className="text-on-surface">{selectedPayment.mode} (RBI APBS)</span>
                  </div>
                </div>

                {/* Stage timeline */}
                <div className="space-y-2 pt-2 border-t border-surface-container">
                  <span className="text-[11px] font-bold uppercase font-label text-secondary">
                    Payment Clearing Pipeline
                  </span>
                  <div className="space-y-2">
                    {selectedPayment.stageTimeline.map((st, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-on-surface">{st.stage}</span>
                        </div>
                        <span className="text-[10px] text-secondary font-mono">{formatDate(st.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const record = auditRecords.find((r) => r.applicationId === selectedPayment.applicationNumber) || auditRecords[0];
                      setSelectedAudit(record);
                    }}
                    className="w-full py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Verify Digital Signature Certificate</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audit Modal */}
      <AuditRecordModal
        record={selectedAudit}
        isOpen={!!selectedAudit}
        onClose={() => setSelectedAudit(null)}
      />
    </AppShell>
  );
}
