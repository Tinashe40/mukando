import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MemberManagementTable from './components/MemberManagementTable';
import GroupAnalyticsPanel from './components/GroupAnalyticsPanel';
import LoanManagementSection from './components/LoanManagementSection';
import GroupSettingsPanel from './components/GroupSettingsPanel';
import MemberInvitationSystem from './components/MemberInvitationSystem';
import NotificationCenter from './components/NotificationCenter';

const GroupManagement = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock data for members
  const [members] = useState([
    {
      id: 1,
      name: "Sarah Mwangi",
      email: "sarah.mwangi@email.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      status: "active",
      joinDate: "2024-01-15",
      totalContributions: 2500,
      contributionCount: 12,
      activeLoanAmount: 1200,
      activeLoans: 1,
      lastActivity: "2024-09-02"
    },
    {
      id: 2,
      name: "James Mutindi",
      email: "james.mutindi@email.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      status: "active",
      joinDate: "2024-02-01",
      totalContributions: 3200,
      contributionCount: 16,
      activeLoanAmount: 0,
      activeLoans: 0,
      lastActivity: "2024-09-01"
    },
    {
      id: 3,
      name: "Grace Nyong'o",
      email: "grace.nyongo@email.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      status: "pending",
      joinDate: "2024-08-28",
      totalContributions: 500,
      contributionCount: 2,
      activeLoanAmount: 0,
      activeLoans: 0,
      lastActivity: "2024-08-30"
    },
    {
      id: 4,
      name: "Peter Kamau",
      email: "peter.kamau@email.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      status: "inactive",
      joinDate: "2023-11-10",
      totalContributions: 1800,
      contributionCount: 9,
      activeLoanAmount: 800,
      activeLoans: 1,
      lastActivity: "2024-08-15"
    },
    {
      id: 5,
      name: "Mary Wanjiku",
      email: "mary.wanjiku@email.com",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      status: "active",
      joinDate: "2024-03-20",
      totalContributions: 2800,
      contributionCount: 14,
      activeLoanAmount: 1500,
      activeLoans: 1,
      lastActivity: "2024-09-03"
    }
  ]);

  // Mock data for analytics
  const [analyticsData] = useState({
    totalSavings: {
      amount: 45000,
      growth: 12.5
    },
    totalMembers: {
      active: 24,
      newThisMonth: 3
    },
    activeLoans: {
      totalAmount: 18500,
      repaidThisMonth: 2
    },
    monthlyContributions: {
      thisMonth: 8200,
      growth: 8.3
    },
    contributionTrends: [
      { month: 'Jan', amount: 6500 },
      { month: 'Feb', amount: 7200 },
      { month: 'Mar', amount: 6800 },
      { month: 'Apr', amount: 7500 },
      { month: 'May', amount: 8100 },
      { month: 'Jun', amount: 7800 },
      { month: 'Jul', amount: 8400 },
      { month: 'Aug', amount: 8200 }
    ],
    loanDistribution: [
      { name: 'Business Loans', value: 12000 },
      { name: 'Emergency Loans', value: 4500 },
      { name: 'Education Loans', value: 2000 }
    ],
    memberParticipation: [
      { category: 'Regular Contributors', count: 18 },
      { category: 'Occasional Contributors', count: 4 },
      { category: 'New Members', count: 2 }
    ]
  });

  // Mock data for loan requests
  const [loanRequests] = useState([
    {
      id: 1,
      memberName: "David Ochieng",
      memberEmail: "david.ochieng@email.com",
      memberAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      memberJoinDate: "2024-01-20",
      previousLoans: 2,
      requestedAmount: 3000,
      termMonths: 6,
      purpose: "Small business expansion - purchasing additional inventory for my retail shop",
      creditScore: 85,
      riskLevel: "Low",
      eligibilityScore: 92,
      aiRecommendation: "Approve",
      interestRate: 12,
      status: "pending",
      requestDate: "2024-09-01",
      assessmentFactors: [
        "Excellent payment history",
        "Stable income source",
        "Low debt-to-income ratio"
      ]
    },
    {
      id: 2,
      memberName: "Agnes Wambui",
      memberEmail: "agnes.wambui@email.com",
      memberAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      memberJoinDate: "2024-03-15",
      previousLoans: 0,
      requestedAmount: 1500,
      termMonths: 4,
      purpose: "Medical emergency - covering hospital bills for family member",
      creditScore: 72,
      riskLevel: "Medium",
      eligibilityScore: 78,
      aiRecommendation: "Review",
      interestRate: 12,
      status: "pending",
      requestDate: "2024-09-02",
      assessmentFactors: [
        "New member (6 months)",
        "Consistent contributions",
        "Emergency loan category"
      ]
    },
    {
      id: 3,
      memberName: "Robert Kipchoge",
      memberEmail: "robert.kipchoge@email.com",
      memberAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
      memberJoinDate: "2023-08-10",
      previousLoans: 3,
      requestedAmount: 2500,
      termMonths: 8,
      purpose: "Education fees for children's school tuition and supplies",
      creditScore: 88,
      riskLevel: "Low",
      eligibilityScore: 95,
      aiRecommendation: "Approve",
      interestRate: 12,
      status: "approved",
      requestDate: "2024-08-28",
      assessmentFactors: [
        "Long-term member",
        "Perfect repayment record",
        "Education investment"
      ]
    }
  ]);

  // Mock data for group settings
  const [groupSettings] = useState({
    groupName: "Mukando Savings Group",
    description: "Community-driven savings and loan group for financial empowerment",
    currency: "USD",
    maxMembers: 50,
    allowInvitations: true,
    requireApproval: true,
    contributions: {
      minimumAmount: 50,
      maximumAmount: 1000,
      frequency: "monthly",
      dueDate: 15,
      penaltyType: "percentage",
      penaltyAmount: 5,
      gracePeriod: 3
    },
    loans: {
      minimumAmount: 100,
      maximumAmount: 5000,
      interestRate: 12,
      maxTermMonths: 12,
      minMembershipMonths: 3,
      minCreditScore: 60,
      requireGuarantor: true,
      allowMultipleLoans: false
    },
    notifications: {
      email: {
        contributionReminders: true,
        loanApprovals: true,
        paymentConfirmations: true
      },
      sms: {
        paymentReminders: true,
        loanUpdates: true
      },
      reminderDays: 3
    },
    security: {
      requireTwoFactor: true,
      auditLogging: true,
      requireApprovalForLargeTransactions: true,
      largeTransactionThreshold: 2000,
      sessionTimeout: 120
    }
  });

  // Mock data for invitation history
  const [inviteHistory] = useState([
    {
      id: 1,
      name: "Michael Otieno",
      email: "michael.otieno@email.com",
      method: "email",
      status: "pending",
      sentDate: "2024-09-01"
    },
    {
      id: 2,
      name: "Lucy Akinyi",
      phone: "+263 77 234 5678",
      method: "sms",
      status: "accepted",
      sentDate: "2024-08-28"
    },
    {
      id: 3,
      name: "John Mwangi",
      email: "john.mwangi@email.com",
      method: "email",
      status: "expired",
      sentDate: "2024-08-20"
    }
  ]);

  // Mock data for notifications
  const [notifications] = useState([
    {
      id: 1,
      type: "loan_approval",
      priority: "high",
      title: "Loan Approval Required",
      message: "David Ochieng has requested a $3,000 loan for business expansion. AI recommendation: Approve",
      memberName: "David Ochieng",
      timestamp: "2024-09-03T06:30:00Z",
      read: false
    },
    {
      id: 2,
      type: "payment_due",
      priority: "medium",
      title: "Payment Overdue",
      message: "Peter Kamau's monthly contribution of $100 is 5 days overdue",
      memberName: "Peter Kamau",
      timestamp: "2024-09-02T14:15:00Z",
      read: false
    },
    {
      id: 3,
      type: "member_request",
      priority: "medium",
      title: "New Member Request",
      message: "Grace Nyong'o has requested to join the group via invitation link",
      memberName: "Grace Nyong'o",
      timestamp: "2024-09-01T10:45:00Z",
      read: true
    },
    {
      id: 4,
      type: "system_alert",
      priority: "low",
      title: "Monthly Report Ready",
      message: "August 2024 group financial report is now available for download",
      timestamp: "2024-09-01T08:00:00Z",
      read: true
    },
    {
      id: 5,
      type: "contribution_reminder",
      priority: "low",
      title: "Contribution Reminder Sent",
      message: "Monthly contribution reminders sent to 24 members",
      timestamp: "2024-08-31T16:30:00Z",
      read: true
    }
  ]);

  const tabs = [
    { id: 'members', label: 'Members', icon: 'Users', count: members?.length },
    { id: 'loans', label: 'Loans', icon: 'CreditCard', count: loanRequests?.filter(l => l?.status === 'pending')?.length },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'invitations', label: 'Invitations', icon: 'UserPlus', count: inviteHistory?.filter(i => i?.status === 'pending')?.length },
    { id: 'notifications', label: 'Notifications', icon: 'Bell', count: notifications?.filter(n => !n?.read)?.length },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  const handleMemberAction = (action, memberId) => {
    console.log(`Member action: ${action} for member ${memberId}`);
    // Handle member actions like view, edit, message, etc.
  };

  const handleBulkAction = (action, memberIds) => {
    console.log(`Bulk action: ${action} for members`, memberIds);
    // Handle bulk actions like suspend, activate, send reminder
  };

  const handleLoanAction = (action, loanId) => {
    console.log(`Loan action: ${action} for loan ${loanId}`);
    // Handle loan actions like approve, reject, view details
  };

  const handleSettingsUpdate = (newSettings) => {
    console.log('Settings updated:', newSettings);
    // Handle settings update
  };

  const handleInviteMember = (inviteData) => {
    console.log('Invite member:', inviteData);
    // Handle member invitation
  };

  const handleNotificationAction = (action, notificationId) => {
    console.log(`Notification action: ${action} for notification ${notificationId}`);
    // Handle notification actions
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Users" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Group Management</h1>
                <p className="text-sm text-muted-foreground">Mukando Savings Group</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
              >
                Export Report
              </Button>
              <Button
                variant="default"
                iconName="UserPlus"
                iconPosition="left"
                onClick={() => setActiveTab('invitations')}
              >
                Invite Members
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Management tabs">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                {tab?.label}
                {tab?.count > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {tab?.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'members' && (
          <MemberManagementTable
            members={members}
            onMemberAction={handleMemberAction}
            onBulkAction={handleBulkAction}
          />
        )}

        {activeTab === 'loans' && (
          <LoanManagementSection
            loanRequests={loanRequests}
            onLoanAction={handleLoanAction}
          />
        )}

        {activeTab === 'analytics' && (
          <GroupAnalyticsPanel
            analyticsData={analyticsData}
          />
        )}

        {activeTab === 'invitations' && (
          <MemberInvitationSystem
            onInviteMember={handleInviteMember}
            inviteHistory={inviteHistory}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationCenter
            notifications={notifications}
            onNotificationAction={handleNotificationAction}
          />
        )}

        {activeTab === 'settings' && (
          <GroupSettingsPanel
            groupSettings={groupSettings}
            onSettingsUpdate={handleSettingsUpdate}
          />
        )}
      </div>
      {/* Quick Actions Floating Button (Mobile) */}
      <div className="fixed bottom-20 right-4 lg:hidden">
        <div className="relative">
          <Button
            variant="default"
            size="icon"
            className="w-14 h-14 rounded-full shadow-warm-lg"
          >
            <Icon name="Plus" size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroupManagement;