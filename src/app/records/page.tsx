'use client';

import React, { useState } from 'react';
import { useScholarshipData } from '@/context/ScholarshipDataContext';
import { AppShell } from '@/components/layout/AppShell';
import { AuditRecordModal } from '@/components/common/AuditRecordModal';
import { AuditRecord } from '@/types';
import {
  ShieldCheck,
  Search,
  Copy,
  Lock,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  Cpu,
  Layers,
  Database,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function TransactionRecordsPage() {
  const { auditRecords } = useScholarshipData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const filteredRecords = auditRecords.filter((r) => {
    const matchesSearch =
      r.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.blockHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.actionDetails.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'ALL' || r.recordType === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low p-6 rounded-3xl border border-outline-variant/60">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">
                Tamper-Evident Verification Ledger
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase font-label">
                Consensus Validated
              </span>
            </div>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              Immutable SHA-256 cryptographic audit trail recording student submissions, institutional scrutinies, ministry sanction orders, and DBT payouts.
            </p>
          </div>

          <div className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 flex items-center gap-2 text-xs">
            <Database className="w-4 h-4 text-primary" />
            <span className="font-mono font-bold text-on-surface">
              Latest Block #{auditRecords[0]?.blockHeight || 1849204}
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/60 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by block hash, application ID, student name, officer name, or action..."
              className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
            <span className="text-secondary font-semibold font-label uppercase text-[11px] whitespace-nowrap mr-1">
              Event Filter:
            </span>
            {['ALL', 'APPLICATION_SUBMITTED', 'COLLEGE_VERIFIED', 'MINISTRY_APPROVED', 'PAYMENT_CREDITED'].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    selectedType === type
                      ? 'bg-primary text-white font-semibold shadow-sm'
                      : 'bg-surface-container text-secondary hover:text-on-surface'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              )
            )}
          </div>
        </div>

        {/* Ledger Entries List */}
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/80 shadow-sm hover:border-primary/60 cursor-pointer transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary-container text-on-primary-container">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs uppercase font-label bg-surface-container px-2 py-0.5 rounded text-on-surface">
                        {record.recordType.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-mono text-secondary">
                        Block #{record.blockHeight}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base font-headline text-on-surface mt-1">
                      {record.actionDetails}
                    </h3>
                  </div>
                </div>

                <div className="text-right whitespace-nowrap">
                  <span className="text-xs font-mono text-secondary">
                    {formatDateTime(record.timestamp)}
                  </span>
                  <div className="flex items-center justify-end gap-1 text-[11px] text-emerald-800 font-bold mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Integrity Verified</span>
                  </div>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <span className="text-secondary text-[10px] font-label uppercase">Applicant & Scheme</span>
                  <p className="font-semibold text-on-surface mt-0.5">{record.studentName}</p>
                  <p className="text-[10px] text-secondary font-mono truncate">{record.applicationNumber}</p>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <span className="text-secondary text-[10px] font-label uppercase">Signing Authority</span>
                  <p className="font-semibold text-on-surface mt-0.5">{record.actorName}</p>
                  <p className="text-[10px] text-secondary uppercase font-label">{record.actorRole} • ID: {record.actorId}</p>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <span className="text-secondary text-[10px] font-label uppercase">Origin Gateway IP</span>
                  <p className="font-mono text-on-surface mt-0.5 text-xs truncate">{record.ipAddress}</p>
                  <p className="text-[10px] text-emerald-700 font-medium">SSL / TLS 1.3 Certified</p>
                </div>
              </div>

              {/* Cryptographic SHA-256 Hash Display */}
              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50 flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center gap-2 truncate pr-2">
                  <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-secondary shrink-0">SHA-256:</span>
                  <span className="text-primary font-semibold truncate select-all">{record.blockHash}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyText(record.blockHash);
                  }}
                  className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded text-secondary hover:text-on-surface text-[10px] font-sans font-semibold shrink-0"
                >
                  Copy Hash
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cryptographic Certificate Inspector Modal */}
      <AuditRecordModal
        record={selectedRecord}
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </AppShell>
  );
}
