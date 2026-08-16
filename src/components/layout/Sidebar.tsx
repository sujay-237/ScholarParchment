'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useScholarshipData } from '@/context/ScholarshipDataContext';
import { useNotifications } from '@/context/NotificationContext';
import {
  LayoutDashboard,
  Compass,
  FileEdit,
  UserCheck,
  Landmark,
  CheckSquare,
  Building,
  Layers,
  Send,
  Bell,
  HelpCircle,
  ShieldCheck,
  Award,
  FileSpreadsheet,
  FileSignature,
  FileCheck2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { activeRole, currentUser } = useAuth();
  const { applications, batches } = useScholarshipData();
  const { unreadCount } = useNotifications();

  // Calculation counts for badges
  const pendingCollegeReviewCount = applications.filter(
    (a) => a.status === 'college_pending' || a.status === 'submitted'
  ).length;

  const pendingMinistryCount = applications.filter(
    (a) => a.status === 'college_verified' || a.status === 'ministry_pending'
  ).length;

  const activeBatchesCount = batches.filter(
    (b) => b.status === 'pending_approval' || b.status === 'processing'
  ).length;

  // Student Navigation Links
  const studentLinks: NavItem[] = [
    {
      title: 'Student Dashboard',
      href: '/student/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Scholarship Explorer',
      href: '/student/explorer',
      icon: Compass,
      badge: 'Live Schemes',
    },
    {
      title: 'Application Workspace',
      href: '/student/applications',
      icon: FileEdit,
      badge: applications.filter(a => a.studentId === currentUser.id || a.studentName === 'Aarav Sharma').length.toString(),
    },
    {
      title: 'Profile & Documents',
      href: '/student/profile',
      icon: UserCheck,
    },
    {
      title: 'Payments & Records',
      href: '/student/payments',
      icon: Landmark,
      badge: 'DBT APBS',
    },
  ];

  // College Officer Links
  const collegeLinks: NavItem[] = [
    {
      title: 'Verification Queue',
      href: '/college/dashboard',
      icon: CheckSquare,
      badge: pendingCollegeReviewCount > 0 ? `${pendingCollegeReviewCount} Pending` : undefined,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      title: 'Verification Review',
      href: '/college/review/APP-2026-00981',
      icon: FileCheck2,
    },
  ];

  // Ministry Officer Links
  const ministryLinks: NavItem[] = [
    {
      title: 'Review Queue & Stats',
      href: '/ministry/dashboard',
      icon: LayoutDashboard,
      badge: pendingMinistryCount > 0 ? `${pendingMinistryCount} Queued` : undefined,
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    },
    {
      title: 'Programme Management',
      href: '/ministry/programmes',
      icon: Layers,
    },
    {
      title: 'Disbursement Workspace',
      href: '/ministry/disbursements',
      icon: FileSignature,
      badge: activeBatchesCount > 0 ? `${activeBatchesCount} Batches` : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
  ];

  // Shared Utilities Links
  const sharedLinks: NavItem[] = [
    {
      title: 'Notifications Center',
      href: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount.toString() : undefined,
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      title: 'Verification Records',
      href: '/records',
      icon: ShieldCheck,
    },
    {
      title: 'Help & Support',
      href: '/help',
      icon: HelpCircle,
    },
  ];

  const getPrimaryLinks = () => {
    switch (activeRole) {
      case 'college':
        return collegeLinks;
      case 'ministry':
        return ministryLinks;
      default:
        return studentLinks;
    }
  };

  const currentRoleLinks = getPrimaryLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-72 bg-surface-container-lowest border-r border-surface-container-highest p-4 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="space-y-6">
          {/* Active Role Card */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-secondary uppercase font-label text-[10px]">
                Active Persona
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="font-bold text-sm font-headline text-on-surface mt-1 truncate">
              {currentUser.name}
            </p>
            <p className="text-xs text-secondary capitalize font-label">
              {currentUser.designation || currentUser.institution || `${activeRole} Portal`}
            </p>
          </div>

          {/* Primary Navigation Section */}
          <div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider font-label px-3 mb-2">
              {activeRole === 'student'
                ? 'Student Workspace'
                : activeRole === 'college'
                ? 'Institutional Verification'
                : 'Central Ministry Scrutiny'}
            </div>
            <nav className="space-y-1">
              {currentRoleLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && item.href !== '/student/dashboard' && item.href !== '/college/dashboard' && item.href !== '/ministry/dashboard');
                
                return (
                  <NextLink
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group',
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                        : 'text-on-surface hover:bg-surface-container hover:text-primary'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          'w-4 h-4 transition-colors',
                          isActive ? 'text-on-primary-container' : 'text-secondary group-hover:text-primary'
                        )}
                      />
                      <span>{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                          item.badgeColor || 'bg-surface-container-highest text-secondary border-outline-variant/40'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NextLink>
                );
              })}
            </nav>
          </div>

          {/* Shared Platform Services Section */}
          <div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider font-label px-3 mb-2">
              Shared Platform Services
            </div>
            <nav className="space-y-1">
              {sharedLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <NextLink
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-colors group',
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-secondary hover:bg-surface-container hover:text-on-surface'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-secondary group-hover:text-primary" />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full',
                          item.badgeColor || 'bg-surface-container text-secondary'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NextLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer Security Seal */}
        <div className="pt-4 border-t border-surface-container-highest mt-6 space-y-2">
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 font-label">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>DBT / PFMS Integrated</span>
            </div>
            <p className="text-[10px] text-secondary mt-0.5">
              256-bit Encrypted Government of India National Portal
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
