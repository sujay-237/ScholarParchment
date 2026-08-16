'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useScholarshipData } from '@/context/ScholarshipDataContext';
import { AppShell } from '@/components/layout/AppShell';
import { Scholarship } from '@/types';
import {
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  X,
  FileCheck,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ScholarshipExplorerPage() {
  const { scholarships } = useScholarshipData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedScheme, setSelectedScheme] = useState<Scholarship | null>(scholarships[0] || null);

  const categories = ['All', 'Higher Education', 'Girls STEM', 'Post-Matric', 'Merit-cum-Means', 'Special Ability'];

  const filteredScholarships = useMemo(() => {
    return scholarships.filter((sch) => {
      const matchesSearch =
        sch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sch.ministry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sch.schemeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sch.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || sch.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [scholarships, searchQuery, selectedCategory]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">
                Scholarship Explorer
              </h1>
              <span className="bg-primary-container text-on-primary-container text-xs font-bold px-2 py-0.5 rounded-full font-label">
                {filteredScholarships.length} Schemes Available
              </span>
            </div>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              Browse Government of India Central Sector & AICTE scholarship opportunities.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant/60 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by scheme name, ministry, qualification (e.g. B.Tech, Girl STEM, Post-Matric)..."
              className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-xs text-secondary hover:text-on-surface"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-secondary font-semibold font-label uppercase text-[11px] whitespace-nowrap mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'bg-surface-container-lowest text-secondary hover:text-on-surface border border-outline-variant/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Split Grid: Schemes List + Detail Sticky Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Schemes List (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            {filteredScholarships.map((sch) => {
              const isSelected = selectedScheme?.id === sch.id;
              return (
                <div
                  key={sch.id}
                  onClick={() => setSelectedScheme(sch)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer bg-surface-container-lowest ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 shadow-md bg-primary-container/5'
                      : 'border-outline-variant/60 hover:border-primary/50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-container text-on-primary-container uppercase font-label">
                          {sch.category}
                        </span>
                        <span className="text-[11px] font-mono text-secondary">
                          Code: {sch.schemeCode}
                        </span>
                      </div>
                      <h3 className="font-bold text-base font-headline text-on-surface leading-snug">
                        {sch.title}
                      </h3>
                      <p className="text-xs text-secondary">{sch.ministry}</p>
                    </div>

                    <div className="text-right whitespace-nowrap">
                      <p className="text-lg font-bold font-headline text-primary">
                        {sch.amountFormatted}
                      </p>
                      <p className="text-[10px] text-secondary font-label">{sch.frequency}</p>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-3 leading-relaxed">
                    {sch.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-surface-container text-xs">
                    <div className="flex items-center gap-4 text-secondary text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        Deadline: {sch.deadline} ({sch.daysRemaining} days left)
                      </span>
                      <span>• Min {sch.minimumGpaOrMarks}% Marks</span>
                    </div>

                    <span className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                      View Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredScholarships.length === 0 && (
              <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/60 space-y-3">
                <Search className="w-8 h-8 text-secondary mx-auto" />
                <p className="font-bold text-base text-on-surface font-headline">No matching scholarships found</p>
                <p className="text-xs text-secondary">Try adjusting your search terms or clearing the category filter.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Scheme Detail Sticky Panel (Col 5) */}
          <div className="lg:col-span-5">
            {selectedScheme ? (
              <div className="sticky top-20 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-md space-y-6">
                <div className="space-y-2 pb-4 border-b border-surface-container">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-primary-container text-on-primary-container uppercase font-label">
                      {selectedScheme.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ Applications Open
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-headline text-on-surface leading-tight">
                    {selectedScheme.title}
                  </h3>
                  <p className="text-xs text-secondary">{selectedScheme.department} • {selectedScheme.ministry}</p>
                </div>

                {/* Aid & Eligibility Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                    <span className="text-[10px] text-secondary font-label uppercase">Award Amount</span>
                    <p className="text-lg font-bold font-headline text-primary mt-0.5">
                      {selectedScheme.amountFormatted}
                    </p>
                    <span className="text-[10px] text-secondary">Disbursed via DBT</span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                    <span className="text-[10px] text-secondary font-label uppercase">Max Family Income</span>
                    <p className="text-sm font-bold text-on-surface mt-0.5">
                      {formatCurrency(selectedScheme.maxFamilyIncome)}/yr
                    </p>
                    <span className="text-[10px] text-secondary">Income Cert required</span>
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase font-label text-primary flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Key Scheme Benefits
                  </h4>
                  <ul className="space-y-1.5 text-xs text-on-surface-variant">
                    {selectedScheme.keyBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mandatory Digilocker Documents */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase font-label text-secondary flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-primary" />
                    Required Supporting Documents
                  </h4>
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-1.5 text-xs text-secondary">
                    {selectedScheme.requiredDocs.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  <Link
                    href={`/student/apply/${selectedScheme.id}`}
                    className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <span>Proceed to Application Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[10px] text-secondary text-center mt-2">
                    Takes approx 3-5 mins with pre-filled DigiLocker documents.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
