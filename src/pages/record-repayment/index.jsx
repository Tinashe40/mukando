import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AppIcon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { getUserLoans, recordRepayment } from '../../lib/supabase';

const RecordRepayment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchLoans = async () => {
      const data = await getUserLoans(user.id);
      setLoans(data || []);
    };
    fetchLoans();
  }, [user]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);
    try {
      await recordRepayment({ ...data, user_id: user.id });
      setSuccessMessage('Repayment recorded successfully!');
    } catch (error) {
      setApiError(error.message || 'Failed to record repayment.');
    } finally {
      setIsLoading(false);
    }
  };

  const loanOptions = loans.map(loan => ({
    value: loan.id,
    label: `Loan #${loan.id} - $${loan.amount} for ${loan.purpose}`
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Record Repayment</h1>
        <p className="text-muted-foreground mt-1">Log a repayment for an active loan.</p>
      </header>

      <div className="bg-card rounded-xl border border-border p-6 lg:p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {apiError && <p className="text-sm text-destructive text-center">{apiError}</p>}
          {successMessage && <p className="text-sm text-success text-center">{successMessage}</p>}

          <Select label="Loan" {...register('loan_id', { required: true })} options={loanOptions} error={errors.loan_id} />
          <Input label="Amount (USD)" type="number" {...register('amount', { required: true, valueAsNumber: true })} error={errors.amount} />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" loading={isLoading}>Record Repayment</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordRepayment;