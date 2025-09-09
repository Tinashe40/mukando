import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { getUserGroups, getUsers, recordContribution } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const RecordContribution = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userGroups, setUserGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const groups = await getUserGroups(user.id);
          setUserGroups(groups || []);
          const allUsers = await getUsers();
          setUsers(allUsers || []);
        } catch (err) {
          setError('Failed to fetch initial data.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  const handleRecordContribution = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      await recordContribution({ 
        user_id: selectedUser, 
        amount: parseFloat(amount), 
        group_id: selectedGroup,
        notes: notes,
        recorded_by: user.id
      });
      setSuccess('Contribution recorded successfully!');
      setSelectedUser('');
      setAmount('');
      setNotes('');
    } catch (err) {
      setError('Failed to record contribution. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const groupOptions = userGroups.map(g => ({ value: g.id, label: g.name }));
  const userOptions = users.map(u => ({ value: u.id, label: u.email })); // Assuming users have email

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-card p-8 rounded-xl shadow-warm border border-border">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="DollarSign" size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Record Contribution</h1>
          <p className="text-muted-foreground mt-2">Manually record a new contribution for a group member.</p>
        </div>

        <form onSubmit={handleRecordContribution} className="space-y-6">
          <Select
            label="Select Group"
            options={groupOptions}
            value={selectedGroup}
            onChange={setSelectedGroup}
            placeholder="Choose a group..."
            required
          />
          <Select
            label="Select Member"
            options={userOptions}
            value={selectedUser}
            onChange={setSelectedUser}
            placeholder="Choose a member..."
            required
            disabled={!selectedGroup}
          />
          <Input
            label="Amount (USD)"
            type="number"
            placeholder="e.g., 50.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            disabled={!selectedUser}
            iconName="DollarSign"
          />
          <Input
            label="Notes (Optional)"
            type="text"
            placeholder="e.g., Monthly savings for June"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={!selectedUser}
            iconName="FileText"
          />

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {success && <p className="text-sm text-green-500 text-center">{success}</p>}

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/group-management')} disabled={isLoading}>Cancel</Button>
            <Button type="submit" loading={isLoading} disabled={!selectedUser || !amount}>
              <Icon name="Save" className="mr-2" />
              Record Contribution
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordContribution;