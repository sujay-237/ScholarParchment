import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, ExternalLink, Award, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-low border-t border-surface-container-highest mt-16 text-xs text-secondary no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-on-surface font-headline">ScholarParchment</span>
            </div>
            <p className="text-secondary leading-relaxed">
              The National Unified Scholarship & Disbursement Portal designed on the Earth & Parchment design architecture for transparent, tamper-evident educational aid.
            </p>
            <div className="text-[11px] font-mono text-secondary">
              Version 2.4.0 • Build 2026.08
            </div>
          </div>

          {/* Col 2: Portals & Roles */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-on-surface uppercase tracking-wider font-label text-[11px]">
              Access Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/student/dashboard" className="hover:text-primary transition-colors">
                  Student Application Portal
                </Link>
              </li>
              <li>
                <Link href="/college/dashboard" className="hover:text-primary transition-colors">
                  College Institutional Verification
                </Link>
              </li>
              <li>
                <Link href="/ministry/dashboard" className="hover:text-primary transition-colors">
                  Central Ministry Sanction & DBT
                </Link>
              </li>
              <li>
                <Link href="/records" className="hover:text-primary transition-colors">
                  Tamper-Evident Ledger Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Guidelines & FAQs */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-on-surface uppercase tracking-wider font-label text-[11px]">
              Compliance & Guidelines
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  Eligibility & FAQ Manual
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  DigiLocker Document Standard
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  Aadhaar NPCI DBT Seeding Guide
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  Grievance Redressal Mechanism
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: National Helpline */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-on-surface uppercase tracking-wider font-label text-[11px]">
              National Helpdesk
            </h4>
            <div className="space-y-2 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/60">
              <div className="flex items-center gap-2 text-on-surface">
                <Phone className="w-4 h-4 text-primary" />
                <span className="font-semibold font-mono">1800-118-005 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2 text-secondary">
                <Mail className="w-4 h-4 text-primary" />
                <span>helpdesk-scholarships@gov.in</span>
              </div>
              <p className="text-[10px] text-secondary">
                Operational 24x7 across all States and Union Territories.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-surface-container flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
          <p>© 2026 National Scholarship Portal Division, Government of India. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/help" className="hover:underline">Privacy Policy</Link>
            <Link href="/help" className="hover:underline">Terms of Service</Link>
            <Link href="/records" className="hover:underline">Audit Ledger</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
