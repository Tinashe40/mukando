import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialOverviewCard = ({ title, amount, currency, change, changeType, icon, iconColor, trend }) => {
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-ZW', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    })?.format(amount);
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-error';
      case 'warning': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive': return 'TrendingUp';
      case 'negative': return 'TrendingDown';
      case 'warning': return 'AlertTriangle';
      default: return 'Minus';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-warm hover:shadow-warm-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon name={icon} size={24} color="white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            <Icon name={getChangeIcon(changeType)} size={16} className={getChangeColor(changeType)} />
            <span className={`text-sm font-medium ${getChangeColor(changeType)}`}>
              {change}
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-2xl font-bold text-foreground font-data">
          {formatCurrency(amount, currency)}
        </div>
        {!trend && change && (
          <div className="flex items-center gap-1">
            <Icon name={getChangeIcon(changeType)} size={14} className={getChangeColor(changeType)} />
            <span className={`text-sm ${getChangeColor(changeType)}`}>
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialOverviewCard;