import React, { useEffect, useState } from 'react';
import AppIcon from '../../components/AppIcon';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getAllRepayments } from '../../lib/supabase';

const RepaymentHistory = () => {
  const [repayments, setRepayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRepayments = async () => {
      setIsLoading(true);
      const data = await getAllRepayments();
      setRepayments(data || []);
      setIsLoading(false);
    };
    fetchRepayments();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Repayment History</h1>
        <p className="text-muted-foreground mt-1">A complete record of all loan repayments.</p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-64"><LoadingSpinner /></div>
      ) : (
        <div className="bg-card rounded-xl border border-border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Loan Purpose</th>
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Member</th>
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Date</th>
                  <th className="p-4 text-right text-sm font-semibold text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {repayments.map((repayment) => (
                  <tr key={repayment.id} className="hover:bg-muted/50">
                    <td className="p-4 font-medium text-foreground">{repayment.loans.purpose}</td>
                    <td className="p-4 text-muted-foreground">{repayment.users.full_name}</td>
                    <td className="p-4 text-muted-foreground">{new Date(repayment.repayment_date).toLocaleDateString()}</td>
                    <td className="p-4 text-right font-semibold text-primary">{`$${repayment.amount}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepaymentHistory;