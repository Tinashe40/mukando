import React, { useMemo, useState } from 'react';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LoanManagementSection = ({ loanRequests, onLoanAction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLoans = useMemo(() => {
    return loanRequests.filter(loan => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = loan.profiles.full_name.toLowerCase().includes(searchLower) ||
                            loan.purpose.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [loanRequests, searchTerm, statusFilter]);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search loans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-48"
        />
      </div>

      <div className="space-y-4">
        {filteredLoans.map(loan => (
          <div key={loan.id} className="bg-muted/30 p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={loan.profiles.avatar_url} alt={loan.profiles.full_name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-foreground">{loan.profiles.full_name}</p>
                  <p className="text-sm text-muted-foreground">{loan.purpose}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-foreground">${loan.amount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">for {loan.term} months</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
              {loan.status === 'pending' && (
                <>
                  <Button variant="outline" size="sm" onClick={() => onLoanAction('reject', loan.id)}>Reject</Button>
                  <Button size="sm" onClick={() => onLoanAction('approve', loan.id)}>Approve</Button>
                </>
              )}
              {loan.status !== 'pending' && (
                <span className={`text-sm font-semibold px-2 py-1 rounded-md ${loan.status === 'approved' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                  {loan.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanManagementSection;