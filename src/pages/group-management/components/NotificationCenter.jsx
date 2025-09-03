import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const NotificationCenter = ({ notifications, onNotificationAction }) => {
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'loan_approval', label: 'Loan Approvals' },
    { value: 'payment_due', label: 'Payment Due' },
    { value: 'member_request', label: 'Member Requests' },
    { value: 'system_alert', label: 'System Alerts' },
    { value: 'contribution_reminder', label: 'Contribution Reminders' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const filteredNotifications = notifications?.filter(notification => {
    const matchesType = filterType === 'all' || notification?.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification?.priority === filterPriority;
    return matchesType && matchesPriority;
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedNotifications(filteredNotifications?.map(n => n?.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleSelectNotification = (notificationId, checked) => {
    if (checked) {
      setSelectedNotifications([...selectedNotifications, notificationId]);
    } else {
      setSelectedNotifications(selectedNotifications?.filter(id => id !== notificationId));
    }
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'bg-error text-error-foreground', label: 'High', icon: 'AlertTriangle' },
      medium: { color: 'bg-warning text-warning-foreground', label: 'Medium', icon: 'AlertCircle' },
      low: { color: 'bg-success text-success-foreground', label: 'Low', icon: 'Info' }
    };

    const config = priorityConfig?.[priority] || priorityConfig?.low;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        {config?.label}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    const typeIcons = {
      loan_approval: 'CreditCard',
      payment_due: 'Clock',
      member_request: 'UserPlus',
      system_alert: 'AlertTriangle',
      contribution_reminder: 'Bell'
    };
    return typeIcons?.[type] || 'Bell';
  };

  const formatDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getActionButtons = (notification) => {
    switch (notification?.type) {
      case 'loan_approval':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNotificationAction('reject', notification?.id)}
            >
              Reject
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => onNotificationAction('approve', notification?.id)}
            >
              Approve
            </Button>
          </div>
        );
      case 'member_request':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNotificationAction('decline', notification?.id)}
            >
              Decline
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => onNotificationAction('accept', notification?.id)}
            >
              Accept
            </Button>
          </div>
        );
      default:
        return (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onNotificationAction('view', notification?.id)}
          >View Details
                      </Button>
        );
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Notifications Center</h3>
            <p className="text-sm text-muted-foreground">
              Manage pending approvals, reminders, and system alerts
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Select
              options={typeOptions}
              value={filterType}
              onChange={setFilterType}
              placeholder="Filter by type"
              className="w-full sm:w-40"
            />
            
            <Select
              options={priorityOptions}
              value={filterPriority}
              onChange={setFilterPriority}
              placeholder="Filter by priority"
              className="w-full sm:w-40"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications?.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedNotifications?.length} notification{selectedNotifications?.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNotificationAction('markRead', selectedNotifications)}
              >
                Mark as Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNotificationAction('archive', selectedNotifications)}
              >
                Archive
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Notifications List */}
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {/* Select All Header */}
        <div className="p-4 bg-muted/50">
          <Checkbox
            label={`Select all (${filteredNotifications?.length})`}
            checked={selectedNotifications?.length === filteredNotifications?.length && filteredNotifications?.length > 0}
            onChange={(e) => handleSelectAll(e?.target?.checked)}
          />
        </div>

        {filteredNotifications?.map((notification) => (
          <div 
            key={notification?.id} 
            className={`p-4 hover:bg-muted/50 transition-colors ${
              !notification?.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedNotifications?.includes(notification?.id)}
                onChange={(e) => handleSelectNotification(notification?.id, e?.target?.checked)}
              />
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                notification?.priority === 'high' ? 'bg-error/10 text-error' :
                notification?.priority === 'medium'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
              }`}>
                <Icon name={getTypeIcon(notification?.type)} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">{notification?.title}</h4>
                  {getPriorityBadge(notification?.priority)}
                  {!notification?.read && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {notification?.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{formatDate(notification?.timestamp)}</span>
                    {notification?.memberName && (
                      <span>From: {notification?.memberName}</span>
                    )}
                  </div>
                  
                  {getActionButtons(notification)}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNotificationAction('dismiss', notification?.id)}
                title="Dismiss notification"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {filteredNotifications?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Bell" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No notifications found</h3>
          <p className="text-muted-foreground">
            {filterType !== 'all' || filterPriority !== 'all' ?'Try adjusting your filter criteria' :'All caught up! No new notifications at this time.'
            }
          </p>
        </div>
      )}
      {/* Footer */}
      {filteredNotifications?.length > 0 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredNotifications?.length} of {notifications?.length} notifications
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNotificationAction('markAllRead')}
            >
              Mark All as Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNotificationAction('clearAll')}
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;