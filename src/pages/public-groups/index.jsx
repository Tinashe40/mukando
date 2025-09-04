import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import { getPublicGroups } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const PublicGroups = () => {
  const [publicGroups, setPublicGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicGroups = async () => {
      setIsLoading(true);
      const data = await getPublicGroups();
      setPublicGroups(data || []);
      setIsLoading(false);
    };
    fetchPublicGroups();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-16">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="Globe" size={24} className="text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Public Groups</h1>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="bg-card rounded-lg border border-border shadow-warm">
              <ul className="divide-y divide-border">
                {publicGroups.map((group) => (
                  <li key={group.id} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-foreground">{group.name}</p>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Members: {group.member_count}</p>
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

export default PublicGroups;
