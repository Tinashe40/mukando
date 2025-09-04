import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { getUserLoans, recordRepayment } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const RecordRepayment = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      if (user) {
        setIsLoading(true);
        const data = await getUserLoans(user.id);
        setLoans(data || []);
        setIsLoading(false);
      }
    };
    fetchLoans();
  }, [user]);

  const handleRecordRepayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newRepayment = await recordRepayment({ loan_id: selectedLoan, user_id: user.id, amount });
      if (newRepayment) {
        alert('Repayment recorded successfully!');
        setSelectedLoan(null);
        setAmount('');
      } else {
        alert('Failed to record repayment. Please try again.');
      }
    } catch (error) {
      console.error('Error recording repayment:', error);
      alert('Failed to record repayment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loanOptions = loans.map(loan => ({
    value: loan.id,
    label: `Loan ID: ${loan.id} - Amount: $${loan.amount} - Purpose: ${loan.purpose}`
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-16">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="DollarSign" size={24} className="text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Record Loan Repayment</h1>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <form onSubmit={handleRecordRepayment} className="space-y-6">
              <Select
                label="Select Loan"
                options={loanOptions}
                value={selectedLoan}
                onChange={setSelectedLoan}
                required
              />
              <Input
                label="Amount"
                type="number"
                placeholder="Enter the repayment amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <Button type="submit" loading={isLoading}>
                Record Repayment
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecordRepayment;
