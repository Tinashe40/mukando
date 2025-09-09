import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const StatCard = ({ title, value, icon }) => (
  <div className="bg-muted/30 p-4 rounded-lg">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  </div>
);

const GroupAnalyticsPanel = ({ analyticsData }) => {
  const { total_savings, total_members, active_loans, loan_distribution } = analyticsData;

  const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Savings" value={`$${total_savings?.toLocaleString() || 0}`} icon={<AppIcon name="Wallet" />} />
        <StatCard title="Total Members" value={total_members || 0} icon={<AppIcon name="Users" />} />
        <StatCard title="Active Loans" value={`$${active_loans?.toLocaleString() || 0}`} icon={<AppIcon name="Handshake" />} />
        <StatCard title="Repayment Rate" value="98%" icon={<AppIcon name="TrendingUp" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Loan Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={loan_distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                {loan_distribution?.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Contribution Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="uv" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GroupAnalyticsPanel;