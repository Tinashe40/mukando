import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const QuickActionCard = ({ title, description, icon, onAction }) => {
  const ICON_STYLES = {
    PlusCircle: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
    CreditCard: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
    Users: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
    Wallet: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
  };

  return (
    <div 
      onClick={onAction}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 cursor-pointer group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-in-out"
    >
      <div className="flex flex-col items-start h-full">
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center mb-4', ICON_STYLES[icon] || 'bg-gray-100 text-gray-600')}>
          <Icon name={icon} size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4 flex-grow">{description}</p>
        <div className="w-full mt-auto">
            <span className="text-sm font-semibold text-primary group-hover:underline flex items-center">
              Proceed
              <Icon name="ArrowRight" size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
        </div>
      </div>
    </div>
  );
};

export default QuickActionCard;
