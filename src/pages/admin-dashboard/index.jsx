import React, { useEffect, useState } from 'react';
import AppIcon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getAdminDashboardData } from '../../lib/supabase';
import FinancialOverviewCard from '../member-dashboard/components/FinancialOverviewCard';
import UserGrowthChart from './components/UserGrowthChart';
import GroupActivityTable from './components/GroupActivityTable';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const dashboardData = await getAdminDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError('Failed to load admin data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <header>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">System-wide overview and management.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialOverviewCard title="Total Users" amount={data?.total_users} />
        <FinancialOverviewCard title="Total Groups" amount={data?.total_groups} />
        <FinancialOverviewCard title="Total Loans" amount={data?.total_loans_disbursed} />
        <FinancialOverviewCard title="Total Contributions" amount={data?.total_contributions} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">User Growth</h3>
          <UserGrowthChart data={data?.user_growth} />
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Platform Health</h3>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">System status coming soon</div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Group Activity</h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <GroupActivityTable data={data?.recent_groups} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;