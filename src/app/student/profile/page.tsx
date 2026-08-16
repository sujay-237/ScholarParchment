'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { DocumentPreviewModal } from '@/components/common/DocumentPreviewModal';
import { DocumentAttachment } from '@/types';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Landmark,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Eye,
  Download,
  Sparkles,
  Award,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function StudentProfilePage() {
  const { currentUser } = useAuth();
  const [selectedDoc, setSelectedDoc] = useState<DocumentAttachment | null>(null);

  const vaultDocuments: DocumentAttachment[] = [
    {
      id: 'doc-v1',
      name: 'Class_12_CBSE_Marksheet_Aarav.pdf',
      type: 'marksheet_12',
      category: 'Senior Secondary (10+2) Marksheet',
      size: '1.2 MB',
      uploadDate: '2026-06-10',
      verifiedStatus: 'verified',
      ocrExtractedData: {
        'Aggregate Marks': '94.6%',
        'Board': 'Central Board of Secondary Education',
        'Roll No': '1410298',
        'Passing Year': '2022',
      },
    },
    {
      id: 'doc-v2',
      name: 'Class_10_CBSE_PassCertificate.pdf',
      type: 'marksheet_10',
      category: 'Secondary (Class 10) Certificate',
      size: '980 KB',
      uploadDate: '2026-06-10',
      verifiedStatus: 'verified',
      ocrExtractedData: {
        'Aggregate Marks': '95.2%',
        'Date of Birth Proof': '18-05-2004 (Verified)',
      },
    },
    {
      id: 'doc-v3',
      name: 'Annual_Income_Tehsildar_2026.pdf',
      type: 'income_cert',
      category: 'Family Income Certificate',
      size: '840 KB',
      uploadDate: '2026-07-01',
      verifiedStatus: 'verified',
      ocrExtractedData: {
        'Annual Income': '₹ 2,40,000 / year',
        'Issuing Office': 'Revenue Department, Govt of NCT Delhi',
        'Validity': 'Valid till 31-03-2027',
      },
    },
    {
      id: 'doc-v4',
      name: 'IITD_Bonafide_FeeReceipt_2026.pdf',
      type: 'bonafide_cert',
      category: 'Institutional Bonafide & Fee Receipt',
      size: '1.8 MB',
      uploadDate: '2026-08-01',
      verifiedStatus: 'verified',
      ocrExtractedData: {
        'Institute': 'IIT Delhi (AISHE: U-0100)',
        'Programme': 'B.Tech in Computer Science',
        'Status': 'Regular Full-Time Student',
      },
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">
                Student Profile & Document Vault
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase font-label">
                e-KYC Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              National Academic Depository (NAD) & DigiLocker connected student profile.
            </p>
          </div>

          <div className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/60 flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-emerald-800 font-label">DigiLocker Sync Active</span>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Personal & Academic Bio (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/80 shadow-sm space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-surface-container">
                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold font-headline text-on-surface">
                    {currentUser.name}
                  </h2>
                  <p className="text-xs text-secondary font-label">
                    Roll No: <span className="font-mono font-bold text-on-surface">{currentUser.studentId}</span>
                  </p>
                  <p className="text-xs text-primary font-medium mt-0.5">
                    {currentUser.institution}
                  </p>
                </div>
              </div>

              {/* Attributes */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-surface-container">
                  <span className="text-secondary font-medium">Programme</span>
                  <span className="font-semibold text-on-surface">B.Tech Computer Science</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-surface-container">
                  <span className="text-secondary font-medium">Academic Year</span>
                  <span className="font-semibold text-on-surface">3rd Year (Semester 5)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-surface-container">
                  <span className="text-secondary font-medium">Cumulative CGPA</span>
                  <span className="font-bold text-primary font-headline text-sm">8.92 / 10.0</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-surface-container">
                  <span className="text-secondary font-medium">Aadhaar Linked</span>
                  <span className="font-mono font-semibold text-emerald-800">XXXX-XXXX-8842 (Verified)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-surface-container">
                  <span className="text-secondary font-medium">Social Category</span>
                  <span className="font-semibold text-on-surface">General (EWS)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-secondary font-medium">Annual Family Income</span>
                  <span className="font-semibold text-on-surface">₹ 2,40,000 / annum</span>
                </div>
              </div>
            </div>

            {/* Bank KYC & DBT Mapping Card */}
            <div className="p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <h3 className="font-bold text-sm font-headline text-on-surface flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-primary" />
                  <span>Aadhaar DBT Bank Mapping</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  NPCI Active
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-1">
                  <p className="font-bold text-on-surface">State Bank of India</p>
                  <p className="text-secondary">IIT Delhi Branch (IFSC: SBIN0001077)</p>
                  <p className="font-mono text-xs text-primary font-semibold">A/c: ••••••••8912</p>
                </div>
                <p className="text-[11px] text-secondary leading-relaxed">
                  Verified with NPCI Aadhaar Payment Bridge System (APBS) for automated credit without intermediary delay.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Certified Document Vault (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/80 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-surface-container">
                <div>
                  <h3 className="text-lg font-bold font-headline text-on-surface flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>DigiLocker Certified Document Vault</span>
                  </h3>
                  <p className="text-xs text-secondary mt-0.5">
                    Immutable electronic records certified by National Informatics Centre.
                  </p>
                </div>
                <span className="text-xs font-mono text-secondary">
                  {vaultDocuments.length} Documents
                </span>
              </div>

              <div className="space-y-3">
                {vaultDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/60 hover:border-primary/50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary-container text-on-primary-container">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-on-surface font-headline">{doc.name}</h4>
                        <p className="text-[11px] text-secondary">{doc.category} • {doc.size}</p>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                          ✓ DigiLocker Certified
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        <span>Inspect OCR</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Track Records */}
            <div className="p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/80 shadow-sm space-y-4">
              <h3 className="font-bold text-sm font-headline text-on-surface flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span>Verified Academic Milestones</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <span className="text-[10px] text-secondary font-label uppercase">Class X (CBSE)</span>
                  <p className="text-base font-bold font-headline text-primary mt-0.5">95.2 %</p>
                  <span className="text-[10px] text-secondary">Year 2020</span>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <span className="text-[10px] text-secondary font-label uppercase">Class XII (CBSE)</span>
                  <p className="text-base font-bold font-headline text-primary mt-0.5">94.6 %</p>
                  <span className="text-[10px] text-secondary">Top 1st Percentile (2022)</span>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <span className="text-[10px] text-secondary font-label uppercase">IIT JEE Advanced</span>
                  <p className="text-base font-bold font-headline text-primary mt-0.5">AIR 842</p>
                  <span className="text-[10px] text-secondary">CSE Admission</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Inspection Modal */}
      <DocumentPreviewModal
        document={selectedDoc}
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />
    </AppShell>
  );
}
