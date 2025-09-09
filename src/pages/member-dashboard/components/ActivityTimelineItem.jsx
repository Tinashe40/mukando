import React from 'react';
import AppIcon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const ActivityTimelineItem = ({ activity, isLast = false }) => {
  const { type, title, description, timestamp, amount } = activity;

  const ICONS = {
    contribution: 'PlusCircle',
    loan_approved: 'CheckCircle2',
    loan_request: 'HelpCircle',
    payment: 'ArrowUpRight',
    notification: 'Bell',
    group_join: 'Users',
    default: 'Activity',
  };

  const COLORS = {
    contribution: 'bg-success/10 text-success',
    loan_approved: 'bg-primary/10 text-primary',
    loan_request: 'bg-warning/10 text-warning',
    payment: 'bg-blue-500/10 text-blue-500',
    notification: 'bg-purple-500/10 text-purple-500',
    group_join: 'bg-muted-foreground/10 text-muted-foreground',
    default: 'bg-muted-foreground/10 text-muted-foreground',
  };

  const formatTime = (ts) => {
    const now = new Date();
    const activityTime = new Date(ts);
    const diffSeconds = Math.floor((now - activityTime) / 1000);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const iconName = ICONS[type] || ICONS.default;
  const iconColor = COLORS[type] || COLORS.default;

  return (
    <div className="flex gap-4">
      <div className="relative flex flex-col items-center">
        <div className={cn('w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0', iconColor)}>
          <AppIcon name={iconName} size={20} />
        </div>
        {!isLast && <div className="w-0.5 flex-grow bg-border/70 mt-2" />} 
      </div>

      <div className="flex-grow pb-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-foreground">{title}</p>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatTime(timestamp)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        {amount && (
          <p className="text-sm font-medium text-foreground mt-1">{formatCurrency(amount)}</p>
        )}
      </div>
    </div>
  );
};

export default ActivityTimelineItem;