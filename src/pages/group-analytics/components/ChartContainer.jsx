import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChartContainer = ({ 
  title, 
  children, 
  onExport, 
  onRefresh, 
  showExport = true, 
  showRefresh = true,
  className = "",
  headerActions
}) => {
  return (
    <div className={`bg-card border border-border rounded-lg shadow-warm ${className}`}>
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {headerActions}
          {showRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              title="Refresh data"
            >
              <Icon name="RefreshCw" size={16} />
            </Button>
          )}
          {showExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              Export
            </Button>
          )}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;