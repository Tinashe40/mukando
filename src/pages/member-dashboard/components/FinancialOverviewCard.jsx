import React from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const FinancialOverviewCard = ({ title, amount, currency, change, changeType, icon, iconColor, trend }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  const changeColorClasses = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    warning: 'text-yellow-500',
  };

  const changeIcon = {
    positive: 'ArrowUpRight',
    negative: 'ArrowDownRight',
    warning: 'AlertTriangle',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-600 dark:text-gray-300">{title}</h3>
        <div className={cn('flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', iconColor)}>
          <Icon name={icon} size={22} className="text-white" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(amount)}</p>
        {change && (
          <div className={cn('flex items-center text-sm mt-1', changeColorClasses[changeType] || 'text-gray-500 dark:text-gray-400')}>
            <Icon name={changeIcon[changeType] || 'Minus'} size={16} className="mr-1" />
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialOverviewCard;
