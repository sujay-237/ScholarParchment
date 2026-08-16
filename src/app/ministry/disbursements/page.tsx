'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useScholarshipData } from '@/context/ScholarshipDataContext';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/common/StatCard';
import { DisbursementBatch } from '@/types';
import {
  FileSignature,
  Landmark,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Layers,
  KeyRound,
} from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import confetti from 'canvas-confetti';

// Demo wallet addresses for mock students (Hardhat test accounts)
const DEMO_WALLET_MAP: Record<string, string> = {
  'STU-2026-8941': '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  'STU-2026-7731': '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  'STU-2026-6219': '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
};

export default function MinistryDisbursementWorkspacePage() {
  const { currentUser } = useAuth();
  const {
    batches,
    applications,
    executeDisbursementBatch,
    disburseOnChain,
  } = useScholarshipData();

  const [selectedBatch, setSelectedBatch] = useState<DisbursementBatch | null>(batches[0] || null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const totalSanctionedAcrossBatches = batches.reduce((sum, b) => sum + b.totalAmount, 0);

  const handleAuthorizeBatch = async (batchId: string) => {
    setIsAuthorizing(true);
    const batch = batches.find((b) => b.id === batchId);

    if (batch) {
      // Call on-chain disburse for each application in the batch
      for (const appId of batch.applications) {
        const app = applications.find((a) => a.id === appId);
        if (app) {
          const walletAddress = DEMO_WALLET_MAP[app.studentId];
          if (walletAddress) {
            try {
              const result = await disburseOnChain(walletAddress);
              if (result.success) {
                console.log(`✅ Disbursed to ${app.studentName}: ${result.txHash}`);
              } else {
                console.warn(`⚠️ Disbursement note for ${app.studentName}: ${result.error}`);
              }
            } catch (e) {
              console.error(`Disbursement error for ${app.studentName}:`, e);
            }
          }
        }
      }
    }

    executeDisbursementBatch(batchId, currentUser.name || 'Shri Vikramaditya Roy, IAS');
    setIsAuthorizing(false);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {}
    alert(`Batch authorized and released! DBT APBS Clearing Order dispatched to Reserve Bank of India gateway.`);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low p-6 rounded-3xl border border-outline-variant/60">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">
                Ministry Approval & DBT Disbursement Workspace
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase font-label">
                PFMS Gateway Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              Sign sanction files with Class 3 DSC tokens and release batch funds to Aadhaar seeded bank accounts.
            </p>
          </div>

          <div className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-semibold text-emerald-800 font-label">
              DSC Token: Ready (IAS-DIR-042)
            </span>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Batch Value"
            value={formatCurrency(totalSanctionedAcrossBatches)}
            subtitle="Processed across central heads"
            icon={Landmark}
            iconBg="bg-primary-container"
            iconColor="text-on-primary-container"
          />
          <StatCard
            title="Total Beneficiaries"
            value="27,270 Students"
            subtitle="Matched with NPCI Aadhaar Mapper"
            icon={CheckCircle2}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-800"
          />
          <StatCard
            title="Pending DSC Authorization"
            value={batches.filter((b) => b.status === 'pending_approval').length.toString()}
            subtitle="Awaiting Joint Secretary Sign-off"
            icon={Clock}
            iconBg="bg-amber-100"
            iconColor="text-amber-800"
          />
        </div>

        {/* Main Split Grid: Batches Queue + Authorization Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Batches Queue (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-bold text-lg font-headline text-on-surface">
              Disbursement Batches ({batches.length})
            </h3>

            <div className="space-y-3">
              {batches.map((batch) => {
                const isSelected = selectedBatch?.id === batch.id;
                return (
                  <div
                    key={batch.id}
                    onClick={() => setSelectedBatch(batch)}
                    className={`p-6 rounded-3xl border transition-all cursor-pointer bg-surface-container-lowest ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 shadow-md bg-primary-container/5'
                        : 'border-outline-variant/60 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-label ${
                            batch.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : batch.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {batch.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-mono text-secondary">
                            {batch.batchNumber}
                          </span>
                        </div>
                        <h4 className="font-bold text-base font-headline text-on-surface">
                          {batch.schemeTitle}
                        </h4>
                        <p className="text-xs text-secondary font-mono">
                          PFMS Ref: {batch.pfmsReferenceId} • {batch.totalApplications.toLocaleString('en-IN')} Candidates
                        </p>
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <p className="text-lg font-bold font-headline text-primary">
                          {formatCurrency(batch.totalAmount)}
                        </p>
                        <p className="text-[10px] text-secondary font-label">
                          Created {formatDate(batch.createdDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-4 border-t border-surface-container text-xs">
                      <span className="text-secondary text-[11px]">
                        Authorized By: {batch.authorizedBy}
                      </span>

                      {batch.status === 'pending_approval' ? (
                        <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-amber-600" />
                          Ready for Release
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Settled via APBS
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Authorization Workspace & Digital Signature Controller (Col 5) */}
          <div className="lg:col-span-5">
            {selectedBatch && (
              <div className="sticky top-20 p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-md space-y-6">
                <div className="pb-4 border-b border-surface-container flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base font-headline text-on-surface flex items-center gap-2">
                      <FileSignature className="w-5 h-5 text-primary" />
                      <span>Sanction Order & DSC Signing</span>
                    </h3>
                    <p className="text-xs text-secondary mt-0.5">
                      Batch ID: <span className="font-mono font-bold text-on-surface">{selectedBatch.batchNumber}</span>
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-label ${
                    selectedBatch.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedBatch.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Batch Stat Box */}
                <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-secondary">Gross Sanction Value:</span>
                    <span className="text-lg font-bold font-headline text-primary">
                      {formatCurrency(selectedBatch.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-secondary">Beneficiary Count:</span>
                    <span className="font-bold text-on-surface">
                      {selectedBatch.totalApplications.toLocaleString('en-IN')} Scholars
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-secondary">Clearing Mechanism:</span>
                    <span className="font-semibold text-on-surface">RBI Aadhaar Payment Bridge (APBS)</span>
                  </div>
                </div>

                {/* Digital Token Assurance */}
                <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-950">
                  <div className="flex items-center gap-2 font-bold font-label">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Cryptographic Digital Signature Sign-Off</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Executing this action attaches a verifiable digital signature (PKI Class 3) to the PFMS payment file and immediately triggers Aadhaar Direct Benefit Transfer into all beneficiary bank accounts.
                  </p>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  {selectedBatch.status === 'pending_approval' ? (
                    <button
                      onClick={() => handleAuthorizeBatch(selectedBatch.id)}
                      disabled={isAuthorizing}
                      className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      {isAuthorizing ? (
                        <span>Applying DSC Signature & Transmitting to PFMS...</span>
                      ) : (
                        <>
                          <FileSignature className="w-4 h-4" />
                          <span>Sign with DSC & Disburse Funds via DBT</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="p-3 bg-surface-container rounded-xl text-center text-xs text-secondary font-medium">
                      ✓ Batch successfully released on {formatDateTime(selectedBatch.approvedDate || selectedBatch.createdDate)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
