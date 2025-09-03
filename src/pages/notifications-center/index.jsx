import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import NotificationCard from './components/NotificationCard';
import NotificationFilters from './components/NotificationFilters';
import CommunicationPreferences from './components/CommunicationPreferences';
import ScheduledNotifications from './components/ScheduledNotifications';
import IntegrationStatus from './components/IntegrationStatus';
import BulkActions from './components/BulkActions';

const NotificationsCenter = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    priority: 'all',
    status: 'all',
    channel: 'all',
    deliveryStatus: 'all',
    dateFrom: '',
    dateTo: ''
  });

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'payment',
      priority: 'high',
      title: 'Payment Reminder - Monthly Contribution',
      message: `Your monthly contribution of $50.00 is due tomorrow (September 4, 2025). Please ensure sufficient funds are available in your account to avoid late fees.`,
      timestamp: new Date('2025-09-03T06:00:00'),
      isRead: false,
      actionRequired: true,
      channels: [
        { type: 'sms', status: 'delivered' },
        { type: 'email', status: 'delivered' },
        { type: 'whatsapp', status: 'pending' }
      ]
    },
    {
      id: 2,
      type: 'loan',
      priority: 'medium',
      title: 'Loan Application Approved',
      message: `Congratulations! Your loan application for $500.00 has been approved. The funds will be disbursed to your account within 24 hours. Please review the repayment schedule in your dashboard.`,
      timestamp: new Date('2025-09-02T14:30:00'),
      isRead: false,
      actionRequired: false,
      channels: [
        { type: 'sms', status: 'delivered' },
        { type: 'email', status: 'read' },
        { type: 'push', status: 'delivered' }
      ]
    },
    {
      id: 3,
      type: 'group',
      priority: 'medium',
      title: 'Group Meeting Scheduled',
      message: `The monthly group meeting has been scheduled for September 8, 2025 at 2:00 PM. We will discuss new loan policies and review group performance. Location: Community Center Hall A.`,
      timestamp: new Date('2025-09-01T10:15:00'),
      isRead: true,
      actionRequired: false,
      channels: [
        { type: 'email', status: 'read' },
        { type: 'whatsapp', status: 'delivered' }
      ]
    },
    {
      id: 4,
      type: 'system',
      priority: 'low',
      title: 'System Maintenance Notification',
      message: `Scheduled maintenance will occur on September 5, 2025 from 2:00 AM to 4:00 AM. During this time, some features may be temporarily unavailable. We apologize for any inconvenience.`,
      timestamp: new Date('2025-08-31T16:45:00'),
      isRead: true,
      actionRequired: false,
      channels: [
        { type: 'email', status: 'delivered' },
        { type: 'push', status: 'delivered' }
      ]
    },
    {
      id: 5,
      type: 'reminder',
      priority: 'high',
      title: 'Overdue Payment Alert',
      message: `Your payment of $25.00 was due on August 30, 2025 and is now 4 days overdue. Please make the payment immediately to avoid additional penalties. Late fee of $2.50 has been applied.`,
      timestamp: new Date('2025-08-30T09:00:00'),
      isRead: false,
      actionRequired: true,
      channels: [
        { type: 'sms', status: 'failed' },
        { type: 'email', status: 'delivered' },
        { type: 'whatsapp', status: 'delivered' }
      ]
    },
    {
      id: 6,
      type: 'group',
      priority: 'low',
      title: 'New Member Welcome',
      message: `Please join us in welcoming John Mukamuri to our savings group! John brings valuable experience from his previous group and will be a great addition to our community.`,
      timestamp: new Date('2025-08-29T11:20:00'),
      isRead: true,
      actionRequired: false,
      channels: [
        { type: 'email', status: 'read' },
        { type: 'whatsapp', status: 'read' }
      ]
    }
  ]);

  // Mock communication preferences
  const [communicationPreferences, setCommunicationPreferences] = useState({
    globalTiming: 'immediate',
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    payment_reminders: {
      enabled: true,
      channels: { sms: true, email: true, whatsapp: true, push: false },
      timing: 'immediate'
    },
    loan_updates: {
      enabled: true,
      channels: { sms: true, email: true, whatsapp: false, push: true },
      timing: 'immediate'
    },
    group_announcements: {
      enabled: true,
      channels: { sms: false, email: true, whatsapp: true, push: true },
      timing: 'daily'
    },
    system_alerts: {
      enabled: true,
      channels: { sms: false, email: true, whatsapp: false, push: true },
      timing: 'immediate'
    },
    marketing: {
      enabled: false,
      channels: { sms: false, email: false, whatsapp: false, push: false },
      timing: 'weekly'
    }
  });

  // Mock scheduled notifications
  const [scheduledNotifications, setScheduledNotifications] = useState([
    {
      id: 1,
      type: 'recurring',
      title: 'Monthly Contribution Reminder',
      message: 'Your monthly contribution is due in 3 days',
      frequency: 'month',
      time: '09:00',
      nextRun: '2025-09-01T09:00:00',
      lastRun: '2025-08-01T09:00:00',
      status: 'active',
      channels: ['sms', 'email']
    },
    {
      id: 2,
      type: 'one-time',
      title: 'Group Meeting Reminder',
      message: 'Group meeting tomorrow at 2:00 PM',
      scheduledFor: '2025-09-07T14:00:00',
      nextRun: '2025-09-07T14:00:00',
      status: 'active',
      channels: ['whatsapp', 'push']
    },
    {
      id: 3,
      type: 'automated',
      title: 'Loan Approval Notification',
      message: 'Automated notification for loan approvals',
      trigger: 'loan_approved',
      status: 'active',
      channels: ['sms', 'email', 'push']
    }
  ]);

  // Mock integration status
  const [integrations, setIntegrations] = useState([
    {
      id: 'sms',
      name: 'SMS Gateway',
      description: 'EcoCash SMS API for text message delivery',
      icon: 'MessageSquare',
      status: 'connected',
      lastChecked: '2025-09-03T07:30:00',
      lastSuccess: '2025-09-03T07:25:00',
      messagesSent: 156,
      successRate: 98.5
    },
    {
      id: 'email',
      name: 'Email Service',
      description: 'SMTP service for email notifications',
      icon: 'Mail',
      status: 'connected',
      lastChecked: '2025-09-03T07:30:00',
      lastSuccess: '2025-09-03T07:28:00',
      messagesSent: 89,
      successRate: 99.2
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'WhatsApp Business API integration',
      icon: 'MessageCircle',
      status: 'warning',
      lastChecked: '2025-09-03T07:30:00',
      lastSuccess: '2025-09-03T06:45:00',
      messagesSent: 67,
      successRate: 85.3,
      warning: 'Rate limit approaching. Consider upgrading plan.'
    },
    {
      id: 'push',
      name: 'Push Notifications',
      description: 'Firebase Cloud Messaging for push notifications',
      icon: 'Bell',
      status: 'disconnected',
      lastChecked: '2025-09-03T07:30:00',
      lastSuccess: '2025-09-02T18:20:00',
      messagesSent: 0,
      successRate: 0,
      error: 'Invalid FCM server key. Please update configuration.'
    }
  ]);

  // Filter notifications based on current filters
  const filteredNotifications = useMemo(() => {
    return notifications?.filter(notification => {
      // Search filter
      if (filters?.search && !notification?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
          !notification?.message?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
        return false;
      }

      // Type filter
      if (filters?.type !== 'all' && notification?.type !== filters?.type) {
        return false;
      }

      // Priority filter
      if (filters?.priority !== 'all' && notification?.priority !== filters?.priority) {
        return false;
      }

      // Status filter
      if (filters?.status !== 'all') {
        if (filters?.status === 'unread' && notification?.isRead) return false;
        if (filters?.status === 'read' && !notification?.isRead) return false;
      }

      // Channel filter
      if (filters?.channel !== 'all') {
        const hasChannel = notification?.channels?.some(channel => channel?.type === filters?.channel);
        if (!hasChannel) return false;
      }

      // Delivery status filter
      if (filters?.deliveryStatus !== 'all') {
        const hasDeliveryStatus = notification?.channels?.some(channel => channel?.status === filters?.deliveryStatus);
        if (!hasDeliveryStatus) return false;
      }

      // Date filters
      if (filters?.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        if (notification?.timestamp < fromDate) return false;
      }

      if (filters?.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate?.setHours(23, 59, 59, 999);
        if (notification?.timestamp > toDate) return false;
      }

      return true;
    });
  }, [notifications, filters]);

  const unreadCount = notifications?.filter(n => !n?.isRead)?.length;

  // Notification actions
  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => prev?.map(n => 
      n?.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAsUnread = (notificationId) => {
    setNotifications(prev => prev?.map(n => 
      n?.id === notificationId ? { ...n, isRead: false } : n
    ));
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev => prev?.filter(n => n?.id !== notificationId));
    setSelectedNotifications(prev => prev?.filter(id => id !== notificationId));
  };

  const handleRetryNotification = (notificationId) => {
    // Mock retry logic
    console.log('Retrying notification:', notificationId);
    setNotifications(prev => prev?.map(n => 
      n?.id === notificationId 
        ? {
            ...n,
            channels: n?.channels?.map(channel => 
              channel?.status === 'failed' ? { ...channel, status: 'pending' } : channel
            )
          }
        : n
    ));
  };

  // Bulk actions
  const handleSelectAll = () => {
    setSelectedNotifications(filteredNotifications?.map(n => n?.id));
  };

  const handleDeselectAll = () => {
    setSelectedNotifications([]);
  };

  const handleBulkMarkAsRead = (notificationIds) => {
    setNotifications(prev => prev?.map(n => 
      notificationIds?.includes(n?.id) ? { ...n, isRead: true } : n
    ));
    setSelectedNotifications([]);
  };

  const handleBulkMarkAsUnread = (notificationIds) => {
    setNotifications(prev => prev?.map(n => 
      notificationIds?.includes(n?.id) ? { ...n, isRead: false } : n
    ));
    setSelectedNotifications([]);
  };

  const handleBulkDelete = (notificationIds) => {
    setNotifications(prev => prev?.filter(n => !notificationIds?.includes(n?.id)));
    setSelectedNotifications([]);
  };

  // Scheduled notifications actions
  const handleToggleScheduled = (scheduledId) => {
    setScheduledNotifications(prev => prev?.map(s => 
      s?.id === scheduledId 
        ? { ...s, status: s?.status === 'active' ? 'paused' : 'active' }
        : s
    ));
  };

  const handleDeleteScheduled = (scheduledId) => {
    setScheduledNotifications(prev => prev?.filter(s => s?.id !== scheduledId));
  };

  // Integration actions
  const handleTestConnection = async (integrationId) => {
    // Mock test connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIntegrations(prev => prev?.map(i => 
      i?.id === integrationId 
        ? { 
            ...i, 
            status: Math.random() > 0.3 ? 'connected' : 'disconnected',
            lastChecked: new Date()?.toISOString()
          }
        : i
    ));
  };

  const handleRefreshStatus = () => {
    setIntegrations(prev => prev?.map(i => ({
      ...i,
      lastChecked: new Date()?.toISOString()
    })));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedNotifications([]);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      priority: 'all',
      status: 'all',
      channel: 'all',
      deliveryStatus: 'all',
      dateFrom: '',
      dateTo: ''
    });
    setSelectedNotifications([]);
  };

  return (
    <>
      <Helmet>
        <title>Notifications Center - Mukando</title>
        <meta name="description" content="Manage all your notifications, communication preferences, and integration status in one centralized location." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header 
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          isMenuOpen={mobileMenuOpen}
        />
        
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          userRole="member"
        />

        <main className={`pt-16 pb-20 lg:pb-8 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        }`}>
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Bell" size={24} className="text-primary" />
                <h1 className="text-2xl font-semibold text-foreground">Notifications Center</h1>
              </div>
              <p className="text-muted-foreground">
                Manage all your notifications, communication preferences, and delivery status in one place.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Bell" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{notifications?.length}</p>
                    <p className="text-sm text-muted-foreground">Total Notifications</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Icon name="Circle" size={20} className="text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{unreadCount}</p>
                    <p className="text-sm text-muted-foreground">Unread</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                    <Icon name="AlertTriangle" size={20} className="text-error" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">
                      {notifications?.filter(n => n?.priority === 'high')?.length}
                    </p>
                    <p className="text-sm text-muted-foreground">High Priority</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle" size={20} className="text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">
                      {integrations?.filter(i => i?.status === 'connected')?.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Connected Services</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
              <NotificationFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                totalNotifications={notifications?.length}
                unreadCount={unreadCount}
              />
            </div>

            {/* Bulk Actions */}
            <div className="mb-6">
              <BulkActions
                selectedNotifications={selectedNotifications}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onBulkMarkAsRead={handleBulkMarkAsRead}
                onBulkMarkAsUnread={handleBulkMarkAsUnread}
                onBulkDelete={handleBulkDelete}
                totalNotifications={notifications?.length}
                filteredCount={filteredNotifications?.length}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="xl:col-span-2 space-y-6">
                {/* Notifications List */}
                <div className="bg-card border border-border rounded-lg">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h2 className="font-medium text-foreground">
                        Notifications ({filteredNotifications?.length})
                      </h2>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="RefreshCw"
                          onClick={() => {
                            // Refresh notifications
                            console.log('Refreshing notifications...');
                          }}
                        >
                          Refresh
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="CheckCheck"
                          onClick={() => handleBulkMarkAsRead(filteredNotifications?.map(n => n?.id))}
                        >
                          Mark All Read
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    {filteredNotifications?.length === 0 ? (
                      <div className="text-center py-12">
                        <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium text-foreground mb-2">No Notifications Found</h3>
                        <p className="text-sm text-muted-foreground">
                          {notifications?.length === 0 
                            ? "You don't have any notifications yet."
                            : "No notifications match your current filters."
                          }
                        </p>
                        {notifications?.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="X"
                            iconPosition="left"
                            onClick={handleClearFilters}
                            className="mt-4"
                          >
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredNotifications?.map((notification) => (
                          <div key={notification?.id} className="relative">
                            <div className="absolute left-2 top-2 z-10">
                              <input
                                type="checkbox"
                                checked={selectedNotifications?.includes(notification?.id)}
                                onChange={(e) => {
                                  if (e?.target?.checked) {
                                    setSelectedNotifications(prev => [...prev, notification?.id]);
                                  } else {
                                    setSelectedNotifications(prev => prev?.filter(id => id !== notification?.id));
                                  }
                                }}
                                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                              />
                            </div>
                            <div className="ml-8">
                              <NotificationCard
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                                onMarkAsUnread={handleMarkAsUnread}
                                onDelete={handleDeleteNotification}
                                onRetry={handleRetryNotification}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                {/* Communication Preferences */}
                <CommunicationPreferences
                  preferences={communicationPreferences}
                  onPreferencesChange={setCommunicationPreferences}
                />

                {/* Integration Status */}
                <IntegrationStatus
                  integrations={integrations}
                  onTestConnection={handleTestConnection}
                  onRefreshStatus={handleRefreshStatus}
                />

                {/* Scheduled Notifications */}
                <ScheduledNotifications
                  scheduledNotifications={scheduledNotifications}
                  onToggleScheduled={handleToggleScheduled}
                  onDeleteScheduled={handleDeleteScheduled}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default NotificationsCenter;