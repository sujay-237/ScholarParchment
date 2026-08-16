'use client';

import React, { useState } from 'react';
import { useScholarshipData } from '@/context/ScholarshipDataContext';
import { AppShell } from '@/components/layout/AppShell';
import { Scholarship } from '@/types';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
  Sparkles,
  Edit3,
  Trash2,
  X,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ScholarshipProgrammeManagementPage() {
  const { scholarships } = useScholarshipData();
  const [programmeList, setProgrammeList] = useState<Scholarship[]>(scholarships);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Scheme Form State
  const [newScheme, setNewScheme] = useState<Partial<Scholarship>>({
    title: '',
    schemeCode: '',
    ministry: 'Ministry of Education',
    department: 'Department of Higher Education',
    category: 'Higher Education',
    amount: 50000,
    amountFormatted: '₹50,000 / Year',
    frequency: 'Annual',
    totalSeats: 10000,
    maxFamilyIncome: 450000,
    minimumGpaOrMarks: 75,
    description: '',
    deadline: '2026-11-30',
    daysRemaining: 90,
    status: 'open',
  });

  const handleCreateScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheme.title || !newScheme.schemeCode) return;

    const created: Scholarship = {
      id: `sch-${Date.now()}`,
      schemeCode: newScheme.schemeCode || 'SCH-NEW-2026',
      title: newScheme.title || '',
      ministry: newScheme.ministry || 'Ministry of Education',
      department: newScheme.department || 'Higher Education Division',
      description: newScheme.description || 'National financial assistance initiative for eligible scholars.',
      amount: Number(newScheme.amount) || 50000,
      amountFormatted: `₹${Number(newScheme.amount).toLocaleString('en-IN')} / Year`,
      frequency: 'Annual',
      deadline: newScheme.deadline || '2026-11-30',
      daysRemaining: 90,
      category: (newScheme.category as any) || 'Higher Education',
      targetAudience: 'Meritorious Indian Domicile Students',
      eligibleCourses: ['All Recognized UG/PG Degree Programs'],
      minimumGpaOrMarks: Number(newScheme.minimumGpaOrMarks) || 70,
      maxFamilyIncome: Number(newScheme.maxFamilyIncome) || 450000,
      totalSeats: Number(newScheme.totalSeats) || 5000,
      appliedCount: 0,
      status: 'open',
      keyBenefits: ['Direct Bank Transfer', 'Tuition allowance support'],
      requiredDocs: ['Marksheet', 'Income Proof', 'Bonafide Certificate', 'Bank Passbook'],
    };

    setProgrammeList([created, ...programmeList]);
    setShowCreateModal(false);
    alert('New scholarship scheme successfully configured and published on National Portal!');
  };

  const filteredProgrammes = programmeList.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.schemeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ministry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">
                Scholarship Programme Management
              </h1>
              <span className="bg-tertiary-container text-on-tertiary-container text-xs font-bold px-2 py-0.5 rounded-full font-label">
                {programmeList.length} Active Schemes
              </span>
            </div>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              Configure Central Sector Guidelines, quota caps, and eligibility criteria rules.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Launch New Scheme Initiative</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes by title, scheme code, or nodal ministry..."
            className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Programmes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProgrammes.map((p) => (
            <div
              key={p.id}
              className="p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-container text-on-primary-container uppercase font-label">
                    {p.category}
                  </span>
                  <span className="font-mono text-[10px] text-secondary">
                    {p.schemeCode}
                  </span>
                </div>

                <h3 className="font-bold text-base font-headline text-on-surface line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-xs text-secondary">{p.ministry}</p>
              </div>

              {/* Attributes */}
              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/40 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-secondary">Sanction / Student:</span>
                  <span className="font-bold text-primary font-headline">{p.amountFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Total Sanctioned Quota:</span>
                  <span className="font-semibold text-on-surface">{p.totalSeats.toLocaleString('en-IN')} Seats</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Max Income Ceiling:</span>
                  <span className="font-semibold text-on-surface">{formatCurrency(p.maxFamilyIncome)}/yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Min Merit Threshold:</span>
                  <span className="font-semibold text-on-surface">&gt; {p.minimumGpaOrMarks}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-surface-container text-xs">
                <span className="text-[11px] text-secondary">
                  Deadline: {p.deadline}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Opening configuration editor for ${p.schemeCode}`)}
                    className="p-1.5 text-secondary hover:text-on-surface hover:bg-surface-container rounded-lg"
                    title="Edit Scheme Parameters"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Scheme Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-2xl border border-outline-variant shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-surface-container">
              <div>
                <h3 className="font-bold text-xl font-headline text-on-surface">
                  Configure New Central Scholarship Scheme
                </h3>
                <p className="text-xs text-secondary mt-0.5">
                  Publish guidelines to National Scholarship Portal directory.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-secondary hover:text-on-surface rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateScheme} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Scheme Title</label>
                  <input
                    type="text"
                    required
                    value={newScheme.title}
                    onChange={(e) => setNewScheme({ ...newScheme, title: e.target.value })}
                    placeholder="e.g. National Merit-cum-Means Post-Grad Grant"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Unique Scheme Code</label>
                  <input
                    type="text"
                    required
                    value={newScheme.schemeCode}
                    onChange={(e) => setNewScheme({ ...newScheme, schemeCode: e.target.value })}
                    placeholder="e.g. PM-MCM-PG-2026"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Nodal Ministry</label>
                  <select
                    value={newScheme.ministry}
                    onChange={(e) => setNewScheme({ ...newScheme, ministry: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                  >
                    <option>Ministry of Education</option>
                    <option>Ministry of Social Justice & Empowerment</option>
                    <option>Ministry of Minority Affairs</option>
                    <option>Ministry of Tribal Affairs</option>
                    <option>Ministry of Science & Technology</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Category Target</label>
                  <select
                    value={newScheme.category}
                    onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value as any })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                  >
                    <option>Higher Education</option>
                    <option>Girls STEM</option>
                    <option>Post-Matric</option>
                    <option>Merit-cum-Means</option>
                    <option>Special Ability</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Annual Grant Amount (₹)</label>
                  <input
                    type="number"
                    value={newScheme.amount}
                    onChange={(e) => setNewScheme({ ...newScheme, amount: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-bold text-primary"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Sanctioned Beneficiary Seats</label>
                  <input
                    type="number"
                    value={newScheme.totalSeats}
                    onChange={(e) => setNewScheme({ ...newScheme, totalSeats: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Max Annual Family Income Ceiling (₹)</label>
                  <input
                    type="number"
                    value={newScheme.maxFamilyIncome}
                    onChange={(e) => setNewScheme({ ...newScheme, maxFamilyIncome: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Minimum Merit Score (%)</label>
                  <input
                    type="number"
                    value={newScheme.minimumGpaOrMarks}
                    onChange={(e) => setNewScheme({ ...newScheme, minimumGpaOrMarks: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Programme Description</label>
                <textarea
                  rows={3}
                  value={newScheme.description}
                  onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
                  placeholder="Outline purpose, eligibility specifics, and key guidelines..."
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-secondary hover:bg-surface-container rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-colors"
                >
                  Publish Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
