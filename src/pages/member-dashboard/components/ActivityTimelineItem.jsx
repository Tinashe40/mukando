import React from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const ActivityTimelineItem = ({ activity, isLast = false }) => {
  const { type, title, description, timestamp, amount, currency, status, group } = activity;

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
    contribution: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
    loan_approved: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
    loan_request: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400',
    payment: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
    notification: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
    group_join: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    default: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const iconName = ICONS[type] || ICONS.default;
  const iconColor = COLORS[type] || COLORS.default;

  return (
    <div className="flex items-start gap-4 group">
      <div className="relative">
        <div className={cn('w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0', iconColor)}>
          <Icon name={iconName} size={22} />
        </div>
        {!isLast && (
          <div className="absolute left-1/2 -translate-x-1/2 top-12 w-0.5 h-full bg-gray-200 dark:bg-gray-700 group-hover:bg-primary transition-colors duration-300"></div>
        )}
      </div>

      <div className="flex-grow pt-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</p>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            {formatTime(timestamp)}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>

        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          {amount && (
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {formatCurrency(amount)}
            </span>
          )}
          {status && (
            <span
              className={cn('px-2.5 py-0.5 rounded-full font-medium',
                status === 'approved' && 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
                status === 'pending' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
                status === 'rejected' && 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
              )}
            >
              {status}
            </span>
          )}
          {group && (
            <div className="flex items-center gap-1.5">
              <Icon name="Users" size={14} />
              <span>{group}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimelineItem;
