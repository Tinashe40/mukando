import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const PaymentReminderCard = ({ reminders }) => {
  const navigate = useNavigate();

  const hasReminders = reminders && reminders.length > 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getDueDateText = (days) => {
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  const getDueDateColor = (days) => {
    if (days < 0) return 'text-destructive';
    if (days <= 1) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Payment Reminders</h3>
        {hasReminders && (
          <span className="px-2.5 py-1 bg-warning/10 text-warning text-xs font-semibold rounded-full">
            {reminders.length} Pending
          </span>
        )}
      </div>

      {!hasReminders ? (
        <div className="text-center py-8">
          <AppIcon name="CheckCircle" size={40} className="text-success mx-auto mb-3" />
          <h3 className="font-semibold text-foreground">All Caught Up!</h3>
          <p className="text-sm text-muted-foreground mt-1">No pending payments.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.slice(0, 3).map((reminder) => (
            <div key={reminder.id} className="p-3 rounded-lg hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{reminder.title}</p>
                  <p className={cn('text-sm font-medium', getDueDateColor(reminder.daysUntilDue))}>
                    {getDueDateText(reminder.daysUntilDue)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-foreground">{formatCurrency(reminder.amount)}</p>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/payment-processing')} className="-mr-2 h-auto py-1 px-2">
                    Pay Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button variant="ghost" fullWidth onClick={() => navigate('/payment-processing')} className="mt-4">
        View All Payments
        <AppIcon name="ArrowRight" size={16} className="ml-2" />
      </Button>
    </div>
  );
};

export default PaymentReminderCard;