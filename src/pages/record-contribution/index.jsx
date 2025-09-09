import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AppIcon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { getUserGroups, getUsers, recordContribution } from '../../lib/supabase';

const RecordContribution = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [userGroups, setUserGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [groups, allUsers] = await Promise.all([getUserGroups(user.id), getUsers()]);
      setUserGroups(groups || []);
      setUsers(allUsers || []);
    };
    fetchData();
  }, [user]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);
    try {
      await recordContribution({ ...data, recorded_by: user.id });
      setSuccessMessage('Contribution recorded successfully!');
    } catch (error) {
      setApiError(error.message || 'Failed to record contribution.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Record Contribution</h1>
        <p className="text-muted-foreground mt-1">Manually log a contribution for a member.</p>
      </header>

      <div className="bg-card rounded-xl border border-border p-6 lg:p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {apiError && <p className="text-sm text-destructive text-center">{apiError}</p>}
          {successMessage && <p className="text-sm text-success text-center">{successMessage}</p>}

          <Select label="Group" {...register('group_id', { required: true })} options={userGroups.map(g => ({ value: g.id, label: g.name }))} error={errors.group_id} />
          <Select label="Member" {...register('user_id', { required: true })} options={users.map(u => ({ value: u.id, label: u.full_name }))} error={errors.user_id} />
          <Input label="Amount (USD)" type="number" {...register('amount', { required: true, valueAsNumber: true })} error={errors.amount} />
          <Input label="Notes (Optional)" {...register('notes')} />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" loading={isLoading}>Record Contribution</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordContribution;
