import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const TransactionHistory = ({ transactions = [] }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  const filterOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'contribution', label: 'Contributions' },
    { value: 'loan_repayment', label: 'Loan Repayments' }
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'amount_desc', label: 'Highest Amount' },
    { value: 'amount_asc', label: 'Lowest Amount' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10 border-success/20';
      case 'pending': return 'text-warning bg-warning/10 border-warning/20';
      case 'failed': return 'text-error bg-error/10 border-error/20';
      case 'processing': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'pending': return 'Clock';
      case 'failed': return 'XCircle';
      case 'processing': return 'Loader';
      default: return 'Circle';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'EcoCash': return 'Smartphone';
      case 'OneMoney': return 'CreditCard';
      case 'Telecash': return 'Phone';
      case 'PesePay': return 'Wallet';
      case 'Bank Transfer': return 'Building2';
      case 'Cash': return 'Banknote';
      default: return 'CreditCard';
    }
  };

  const filteredTransactions = transactions?.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'completed' || filter === 'pending' || filter === 'failed') {
      return transaction?.status === filter;
    }
    return transaction?.purpose === filter;
  });

  const sortedTransactions = [...filteredTransactions]?.sort((a, b) => {
    switch (sortBy) {
      case 'date_desc':
        return new Date(b.date) - new Date(a.date);
      case 'date_asc':
        return new Date(a.date) - new Date(b.date);
      case 'amount_desc':
        return b?.amount - a?.amount;
      case 'amount_asc':
        return a?.amount - b?.amount;
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRetryPayment = (transactionId) => {
    console.log('Retrying payment for transaction:', transactionId);
    // Retry logic would go here
  };

  const handleViewDetails = (transactionId) => {
    console.log('Viewing details for transaction:', transactionId);
    // View details logic would go here
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="History" size={20} className="text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
              <p className="text-sm text-muted-foreground">
                {sortedTransactions?.length} transaction{sortedTransactions?.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            label="Filter by"
            options={filterOptions}
            value={filter}
            onChange={setFilter}
            className="flex-1"
          />
          <Select
            label="Sort by"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            className="flex-1"
          />
        </div>
      </div>
      {/* Transaction List */}
      <div className="divide-y divide-border">
        {sortedTransactions?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No transactions found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === 'all' ?'You haven\'t made any payments yet' 
                : `No ${filter} transactions found`
              }
            </p>
          </div>
        ) : (
          sortedTransactions?.map((transaction) => (
            <div key={transaction?.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-4">
                {/* Method Icon */}
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={getMethodIcon(transaction?.method)} size={20} className="text-muted-foreground" />
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-foreground truncate">
                        {transaction?.purpose === 'contribution' ? 'Monthly Contribution' :
                         transaction?.purpose === 'loan_repayment' ? 'Loan Repayment' :
                         transaction?.purpose === 'penalty' ? 'Penalty Payment' :
                         transaction?.purpose === 'emergency_fund'? 'Emergency Fund' : 'Other Payment'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {transaction?.method} • {transaction?.recipient}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${transaction?.amount?.toFixed(2)}</p>
                      {transaction?.fee > 0 && (
                        <p className="text-xs text-muted-foreground">Fee: ${transaction?.fee?.toFixed(2)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Status Badge */}
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction?.status)}`}>
                        <Icon name={getStatusIcon(transaction?.status)} size={12} />
                        {transaction?.status?.charAt(0)?.toUpperCase() + transaction?.status?.slice(1)}
                      </span>

                      {/* Date */}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(transaction?.date)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => handleViewDetails(transaction?.id)}
                      >
                        Details
                      </Button>
                      
                      {transaction?.status === 'failed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="RefreshCw"
                          onClick={() => handleRetryPayment(transaction?.id)}
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Reference */}
                  {transaction?.reference && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Ref: {transaction?.reference}
                    </p>
                  )}

                  {/* Error Message for Failed Transactions */}
                  {transaction?.status === 'failed' && transaction?.errorMessage && (
                    <div className="mt-2 p-2 bg-error/10 rounded border border-error/20">
                      <p className="text-xs text-error">
                        <Icon name="AlertCircle" size={12} className="inline mr-1" />
                        {transaction?.errorMessage}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Load More */}
      {sortedTransactions?.length > 0 && sortedTransactions?.length >= 10 && (
        <div className="p-4 border-t border-border text-center">
          <Button variant="ghost" size="sm">
            Load More Transactions
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;