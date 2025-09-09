import React, { useEffect, useState } from 'react';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const GroupSettingsPanel = ({ groupSettings, onSettingsUpdate }) => {
  const [settings, setSettings] = useState(groupSettings || {});

  useEffect(() => {
    setSettings(groupSettings || {});
  }, [groupSettings]);

  const handleSave = () => {
    onSettingsUpdate(settings);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground">General Settings</h3>
        <div className="mt-4 space-y-4">
          <Input label="Group Name" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
          <Input label="Group Description" value={settings.description} onChange={(e) => setSettings({ ...settings, description: e.target.value })} />
          <Checkbox label="Make group public" checked={settings.is_public} onChange={(e) => setSettings({ ...settings, is_public: e.target.checked })} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground">Contribution Rules</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Contribution Amount (USD)" type="number" value={settings.contribution_amount} onChange={(e) => setSettings({ ...settings, contribution_amount: parseFloat(e.target.value) })} />
          <Select label="Contribution Frequency" options={[{value: 'weekly', label: 'Weekly'}, {value: 'monthly', label: 'Monthly'}]} value={settings.contribution_frequency} onChange={(value) => setSettings({ ...settings, contribution_frequency: value })} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground">Loan Rules</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Interest Rate (%)" type="number" value={settings.loan_interest_rate} onChange={(e) => setSettings({ ...settings, loan_interest_rate: parseFloat(e.target.value) })} />
          <Input label="Max Loan Term (Months)" type="number" value={settings.max_loan_term} onChange={(e) => setSettings({ ...settings, max_loan_term: parseInt(e.target.value) })} />
        </div>
      </div>

      <div className="border-t border-border pt-6 flex justify-end">
        <Button onClick={handleSave}><AppIcon name="Save" className="mr-2" /> Save Changes</Button>
      </div>
    </div>
  );
};

export default GroupSettingsPanel;