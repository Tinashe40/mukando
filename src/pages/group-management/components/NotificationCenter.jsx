import React, { useState } from 'react';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const NotificationCenter = ({ notifications, onNotificationAction }) => {
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications?.filter(n => filter === 'all' || n.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
        <Select
          options={[{ value: 'all', label: 'All' }, { value: 'unread', label: 'Unread' }]}
          value={filter}
          onChange={setFilter}
          className="w-32"
        />
      </div>

      <div className="space-y-3">
        {filteredNotifications?.map(notification => (
          <div key={notification.id} className={`p-4 rounded-lg flex items-start gap-4 ${notification.read ? 'bg-muted/30' : 'bg-primary/10'}`}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary">
              <AppIcon name="Bell" />
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-foreground">{notification.title}</p>
              <p className="text-sm text-muted-foreground">{notification.description}</p>
            </div>
            <div className="text-xs text-muted-foreground">{new Date(notification.created_at).toLocaleDateString()}</div>
          </div>
        ))}
        {filteredNotifications?.length === 0 && (
          <p className="text-muted-foreground text-center py-8">No notifications to display.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
