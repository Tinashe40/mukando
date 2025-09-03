import React from 'react';
import Icon from '../../../components/AppIcon';

const NotificationBadge = ({ notifications, onViewAll }) => {
  const urgentCount = notifications?.filter(n => n?.priority === 'urgent')?.length;
  const totalCount = notifications?.length;

  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="Bell" size={16} color="white" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">Notifications</h4>
            <p className="text-xs text-muted-foreground">
              {totalCount} unread
            </p>
          </div>
        </div>
        {urgentCount > 0 && (
          <span className="px-2 py-1 bg-error text-error-foreground text-xs font-medium rounded-full">
            {urgentCount} urgent
          </span>
        )}
      </div>
      <div className="space-y-3">
        {notifications?.slice(0, 3)?.map((notification) => (
          <div key={notification?.id} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              notification?.priority === 'urgent' ? 'bg-error' :
              notification?.priority === 'high'? 'bg-warning' : 'bg-primary'
            }`}></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {notification?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {notification?.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      {totalCount > 3 && (
        <button
          onClick={onViewAll}
          className="w-full mt-4 pt-3 border-t border-border text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200"
        >
          View all {totalCount} notifications
        </button>
      )}
    </div>
  );
};

export default NotificationBadge;