import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScheduledNotifications = ({ scheduledNotifications, onToggleScheduled, onDeleteScheduled }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScheduleTypeIcon = (type) => {
    switch (type) {
      case 'recurring': return 'Repeat';
      case 'one-time': return 'Clock';
      case 'automated': return 'Zap';
      default: return 'Calendar';
    }
  };

  const getScheduleTypeColor = (type) => {
    switch (type) {
      case 'recurring': return 'text-secondary';
      case 'one-time': return 'text-primary';
      case 'automated': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const formatScheduleTime = (schedule) => {
    if (schedule?.type === 'recurring') {
      return `Every ${schedule?.frequency} at ${schedule?.time}`;
    }
    if (schedule?.type === 'one-time') {
      return new Date(schedule.scheduledFor)?.toLocaleString();
    }
    if (schedule?.type === 'automated') {
      return `Triggered by ${schedule?.trigger}`;
    }
    return 'Unknown schedule';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success/10 text-success', label: 'Active' },
      paused: { color: 'bg-warning/10 text-warning', label: 'Paused' },
      completed: { color: 'bg-muted text-muted-foreground', label: 'Completed' },
      failed: { color: 'bg-error/10 text-error', label: 'Failed' }
    };

    const config = statusConfig?.[status] || statusConfig?.active;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const upcomingNotifications = scheduledNotifications?.filter(n => 
    n?.status === 'active' && new Date(n.nextRun) > new Date()
  )?.sort((a, b) => new Date(a.nextRun) - new Date(b.nextRun));

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="Calendar" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Scheduled Notifications</h3>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
            {upcomingNotifications?.length} upcoming
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          {scheduledNotifications?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h4 className="font-medium text-foreground mb-2">No Scheduled Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Set up automated reminders and recurring notifications to stay organized.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Upcoming Section */}
              {upcomingNotifications?.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Icon name="Clock" size={16} />
                    Upcoming Notifications
                  </h4>
                  <div className="space-y-3">
                    {upcomingNotifications?.slice(0, 3)?.map((notification) => (
                      <div key={notification?.id} className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon 
                                name={getScheduleTypeIcon(notification?.type)} 
                                size={16} 
                                className={getScheduleTypeColor(notification?.type)}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-foreground mb-1">{notification?.title}</h5>
                              <p className="text-sm text-muted-foreground mb-2">{notification?.message}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{formatScheduleTime(notification)}</span>
                                <span>Next: {new Date(notification.nextRun)?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(notification?.status)}
                            <Button
                              variant="ghost"
                              size="xs"
                              iconName={notification?.status === 'active' ? 'Pause' : 'Play'}
                              onClick={() => onToggleScheduled(notification?.id)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Scheduled Notifications */}
              <div>
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Icon name="List" size={16} />
                  All Scheduled Notifications
                </h4>
                <div className="space-y-3">
                  {scheduledNotifications?.map((notification) => (
                    <div key={notification?.id} className="border border-border rounded-lg p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon 
                              name={getScheduleTypeIcon(notification?.type)} 
                              size={16} 
                              className={getScheduleTypeColor(notification?.type)}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-foreground">{notification?.title}</h5>
                              <span className="text-xs text-muted-foreground capitalize">
                                ({notification?.type})
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification?.message}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{formatScheduleTime(notification)}</span>
                              {notification?.lastRun && (
                                <span>Last: {new Date(notification.lastRun)?.toLocaleString()}</span>
                              )}
                              {notification?.nextRun && notification?.status === 'active' && (
                                <span>Next: {new Date(notification.nextRun)?.toLocaleString()}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              {notification?.channels?.map((channel) => (
                                <div key={channel} className="flex items-center gap-1">
                                  <Icon 
                                    name={channel === 'sms' ? 'MessageSquare' : 
                                          channel === 'email' ? 'Mail' : 
                                          channel === 'whatsapp' ? 'MessageCircle' : 'Bell'} 
                                    size={12} 
                                    className="text-muted-foreground" 
                                  />
                                  <span className="text-xs text-muted-foreground capitalize">
                                    {channel}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(notification?.status)}
                          <Button
                            variant="ghost"
                            size="xs"
                            iconName={notification?.status === 'active' ? 'Pause' : 'Play'}
                            onClick={() => onToggleScheduled(notification?.id)}
                          />
                          <Button
                            variant="ghost"
                            size="xs"
                            iconName="Trash2"
                            onClick={() => onDeleteScheduled(notification?.id)}
                            className="text-error hover:text-error"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduledNotifications;