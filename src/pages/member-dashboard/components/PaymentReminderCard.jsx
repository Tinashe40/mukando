import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const PaymentReminderCard = ({ reminders, onPayNow, onViewAll }) => {
  const hasReminders = reminders && reminders.length > 0;

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const getDueDateText = (days) => {
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  const getDueDateColor = (days) => {
    if (days < 0) return 'text-red-500';
    if (days <= 1) return 'text-yellow-500';
    return 'text-gray-500';
  };

  if (!hasReminders) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
        <Icon name="CheckCircle" size={32} className="text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">All Caught Up!</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No pending payments at this time.</p>
      </div>
    );
  }

  const urgentReminders = reminders.filter(r => r.daysUntilDue <= 1);
  const upcomingReminders = reminders.filter(r => r.daysUntilDue > 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payment Reminders</h3>
        {urgentReminders.length > 0 && (
          <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 text-xs font-semibold rounded-full">
            {urgentReminders.length} Urgent
          </span>
        )}
      </div>
      <div className="space-y-4">
        {urgentReminders.map((reminder) => (
          <div key={reminder.id} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="AlertTriangle" size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{reminder.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.group}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(reminder.amount, reminder.currency)}</p>
                <p className={cn('text-sm font-medium', getDueDateColor(reminder.daysUntilDue))}>
                  {getDueDateText(reminder.daysUntilDue)}
                </p>
              </div>
            </div>
            <Button
              variant="default"
              fullWidth
              onClick={() => onPayNow(reminder)}
              className="mt-2"
            >
              Pay Now
            </Button>
          </div>
        ))}

        {upcomingReminders.slice(0, 2).map((reminder) => (
          <div key={reminder.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Clock" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{reminder.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.group}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(reminder.amount, reminder.currency)}</p>
                <p className={cn('text-sm font-medium', getDueDateColor(reminder.daysUntilDue))}>
                  {getDueDateText(reminder.daysUntilDue)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {reminders.length > 3 && (
          <Button variant="ghost" fullWidth onClick={onViewAll} className="mt-4">
            View All ({reminders.length})
            <Icon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentReminderCard;
