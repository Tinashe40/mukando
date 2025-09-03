import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentReminderCard = ({ reminders, onPayNow, onViewAll }) => {
  if (!reminders || reminders?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-warm">
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={24} className="text-success" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">All Caught Up!</h3>
          <p className="text-sm text-muted-foreground">
            No pending payments at this time
          </p>
        </div>
      </div>
    );
  }

  const urgentReminders = reminders?.filter(r => r?.daysUntilDue <= 1);
  const upcomingReminders = reminders?.filter(r => r?.daysUntilDue > 1);

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-ZW', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    })?.format(amount);
  };

  const getDueDateColor = (days) => {
    if (days < 0) return 'text-error';
    if (days <= 1) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getDueDateText = (days) => {
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Payment Reminders</h3>
          <p className="text-sm text-muted-foreground">
            {reminders?.length} pending payment{reminders?.length !== 1 ? 's' : ''}
          </p>
        </div>
        {urgentReminders?.length > 0 && (
          <span className="px-3 py-1 bg-error text-error-foreground text-sm font-medium rounded-full">
            {urgentReminders?.length} urgent
          </span>
        )}
      </div>
      <div className="space-y-4">
        {/* Urgent Reminders */}
        {urgentReminders?.map((reminder) => (
          <div key={reminder?.id} className="p-4 bg-error/5 border border-error/20 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-error rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} color="white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{reminder?.title}</h4>
                  <p className="text-sm text-muted-foreground">{reminder?.group}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground font-data">
                  {formatCurrency(reminder?.amount, reminder?.currency)}
                </p>
                <p className={`text-sm font-medium ${getDueDateColor(reminder?.daysUntilDue)}`}>
                  {getDueDateText(reminder?.daysUntilDue)}
                </p>
              </div>
            </div>
            <Button
              variant="default"
              size="sm"
              fullWidth
              onClick={() => onPayNow(reminder)}
              iconName="CreditCard"
              iconPosition="left"
              iconSize={16}
            >
              Pay Now
            </Button>
          </div>
        ))}

        {/* Upcoming Reminders */}
        {upcomingReminders?.slice(0, 2)?.map((reminder) => (
          <div key={reminder?.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} color="white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{reminder?.title}</h4>
                  <p className="text-sm text-muted-foreground">{reminder?.group}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground font-data">
                  {formatCurrency(reminder?.amount, reminder?.currency)}
                </p>
                <p className={`text-sm font-medium ${getDueDateColor(reminder?.daysUntilDue)}`}>
                  {getDueDateText(reminder?.daysUntilDue)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {reminders?.length > 3 && (
          <Button
            variant="outline"
            fullWidth
            onClick={onViewAll}
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={16}
          >
            View all {reminders?.length} reminders
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentReminderCard;