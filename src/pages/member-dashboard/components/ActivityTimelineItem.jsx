import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityTimelineItem = ({ activity, isLast = false }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'contribution': return 'PlusCircle';
      case 'loan_approved': return 'CheckCircle';
      case 'loan_request': return 'CreditCard';
      case 'payment': return 'ArrowUpRight';
      case 'notification': return 'Bell';
      case 'group_join': return 'Users';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'contribution': return 'bg-success';
      case 'loan_approved': return 'bg-primary';
      case 'loan_request': return 'bg-warning';
      case 'payment': return 'bg-secondary';
      case 'notification': return 'bg-accent';
      case 'group_join': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="flex gap-4 pb-6 relative">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-0.5 h-full bg-border"></div>
      )}
      {/* Activity Icon */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getActivityColor(activity?.type)} flex-shrink-0`}>
        <Icon name={getActivityIcon(activity?.type)} size={20} color="white" />
      </div>
      {/* Activity Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-foreground mb-1">
              {activity?.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {activity?.description}
            </p>
          </div>
          <span className="text-xs text-muted-foreground ml-4 flex-shrink-0">
            {formatTime(activity?.timestamp)}
          </span>
        </div>
        
        {/* Activity Details */}
        {activity?.amount && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-medium text-foreground font-data">
              {activity?.currency} {activity?.amount?.toLocaleString()}
            </span>
            {activity?.status && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                activity?.status === 'approved' ? 'bg-success/10 text-success' :
                activity?.status === 'pending' ? 'bg-warning/10 text-warning' :
                activity?.status === 'rejected'? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'
              }`}>
                {activity?.status}
              </span>
            )}
          </div>
        )}
        
        {activity?.group && (
          <div className="flex items-center gap-1 mt-2">
            <Icon name="Users" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{activity?.group}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimelineItem;