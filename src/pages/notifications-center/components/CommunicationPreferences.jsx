import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';


const CommunicationPreferences = ({ preferences, onPreferencesChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const notificationTypes = [
    {
      id: 'payment_reminders',
      label: 'Payment Reminders',
      description: 'Notifications about upcoming and overdue payments',
      icon: 'Wallet'
    },
    {
      id: 'loan_updates',
      label: 'Loan Status Updates',
      description: 'Updates on loan applications, approvals, and rejections',
      icon: 'CreditCard'
    },
    {
      id: 'group_announcements',
      label: 'Group Announcements',
      description: 'Important announcements from group administrators',
      icon: 'Users'
    },
    {
      id: 'system_alerts',
      label: 'System Alerts',
      description: 'Technical updates and maintenance notifications',
      icon: 'Settings'
    },
    {
      id: 'marketing',
      label: 'Marketing & Promotions',
      description: 'Information about new features and promotional offers',
      icon: 'Megaphone'
    }
  ];

  const channels = [
    { id: 'sms', label: 'SMS', icon: 'MessageSquare' },
    { id: 'email', label: 'Email', icon: 'Mail' },
    { id: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle' },
    { id: 'push', label: 'Push Notifications', icon: 'Bell' }
  ];

  const timingOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'hourly', label: 'Hourly Digest' },
    { value: 'daily', label: 'Daily Digest' },
    { value: 'weekly', label: 'Weekly Digest' }
  ];

  const handleChannelToggle = (notificationType, channel, enabled) => {
    const updatedPreferences = {
      ...preferences,
      [notificationType]: {
        ...preferences?.[notificationType],
        channels: {
          ...preferences?.[notificationType]?.channels,
          [channel]: enabled
        }
      }
    };
    onPreferencesChange(updatedPreferences);
  };

  const handleTimingChange = (notificationType, timing) => {
    const updatedPreferences = {
      ...preferences,
      [notificationType]: {
        ...preferences?.[notificationType],
        timing
      }
    };
    onPreferencesChange(updatedPreferences);
  };

  const handleMasterToggle = (notificationType, enabled) => {
    const updatedPreferences = {
      ...preferences,
      [notificationType]: {
        ...preferences?.[notificationType],
        enabled
      }
    };
    onPreferencesChange(updatedPreferences);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="Settings" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Communication Preferences</h3>
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
        <div className="p-4 space-y-6">
          {/* Global Settings */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Global Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Default Notification Timing
                </label>
                <Select
                  options={timingOptions}
                  value={preferences?.globalTiming || 'immediate'}
                  onChange={(value) => onPreferencesChange({
                    ...preferences,
                    globalTiming: value
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Quiet Hours
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={preferences?.quietHoursStart || '22:00'}
                    onChange={(e) => onPreferencesChange({
                      ...preferences,
                      quietHoursStart: e?.target?.value
                    })}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={preferences?.quietHoursEnd || '07:00'}
                    onChange={(e) => onPreferencesChange({
                      ...preferences,
                      quietHoursEnd: e?.target?.value
                    })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Type Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Notification Types</h4>
            
            {notificationTypes?.map((type) => (
              <div key={type?.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={type?.icon} size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-foreground">{type?.label}</h5>
                      <Checkbox
                        checked={preferences?.[type?.id]?.enabled !== false}
                        onChange={(e) => handleMasterToggle(type?.id, e?.target?.checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{type?.description}</p>
                  </div>
                </div>

                {preferences?.[type?.id]?.enabled !== false && (
                  <div className="space-y-3 ml-11">
                    {/* Channels */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Delivery Channels
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {channels?.map((channel) => (
                          <div key={channel?.id} className="flex items-center gap-2">
                            <Checkbox
                              checked={preferences?.[type?.id]?.channels?.[channel?.id] !== false}
                              onChange={(e) => handleChannelToggle(type?.id, channel?.id, e?.target?.checked)}
                            />
                            <Icon name={channel?.icon} size={14} className="text-muted-foreground" />
                            <span className="text-sm text-foreground">{channel?.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timing */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Notification Timing
                      </label>
                      <Select
                        options={timingOptions}
                        value={preferences?.[type?.id]?.timing || preferences?.globalTiming || 'immediate'}
                        onChange={(value) => handleTimingChange(type?.id, value)}
                        className="max-w-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              variant="default"
              iconName="Save"
              iconPosition="left"
              onClick={() => {
                // Save preferences logic
                console.log('Saving preferences:', preferences);
              }}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationPreferences;