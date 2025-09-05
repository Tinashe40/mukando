import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FinancialOverviewCard from './components/FinancialOverviewCard';
import ActivityTimelineItem from './components/ActivityTimelineItem';
import QuickActionCard from './components/QuickActionCard';
import SavingsGrowthChart from './components/SavingsGrowthChart';
import GroupMembershipTabs from './components/GroupMembershipTabs';
import NotificationBadge from './components/NotificationBadge';
import PaymentReminderCard from './components/PaymentReminderCard';
import { useAuth } from '../../contexts/AuthContext';
import { getFinancialOverview, getRecentActivity, getUserGroups } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [financialData, setFinancialData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        const [overview, activity, groups] = await Promise.all([
          getFinancialOverview(user.id),
          getRecentActivity(user.id),
          getUserGroups(user.id),
        ]);
        setFinancialData(overview);
        setRecentActivity(activity || []);
        setUserGroups(groups || []);
        setIsLoading(false);
      }
    };

    fetchData();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [user]);

  const handlePayNow = (reminder) => {
    navigate('/payment-processing', { state: { reminder } });
  };

  const handleViewAllNotifications = () => {
    navigate('/notifications-center');
  };

  const handleViewAllReminders = () => {
    navigate('/payment-processing');
  };

  const getGreeting = () => {
    const hour = currentTime?.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-8xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 font-heading">
              {getGreeting()}, {profile?.full_name || 'Member'}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's your financial snapshot for today, {currentTime?.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              Export Report
            </Button>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
              onClick={() => navigate('/group-creation')}
            >
              Create Group
            </Button>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FinancialOverviewCard
            title="Total Savings"
            amount={financialData?.total_savings || 0}
            currency="USD"
            change={`+${financialData?.savings_change_percentage || 0}%`}
            changeType="positive"
            icon="PiggyBank"
            iconColor="bg-green-500"
          />
          <FinancialOverviewCard
            title="Active Loans"
            amount={financialData?.active_loans_amount || 0}
            currency="USD"
            change={`${financialData?.active_loans_count || 0} active`}
            changeType="warning"
            icon="CreditCard"
            iconColor="bg-blue-500"
          />
          <FinancialOverviewCard
            title="Pending Contributions"
            amount={financialData?.pending_contributions_amount || 0}
            currency="USD"
            change={`Due in ${financialData?.days_to_next_due || 0} days`}
            changeType="warning"
            icon="Clock"
            iconColor="bg-yellow-500"
          />
          <FinancialOverviewCard
            title="Monthly Growth"
            amount={financialData?.monthly_growth || 0}
            currency="USD"
            change={`+${financialData?.monthly_growth_percentage || 0}%`}
            changeType="positive"
            icon="TrendingUp"
            iconColor="bg-purple-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SavingsGrowthChart data={financialData?.savings_growth || []} currency="USD" />

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <ActivityTimelineItem
                      key={activity.id}
                      activity={activity}
                      isLast={index === recentActivity.length - 1}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon name="Inbox" size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity to display.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <NotificationBadge notifications={[]} onViewAll={handleViewAllNotifications} />
            <PaymentReminderCard reminders={[]} onPayNow={handlePayNow} onViewAll={handleViewAllReminders} />
            <GroupMembershipTabs groups={userGroups} />
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard title="Make Contribution" description="Add money to your group savings pool" icon="PlusCircle" onAction={() => navigate('/payment-processing')} />
            <QuickActionCard title="Request Loan" description="Apply for a loan from your group funds" icon="CreditCard" onAction={() => navigate('/loan-request')} />
            <QuickActionCard title="View Groups" description="Manage your group memberships" icon="Users" onAction={() => navigate('/group-management')} />
            <QuickActionCard title="Payment Methods" description="Manage your payment options" icon="Wallet" onAction={() => navigate('/payment-processing')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
