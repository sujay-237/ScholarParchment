'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import {
  Bell,
  CheckCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  Trash2,
  Filter,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const { activeRole } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'role'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (selectedFilter === 'unread') return !n.read;
    if (selectedFilter === 'role') return n.roleTarget === activeRole || n.roleTarget === 'all';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-surface-container">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">
                Notifications Center
              </h1>
              {unreadCount > 0 && (
                <span className="bg-primary-container text-on-primary-container text-xs font-bold px-2 py-0.5 rounded-full font-label">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              Live updates regarding application review stages, queries, and DBT disbursements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="px-3.5 py-2 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-primary" />
              <span>Mark All Read</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              selectedFilter === 'all'
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'bg-surface-container text-secondary hover:text-on-surface'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setSelectedFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              selectedFilter === 'unread'
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'bg-surface-container text-secondary hover:text-on-surface'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setSelectedFilter('role')}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              selectedFilter === 'role'
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'bg-surface-container text-secondary hover:text-on-surface'
            }`}
          >
            My Role ({activeRole.toUpperCase()})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                notif.read
                  ? 'bg-surface-container-lowest border-outline-variant/50 opacity-80 hover:opacity-100'
                  : 'bg-surface-container-lowest border-primary/40 shadow-sm ring-1 ring-primary/20'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <div className="p-2.5 rounded-xl bg-surface-container-low mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-sm font-headline text-on-surface">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] font-mono text-secondary bg-surface-container px-2 py-0.5 rounded">
                      {formatDateTime(notif.timestamp)}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.link && (
                    <div className="pt-2">
                      <Link
                        href={notif.link}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        <span>{notif.actionLabel || 'View Details'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearNotification(notif.id);
                }}
                className="p-1.5 text-secondary hover:text-rose-700 hover:bg-surface-container rounded-lg transition-colors"
                title="Dismiss notification"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/60 space-y-2">
              <Bell className="w-8 h-8 text-secondary mx-auto" />
              <p className="font-bold text-sm text-on-surface">No notifications to display</p>
              <p className="text-xs text-secondary">You are all caught up with system alerts.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
