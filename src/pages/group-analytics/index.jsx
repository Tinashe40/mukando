import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

// Import all components
import KPICard from './components/KPICard';
import ChartContainer from './components/ChartContainer';
import SavingsGrowthChart from './components/SavingsGrowthChart';
import LoanDistributionChart from './components/LoanDistributionChart';
import MemberEngagementChart from './components/MemberEngagementChart';
import RiskHeatmap from './components/RiskHeatmap';
import FilterPanel from './components/FilterPanel';
import ReportGenerator from './components/ReportGenerator';

const GroupAnalytics = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('main-group');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for KPIs
  const kpiData = [
    {
      title: "Total Group Savings",
      value: "$45,230",
      change: "+12.5%",
      changeType: "positive",
      icon: "PiggyBank",
      color: "primary",
      description: "Across all members"
    },
    {
      title: "Active Loans",
      value: "$18,750",
      change: "+8.2%",
      changeType: "positive",
      icon: "CreditCard",
      color: "secondary",
      description: "Currently outstanding"
    },
    {
      title: "Repayment Rate",
      value: "94.2%",
      change: "-2.1%",
      changeType: "negative",
      icon: "TrendingUp",
      color: "success",
      description: "Last 30 days"
    },
    {
      title: "Member Participation",
      value: "87%",
      change: "+5.3%",
      changeType: "positive",
      icon: "Users",
      color: "warning",
      description: "Active contributors"
    }
  ];

  // Mock data for savings growth chart
  const savingsGrowthData = [
    { date: "2024-07-01", totalSavings: 25000, activeLoans: 8000 },
    { date: "2024-08-01", totalSavings: 28500, activeLoans: 9500 },
    { date: "2024-09-01", totalSavings: 32100, activeLoans: 11200 },
    { date: "2024-10-01", totalSavings: 36800, activeLoans: 13800 },
    { date: "2024-11-01", totalSavings: 41200, activeLoans: 16400 },
    { date: "2024-12-01", totalSavings: 45230, activeLoans: 18750 }
  ];

  // Mock data for loan distribution
  const loanDistributionData = [
    { category: "Emergency Loans", value: 7500, percentage: 40 },
    { category: "Business Loans", value: 5625, percentage: 30 },
    { category: "Education Loans", value: 3750, percentage: 20 },
    { category: "Medical Loans", value: 1875, percentage: 10 }
  ];

  // Mock data for member engagement
  const memberEngagementData = [
    { name: "Sarah M.", value: 2500, participationRate: 95 },
    { name: "John K.", value: 2200, participationRate: 88 },
    { name: "Mary T.", value: 1950, participationRate: 92 },
    { name: "Peter N.", value: 1800, participationRate: 85 },
    { name: "Grace W.", value: 1650, participationRate: 78 },
    { name: "David L.", value: 1500, participationRate: 82 },
    { name: "Ruth M.", value: 1400, participationRate: 90 },
    { name: "James S.", value: 1200, participationRate: 75 }
  ];

  // Mock data for risk heatmap
  const riskHeatmapData = [
    {
      name: "Sarah Mwangi",
      memberId: "MUK001",
      riskLevel: "low",
      outstandingLoans: 500,
      repaymentRate: 98,
      daysOverdue: 0,
      creditScore: 95,
      lastPayment: "2024-12-01"
    },
    {
      name: "John Kamau",
      memberId: "MUK002",
      riskLevel: "medium",
      outstandingLoans: 1200,
      repaymentRate: 85,
      daysOverdue: 5,
      creditScore: 72,
      lastPayment: "2024-11-28"
    },
    {
      name: "Mary Wanjiku",
      memberId: "MUK003",
      riskLevel: "low",
      outstandingLoans: 800,
      repaymentRate: 96,
      daysOverdue: 0,
      creditScore: 88,
      lastPayment: "2024-12-02"
    },
    {
      name: "Peter Njoroge",
      memberId: "MUK004",
      riskLevel: "high",
      outstandingLoans: 2500,
      repaymentRate: 65,
      daysOverdue: 15,
      creditScore: 45,
      lastPayment: "2024-11-15"
    },
    {
      name: "Grace Wambui",
      memberId: "MUK005",
      riskLevel: "medium",
      outstandingLoans: 1500,
      repaymentRate: 78,
      daysOverdue: 8,
      creditScore: 68,
      lastPayment: "2024-11-25"
    },
    {
      name: "David Kiprotich",
      memberId: "MUK006",
      riskLevel: "low",
      outstandingLoans: 600,
      repaymentRate: 92,
      daysOverdue: 2,
      creditScore: 82,
      lastPayment: "2024-11-30"
    }
  ];

  // Filter state
  const [filters, setFilters] = useState({
    timeRange: '6M',
    memberSegment: 'all',
    metricType: 'all',
    riskLevel: 'all',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });

  const groupOptions = [
    { value: 'main-group', label: 'Main Savings Group' },
    { value: 'youth-group', label: 'Youth Savings Circle' },
    { value: 'women-group', label: 'Women Empowerment Group' },
    { value: 'business-group', label: 'Business Development Group' }
  ];

  const tabOptions = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'savings', label: 'Savings Analysis', icon: 'PiggyBank' },
    { id: 'loans', label: 'Loan Performance', icon: 'CreditCard' },
    { id: 'members', label: 'Member Insights', icon: 'Users' },
    { id: 'risk', label: 'Risk Assessment', icon: 'Shield' },
    { id: 'reports', label: 'Reports', icon: 'FileText' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    // Implement filter application logic
  };

  const handleResetFilters = () => {
    setFilters({
      timeRange: '6M',
      memberSegment: 'all',
      metricType: 'all',
      riskLevel: 'all',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  const handleExportData = () => {
    console.log('Exporting data with filters:', filters);
    // Implement export logic
  };

  const handleGenerateReport = (reportConfig) => {
    setIsGeneratingReport(true);
    console.log('Generating report with config:', reportConfig);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      console.log('Report generated successfully');
    }, 3000);
  };

  const handleRefreshData = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleChartExport = (chartType) => {
    console.log(`Exporting ${chartType} chart`);
  };

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      // Update data periodically
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData?.map((kpi, index) => (
                <KPICard key={index} {...kpi} />
              ))}
            </div>
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Savings Growth Trend"
                onExport={() => handleChartExport('savings-growth')}
                onRefresh={handleRefreshData}
              >
                <SavingsGrowthChart data={savingsGrowthData} />
              </ChartContainer>

              <ChartContainer
                title="Loan Distribution"
                onExport={() => handleChartExport('loan-distribution')}
                onRefresh={handleRefreshData}
              >
                <LoanDistributionChart data={loanDistributionData} />
              </ChartContainer>
            </div>
            {/* Member Engagement */}
            <ChartContainer
              title="Member Contribution Analysis"
              onExport={() => handleChartExport('member-engagement')}
              onRefresh={handleRefreshData}
            >
              <MemberEngagementChart data={memberEngagementData} metric="contributions" />
            </ChartContainer>
          </div>
        );

      case 'savings':
        return (
          <div className="space-y-6">
            <ChartContainer
              title="Detailed Savings Growth Analysis"
              onExport={() => handleChartExport('detailed-savings')}
              onRefresh={handleRefreshData}
            >
              <SavingsGrowthChart data={savingsGrowthData} timeRange={filters?.timeRange} />
            </ChartContainer>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <KPICard
                title="Average Monthly Savings"
                value="$3,769"
                change="+15.2%"
                changeType="positive"
                icon="TrendingUp"
                color="success"
                description="Per member contribution"
              />
              <KPICard
                title="Savings Goal Progress"
                value="76%"
                change="+8.5%"
                changeType="positive"
                icon="Target"
                color="primary"
                description="Towards $60,000 target"
              />
            </div>
          </div>
        );

      case 'loans':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="Loan Distribution by Category"
                onExport={() => handleChartExport('loan-distribution')}
                onRefresh={handleRefreshData}
              >
                <LoanDistributionChart data={loanDistributionData} />
              </ChartContainer>

              <div className="space-y-4">
                <KPICard
                  title="Average Loan Amount"
                  value="$1,250"
                  change="+5.8%"
                  changeType="positive"
                  icon="DollarSign"
                  color="secondary"
                  description="Average per member"
                />
                <KPICard
                  title="Loan Approval Rate"
                  value="89%"
                  change="+2.3%"
                  changeType="positive"
                  icon="CheckCircle"
                  color="success"
                  description="Last 30 days"
                />
              </div>
            </div>
          </div>
        );

      case 'members':
        return (
          <div className="space-y-6">
            <ChartContainer
              title="Member Engagement Metrics"
              onExport={() => handleChartExport('member-engagement')}
              onRefresh={handleRefreshData}
            >
              <MemberEngagementChart data={memberEngagementData} metric="contributions" />
            </ChartContainer>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KPICard
                title="Active Members"
                value="24"
                change="+2"
                changeType="positive"
                icon="UserCheck"
                color="success"
                description="Out of 28 total"
              />
              <KPICard
                title="New Members"
                value="3"
                change="+1"
                changeType="positive"
                icon="UserPlus"
                color="primary"
                description="This month"
              />
              <KPICard
                title="Member Retention"
                value="96%"
                change="+1.2%"
                changeType="positive"
                icon="Users"
                color="warning"
                description="12-month rate"
              />
            </div>
          </div>
        );

      case 'risk':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KPICard
                title="Overall Risk Score"
                value="Low"
                change="Stable"
                changeType="positive"
                icon="Shield"
                color="success"
                description="Group risk level"
              />
              <KPICard
                title="High Risk Members"
                value="1"
                change="-1"
                changeType="positive"
                icon="AlertTriangle"
                color="error"
                description="Requires attention"
              />
              <KPICard
                title="Default Rate"
                value="2.1%"
                change="-0.5%"
                changeType="positive"
                icon="TrendingDown"
                color="warning"
                description="Last 6 months"
              />
            </div>

            <ChartContainer
              title="Member Risk Assessment"
              onExport={() => handleChartExport('risk-heatmap')}
              onRefresh={handleRefreshData}
            >
              <RiskHeatmap data={riskHeatmapData} />
            </ChartContainer>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <ReportGenerator
              onGenerateReport={handleGenerateReport}
              isGenerating={isGeneratingReport}
            />
          </div>
        );

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
          {/* Page Header */}
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
                options={groupOptions}
                value={selectedGroup}
                onChange={setSelectedGroup}
                className="w-48"
              />
              
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={16}
                loading={refreshing}
                onClick={handleRefreshData}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          <div className="mb-6">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              onExportData={handleExportData}
              isCollapsed={filtersCollapsed}
              onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
            />
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabOptions?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
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
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default GroupAnalytics;