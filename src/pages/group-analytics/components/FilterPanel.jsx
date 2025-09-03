import React from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  onResetFilters, 
  onExportData,
  isCollapsed,
  onToggleCollapse 
}) => {
  const timeRangeOptions = [
    { value: '1M', label: 'Last Month' },
    { value: '3M', label: 'Last 3 Months' },
    { value: '6M', label: 'Last 6 Months' },
    { value: '1Y', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const memberSegmentOptions = [
    { value: 'all', label: 'All Members' },
    { value: 'active', label: 'Active Members' },
    { value: 'inactive', label: 'Inactive Members' },
    { value: 'new', label: 'New Members (Last 3 months)' },
    { value: 'high-contributors', label: 'High Contributors' },
    { value: 'loan-holders', label: 'Current Loan Holders' }
  ];

  const metricTypeOptions = [
    { value: 'all', label: 'All Metrics' },
    { value: 'savings', label: 'Savings Only' },
    { value: 'loans', label: 'Loans Only' },
    { value: 'repayments', label: 'Repayments Only' },
    { value: 'engagement', label: 'Member Engagement' }
  ];

  const riskLevelOptions = [
    { value: 'all', label: 'All Risk Levels' },
    { value: 'low', label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high', label: 'High Risk' }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg shadow-warm transition-all duration-300 ${
      isCollapsed ? 'h-16' : 'h-auto'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Analytics Filters</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
        >
          <Icon name={isCollapsed ? 'ChevronDown' : 'ChevronUp'} size={20} />
        </Button>
      </div>
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {/* Time Range Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Time Range"
              options={timeRangeOptions}
              value={filters?.timeRange}
              onChange={(value) => onFilterChange('timeRange', value)}
            />
            
            <Select
              label="Member Segment"
              options={memberSegmentOptions}
              value={filters?.memberSegment}
              onChange={(value) => onFilterChange('memberSegment', value)}
            />
          </div>

          {/* Custom Date Range */}
          {filters?.timeRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={filters?.startDate}
                onChange={(e) => onFilterChange('startDate', e?.target?.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={filters?.endDate}
                onChange={(e) => onFilterChange('endDate', e?.target?.value)}
              />
            </div>
          )}

          {/* Metric and Risk Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Metric Type"
              options={metricTypeOptions}
              value={filters?.metricType}
              onChange={(value) => onFilterChange('metricType', value)}
            />
            
            <Select
              label="Risk Level"
              options={riskLevelOptions}
              value={filters?.riskLevel}
              onChange={(value) => onFilterChange('riskLevel', value)}
            />
          </div>

          {/* Amount Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Minimum Amount (USD)"
              type="number"
              placeholder="0"
              value={filters?.minAmount}
              onChange={(e) => onFilterChange('minAmount', e?.target?.value)}
            />
            <Input
              label="Maximum Amount (USD)"
              type="number"
              placeholder="No limit"
              value={filters?.maxAmount}
              onChange={(e) => onFilterChange('maxAmount', e?.target?.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            <Button
              variant="default"
              onClick={onApplyFilters}
              iconName="Filter"
              iconPosition="left"
              iconSize={16}
            >
              Apply Filters
            </Button>
            
            <Button
              variant="outline"
              onClick={onResetFilters}
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={16}
            >
              Reset
            </Button>
            
            <Button
              variant="secondary"
              onClick={onExportData}
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              Export Data
            </Button>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-sm text-muted-foreground">Quick filters:</span>
            <button
              onClick={() => onFilterChange('quickFilter', 'thisMonth')}
              className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
            >
              This Month
            </button>
            <button
              onClick={() => onFilterChange('quickFilter', 'highRisk')}
              className="px-3 py-1 text-xs bg-error/10 text-error rounded-full hover:bg-error/20 transition-colors"
            >
              High Risk Members
            </button>
            <button
              onClick={() => onFilterChange('quickFilter', 'topContributors')}
              className="px-3 py-1 text-xs bg-success/10 text-success rounded-full hover:bg-success/20 transition-colors"
            >
              Top Contributors
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;