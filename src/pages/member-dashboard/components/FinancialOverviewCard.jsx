import React from 'react';
import AppIcon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const FinancialOverviewCard = ({ title, amount, trend }) => {
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // Assuming USD, this could be dynamic
      minimumFractionDigits: 2,
    }).format(value);
  };

  const isPositive = trend >= 0;
  const trendPercentage = trend ? `${Math.abs(trend).toFixed(1)}%` : null;

  const iconMap = {
    "Total Savings": "Wallet",
    "Active Loans": "Handshake",
    "Pending Contributions": "Hourglass",
    "Group Memberships": "Users",
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-warm-md hover:-translate-y-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-muted-foreground">{title}</h3>
        <AppIcon name={iconMap[title] || 'DollarSign'} size={22} className="text-muted-foreground" />
      </div>
      <div className="mt-1">
        <p className="text-3xl font-bold text-foreground">{title.includes('Amount') || title.includes('Savings') ? formatCurrency(amount) : amount}</p>
        {trendPercentage && (
          <div className={cn('flex items-center text-sm mt-1', isPositive ? 'text-success' : 'text-destructive')}>
            <AppIcon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={16} className="mr-1" />
            <span>{trendPercentage} vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialOverviewCard;