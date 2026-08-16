'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useScholarshipData } from '@/context/ScholarshipDataContext';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  School,
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function CollegeDashboardPage() {
  const { currentUser } = useAuth();
  const { applications } = useScholarshipData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'queried'>('all');

  const pendingCount = applications.filter((a) => a.status === 'college_pending' || a.status === 'submitted').length;
  const verifiedCount = applications.filter((a) => a.status === 'college_verified' || a.status === 'ministry_approved' || a.status === 'disbursed').length;
  const queriedCount = applications.filter((a) => a.status === 'college_queried').length;
  const rejectedCount = applications.filter((a) => a.status === 'college_rejected' || a.status === 'rejected').length;

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.scholarshipTitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'pending') {
      return matchesSearch && (app.status === 'college_pending' || app.status === 'submitted');
    }
    if (statusFilter === 'verified') {
      return matchesSearch && (app.status === 'college_verified' || app.status === 'ministry_approved' || app.status === 'disbursed');
    }
    if (statusFilter === 'queried') {
      return matchesSearch && app.status === 'college_queried';
    }
    return matchesSearch;
  });

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low p-6 rounded-3xl border border-outline-variant/60">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">
                Institutional Verification Queue
              </h1>
              <span className="bg-secondary-container text-on-secondary-container text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase font-label">
                AISHE: U-0100
              </span>
            </div>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              {currentUser.institution || 'Indian Institute of Technology Delhi'} • Nodal Officer: <strong className="text-on-surface">{currentUser.name}</strong>
            </p>
          </div>

          <div className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 text-right">
            <span className="text-[10px] text-secondary font-label uppercase">Institutional Quota</span>
            <p className="text-sm font-bold font-headline text-primary">100% Digital Scrutiny</p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending Verification"
            value={pendingCount}
            subtitle="Requires immediate review"
            icon={CheckSquare}
            iconBg="bg-amber-100"
            iconColor="text-amber-800"
          />
          <StatCard
            title="Verified & Forwarded"
            value={verifiedCount}
            subtitle="Recommended to Central Portal"
            icon={CheckCircle2}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-800"
          />
          <StatCard
            title="Queries Raised"
            value={queriedCount}
            subtitle="Awaiting Student Response"
            icon={AlertTriangle}
            iconBg="bg-orange-100"
            iconColor="text-orange-800"
          />
          <StatCard
            title="Total Applications"
            value={applications.length}
            subtitle="Current 2026 Academic Year"
            icon={School}
            iconBg="bg-surface-container-high"
            iconColor="text-secondary"
          />
        </div>

        {/* Verification Queue Section */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/80 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-surface-container">
            <div>
              <h2 className="text-lg font-bold font-headline text-on-surface flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-secondary" />
                <span>Student Verification Queue ({filteredApps.length})</span>
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Examine enrollment, minimum 75% attendance, fee receipts, and marks.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/40 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'all'
                    ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-sm'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                All ({applications.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-amber-800 text-white font-semibold shadow-sm'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setStatusFilter('verified')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'verified'
                    ? 'bg-emerald-800 text-white font-semibold shadow-sm'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                Verified ({verifiedCount})
              </button>
            </div>
          </div>

          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, roll number, course, scheme name..."
              className="w-full pl-11 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Queue Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-container text-[11px] font-bold text-secondary font-label uppercase tracking-wider bg-surface-container-low">
                  <th className="py-3 px-4 rounded-l-xl">Applicant & ID</th>
                  <th className="py-3 px-4">Scheme Name</th>
                  <th className="py-3 px-4">Course & CGPA</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-on-surface text-sm font-headline">
                        {app.studentName}
                      </div>
                      <div className="font-mono text-[10px] text-secondary">
                        {app.applicationNumber} • ID: {app.studentId}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-medium text-on-surface line-clamp-1 max-w-xs">
                        {app.scholarshipTitle}
                      </div>
                      <div className="text-[10px] text-secondary">{app.ministry}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-on-surface font-medium">{app.course}</div>
                      <div className="text-[10px] text-secondary">
                        Score: <strong className="text-primary">{app.cgpaPercentage} CGPA</strong> ({app.currentYear})
                      </div>
                    </td>

                    <td className="py-4 px-4 text-secondary whitespace-nowrap">
                      {formatDate(app.submittedDate)}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/college/review/${app.id}`}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                          app.status === 'college_pending' || app.status === 'submitted'
                            ? 'bg-secondary text-white hover:bg-secondary/90'
                            : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                        }`}
                      >
                        <span>{app.status === 'college_pending' ? 'Review & Verify' : 'View Record'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
