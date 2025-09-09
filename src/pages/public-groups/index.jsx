import React, { useEffect, useState } from 'react';
import AppIcon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getPublicGroups } from '../../lib/supabase';

const PublicGroups = () => {
  const [publicGroups, setPublicGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPublicGroups = async () => {
      setIsLoading(true);
      const data = await getPublicGroups();
      setPublicGroups(data || []);
      setIsLoading(false);
    };
    fetchPublicGroups();
  }, []);

  const filteredGroups = publicGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Public Groups</h1>
        <p className="text-muted-foreground mt-1">Discover and join savings communities.</p>
      </header>

      <Input
        placeholder="Search for groups..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64"><LoadingSpinner /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-card rounded-xl border border-border p-6 flex flex-col">
              <h3 className="text-lg font-bold text-foreground">{group.name}</h3>
              <p className="text-muted-foreground text-sm mt-1 flex-grow">{group.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AppIcon name="Users" size={16} />
                  <span>{group.members_count} members</span>
                </div>
                <Button size="sm">Join</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicGroups;