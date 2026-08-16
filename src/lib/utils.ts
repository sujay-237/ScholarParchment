import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApplicationStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function generateHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x8f2a${hex}${Math.abs(hash * 31).toString(16).padStart(12, 'e7b1')}`;
}

export function getStatusDetails(status: ApplicationStatus) {
  switch (status) {
    case 'draft':
      return {
        label: 'Draft Application',
        color: 'bg-surface-container-high text-on-surface-variant border-outline-variant',
        step: 0,
        badgeVariant: 'neutral',
      };
    case 'submitted':
    case 'college_pending':
      return {
        label: 'Under College Review',
        color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200',
        step: 1,
        badgeVariant: 'warning',
      };
    case 'college_verified':
    case 'ministry_pending':
      return {
        label: 'College Verified - Ministry Review',
        color: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200',
        step: 2,
        badgeVariant: 'info',
      };
    case 'college_queried':
      return {
        label: 'Query Raised by College',
        color: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950 dark:text-orange-200',
        step: 1,
        badgeVariant: 'warning',
      };
    case 'college_rejected':
    case 'rejected':
      return {
        label: 'Application Rejected',
        color: 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950 dark:text-red-200',
        step: -1,
        badgeVariant: 'error',
      };
    case 'ministry_approved':
      return {
        label: 'Ministry Sanctioned - In Disbursement Queue',
        color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200',
        step: 3,
        badgeVariant: 'success',
      };
    case 'disbursed':
      return {
        label: 'Disbursed via DBT',
        color: 'bg-green-100 text-green-900 border-green-300 dark:bg-green-950 dark:text-green-200',
        step: 4,
        badgeVariant: 'success',
      };
    default:
      return {
        label: status,
        color: 'bg-surface-container text-on-surface border-outline-variant',
        step: 0,
        badgeVariant: 'neutral',
      };
  }
}
