import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import { getAllRepayments } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

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
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-16">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="History" size={24} className="text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Loan Repayment History</h1>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="bg-card rounded-lg border border-border shadow-warm">
              <ul className="divide-y divide-border">
                {repayments.map((repayment) => (
                  <li key={repayment.id} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-foreground">{repayment.loans.purpose} - {repayment.users.full_name}</p>
                        <p className="text-sm text-muted-foreground">{new Date(repayment.repayment_date).toLocaleDateString()}</p>
                      </div>
                      <p className="font-medium text-foreground">{`$${repayment.amount}`}</p>
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

export default RepaymentHistory;
