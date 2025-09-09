import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { getContributionHistory, getUserGroups } from '../../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ContributionHistory = () => {
  const { user } = useAuth();
  const [contributions, setContributions] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const [groups, history] = await Promise.all([
            getUserGroups(user.id),
            getContributionHistory(user.id) // Assuming this fetches all contributions for the user
          ]);
          setUserGroups(groups || []);
          setContributions(history || []);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  const filteredContributions = useMemo(() => {
    if (selectedGroup === 'all') return contributions;
    return contributions.filter(c => c.group_id === selectedGroup);
  }, [contributions, selectedGroup]);

  const totalContribution = useMemo(() => {
    return filteredContributions.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredContributions]);

  const groupOptions = [
    { value: 'all', label: 'All Groups' },
    ...userGroups.map(g => ({ value: g.id, label: g.name }))
  ];

  const chartData = useMemo(() => {
    const data = filteredContributions.reduce((acc, curr) => {
      const date = new Date(curr.contribution_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[date] = (acc[date] || 0) + curr.amount;
      return acc;
    }, {});
    return Object.entries(data).map(([date, amount]) => ({ date, amount })).reverse();
  }, [filteredContributions]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contribution History</h1>
          <p className="text-muted-foreground mt-1">Review your savings contributions across all your groups.</p>
        </div>
        <Select options={groupOptions} value={selectedGroup} onChange={setSelectedGroup} className="w-full md:w-64 mt-4 md:mt-0" />
      </div>

      {isLoading ? (
        <div className="text-center"><p>Loading...</p></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card p-6 rounded-xl shadow-warm border border-border">
              <p className="text-sm text-muted-foreground">Total Contributions</p>
              <p className="text-3xl font-bold text-primary">${totalContribution.toLocaleString()}</p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-warm border border-border">
              <p className="text-sm text-muted-foreground">Number of Contributions</p>
              <p className="text-3xl font-bold text-primary">{filteredContributions.length}</p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-warm border border-border">
              <p className="text-sm text-muted-foreground">Average Contribution</p>
              <p className="text-3xl font-bold text-primary">${(totalContribution / (filteredContributions.length || 1)).toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-warm border border-border mb-8">
            <h3 className="font-semibold text-lg text-foreground p-5">Contribution Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-popover)', border: '1px solid var(--color-border)' }} />
                <Line type="monotone" dataKey="amount" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl shadow-warm border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Date</th>
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Group</th>
                  <th className="p-4 text-right text-sm font-semibold text-muted-foreground">Amount (USD)</th>
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredContributions.map((c) => (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 text-sm text-foreground">{new Date(c.contribution_date).toLocaleDateString()}</td>
                    <td className="p-4 text-sm font-medium text-foreground">{userGroups.find(g => g.id === c.group_id)?.name || 'N/A'}</td>
                    <td className="p-4 text-right font-semibold text-primary">${c.amount.toLocaleString()}</td>
                    <td className="p-4 text-sm text-muted-foreground">{c.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredContributions.length === 0 && (
              <div className="p-8 text-center">
                <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">No Contributions Found</h3>
                <p className="text-muted-foreground">No contributions recorded for the selected group.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ContributionHistory;