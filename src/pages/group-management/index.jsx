import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppIcon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { approveLoan, getGroupManagementData, getUserGroups, inviteMember, rejectLoan, updateGroupSettings } from '../../lib/supabase';
import GroupAnalyticsPanel from './components/GroupAnalyticsPanel';
import GroupSettingsPanel from './components/GroupSettingsPanel';
import LoanManagementSection from './components/LoanManagementSection';
import MemberInvitationSystem from './components/MemberInvitationSystem';
import MemberManagementTable from './components/MemberManagementTable';
import NotificationCenter from './components/NotificationCenter';

const useGroupManagement = (user) => {
  const [managementData, setManagementData] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;
      try {
        const groups = await getUserGroups(user.id);
        setUserGroups(groups || []);
        if (groups && groups.length > 0) {
          setSelectedGroup(groups[0].id);
        }
      } catch (err) {
        setError('Failed to fetch groups.');
      }
    };
    fetchGroups();
  }, [user]);

  useEffect(() => {
    if (!selectedGroup) return;
    const fetchManagementData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getGroupManagementData(selectedGroup);
        setManagementData(data);
      } catch (err) {
        setError('Failed to fetch management data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchManagementData();
  }, [selectedGroup]);

  // ... (rest of the hook is unchanged)

  return { managementData, userGroups, selectedGroup, setSelectedGroup, isLoading, error };
};

const GroupManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { managementData, userGroups, selectedGroup, setSelectedGroup, isLoading, error } = useGroupManagement(user);
  const [activeTab, setActiveTab] = useState('members');

  const tabs = useMemo(() => [
    { id: 'members', label: 'Members', icon: 'Users' },
    { id: 'loans', label: 'Loan Requests', icon: 'Handshake' },
    { id: 'analytics', label: 'Analytics', icon: 'PieChart' },
    { id: 'invitations', label: 'Invitations', icon: 'Mail' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ], []);

  const renderContent = () => {
    if (isLoading) return <div className="flex items-center justify-center h-96"><LoadingSpinner /></div>;
    if (error) return <div className="text-center py-8 text-destructive">{error}</div>;
    if (!managementData) return <div className="text-center py-8">Select a group to see details.</div>;

    switch (activeTab) {
      case 'members': return <MemberManagementTable members={managementData.members || []} />;
      case 'loans': return <LoanManagementSection loanRequests={managementData.loan_requests || []} />;
      case 'analytics': return <GroupAnalyticsPanel analyticsData={{}} />;
      case 'invitations': return <MemberInvitationSystem inviteHistory={managementData.invitations || []} />;
      case 'notifications': return <NotificationCenter notifications={[]} />;
      case 'settings': return <GroupSettingsPanel groupSettings={managementData.settings} />;
      default: return null;
    }
  };

  if (userGroups.length === 0 && !isLoading) {
    return (
      <div className="text-center py-20">
        <AppIcon name="Users" size={56} className="text-muted-foreground/50 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground">No Groups Found</h2>
        <p className="text-muted-foreground mt-2 mb-6">You haven't joined or created any groups yet.</p>
        <Button onClick={() => navigate('/group-creation')}>Create a Group</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Group Management</h1>
          <p className="text-muted-foreground mt-1">Oversee your savings groups, members, and loans.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            options={userGroups.map(g => ({ value: g.id, label: g.name }))}
            value={selectedGroup}
            onChange={setSelectedGroup}
            className="w-48"
          />
          <Button variant="outline" onClick={() => navigate('/report-generation')}><AppIcon name="Download" className="mr-2" /> Export</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <nav className="space-y-1 bg-card p-3 rounded-xl border border-border">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <AppIcon name={tab.icon} size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="lg:col-span-3 bg-card p-6 rounded-xl border border-border">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default GroupManagement;
