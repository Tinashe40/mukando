import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCard = ({ 
  notification, 
  onMarkAsRead, 
  onMarkAsUnread, 
  onDelete, 
  onRetry 
}) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'payment': return 'Wallet';
      case 'loan': return 'CreditCard';
      case 'group': return 'Users';
      case 'system': return 'Settings';
      case 'reminder': return 'Clock';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-error';
    switch (type) {
      case 'payment': return 'text-warning';
      case 'loan': return 'text-primary';
      case 'group': return 'text-secondary';
      case 'system': return 'text-muted-foreground';
      case 'reminder': return 'text-accent';
      default: return 'text-foreground';
    }
  };

  const getDeliveryStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return 'CheckCircle';
      case 'failed': return 'XCircle';
      case 'pending': return 'Clock';
      case 'read': return 'CheckCheck';
      default: return 'Circle';
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-success';
      case 'failed': return 'text-error';
      case 'pending': return 'text-warning';
      case 'read': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return notificationTime?.toLocaleDateString();
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-warm-md ${
      !notification?.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
    }`}>
      <div className="flex items-start gap-3">
        {/* Notification Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          !notification?.isRead ? 'bg-primary/10' : 'bg-muted'
        }`}>
          <Icon 
            name={getNotificationIcon(notification?.type)} 
            size={20} 
            className={getNotificationColor(notification?.type, notification?.priority)}
          />
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className={`text-sm font-medium ${
                !notification?.isRead ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {notification?.title}
              </h3>
              {notification?.priority === 'high' && (
                <span className="inline-flex items-center gap-1 text-xs text-error font-medium mt-1">
                  <Icon name="AlertTriangle" size={12} />
                  High Priority
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatTimestamp(notification?.timestamp)}</span>
              {!notification?.isRead && (
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {notification?.message}
          </p>

          {/* Delivery Status */}
          <div className="flex items-center gap-4 mb-3">
            {notification?.channels?.map((channel) => (
              <div key={channel?.type} className="flex items-center gap-1">
                <Icon 
                  name={channel?.type === 'sms' ? 'MessageSquare' : 
                        channel?.type === 'email' ? 'Mail' : 
                        channel?.type === 'whatsapp' ? 'MessageCircle' : 'Bell'} 
                  size={14} 
                  className="text-muted-foreground" 
                />
                <Icon 
                  name={getDeliveryStatusIcon(channel?.status)} 
                  size={12} 
                  className={getDeliveryStatusColor(channel?.status)}
                />
                <span className="text-xs text-muted-foreground capitalize">
                  {channel?.status}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {!notification?.isRead ? (
              <Button
                variant="ghost"
                size="xs"
                iconName="Check"
                iconPosition="left"
                onClick={() => onMarkAsRead(notification?.id)}
              >
                Mark as Read
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="xs"
                iconName="RotateCcw"
                iconPosition="left"
                onClick={() => onMarkAsUnread(notification?.id)}
              >
                Mark as Unread
              </Button>
            )}

            {notification?.channels?.some(channel => channel?.status === 'failed') && (
              <Button
                variant="ghost"
                size="xs"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={() => onRetry(notification?.id)}
              >
                Retry
              </Button>
            )}

            {notification?.actionRequired && (
              <Button
                variant="outline"
                size="xs"
                iconName="ExternalLink"
                iconPosition="right"
              >
                Take Action
              </Button>
            )}

            <Button
              variant="ghost"
              size="xs"
              iconName="Trash2"
              onClick={() => onDelete(notification?.id)}
              className="text-error hover:text-error"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;