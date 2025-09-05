import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const NotificationBadge = ({ notifications, onViewAll }) => {
  const unreadCount = notifications?.filter(n => !n.read)?.length || 0;

  if (notifications.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
        <Icon name="BellOff" size={32} className="text-gray-400 dark:text-gray-500 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400 text-sm">No new notifications</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
        {unreadCount > 0 && (
          <span className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 text-xs font-semibold rounded-full">
            {unreadCount} New
          </span>
        )}
      </div>
      <div className="space-y-4">
        {notifications.slice(0, 3).map((notification) => (
          <div key={notification.id} className="flex items-start gap-3">
            <div className={cn(
              'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
              notification.priority === 'urgent' ? 'bg-red-500' :
              notification.priority === 'high' ? 'bg-yellow-500' :
              'bg-gray-400'
            )} />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{notification.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
      {notifications.length > 3 && (
        <Button variant="ghost" fullWidth onClick={onViewAll} className="mt-4">
          View All ({notifications.length})
          <Icon name="ArrowRight" size={16} className="ml-2" />
        </Button>
      )}
    </div>
  );
};

export default NotificationBadge;
