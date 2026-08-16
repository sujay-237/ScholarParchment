import React from 'react';
import { ApplicationStatus } from '@/types';
import { getStatusDetails, cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle, XCircle, Send, Landmark, ArrowRightCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showIcon = true,
}) => {
  const details = getStatusDetails(status);

  const getIcon = () => {
    switch (status) {
      case 'draft':
        return <Clock className="w-3.5 h-3.5" />;
      case 'submitted':
      case 'college_pending':
        return <Send className="w-3.5 h-3.5" />;
      case 'college_verified':
      case 'ministry_pending':
        return <ArrowRightCircle className="w-3.5 h-3.5" />;
      case 'college_queried':
        return <AlertCircle className="w-3.5 h-3.5" />;
      case 'college_rejected':
      case 'rejected':
        return <XCircle className="w-3.5 h-3.5" />;
      case 'ministry_approved':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'disbursed':
        return <Landmark className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border transition-colors font-label shadow-sm',
        details.color,
        className
      )}
    >
      {showIcon && getIcon()}
      <span>{details.label}</span>
    </span>
  );
};
