import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'bg-primary-container/40',
  iconColor = 'text-primary',
  trend,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm transition-all duration-200',
        onClick ? 'cursor-pointer hover:border-primary hover:shadow-md' : '',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary font-label">
            {title}
          </p>
          <p className="text-2xl font-bold font-headline text-on-surface tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-on-surface-variant line-clamp-1">{subtitle}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-surface-container flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'font-semibold px-1.5 py-0.5 rounded',
              trend.isPositive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            )}
          >
            {trend.value}
          </span>
          <span className="text-secondary text-[11px]">vs previous cycle</span>
        </div>
      )}
    </div>
  );
};
