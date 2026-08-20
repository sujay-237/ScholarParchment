'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import NextLink from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import {
  Bell,
  HelpCircle,
  ShieldCheck,
  Search,
  Menu,
  X,
  FileCheck,
  GraduationCap,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/lib/utils';

export const Navbar: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const { currentUser, activeRole, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const getRoleBadge = () => {
    switch (activeRole) {
      case 'student':
        return { label: 'Student Portal', color: 'bg-primary/10 text-primary border-primary/30' };
      case 'college':
        return { label: 'College Nodal Officer', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'ministry':
        return { label: 'Central Ministry Portal', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      default:
        return { label: 'Public Portal', color: 'bg-surface-container text-on-surface' };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-surface-container-highest transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand & Mobile Sidebar Toggle */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface lg:hidden"
                aria-label="Toggle Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <NextLink href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight font-headline text-on-surface flex items-center gap-1.5">
                  ScholarParchment
                  <span className="text-[10px] uppercase font-label px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container font-semibold">
                    National
                  </span>
                </span>
                <span className="text-[10px] text-secondary font-label -mt-0.5 hidden sm:inline">
                  Unified Central Scholarship & Disbursement Gateway
                </span>
              </div>
            </NextLink>

            {isAuthenticated && (
              <span className={`hidden md:inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                {badge.label}
              </span>
            )}
          </div>

          {/* Center / Right: Nav Utilities & User Context */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Links */}
            <div className="hidden lg:flex items-center gap-1 text-xs font-medium text-secondary">
              <NextLink
                href="/records"
                className="px-3 py-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface flex items-center gap-1.5 transition-colors"
              >
                <FileCheck className="w-4 h-4 text-primary" />
                <span>Verification Ledger</span>
              </NextLink>
              <NextLink
                href="/help"
                className="px-3 py-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface flex items-center gap-1.5 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-primary" />
                <span>Help & Support</span>
              </NextLink>
            </div>

            {isAuthenticated ? (
              <>
                {/* Notification Bell Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="relative p-2 rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Popover */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                        <h4 className="font-semibold text-sm font-headline text-on-surface flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-primary" />
                          Notifications & Alerts
                        </h4>
                        <NextLink
                          href="/notifications"
                          onClick={() => setShowNotifications(false)}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          View All
                        </NextLink>
                      </div>

                      <div className="mt-2 space-y-2 max-h-80 overflow-y-auto divide-y divide-surface-container">
                        {notifications.slice(0, 4).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`pt-2.5 pb-2 text-xs transition-colors cursor-pointer rounded-lg px-2 ${
                              n.read ? 'opacity-70 hover:opacity-100' : 'bg-primary-container/20 font-medium'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-semibold text-on-surface">{n.title}</span>
                              <span className="text-[10px] text-secondary whitespace-nowrap">
                                {formatDateTime(n.timestamp)}
                              </span>
                            </div>
                            <p className="text-secondary mt-1 text-[11px] line-clamp-2">{n.message}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-2 border-t border-surface-container text-center">
                        <NextLink
                          href="/notifications"
                          onClick={() => setShowNotifications(false)}
                          className="block w-full py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg text-xs font-semibold"
                        >
                          Open Notification Center
                        </NextLink>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Pill */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 p-1.5 pl-2 rounded-xl border border-outline-variant/60 hover:bg-surface-container transition-colors bg-surface-container-lowest"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                      {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-semibold text-on-surface font-headline leading-none line-clamp-1">
                        {currentUser?.name}
                      </div>
                      <div className="text-[10px] text-secondary font-label leading-tight capitalize">
                        {activeRole}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-secondary mr-1" />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="p-2 border-b border-surface-container">
                        <p className="text-xs font-semibold text-on-surface font-headline">{currentUser?.name}</p>
                        <p className="text-[11px] text-secondary truncate">{currentUser?.email}</p>
                        <div className="mt-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-container text-on-primary-container uppercase">
                            {currentUser?.role}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 space-y-1 text-xs">
                        {activeRole === 'student' && (
                          <NextLink
                            href="/student/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-on-surface hover:bg-surface-container"
                          >
                            <UserIcon className="w-4 h-4 text-primary" />
                            <span>Student Profile & Documents</span>
                          </NextLink>
                        )}
                        <NextLink
                          href="/records"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-on-surface hover:bg-surface-container"
                        >
                          <FileCheck className="w-4 h-4 text-primary" />
                          <span>Audit Verification Log</span>
                        </NextLink>
                        <NextLink
                          href="/help"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-on-surface hover:bg-surface-container"
                        >
                          <HelpCircle className="w-4 h-4 text-primary" />
                          <span>Help & Support Center</span>
                        </NextLink>
                      </div>

                      <div className="mt-2 pt-2 border-t border-surface-container">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                            router.push('/auth');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out / Change Persona</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <NextLink
                href="/auth"
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In / Access Portal</span>
              </NextLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
