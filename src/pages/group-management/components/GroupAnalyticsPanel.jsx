import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const GroupAnalyticsPanel = ({ analyticsData }) => {
  const {
    totalSavings,
    totalMembers,
    activeLoans,
    monthlyContributions,
    loanDistribution,
    memberParticipation,
    contributionTrends
  } = analyticsData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZW', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const COLORS = ['#D97706', '#059669', '#DC2626', '#6366F1', '#8B5CF6'];

  const StatCard = ({ title, value, change, icon, color = 'primary' }) => (
    <div className="bg-card rounded-lg border border-border p-4 shadow-warm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground font-data mt-1">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              change?.type === 'increase' ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={change?.type === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                size={14} 
              />
              <span>{change?.value}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          color === 'primary' ? 'bg-primary text-primary-foreground' :
          color === 'secondary' ? 'bg-secondary text-secondary-foreground' :
          color === 'warning' ? 'bg-warning text-warning-foreground' :
          'bg-accent text-accent-foreground'
        }`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Savings"
          value={formatCurrency(totalSavings?.amount)}
          change={{ type: 'increase', value: `+${totalSavings?.growth}%` }}
          icon="Wallet"
          color="primary"
        />
        <StatCard
          title="Active Members"
          value={totalMembers?.active}
          change={{ type: 'increase', value: `+${totalMembers?.newThisMonth}` }}
          icon="Users"
          color="secondary"
        />
        <StatCard
          title="Active Loans"
          value={formatCurrency(activeLoans?.totalAmount)}
          change={{ type: 'decrease', value: `-${activeLoans?.repaidThisMonth}` }}
          icon="CreditCard"
          color="warning"
        />
        <StatCard
          title="Monthly Contributions"
          value={formatCurrency(monthlyContributions?.thisMonth)}
          change={{ type: 'increase', value: `+${monthlyContributions?.growth}%` }}
          icon="TrendingUp"
          color="accent"
        />
      </div>
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Contributions Trend */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Contribution Trends</h3>
            <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={contributionTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Contributions']}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loan Distribution */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Loan Distribution</h3>
            <Icon name="PieChart" size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loanDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {loanDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Amount']}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {loanDistribution?.map((entry, index) => (
              <div key={entry?.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                ></div>
                <span className="text-sm text-muted-foreground">{entry?.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Member Participation */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Member Participation</h3>
          <Icon name="BarChart3" size={20} className="text-muted-foreground" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={memberParticipation}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="category" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                formatter={(value) => [value, 'Members']}
                labelStyle={{ color: 'var(--color-foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="var(--color-secondary)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Quick Insights */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Target" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Savings Goal</span>
            </div>
            <p className="text-xs text-muted-foreground">
              85% of monthly target achieved
            </p>
            <div className="w-full bg-border rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" size={16} className="text-warning" />
              <span className="text-sm font-medium text-foreground">Payment Rate</span>
            </div>
            <p className="text-xs text-muted-foreground">
              92% on-time payment rate this month
            </p>
            <div className="w-full bg-border rounded-full h-2 mt-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Activity" size={16} className="text-secondary" />
              <span className="text-sm font-medium text-foreground">Member Activity</span>
            </div>
            <p className="text-xs text-muted-foreground">
              78% active participation rate
            </p>
            <div className="w-full bg-border rounded-full h-2 mt-2">
              <div className="bg-secondary h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupAnalyticsPanel;