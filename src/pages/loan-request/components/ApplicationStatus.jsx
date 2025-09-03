import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ApplicationStatus = ({ applications, onViewDetails, onWithdraw }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'text-success bg-success/10 border-success/20';
      case 'pending':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'rejected':
        return 'text-error bg-error/10 border-error/20';
      case 'under_review':
        return 'text-secondary bg-secondary/10 border-secondary/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'rejected':
        return 'XCircle';
      case 'under_review':
        return 'Eye';
      default:
        return 'FileText';
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (!applications || applications?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-warm">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Application Status</h2>
              <p className="text-sm text-muted-foreground">Track your loan applications</p>
            </div>
          </div>
        </div>

        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileX" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Applications Yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't submitted any loan applications. Start by filling out the application form above.
          </p>
          <Button variant="outline" iconName="Plus" iconPosition="left">
            Create First Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Application Status</h2>
              <p className="text-sm text-muted-foreground">
                {applications?.length} application{applications?.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" iconName="RefreshCw">
            Refresh
          </Button>
        </div>
      </div>
      <div className="divide-y divide-border">
        {applications?.map((application) => (
          <div key={application?.id} className="p-6 hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Icon 
                    name={getStatusIcon(application?.status)} 
                    size={20} 
                    className={getStatusColor(application?.status)?.split(' ')?.[0]}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">
                      {formatCurrency(application?.amount, application?.currency)}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application?.status)}`}>
                      {application?.status?.replace('_', ' ')?.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Purpose:</span>
                      <p className="font-medium text-foreground capitalize">
                        {application?.purpose?.replace('_', ' ')}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Period:</span>
                      <p className="font-medium text-foreground">
                        {application?.repaymentPeriod} months
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Applied:</span>
                      <p className="font-medium text-foreground">
                        {formatDate(application?.submittedAt)}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Updated:</span>
                      <p className="font-medium text-foreground">
                        {getTimeAgo(application?.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Processing Progress</span>
                <span className="text-sm text-muted-foreground">
                  {application?.progress || 0}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${application?.progress || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Status Details */}
            {application?.statusMessage && (
              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <p className="text-sm text-foreground">{application?.statusMessage}</p>
                {application?.nextAction && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Next: {application?.nextAction}
                  </p>
                )}
              </div>
            )}

            {/* Expected Timeline */}
            {application?.status === 'pending' && (
              <div className="bg-warning/5 border border-warning/20 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-foreground">
                    Expected Response: {application?.expectedResponse || '3-5 business days'}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(application?.id)}
                iconName="Eye"
                iconPosition="left"
              >
                View Details
              </Button>
              
              {application?.status === 'pending' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onWithdraw(application?.id)}
                  iconName="X"
                  iconPosition="left"
                  className="text-error hover:text-error"
                >
                  Withdraw
                </Button>
              )}
              
              {application?.status === 'approved' && (
                <Button
                  variant="default"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                >
                  Accept Loan
                </Button>
              )}
              
              {application?.documents && application?.documents?.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Paperclip"
                  iconPosition="left"
                >
                  Documents ({application?.documents?.length})
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationStatus;