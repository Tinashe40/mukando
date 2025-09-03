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

const MemberDashboard = () => {
  const navigate = useNavigate();
  const [activeGroupId, setActiveGroupId] = useState('group-1');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('7days');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data for financial overview
  const financialData = {
    totalSavings: { amount: 45000, currency: 'USD', change: '+12.5%', changeType: 'positive' },
    activeLoans: { amount: 15000, currency: 'USD', change: '2 active', changeType: 'warning' },
    pendingContributions: { amount: 2500, currency: 'USD', change: 'Due in 3 days', changeType: 'warning' },
    monthlyGrowth: { amount: 3200, currency: 'USD', change: '+8.2%', changeType: 'positive' }
  };

  // Mock data for savings growth chart
  const savingsGrowthData = [
    { date: '2024-08-01', savings: 35000 },
    { date: '2024-08-08', savings: 37500 },
    { date: '2024-08-15', savings: 39200 },
    { date: '2024-08-22', savings: 41800 },
    { date: '2024-08-29', savings: 43500 },
    { date: '2024-09-03', savings: 45000 }
  ];

  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'contribution',
      title: 'Monthly Contribution',
      description: 'Added to Harare Women\'s Group savings pool',
      amount: 500,
      currency: 'USD',
      status: 'approved',
      group: 'Harare Women\'s Group',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      type: 'loan_approved',
      title: 'Loan Request Approved',
      description: 'Your business loan application has been approved',
      amount: 5000,
      currency: 'USD',
      status: 'approved',
      group: 'Business Development Circle',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: 3,
      type: 'payment',
      title: 'Loan Repayment',
      description: 'Monthly installment payment processed',
      amount: 750,
      currency: 'USD',
      status: 'completed',
      group: 'Harare Women\'s Group',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 4,
      type: 'notification',
      title: 'Group Meeting Reminder',
      description: 'Weekly group meeting scheduled for tomorrow',
      group: 'Business Development Circle',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 5,
      type: 'group_join',
      title: 'New Group Member',
      description: 'Mary Chikwanha joined your savings group',
      group: 'Harare Women\'s Group',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ];

  // Mock data for groups
  const userGroups = [
    {
      id: 'group-1',
      name: 'Harare Women\'s Group',
      memberCount: 12,
      myBalance: 15000,
      currency: 'USD',
      status: 'active',
      nextContribution: '05 Sep 2024',
      notifications: 2
    },
    {
      id: 'group-2',
      name: 'Business Development Circle',
      memberCount: 8,
      myBalance: 22500,
      currency: 'USD',
      status: 'active',
      nextContribution: '10 Sep 2024',
      notifications: 1
    },
    {
      id: 'group-3',
      name: 'Community Builders',
      memberCount: 15,
      myBalance: 7500,
      currency: 'USD',
      status: 'active',
      nextContribution: '15 Sep 2024',
      notifications: 0
    },
    {
      id: 'group-4',
      name: 'Youth Entrepreneurs',
      memberCount: 6,
      myBalance: 5000,
      currency: 'USD',
      status: 'pending',
      nextContribution: '20 Sep 2024',
      notifications: 3
    }
  ];

  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      title: 'Loan payment due tomorrow',
      priority: 'urgent',
      time: '2 hours ago'
    },
    {
      id: 2,
      title: 'Group meeting scheduled',
      priority: 'high',
      time: '4 hours ago'
    },
    {
      id: 3,
      title: 'New member joined your group',
      priority: 'normal',
      time: '1 day ago'
    },
    {
      id: 4,
      title: 'Monthly contribution reminder',
      priority: 'high',
      time: '2 days ago'
    }
  ];

  // Mock data for payment reminders
  const paymentReminders = [
    {
      id: 1,
      title: 'Monthly Contribution',
      group: 'Harare Women\'s Group',
      amount: 500,
      currency: 'USD',
      daysUntilDue: 0
    },
    {
      id: 2,
      title: 'Loan Repayment',
      group: 'Business Development Circle',
      amount: 750,
      currency: 'USD',
      daysUntilDue: 1
    },
    {
      id: 3,
      title: 'Emergency Fund Contribution',
      group: 'Community Builders',
      amount: 200,
      currency: 'USD',
      daysUntilDue: 5
    }
  ];

  // Quick actions data
  const quickActions = [
    {
      title: 'Make Contribution',
      description: 'Add money to your group savings pool',
      icon: 'PlusCircle',
      iconColor: 'bg-success',
      actionText: 'Contribute Now',
      onAction: () => navigate('/payment-processing')
    },
    {
      title: 'Request Loan',
      description: 'Apply for a loan from your group funds',
      icon: 'CreditCard',
      iconColor: 'bg-primary',
      actionText: 'Apply Now',
      onAction: () => navigate('/loan-request')
    },
    {
      title: 'View Groups',
      description: 'Manage your group memberships and activities',
      icon: 'Users',
      iconColor: 'bg-secondary',
      actionText: 'View Groups',
      onAction: () => navigate('/group-management')
    },
    {
      title: 'Payment Methods',
      description: 'Manage your mobile money and payment options',
      icon: 'Wallet',
      iconColor: 'bg-warning',
      actionText: 'Manage',
      onAction: () => navigate('/payment-processing'),
      badge: 'New'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handlePayNow = (reminder) => {
    navigate('/payment-processing', { state: { reminder } });
  };

  const handleViewAllNotifications = () => {
    navigate('/notifications-center');
  };

  const handleViewAllReminders = () => {
    navigate('/payment-processing');
  };

  const handleGroupChange = (groupId) => {
    setActiveGroupId(groupId);
  };

  const getGreeting = () => {
    const hour = currentTime?.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
              {getGreeting()}, Sarah! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's your financial overview for {currentTime?.toLocaleDateString('en-GB', { 
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
              onClick={() => navigate('/group-management')}
            >
              Join New Group
            </Button>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FinancialOverviewCard
            title="Total Savings"
            amount={financialData?.totalSavings?.amount}
            currency={financialData?.totalSavings?.currency}
            change={financialData?.totalSavings?.change}
            changeType={financialData?.totalSavings?.changeType}
            icon="PiggyBank"
            iconColor="bg-success"
            trend={true}
          />
          <FinancialOverviewCard
            title="Active Loans"
            amount={financialData?.activeLoans?.amount}
            currency={financialData?.activeLoans?.currency}
            change={financialData?.activeLoans?.change}
            changeType={financialData?.activeLoans?.changeType}
            icon="CreditCard"
            iconColor="bg-primary"
            trend={false}
          />
          <FinancialOverviewCard
            title="Pending Contributions"
            amount={financialData?.pendingContributions?.amount}
            currency={financialData?.pendingContributions?.currency}
            change={financialData?.pendingContributions?.change}
            changeType={financialData?.pendingContributions?.changeType}
            icon="Clock"
            iconColor="bg-warning"
            trend={false}
          />
          <FinancialOverviewCard
            title="Monthly Growth"
            amount={financialData?.monthlyGrowth?.amount}
            currency={financialData?.monthlyGrowth?.currency}
            change={financialData?.monthlyGrowth?.change}
            changeType={financialData?.monthlyGrowth?.changeType}
            icon="TrendingUp"
            iconColor="bg-secondary"
            trend={true}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Activity Timeline */}
          <div className="lg:col-span-2 space-y-8">
            {/* Savings Growth Chart */}
            <SavingsGrowthChart 
              data={savingsGrowthData} 
              currency="USD" 
              height={300} 
            />

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-warm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Recent Activity</h3>
                  <p className="text-sm text-muted-foreground">Your latest transactions and updates</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedTimeFilter}
                    onChange={(e) => setSelectedTimeFilter(e?.target?.value)}
                    className="text-sm border border-border rounded-md px-3 py-1 bg-background text-foreground"
                  >
                    <option value="7days">Last 7 days</option>
                    <option value="30days">Last 30 days</option>
                    <option value="90days">Last 90 days</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-0">
                {recentActivities?.map((activity, index) => (
                  <ActivityTimelineItem
                    key={activity?.id}
                    activity={activity}
                    isLast={index === recentActivities?.length - 1}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                fullWidth
                iconName="ArrowRight"
                iconPosition="right"
                iconSize={16}
                className="mt-4"
              >
                View All Activity
              </Button>
            </div>
          </div>

          {/* Right Column - Sidebar Content */}
          <div className="space-y-6">
            {/* Notifications */}
            <NotificationBadge
              notifications={notifications}
              onViewAll={handleViewAllNotifications}
            />

            {/* Payment Reminders */}
            <PaymentReminderCard
              reminders={paymentReminders}
              onPayNow={handlePayNow}
              onViewAll={handleViewAllReminders}
            />

            {/* Group Memberships */}
            <GroupMembershipTabs
              groups={userGroups}
              activeGroupId={activeGroupId}
              onGroupChange={handleGroupChange}
            />
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions?.map((action, index) => (
              <QuickActionCard
                key={index}
                title={action?.title}
                description={action?.description}
                icon={action?.icon}
                iconColor={action?.iconColor}
                actionText={action?.actionText}
                onAction={action?.onAction}
                badge={action?.badge}
              />
            ))}
          </div>
        </div>

        {/* Integration Status */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-warm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Integration Status</h3>
            <Button variant="outline" size="sm">
              Manage Integrations
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
                <Icon name="Smartphone" size={16} color="white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">EcoCash</p>
                <p className="text-xs text-success">Connected</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
                <Icon name="MessageSquare" size={16} color="white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">WhatsApp</p>
                <p className="text-xs text-success">Active</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
              <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center">
                <Icon name="Mail" size={16} color="white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <p className="text-xs text-warning">Setup Required</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-muted-foreground rounded-lg flex items-center justify-center">
                <Icon name="MessageCircle" size={16} color="white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">SMS</p>
                <p className="text-xs text-muted-foreground">Not Connected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;