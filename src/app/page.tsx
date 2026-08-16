'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import {
  GraduationCap,
  School,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  FileCheck,
  Landmark,
  Coins,
  Users,
  CheckCircle2,
  Search,
  BookOpen,
  Cpu,
  Lock,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function WelcomePage() {
  const { setRole } = useAuth();
  const router = useRouter();

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
    if (role === 'student') router.push('/student/dashboard');
    else if (role === 'college') router.push('/college/dashboard');
    else if (role === 'ministry') router.push('/ministry/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-20 sm:space-y-28">
        {/* Hero Section */}
        <section className="pt-6 sm:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold font-label border border-primary/20 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>National Unified Portal • Govt of India</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-headline tracking-tight text-on-surface leading-[1.1]">
              Transparent Scholarships, <br />
              <span className="text-primary underline decoration-primary/40 decoration-wavy decoration-2">
                Verified Futures.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-secondary leading-relaxed max-w-2xl font-body">
              A unified, paperless, and tamper-evident national scholarship ecosystem connecting Students, Educational Institutions, and Central Ministries. Verified records with instant Direct Benefit Transfer (DBT).
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleRoleSelect('student')}
                className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Explore & Apply for Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/auth"
                className="px-6 py-3.5 rounded-xl bg-surface-container-highest hover:bg-surface-container-high text-on-surface font-medium text-sm border border-outline-variant/60 transition-colors"
              >
                Sign In / Access Portal
              </Link>
            </div>

            {/* Quick Micro Stats */}
            <div className="pt-6 border-t border-surface-container-highest grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold font-headline text-on-surface">₹ 4,850 Cr+</p>
                <p className="text-xs text-secondary font-label">Direct DBT Disbursed</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-headline text-on-surface">12.4 Lakh</p>
                <p className="text-xs text-secondary font-label">Verified Beneficiaries</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-headline text-on-surface">99.8%</p>
                <p className="text-xs text-secondary font-label">Tamper-Proof Audit Rate</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant shadow-xl relative overflow-hidden space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider font-label text-on-surface">
                    Live System Status
                  </span>
                </div>
                <span className="text-xs font-mono text-secondary">Block #1849210</span>
              </div>

              {/* Workflow Stepper Mockup */}
              <div className="space-y-4">
                <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary-container text-on-primary-container">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">1. Student Submission</p>
                      <p className="text-[11px] text-secondary">Aadhaar & DigiLocker e-KYC Verified</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-secondary-container text-on-secondary-container">
                      <School className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">2. College Nodal Scrutiny</p>
                      <p className="text-[11px] text-secondary">Attendance & Fee Receipt Matching</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-tertiary-container text-on-tertiary-container">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">3. Ministry Digital Sanction</p>
                      <p className="text-[11px] text-secondary">DSC Token Signed Sanction Order</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="p-3.5 bg-primary-container/30 rounded-2xl border border-primary/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary text-white">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">4. Instant DBT Transfer</p>
                      <p className="text-[11px] text-primary font-medium">PFMS APBS Direct to Bank Account</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
              </div>

              <div className="p-3 bg-surface-container rounded-xl text-[11px] text-secondary flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary shrink-0" />
                <span>Protected by SHA-256 Cryptographic Verification Ledger</span>
              </div>
            </div>
          </div>
        </section>

        {/* Role Selection Section */}
        <section className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider font-label text-primary">
              Role-Based Access
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-headline text-on-surface">
              Select Your Portal Role
            </h2>
            <p className="text-sm text-secondary">
              Choose your role below to access tailored dashboards, verification queues, or ministry sanction workspaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Role Card */}
            <div className="group relative bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-7 hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-headline text-on-surface">Student Portal</h3>
                  <p className="text-xs text-secondary mt-2 leading-relaxed">
                    Explore Central & State scholarships, apply with DigiLocker documents, track real-time verification stages, and view DBT payment records.
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-surface-container text-xs text-secondary">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>DigiLocker 1-Click KYC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>Real-time Application Tracker</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>Direct Benefit Transfer (DBT)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRoleSelect('student')}
                className="w-full py-3 rounded-xl bg-primary-container hover:bg-primary text-on-primary-container hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Enter Student Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* College Officer Role Card */}
            <div className="group relative bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-7 hover:border-secondary hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                  <School className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-headline text-on-surface">College Nodal Officer</h3>
                  <p className="text-xs text-secondary mt-2 leading-relaxed">
                    Perform institutional scrutiny of student applications, verify academic attendance and fee receipts, raise queries, and forward certified records to Ministry.
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-surface-container text-xs text-secondary">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                    <span>Split-Screen Document Inspector</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                    <span>Automated Fraud & Duplicate Checks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                    <span>Institutional Verification Sign-off</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRoleSelect('college')}
                className="w-full py-3 rounded-xl bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Enter College Verification Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ministry Officer Role Card */}
            <div className="group relative bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-7 hover:border-tertiary hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7 text-tertiary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-headline text-on-surface">Central Ministry Officer</h3>
                  <p className="text-xs text-secondary mt-2 leading-relaxed">
                    Oversee national scholarship schemes, approve sanctioned batches with DSC digital signatures, track budget allocations, and trigger PFMS DBT fund releases.
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-surface-container text-xs text-secondary">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tertiary" />
                    <span>Budget & Quota Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tertiary" />
                    <span>Batch Sanction Order Generator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tertiary" />
                    <span>PFMS APBS Direct Clearing</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRoleSelect('ministry')}
                className="w-full py-3 rounded-xl bg-tertiary-container hover:bg-tertiary text-on-tertiary-container hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Enter Ministry Review & Sanctions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold font-headline text-on-surface">
              The Transparent Scholarship Lifecycle
            </h2>
            <p className="text-sm text-secondary">
              How ScholarParchment streamlines funding from initial discovery to bank credit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/60 space-y-3">
              <span className="text-[11px] font-bold text-primary uppercase font-label">Step 1</span>
              <h4 className="font-bold text-base font-headline">Scholarship Explorer</h4>
              <p className="text-xs text-secondary">
                Search schemes, check criteria match, and auto-populate academic details directly from academic depositories.
              </p>
            </div>

            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/60 space-y-3">
              <span className="text-[11px] font-bold text-secondary uppercase font-label">Step 2</span>
              <h4 className="font-bold text-base font-headline">Institutional Verification</h4>
              <p className="text-xs text-secondary">
                Colleges inspect bona fide records, course fee receipts, and marks with side-by-side OCR verification.
              </p>
            </div>

            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/60 space-y-3">
              <span className="text-[11px] font-bold text-tertiary uppercase font-label">Step 3</span>
              <h4 className="font-bold text-base font-headline">Central Sanction</h4>
              <p className="text-xs text-secondary">
                Ministries review verified cohorts, issue DSC-signed sanction orders, and group beneficiaries into batches.
              </p>
            </div>

            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/60 space-y-3">
              <span className="text-[11px] font-bold text-emerald-800 uppercase font-label">Step 4</span>
              <h4 className="font-bold text-base font-headline">DBT APBS Credit</h4>
              <p className="text-xs text-secondary">
                Funds are credited directly to the student&apos;s Aadhaar-seeded bank account with an immutable audit hash.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
