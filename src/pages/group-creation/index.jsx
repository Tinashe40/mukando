import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AppIcon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { createGroup } from '../../lib/supabase';

const GroupCreation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await createGroup({ ...data, created_by: user.id });
      navigate('/group-management');
    } catch (error) {
      setApiError(error.message || 'Failed to create group.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Create a New Group</h1>
        <p className="text-muted-foreground mt-1">Start a new savings community with your friends and family.</p>
      </header>

      <div className="bg-card rounded-xl border border-border p-6 lg:p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {apiError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
              <AppIcon name="AlertTriangle" className="text-destructive" size={20} />
              <p className="text-sm font-medium text-destructive">{apiError}</p>
            </div>
          )}

          <Input
            label="Group Name"
            placeholder="e.g. Family Savings"
            {...register('name', { required: 'Group name is required' })}
            error={errors.name?.message}
          />

          <Input
            label="Group Description"
            placeholder="A short description of your group's purpose."
            {...register('description')}
          />

          <div className="flex justify-end">
            <Button type="submit" loading={isLoading}>
              Create Group
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupCreation;