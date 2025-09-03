import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LoanManagementSection = ({ loanRequests, onLoanAction }) => {
  const [filterStatus, setFilterStatus] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Requests' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'active', label: 'Active Loans' },
    { value: 'completed', label: 'Completed' }
  ];

  const filteredLoans = loanRequests?.filter(loan => {
    const matchesSearch = loan?.memberName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         loan?.purpose?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = filterStatus === 'all' || loan?.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-warning text-warning-foreground', label: 'Pending', icon: 'Clock' },
      approved: { color: 'bg-success text-success-foreground', label: 'Approved', icon: 'CheckCircle' },
      rejected: { color: 'bg-error text-error-foreground', label: 'Rejected', icon: 'XCircle' },
      active: { color: 'bg-primary text-primary-foreground', label: 'Active', icon: 'CreditCard' },
      completed: { color: 'bg-muted text-muted-foreground', label: 'Completed', icon: 'Check' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        {config?.label}
      </span>
    );
  };

  const getCreditScoreBadge = (score) => {
    let color = 'bg-error text-error-foreground';
    let label = 'Poor';
    
    if (score >= 80) {
      color = 'bg-success text-success-foreground';
      label = 'Excellent';
    } else if (score >= 70) {
      color = 'bg-primary text-primary-foreground';
      label = 'Good';
    } else if (score >= 60) {
      color = 'bg-warning text-warning-foreground';
      label = 'Fair';
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {score}/100 - {label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZW', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-GB');
  };

  const calculateMonthlyPayment = (amount, interestRate, termMonths) => {
    const monthlyRate = interestRate / 100 / 12;
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                   (Math.pow(1 + monthlyRate, termMonths) - 1);
    return payment;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Loan Management</h3>
            <p className="text-sm text-muted-foreground">
              Review and approve loan requests with AI-powered credit scoring
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Input
              type="search"
              placeholder="Search loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full sm:w-64"
            />
            
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Filter by status"
              className="w-full sm:w-40"
            />
          </div>
        </div>
      </div>
      {/* Loan Requests List */}
      <div className="divide-y divide-border">
        {filteredLoans?.map((loan) => (
          <div key={loan?.id} className="p-6 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Member Info */}
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={loan?.memberAvatar}
                    alt={loan?.memberName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{loan?.memberName}</h4>
                    {getStatusBadge(loan?.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{loan?.memberEmail}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Member since: {formatDate(loan?.memberJoinDate)}
                    </span>
                    <span className="text-muted-foreground">
                      Previous loans: {loan?.previousLoans}
                    </span>
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Requested Amount</p>
                    <p className="font-semibold text-foreground font-data">
                      {formatCurrency(loan?.requestedAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Term</p>
                    <p className="font-medium text-foreground">{loan?.termMonths} months</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Purpose</p>
                  <p className="text-sm text-foreground">{loan?.purpose}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Credit Score</p>
                    {getCreditScoreBadge(loan?.creditScore)}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Monthly Payment</p>
                    <p className="font-medium text-foreground font-data">
                      {formatCurrency(calculateMonthlyPayment(loan?.requestedAmount, loan?.interestRate, loan?.termMonths))}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Assessment */}
              <div className="lg:w-64 bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Brain" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">AI Assessment</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Risk Level:</span>
                    <span className={`font-medium ${
                      loan?.riskLevel === 'Low' ? 'text-success' :
                      loan?.riskLevel === 'Medium' ? 'text-warning' : 'text-error'
                    }`}>
                      {loan?.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Eligibility:</span>
                    <span className="font-medium text-foreground">{loan?.eligibilityScore}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recommended:</span>
                    <span className={`font-medium ${loan?.aiRecommendation === 'Approve' ? 'text-success' : 'text-warning'}`}>
                      {loan?.aiRecommendation}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mb-3">
                  <p className="font-medium mb-1">Key Factors:</p>
                  <ul className="space-y-1">
                    {loan?.assessmentFactors?.map((factor, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <Icon name="Dot" size={12} />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>

                {loan?.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLoanAction('reject', loan?.id)}
                      className="flex-1"
                    >
                      <Icon name="X" size={14} />
                      Reject
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onLoanAction('approve', loan?.id)}
                      className="flex-1"
                    >
                      <Icon name="Check" size={14} />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Calendar" size={14} />
                <span>Requested: {formatDate(loan?.requestDate)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLoan(loan?.id)}
                >
                  <Icon name="Eye" size={14} />
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLoanAction('message', loan?.id)}
                >
                  <Icon name="MessageCircle" size={14} />
                  Message
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLoanAction('history', loan?.id)}
                >
                  <Icon name="History" size={14} />
                  History
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredLoans?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="CreditCard" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No loan requests found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterStatus !== 'all' ?'Try adjusting your search or filter criteria' :'No loan requests at this time'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default LoanManagementSection;