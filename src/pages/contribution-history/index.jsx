import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { getContributionHistory } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ContributionHistory = () => {
  const { user } = useAuth();
  const [contributions, setContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContributions = async () => {
      if (user) {
        setIsLoading(true);
        const data = await getContributionHistory(user.id);
        setContributions(data || []);
        setIsLoading(false);
      }
    };
    fetchContributions();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-16">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="History" size={24} className="text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Contribution History</h1>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="bg-card rounded-lg border border-border shadow-warm">
              <ul className="divide-y divide-border">
                {contributions.map((contribution) => (
                  <li key={contribution.id} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-foreground">{contribution.groups.name}</p>
                        <p className="text-sm text-muted-foreground">{new Date(contribution.contribution_date).toLocaleDateString()}</p>
                      </div>
                      <p className="font-medium text-foreground">{`$${contribution.amount}`}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContributionHistory;
