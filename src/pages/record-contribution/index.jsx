import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { getUsers, recordContribution } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const RecordContribution = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const data = await getUsers();
      setUsers(data || []);
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  const handleRecordContribution = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newContribution = await recordContribution({ user_id: selectedUser, amount, group_id: 1 }); // Assuming group_id 1 for now
      if (newContribution) {
        alert('Contribution recorded successfully!');
        setSelectedUser(null);
        setAmount('');
      } else {
        alert('Failed to record contribution. Please try again.');
      }
    } catch (error) {
      console.error('Error recording contribution:', error);
      alert('Failed to record contribution. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const userOptions = users.map(user => ({ value: user.id, label: user.full_name }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-16">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="PlusSquare" size={24} className="text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Record Contribution</h1>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <form onSubmit={handleRecordContribution} className="space-y-6">
              <Select
                label="Select User"
                options={userOptions}
                value={selectedUser}
                onChange={setSelectedUser}
                required
              />
              <Input
                label="Amount"
                type="number"
                placeholder="Enter the contribution amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <Button type="submit" loading={isLoading}>
                Record Contribution
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecordContribution;
