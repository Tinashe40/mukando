import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MemberManagementTable from './components/MemberManagementTable';
import GroupAnalyticsPanel from './components/GroupAnalyticsPanel';
import LoanManagementSection from './components/LoanManagementSection';
import GroupSettingsPanel from './components/GroupSettingsPanel';
import MemberInvitationSystem from './components/MemberInvitationSystem';
import NotificationCenter from './components/NotificationCenter';
import { useAuth } from '../../contexts/AuthContext';
import { getGroupManagementData, getUserGroups } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Select from '../../components/ui/Select';

const GroupManagement = () => {
  const { user } = useAuth();
  const [managementData, setManagementData] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');

  useEffect(() => {
    const fetchGroups = async () => {
      if (user) {
        const groups = await getUserGroups(user.id);
        setUserGroups(groups || []);
        if (groups && groups.length > 0) {
          setSelectedGroup(groups[0].id);
        }
      }
    };
    fetchGroups();
  }, [user]);

  useEffect(() => {
    const fetchManagementData = async () => {
      if (selectedGroup) {
        setIsLoading(true);
        const data = await getGroupManagementData(selectedGroup);
        setManagementData(data);
        setIsLoading(false);
      }
    };
    fetchManagementData();
  }, [selectedGroup]);

  const renderTabContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!managementData) {
      return (
        <div className="text-center py-8">
          <Icon name="Inbox" size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No management data available for this group.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'members':
        return <MemberManagementTable members={managementData.members || []} />;
      case 'loans':
        return <LoanManagementSection loanRequests={managementData.loan_requests || []} />;
      case 'analytics':
        return <GroupAnalyticsPanel analyticsData={{}} />;
      case 'invitations':
        return <MemberInvitationSystem inviteHistory={managementData.invitations || []} />;
      case 'notifications':
        return <NotificationCenter notifications={[]} />;
      case 'settings':
        return <GroupSettingsPanel groupSettings={managementData.settings} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border shadow-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Users" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Group Management</h1>
                <Select
                  options={userGroups.map(g => ({ value: g.id, label: g.name }))}
                  value={selectedGroup}
                  onChange={setSelectedGroup}
                  className="w-48"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" iconName="Download" iconPosition="left">
                Export Report
              </Button>
              <Button variant="default" iconName="UserPlus" iconPosition="left" onClick={() => setActiveTab('invitations')}>
                Invite Members
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Management tabs">
            <button onClick={() => setActiveTab('members')} className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'members' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`}>
              <Icon name="Users" size={16} />
              Members
            </button>
            {/* Add other tabs here */}
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default GroupManagement;
