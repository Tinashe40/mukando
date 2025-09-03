import React from 'react';
import Icon from '../../../components/AppIcon';

const RiskHeatmap = ({ data }) => {
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-success/20 text-success border-success/30';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'high':
        return 'bg-error/20 text-error border-error/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-border';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return 'CheckCircle';
      case 'medium':
        return 'AlertTriangle';
      case 'high':
        return 'XCircle';
      default:
        return 'HelpCircle';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZW', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((member, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-warm-md ${getRiskColor(member?.riskLevel)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{member?.name}</h4>
                <p className="text-sm text-muted-foreground">ID: {member?.memberId}</p>
              </div>
              <div className="flex items-center gap-1">
                <Icon name={getRiskIcon(member?.riskLevel)} size={16} />
                <span className="text-xs font-medium uppercase tracking-wider">
                  {member?.riskLevel}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Outstanding Loans:</span>
                <span className="text-sm font-medium text-foreground">
                  {formatCurrency(member?.outstandingLoans)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Repayment Rate:</span>
                <span className="text-sm font-medium text-foreground">
                  {member?.repaymentRate}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Days Overdue:</span>
                <span className="text-sm font-medium text-foreground">
                  {member?.daysOverdue}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Credit Score:</span>
                <span className="text-sm font-medium text-foreground">
                  {member?.creditScore}/100
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-current/20">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-current/10 rounded-full h-2">
                  <div
                    className="bg-current h-2 rounded-full transition-all duration-300"
                    style={{ width: `${member?.creditScore}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{member?.creditScore}%</span>
              </div>
            </div>

            {member?.lastPayment && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">
                  Last Payment: {new Date(member.lastPayment)?.toLocaleDateString('en-GB')}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Risk Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Risk Distribution Summary</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success font-data">
              {data?.filter(m => m?.riskLevel === 'low')?.length}
            </div>
            <div className="text-sm text-muted-foreground">Low Risk</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning font-data">
              {data?.filter(m => m?.riskLevel === 'medium')?.length}
            </div>
            <div className="text-sm text-muted-foreground">Medium Risk</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-error font-data">
              {data?.filter(m => m?.riskLevel === 'high')?.length}
            </div>
            <div className="text-sm text-muted-foreground">High Risk</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskHeatmap;