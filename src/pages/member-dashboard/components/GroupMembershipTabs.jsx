import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GroupMembershipTabs = ({ groups, activeGroupId, onGroupChange }) => {
  const [showAllGroups, setShowAllGroups] = useState(false);
  
  const visibleGroups = showAllGroups ? groups : groups?.slice(0, 3);
  const hasMoreGroups = groups?.length > 3;

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-ZW', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'inactive': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">My Groups</h3>
          <p className="text-sm text-muted-foreground">
            {groups?.length} active membership{groups?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
        >
          Join Group
        </Button>
      </div>
      <div className="space-y-4">
        {visibleGroups?.map((group) => (
          <div
            key={group?.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              activeGroupId === group?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
            onClick={() => onGroupChange(group?.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} color="white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{group?.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {group?.memberCount} members
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(group?.status)}`}></div>
                <span className="text-xs text-muted-foreground capitalize">
                  {group?.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">My Balance</p>
                <p className="text-sm font-semibold text-foreground font-data">
                  {formatCurrency(group?.myBalance, group?.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Next Contribution</p>
                <p className="text-sm font-medium text-foreground">
                  {group?.nextContribution}
                </p>
              </div>
            </div>

            {group?.notifications && group?.notifications > 0 && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <Icon name="Bell" size={14} className="text-warning" />
                <span className="text-xs text-warning font-medium">
                  {group?.notifications} pending notification{group?.notifications !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        ))}

        {hasMoreGroups && (
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setShowAllGroups(!showAllGroups)}
            iconName={showAllGroups ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
            iconSize={16}
          >
            {showAllGroups ? 'Show Less' : `Show ${groups?.length - 3} More Groups`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default GroupMembershipTabs;