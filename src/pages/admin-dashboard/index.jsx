import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import { getAdminDashboardData } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FinancialOverviewCard from '../member-dashboard/components/FinancialOverviewCard';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      const data = await getAdminDashboardData();
      setDashboardData(data);
      setIsLoading(false);
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-16 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <div className="flex items-center gap-4">
            <Icon name="LayoutDashboard" size={32} className="text-primary" />
            <h1 className="text-3xl font-bold font-heading">Admin Dashboard</h1>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-8">
              {/* System Overview */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FinancialOverviewCard
                    title="Total Users"
                    amount={dashboardData?.total_users}
                    icon="Users"
                    iconColor="bg-blue-500"
                    currency=""
                    change=""
                    changeType="positive"
                  />
                  <FinancialOverviewCard
                    title="Total Groups"
                    amount={dashboardData?.total_groups}
                    icon="Group"
                    iconColor="bg-green-500"
                    currency=""
                    change=""
                    changeType="positive"
                  />
                  <FinancialOverviewCard
                    title="Total Loans Disbursed"
                    amount={dashboardData?.total_loans_disbursed}
                    icon="CreditCard"
                    iconColor="bg-purple-500"
                    currency="USD"
                    change=""
                    changeType="positive"
                  />
                  <FinancialOverviewCard
                    title="Total Contributions"
                    amount={dashboardData?.total_contributions}
                    icon="PiggyBank"
                    iconColor="bg-yellow-500"
                    currency="USD"
                    change=""
                    changeType="positive"
                  />
                </div>
              </section>

              {/* Recent Activity (Placeholder) */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 min-h-[200px] flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Activity feed coming soon...</p>
                </div>
              </section>

              {/* User & Group Trends (Placeholder) */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User & Group Trends</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 min-h-[200px] flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Charts and trends coming soon...</p>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
