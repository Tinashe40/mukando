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
import { useAuth } from '../../contexts/AuthContext';
import { getNotificationsCenterData, getNotificationSettings, updateNotificationSettings, getScheduledNotifications } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const NotificationsCenter = () => {
  const { user } = useAuth();
  const [notificationsData, setNotificationsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    priority: 'all',
    status: 'all',
  });

  useEffect(() => {
    const fetchNotificationsData = async () => {
      if (user) {
        setIsLoading(true);
        const [notifications, settings, scheduled] = await Promise.all([
          getNotificationsCenterData(user.id),
          getNotificationSettings(user.id),
          getScheduledNotifications(user.id),
        ]);
        setNotificationsData(notifications);
        setCommunicationPreferences(settings[0]?.setting_value || {});
        setScheduledNotifications(scheduled || []);
        setIsLoading(false);
      }
    };
    fetchNotificationsData();
  }, [user]);

  const handlePreferencesChange = async (newPreferences) => {
    if (user) {
      await updateNotificationSettings(user.id, newPreferences);
      setCommunicationPreferences(newPreferences);
    }
  };

  const filteredNotifications = useMemo(() => {
    if (!notificationsData) return [];
    return notificationsData.notifications?.filter(notification => {
      if (filters.search && !notification.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.type !== 'all' && notification.type !== filters.type) {
        return false;
      }
      if (filters.priority !== 'all' && notification.priority !== filters.priority) {
        return false;
      }
      if (filters.status !== 'all') {
        if (filters.status === 'unread' && notification.isRead) return false;
        if (filters.status === 'read' && !notification.isRead) return false;
      }
      return true;
    });
  }, [notificationsData, filters]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!notificationsData) {
      return (
        <div className="text-center py-8">
          <Icon name="Inbox" size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Could not load notifications data.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-2">No Notifications Found</h3>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <CommunicationPreferences preferences={communicationPreferences} onPreferencesChange={handlePreferencesChange} />
          <IntegrationStatus integrations={notificationsData.integrations} />
          <ScheduledNotifications scheduledNotifications={scheduledNotifications} />
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Notifications Center - Mukando</title>
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
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground">Notifications Center</h1>
            </div>
            <NotificationFilters filters={filters} onFiltersChange={setFilters} />
            <BulkActions selectedNotifications={selectedNotifications} />
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default NotificationsCenter;
