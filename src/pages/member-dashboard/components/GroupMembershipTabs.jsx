import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const GroupMembershipTabs = ({ groups, activeGroupId, onGroupChange }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleGroups = showAll ? groups : groups.slice(0, 3);

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Groups</h3>
        <Button variant="ghost" size="sm" onClick={() => { /* Navigate to create group page */ }}>
          <Icon name="Plus" className="mr-2" size={16} />
          New Group
        </Button>
      </div>
      <div className="space-y-3">
        {visibleGroups.map((group) => (
          <div
            key={group.id}
            onClick={() => onGroupChange(group.id)}
            className={cn(
              'p-4 rounded-lg cursor-pointer transition-all duration-200 border-2',
              activeGroupId === group.id
                ? 'border-primary bg-primary/10 dark:bg-primary/20'
                : 'border-transparent bg-gray-50 dark:bg-gray-700/50 hover:border-primary/50'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{group.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{group.memberCount} members</p>
                </div>
              </div>
              <div className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-full capitalize',
                group.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              )}>
                {group.status}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">My Savings</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(group.myBalance, group.currency)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Next Due</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{group.nextContribution}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {groups.length > 3 && (
        <Button variant="ghost" fullWidth onClick={() => setShowAll(!showAll)} className="mt-4">
          {showAll ? 'Show Less' : `Show ${groups.length - 3} More`}
          <Icon name={showAll ? 'ChevronUp' : 'ChevronDown'} size={16} className="ml-2" />
        </Button>
      )}
    </div>
  );
};

export default GroupMembershipTabs;
