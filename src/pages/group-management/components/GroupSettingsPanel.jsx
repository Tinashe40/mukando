import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const GroupSettingsPanel = ({ groupSettings, onSettingsUpdate }) => {
  const [settings, setSettings] = useState(groupSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'contributions', label: 'Contributions', icon: 'Wallet' },
    { id: 'loans', label: 'Loan Rules', icon: 'CreditCard' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'ZWL', label: 'Zimbabwean Dollar (ZWL)' },
    { value: 'ZAR', label: 'South African Rand (ZAR)' }
  ];

  const frequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const penaltyTypeOptions = [
    { value: 'fixed', label: 'Fixed Amount' },
    { value: 'percentage', label: 'Percentage of Contribution' }
  ];

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleNestedChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    onSettingsUpdate(settings);
    setHasChanges(false);
  };

  const handleResetSettings = () => {
    setSettings(groupSettings);
    setHasChanges(false);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Group Name"
          value={settings?.groupName}
          onChange={(e) => handleInputChange('groupName', e?.target?.value)}
          placeholder="Enter group name"
          required
        />
        
        <Input
          label="Group Description"
          value={settings?.description}
          onChange={(e) => handleInputChange('description', e?.target?.value)}
          placeholder="Brief description of the group"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Primary Currency"
          options={currencyOptions}
          value={settings?.currency}
          onChange={(value) => handleInputChange('currency', value)}
        />
        
        <Input
          label="Maximum Members"
          type="number"
          value={settings?.maxMembers}
          onChange={(e) => handleInputChange('maxMembers', parseInt(e?.target?.value))}
          min="5"
          max="100"
        />
      </div>

      <div>
        <Checkbox
          label="Allow new member invitations"
          checked={settings?.allowInvitations}
          onChange={(e) => handleInputChange('allowInvitations', e?.target?.checked)}
        />
      </div>

      <div>
        <Checkbox
          label="Require admin approval for new members"
          checked={settings?.requireApproval}
          onChange={(e) => handleInputChange('requireApproval', e?.target?.checked)}
        />
      </div>
    </div>
  );

  const renderContributionSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Minimum Contribution Amount"
          type="number"
          value={settings?.contributions?.minimumAmount}
          onChange={(e) => handleNestedChange('contributions', 'minimumAmount', parseFloat(e?.target?.value))}
          min="0"
          step="0.01"
        />
        
        <Input
          label="Maximum Contribution Amount"
          type="number"
          value={settings?.contributions?.maximumAmount}
          onChange={(e) => handleNestedChange('contributions', 'maximumAmount', parseFloat(e?.target?.value))}
          min="0"
          step="0.01"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Contribution Frequency"
          options={frequencyOptions}
          value={settings?.contributions?.frequency}
          onChange={(value) => handleNestedChange('contributions', 'frequency', value)}
        />
        
        <Input
          label="Due Date (Day of Month/Week)"
          type="number"
          value={settings?.contributions?.dueDate}
          onChange={(e) => handleNestedChange('contributions', 'dueDate', parseInt(e?.target?.value))}
          min="1"
          max="31"
        />
      </div>

      <div className="border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-4">Late Payment Penalties</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Select
            label="Penalty Type"
            options={penaltyTypeOptions}
            value={settings?.contributions?.penaltyType}
            onChange={(value) => handleNestedChange('contributions', 'penaltyType', value)}
          />
          
          <Input
            label={`Penalty ${settings?.contributions?.penaltyType === 'fixed' ? 'Amount' : 'Percentage'}`}
            type="number"
            value={settings?.contributions?.penaltyAmount}
            onChange={(e) => handleNestedChange('contributions', 'penaltyAmount', parseFloat(e?.target?.value))}
            min="0"
            step={settings?.contributions?.penaltyType === 'fixed' ? '0.01' : '0.1'}
          />
        </div>

        <Input
          label="Grace Period (Days)"
          type="number"
          value={settings?.contributions?.gracePeriod}
          onChange={(e) => handleNestedChange('contributions', 'gracePeriod', parseInt(e?.target?.value))}
          min="0"
          max="30"
          description="Number of days after due date before penalty applies"
        />
      </div>
    </div>
  );

  const renderLoanSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Minimum Loan Amount"
          type="number"
          value={settings?.loans?.minimumAmount}
          onChange={(e) => handleNestedChange('loans', 'minimumAmount', parseFloat(e?.target?.value))}
          min="0"
          step="0.01"
        />
        
        <Input
          label="Maximum Loan Amount"
          type="number"
          value={settings?.loans?.maximumAmount}
          onChange={(e) => handleNestedChange('loans', 'maximumAmount', parseFloat(e?.target?.value))}
          min="0"
          step="0.01"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Interest Rate (%)"
          type="number"
          value={settings?.loans?.interestRate}
          onChange={(e) => handleNestedChange('loans', 'interestRate', parseFloat(e?.target?.value))}
          min="0"
          max="100"
          step="0.1"
        />
        
        <Input
          label="Maximum Loan Term (Months)"
          type="number"
          value={settings?.loans?.maxTermMonths}
          onChange={(e) => handleNestedChange('loans', 'maxTermMonths', parseInt(e?.target?.value))}
          min="1"
          max="60"
        />
      </div>

      <div className="border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-4">Loan Eligibility Rules</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Minimum Membership Period (Months)"
            type="number"
            value={settings?.loans?.minMembershipMonths}
            onChange={(e) => handleNestedChange('loans', 'minMembershipMonths', parseInt(e?.target?.value))}
            min="0"
            max="24"
          />
          
          <Input
            label="Minimum Credit Score"
            type="number"
            value={settings?.loans?.minCreditScore}
            onChange={(e) => handleNestedChange('loans', 'minCreditScore', parseInt(e?.target?.value))}
            min="0"
            max="100"
          />
        </div>

        <div>
          <Checkbox
            label="Require guarantor for loans above maximum individual limit"
            checked={settings?.loans?.requireGuarantor}
            onChange={(e) => handleNestedChange('loans', 'requireGuarantor', e?.target?.checked)}
          />
        </div>

        <div>
          <Checkbox
            label="Allow multiple active loans per member"
            checked={settings?.loans?.allowMultipleLoans}
            onChange={(e) => handleNestedChange('loans', 'allowMultipleLoans', e?.target?.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-4">Email Notifications</h4>
        <div className="space-y-3">
          <Checkbox
            label="Contribution reminders"
            checked={settings?.notifications?.email?.contributionReminders}
            onChange={(e) => handleNestedChange('notifications', 'email', {
              ...settings?.notifications?.email,
              contributionReminders: e?.target?.checked
            })}
          />
          <Checkbox
            label="Loan approval notifications"
            checked={settings?.notifications?.email?.loanApprovals}
            onChange={(e) => handleNestedChange('notifications', 'email', {
              ...settings?.notifications?.email,
              loanApprovals: e?.target?.checked
            })}
          />
          <Checkbox
            label="Payment confirmations"
            checked={settings?.notifications?.email?.paymentConfirmations}
            onChange={(e) => handleNestedChange('notifications', 'email', {
              ...settings?.notifications?.email,
              paymentConfirmations: e?.target?.checked
            })}
          />
        </div>
      </div>

      <div className="border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-4">SMS Notifications</h4>
        <div className="space-y-3">
          <Checkbox
            label="Payment due reminders"
            checked={settings?.notifications?.sms?.paymentReminders}
            onChange={(e) => handleNestedChange('notifications', 'sms', {
              ...settings?.notifications?.sms,
              paymentReminders: e?.target?.checked
            })}
          />
          <Checkbox
            label="Loan status updates"
            checked={settings?.notifications?.sms?.loanUpdates}
            onChange={(e) => handleNestedChange('notifications', 'sms', {
              ...settings?.notifications?.sms,
              loanUpdates: e?.target?.checked
            })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Reminder Days Before Due Date"
          type="number"
          value={settings?.notifications?.reminderDays}
          onChange={(e) => handleNestedChange('notifications', 'reminderDays', parseInt(e?.target?.value))}
          min="1"
          max="30"
        />
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-4">Access Control</h4>
        <div className="space-y-3">
          <Checkbox
            label="Require two-factor authentication for admins"
            checked={settings?.security?.requireTwoFactor}
            onChange={(e) => handleNestedChange('security', 'requireTwoFactor', e?.target?.checked)}
          />
          <Checkbox
            label="Enable audit logging"
            checked={settings?.security?.auditLogging}
            onChange={(e) => handleNestedChange('security', 'auditLogging', e?.target?.checked)}
          />
          <Checkbox
            label="Require approval for large transactions"
            checked={settings?.security?.requireApprovalForLargeTransactions}
            onChange={(e) => handleNestedChange('security', 'requireApprovalForLargeTransactions', e?.target?.checked)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Large Transaction Threshold"
          type="number"
          value={settings?.security?.largeTransactionThreshold}
          onChange={(e) => handleNestedChange('security', 'largeTransactionThreshold', parseFloat(e?.target?.value))}
          min="0"
          step="0.01"
        />
        
        <Input
          label="Session Timeout (Minutes)"
          type="number"
          value={settings?.security?.sessionTimeout}
          onChange={(e) => handleNestedChange('security', 'sessionTimeout', parseInt(e?.target?.value))}
          min="15"
          max="480"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Group Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure group rules, contribution schedules, and loan parameters
            </p>
          </div>
          
          {hasChanges && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleResetSettings}
              >
                Reset
              </Button>
              <Button
                variant="default"
                onClick={handleSaveSettings}
              >
                <Icon name="Save" size={16} />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6" aria-label="Settings tabs">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              {tab?.label}
            </button>
          ))}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'contributions' && renderContributionSettings()}
        {activeTab === 'loans' && renderLoanSettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        {activeTab === 'security' && renderSecuritySettings()}
      </div>
    </div>
  );
};

export default GroupSettingsPanel;