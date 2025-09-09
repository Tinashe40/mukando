import React, { useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AppIcon from '../../components/AppIcon';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { getContributionHistory, getUserGroups } from '../../lib/supabase';

const StatCard = ({ title, value }) => (
  <div className="bg-card p-5 rounded-xl border border-border">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-2xl font-bold text-foreground">{value}</p>
  </div>
);

const ContributionHistory = () => {
  const { user } = useAuth();
  const [contributions, setContributions] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [groups, history] = await Promise.all([
          getUserGroups(user.id),
          getContributionHistory(user.id),
        ]);
        setUserGroups(groups || []);
        setContributions(history || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const filteredContributions = useMemo(() => {
    if (selectedGroup === 'all') return contributions;
    return contributions.filter(c => c.group_id === selectedGroup);
  }, [contributions, selectedGroup]);

  const { totalContribution, chartData } = useMemo(() => {
    const total = filteredContributions.reduce((acc, curr) => acc + curr.amount, 0);
    const data = filteredContributions.reduce((acc, curr) => {
      const date = new Date(curr.contribution_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[date] = (acc[date] || 0) + curr.amount;
      return acc;
    }, {});
    const chart = Object.entries(data).map(([date, amount]) => ({ date, amount })).reverse();
    return { totalContribution: total, chartData: chart };
  }, [filteredContributions]);

  const groupOptions = [
    { value: 'all', label: 'All Groups' },
    ...userGroups.map(g => ({ value: g.id, label: g.name }))
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><LoadingSpinner /></div>;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contribution History</h1>
          <p className="text-muted-foreground mt-1">Review your savings contributions.</p>
        </div>
        <Select options={groupOptions} value={selectedGroup} onChange={setSelectedGroup} className="w-full md:w-64 mt-4 md:mt-0" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Contributions" value={`$${totalContribution.toLocaleString()}`} />
        <StatCard title="# of Contributions" value={filteredContributions.length} />
        <StatCard title="Average Contribution" value={`$${(totalContribution / (filteredContributions.length || 1)).toFixed(2)}`} />
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-lg text-foreground mb-4">Contribution Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--color-popover)', border: '1px solid var(--color-border)' }} />
            <Line type="monotone" dataKey="amount" stroke="var(--color-primary)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Date</th>
              <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Group</th>
              <th className="p-4 text-right text-sm font-semibold text-muted-foreground">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredContributions.map((c) => (
              <tr key={c.id} className="hover:bg-muted/50">
                <td className="p-4 text-sm text-foreground">{new Date(c.contribution_date).toLocaleDateString()}</td>
                <td className="p-4 text-sm font-medium text-foreground">{userGroups.find(g => g.id === c.group_id)?.name || 'N/A'}</td>
                <td className="p-4 text-right font-semibold text-primary">${c.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredContributions.length === 0 && (
          <div className="p-8 text-center">
            <AppIcon name="Inbox" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No contributions found.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionHistory;
