import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const NotificationFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  totalNotifications,
  unreadCount 
}) => {
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'payment', label: 'Payment Reminders' },
    { value: 'loan', label: 'Loan Updates' },
    { value: 'group', label: 'Group Announcements' },
    { value: 'system', label: 'System Alerts' },
    { value: 'reminder', label: 'General Reminders' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'unread', label: 'Unread Only' },
    { value: 'read', label: 'Read Only' }
  ];

  const channelOptions = [
    { value: 'all', label: 'All Channels' },
    { value: 'sms', label: 'SMS' },
    { value: 'email', label: 'Email' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'push', label: 'Push Notifications' }
  ];

  const deliveryStatusOptions = [
    { value: 'all', label: 'All Delivery Status' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'failed', label: 'Failed' },
    { value: 'pending', label: 'Pending' },
    { value: 'read', label: 'Read' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value && value !== 'all' && value !== ''
  );

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Filters</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {totalNotifications} total, {unreadCount} unread
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="xs"
              iconName="X"
              onClick={onClearFilters}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="search"
          placeholder="Search notifications..."
          value={filters?.search || ''}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          className="w-full"
        />
        
        <div className="flex items-center gap-2">
          <Input
            type="date"
            label="From Date"
            value={filters?.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
            className="flex-1"
          />
          <Input
            type="date"
            label="To Date"
            value={filters?.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
            className="flex-1"
          />
        </div>
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Select
          label="Type"
          options={typeOptions}
          value={filters?.type || 'all'}
          onChange={(value) => handleFilterChange('type', value)}
        />

        <Select
          label="Priority"
          options={priorityOptions}
          value={filters?.priority || 'all'}
          onChange={(value) => handleFilterChange('priority', value)}
        />

        <Select
          label="Read Status"
          options={statusOptions}
          value={filters?.status || 'all'}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Select
          label="Channel"
          options={channelOptions}
          value={filters?.channel || 'all'}
          onChange={(value) => handleFilterChange('channel', value)}
        />

        <Select
          label="Delivery Status"
          options={deliveryStatusOptions}
          value={filters?.deliveryStatus || 'all'}
          onChange={(value) => handleFilterChange('deliveryStatus', value)}
        />
      </div>
      {/* Quick Filter Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Quick filters:</span>
        <Button
          variant={filters?.status === 'unread' ? 'default' : 'ghost'}
          size="xs"
          iconName="Circle"
          iconPosition="left"
          onClick={() => handleFilterChange('status', filters?.status === 'unread' ? 'all' : 'unread')}
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filters?.priority === 'high' ? 'default' : 'ghost'}
          size="xs"
          iconName="AlertTriangle"
          iconPosition="left"
          onClick={() => handleFilterChange('priority', filters?.priority === 'high' ? 'all' : 'high')}
        >
          High Priority
        </Button>
        <Button
          variant={filters?.deliveryStatus === 'failed' ? 'default' : 'ghost'}
          size="xs"
          iconName="XCircle"
          iconPosition="left"
          onClick={() => handleFilterChange('deliveryStatus', filters?.deliveryStatus === 'failed' ? 'all' : 'failed')}
        >
          Failed Delivery
        </Button>
      </div>
    </div>
  );
};

export default NotificationFilters;