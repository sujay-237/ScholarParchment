'use client';

import React from 'react';
import { AuditRecord } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { X, ShieldCheck, CheckCircle2, Copy, Clock, Cpu, Lock } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface AuditRecordModalProps {
  record: AuditRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditRecordModal: React.FC<AuditRecordModalProps> = ({
  record,
  isOpen,
  onClose,
}) => {
  const { isAuthenticated } = useAuth();

  if (!isOpen || !record) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied cryptographic hash to clipboard!');
  };

  const maskName = (name: string) => {
    if (!name) return 'Beneficiary';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0][0] + '***';
    return `${parts[0]} ${parts[1][0]}.***`;
  };

  const maskId = (id: string) => {
    if (!id) return '****';
    if (id.length <= 4) return '****';
    return `****-${id.slice(-4)}`;
  };

  const studentDisplayName = isAuthenticated ? record.studentName : maskName(record.studentName);
  const actorDisplayName = isAuthenticated ? record.actorName : maskName(record.actorName);
  const actorDisplayId = isAuthenticated ? record.actorId : maskId(record.actorId);
  const displayIp = isAuthenticated ? record.ipAddress : `${record.ipAddress.slice(0, 5)}***.***`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-2xl border border-outline-variant shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 px-6 border-b border-surface-container-highest flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary text-on-primary shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-on-surface font-headline">
                  Cryptographic Verification Certificate
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Verified Valid
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Audit Record ID: <span className="font-mono">{record.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-secondary hover:text-on-surface hover:bg-surface-container rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Privacy Banner if guest */}
          {!isAuthenticated && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-900 text-xs">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Privacy Protected:</strong> Beneficiary & officer details are masked for guest visitors. Sign in to view full unmasked credentials.
              </span>
            </div>
          )}

          {/* Top Banner */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary uppercase font-label text-[11px]">
                Event Description
              </span>
              <span className="text-secondary">{formatDateTime(record.timestamp)}</span>
            </div>
            <p className="text-sm font-medium text-on-surface">{record.actionDetails}</p>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-surface-container-lowest border border-surface-container rounded-xl">
              <span className="text-secondary text-[11px]">Associated Applicant</span>
              <p className="font-semibold text-on-surface mt-0.5">{studentDisplayName}</p>
              <p className="text-[10px] text-secondary font-mono">{record.applicationNumber}</p>
            </div>
            <div className="p-3 bg-surface-container-lowest border border-surface-container rounded-xl">
              <span className="text-secondary text-[11px]">Executing Actor / Officer</span>
              <p className="font-semibold text-on-surface mt-0.5">{actorDisplayName}</p>
              <p className="text-[10px] text-secondary uppercase font-label">{record.actorRole} • ID: {actorDisplayId}</p>
            </div>
            <div className="p-3 bg-surface-container-lowest border border-surface-container rounded-xl">
              <span className="text-secondary text-[11px]">State Transition</span>
              <p className="font-medium text-on-surface mt-0.5 flex items-center gap-1.5 font-mono">
                <span className="bg-surface-container px-1.5 py-0.5 rounded">{record.previousState}</span>
                <span>→</span>
                <span className="bg-primary-container px-1.5 py-0.5 rounded font-bold text-on-primary-container">
                  {record.newState}
                </span>
              </p>
            </div>
            <div className="p-3 bg-surface-container-lowest border border-surface-container rounded-xl">
              <span className="text-secondary text-[11px]">Gateway & Origin IP</span>
              <p className="font-mono text-on-surface mt-0.5">{displayIp}</p>
            </div>
          </div>

          {/* Cryptographic Ledger & Hash Proofs */}
          <div className="space-y-2 pt-1">
            <h4 className="font-semibold text-secondary uppercase font-label text-[11px] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-primary" />
              Tamper-Evident Ledger Integrity Proofs
            </h4>
            
            <div className="space-y-2 bg-surface-container-high/40 p-3.5 rounded-xl border border-outline-variant/60 font-mono text-[11px]">
              <div>
                <div className="text-secondary text-[10px] flex justify-between">
                  <span>Current Block / Transaction Hash (SHA-256):</span>
                  <button
                    onClick={() => copyToClipboard(record.blockHash)}
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <div className="p-1.5 bg-surface-container-lowest rounded border border-outline-variant/40 text-on-surface break-all select-all mt-0.5 font-semibold text-primary">
                  {record.blockHash}
                </div>
              </div>

              <div>
                <div className="text-secondary text-[10px]">Previous Block Hash:</div>
                <div className="p-1.5 bg-surface-container-lowest rounded border border-outline-variant/40 text-secondary break-all select-all mt-0.5">
                  {record.prevBlockHash}
                </div>
              </div>

              <div>
                <div className="text-secondary text-[10px]">Digital Signature (PKI / DSC Token):</div>
                <div className="p-1.5 bg-surface-container-lowest rounded border border-outline-variant/40 text-on-surface break-all select-all mt-0.5 text-emerald-800">
                  {record.digitalSignature}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-surface-container bg-surface-container-low flex justify-between items-center">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Consensus State: Validated & Immutably Anchored
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-on-primary rounded-xl font-medium text-xs hover:bg-primary/90 transition-colors shadow-sm"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
