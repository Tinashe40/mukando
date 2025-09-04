import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import KPICard from './components/KPICard';
import ChartContainer from './components/ChartContainer';
import SavingsGrowthChart from './components/SavingsGrowthChart';
import LoanDistributionChart from './components/LoanDistributionChart';
import MemberEngagementChart from './components/MemberEngagementChart';
import RiskHeatmap from './components/RiskHeatmap';
import FilterPanel from './components/FilterPanel';
import ReportGenerator from './components/ReportGenerator';
import { useAuth } from '../../contexts/AuthContext';
import { getGroupAnalytics, getUserGroups } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const GroupAnalytics = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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
    const fetchAnalytics = async () => {
      if (selectedGroup) {
        setIsLoading(true);
        const data = await getGroupAnalytics(selectedGroup);
        setAnalyticsData(data);
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [selectedGroup]);

  const renderTabContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!analyticsData) {
      return (
        <div className="text-center py-8">
          <Icon name="Inbox" size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No analytics data available for this group.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard title="Total Group Savings" value={`$${analyticsData.kpis?.total_savings || 0}`} change={`+${analyticsData.kpis?.savings_change_percentage || 0}%`} changeType="positive" icon="PiggyBank" color="primary" />
              <KPICard title="Active Loans" value={`$${analyticsData.kpis?.active_loans || 0}`} change={`+${analyticsData.kpis?.active_loans_percentage || 0}%`} changeType="positive" icon="CreditCard" color="secondary" />
              <KPICard title="Repayment Rate" value={`${analyticsData.kpis?.repayment_rate || 0}%`} change={`+${analyticsData.kpis?.repayment_rate_change || 0}%`} changeType="positive" icon="TrendingUp" color="success" />
              <KPICard title="Member Participation" value={`${analyticsData.kpis?.member_participation || 0}%`} change={`+${analyticsData.kpis?.member_participation_change || 0}%`} changeType="positive" icon="Users" color="warning" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer title="Savings Growth Trend">
                <SavingsGrowthChart data={analyticsData.savings_growth || []} />
              </ChartContainer>
              <ChartContainer title="Loan Distribution">
                <LoanDistributionChart data={analyticsData.loan_distribution || []} />
              </ChartContainer>
            </div>
            <ChartContainer title="Member Contribution Analysis">
              <MemberEngagementChart data={analyticsData.member_engagement || []} metric="contributions" />
            </ChartContainer>
          </div>
        );
      // Other cases would be built out similarly
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMenuOpen={mobileMenuOpen}
      />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole="admin"
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      } pt-16 pb-20 lg:pb-6`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground font-heading">
                Group Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive insights and performance metrics for your savings group
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select
                options={userGroups.map(g => ({ value: g.id, label: g.name }))}
                value={selectedGroup}
                onChange={setSelectedGroup}
                className="w-48"
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`}>
                  <Icon name="BarChart3" size={16} />
                  Overview
                </button>
                {/* Add other tabs here */}
              </nav>
            </div>
          </div>
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default GroupAnalytics;