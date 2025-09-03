import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionCard = ({ title, description, icon, iconColor, actionText, onAction, disabled = false, badge }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-warm hover:shadow-warm-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColor} group-hover:scale-105 transition-transform duration-200`}>
          <Icon name={icon} size={24} color="white" />
        </div>
        {badge && (
          <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
            {badge}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        
        <Button
          variant="outline"
          fullWidth
          onClick={onAction}
          disabled={disabled}
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={16}
          className="group-hover:border-primary group-hover:text-primary transition-colors duration-200"
        >
          {actionText}
        </Button>
      </div>
    </div>
  );
};

export default QuickActionCard;