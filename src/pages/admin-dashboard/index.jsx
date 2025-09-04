import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import { getAdminDashboardData } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

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
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-16">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="LayoutDashboard" size={24} className="text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="bg-card rounded-lg border border-border shadow-warm">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-semibold text-foreground">{dashboardData?.total_users}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Groups</p>
                    <p className="text-2xl font-semibold text-foreground">{dashboardData?.total_groups}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Loans Disbursed</p>
                    <p className="text-2xl font-semibold text-foreground">{`$${dashboardData?.total_loans_disbursed}`}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
