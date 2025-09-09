import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationBadge = ({ notifications }) => {
  const navigate = useNavigate();
  const unreadCount = notifications?.filter(n => !n.read)?.length || 0;

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
        {unreadCount > 0 && (
          <span className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            {unreadCount} New
          </span>
        )}
      </div>
      
      {notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.slice(0, 3).map((notification) => (
            <div key={notification.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${notification.read ? 'bg-muted' : 'bg-primary'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{notification.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <AppIcon name="BellOff" size={40} className="text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No new notifications.</p>
        </div>
      )}

      <Button variant="ghost" fullWidth onClick={() => navigate('/notifications-center')} className="mt-4">
        View All
        <AppIcon name="ArrowRight" size={16} className="ml-2" />
      </Button>
    </div>
  );
};

export default NotificationBadge;