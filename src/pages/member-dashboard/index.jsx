import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppIcon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { getFinancialOverview, getRecentActivity, getUserGroups, getPaymentReminders } from '../../lib/supabase';
import ActivityTimelineItem from './components/ActivityTimelineItem';
import FinancialOverviewCard from './components/FinancialOverviewCard';
import GroupMembershipTabs from './components/GroupMembershipTabs';
import NotificationBadge from './components/NotificationBadge';
import PaymentReminderCard from './components/PaymentReminderCard';
import QuickActionCard from './components/QuickActionCard';
import SavingsGrowthChart from './components/SavingsGrowthChart';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [financialData, setFinancialData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentReminders, setPaymentReminders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [overview, activity, groups, reminders] = await Promise.all([
          getFinancialOverview(user.id),
          getRecentActivity(user.id),
          getUserGroups(user.id),
          getPaymentReminders(user.id),
        ]);
        setFinancialData(overview);
        setRecentActivity(activity || []);
        setUserGroups(groups || []);
        setPaymentReminders(reminders || []);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-[calc(100vh-200px)]"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
        <AppIcon name="AlertTriangle" size={48} className="text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Oops!</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{getGreeting()}, {profile?.full_name || 'Member'}! 👋</h1>
          <p className="text-muted-foreground mt-1">Here’s your financial snapshot today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/report-generation')}><AppIcon name="Download" className="mr-2" /> Export</Button>
          <Button onClick={() => navigate('/group-creation')}><AppIcon name="Plus" className="mr-2" /> New Group</Button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialOverviewCard title="Total Savings" amount={financialData?.total_savings} trend={financialData?.savings_trend} />
        <FinancialOverviewCard title="Active Loans" amount={financialData?.active_loans_amount} trend={financialData?.loans_trend} />
        <FinancialOverviewCard title="Pending Contributions" amount={financialData?.pending_contributions_amount} />
        <FinancialOverviewCard title="Group Memberships" amount={userGroups.length} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2 space-y-8">
          <SavingsGrowthChart data={financialData?.savings_growth} />
          
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <ActivityTimelineItem key={activity.id} activity={activity} isLast={index === recentActivity.length - 1} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AppIcon name="Inbox" size={48} className="text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No recent activity.</p>
              </div>
            )}
          </div>
        </main>

        <aside className="space-y-6">
          <QuickActionCard />
          <PaymentReminderCard reminders={paymentReminders} />
          <GroupMembershipTabs groups={userGroups} />
        </aside>
      </div>
    </div>
  );
};

export default MemberDashboard;
