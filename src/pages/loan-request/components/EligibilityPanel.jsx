import React from 'react';
import Icon from '../../../components/AppIcon';

const EligibilityPanel = ({ eligibilityData, memberData }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getApprovalLikelihood = (score) => {
    if (score >= 80) return { text: 'Very High', color: 'text-success' };
    if (score >= 60) return { text: 'Moderate', color: 'text-warning' };
    return { text: 'Low', color: 'text-error' };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: eligibilityData?.currency || 'USD',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const approvalLikelihood = getApprovalLikelihood(eligibilityData?.creditScore || 0);

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Loan Eligibility</h2>
            <p className="text-sm text-muted-foreground">Your current eligibility assessment</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Credit Score */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(eligibilityData?.creditScore || 0)} mb-4`}>
            <span className={`text-2xl font-bold ${getScoreColor(eligibilityData?.creditScore || 0)}`}>
              {eligibilityData?.creditScore || 0}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Credit Score</h3>
          <p className={`text-sm font-medium ${approvalLikelihood?.color}`}>
            {approvalLikelihood?.text} Approval Likelihood
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Wallet" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Current Savings</span>
            </div>
            <p className="text-lg font-semibold text-foreground font-data">
              {formatCurrency(memberData?.currentSavings || 0)}
            </p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CreditCard" size={16} className="text-secondary" />
              <span className="text-sm font-medium text-foreground">Max Loan Amount</span>
            </div>
            <p className="text-lg font-semibold text-foreground font-data">
              {formatCurrency(eligibilityData?.maxLoanAmount || 0)}
            </p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Percent" size={16} className="text-warning" />
              <span className="text-sm font-medium text-foreground">Interest Rate</span>
            </div>
            <p className="text-lg font-semibold text-foreground font-data">
              {((eligibilityData?.interestRate || 0.15) * 100)?.toFixed(1)}% p.a.
            </p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Calendar" size={16} className="text-accent" />
              <span className="text-sm font-medium text-foreground">Membership</span>
            </div>
            <p className="text-lg font-semibold text-foreground font-data">
              {memberData?.membershipMonths || 0} months
            </p>
          </div>
        </div>

        {/* Eligibility Requirements */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Eligibility Requirements</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                (memberData?.membershipMonths || 0) >= 3 ? 'bg-success text-white' : 'bg-error text-white'
              }`}>
                <Icon name={(memberData?.membershipMonths || 0) >= 3 ? 'Check' : 'X'} size={12} />
              </div>
              <span className="text-sm text-foreground">
                Minimum 3 months membership
                <span className="text-muted-foreground ml-2">
                  ({memberData?.membershipMonths || 0} months)
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                (memberData?.currentSavings || 0) >= 5000 ? 'bg-success text-white' : 'bg-error text-white'
              }`}>
                <Icon name={(memberData?.currentSavings || 0) >= 5000 ? 'Check' : 'X'} size={12} />
              </div>
              <span className="text-sm text-foreground">
                Minimum savings of {formatCurrency(5000)}
                <span className="text-muted-foreground ml-2">
                  ({formatCurrency(memberData?.currentSavings || 0)})
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                (memberData?.contributionStreak || 0) >= 3 ? 'bg-success text-white' : 'bg-error text-white'
              }`}>
                <Icon name={(memberData?.contributionStreak || 0) >= 3 ? 'Check' : 'X'} size={12} />
              </div>
              <span className="text-sm text-foreground">
                3+ consecutive contributions
                <span className="text-muted-foreground ml-2">
                  ({memberData?.contributionStreak || 0} months)
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                (memberData?.activeLoans || 0) === 0 ? 'bg-success text-white' : 'bg-warning text-white'
              }`}>
                <Icon name={(memberData?.activeLoans || 0) === 0 ? 'Check' : 'AlertTriangle'} size={12} />
              </div>
              <span className="text-sm text-foreground">
                No active loans
                <span className="text-muted-foreground ml-2">
                  ({memberData?.activeLoans || 0} active)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Improvement Tips */}
        {(eligibilityData?.creditScore || 0) < 80 && (
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Lightbulb" size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-2">Improve Your Score</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {(memberData?.contributionStreak || 0) < 6 && (
                    <li>• Make consistent monthly contributions</li>
                  )}
                  {(memberData?.currentSavings || 0) < 10000 && (
                    <li>• Increase your savings balance</li>
                  )}
                  {(memberData?.activeLoans || 0) > 0 && (
                    <li>• Complete existing loan repayments</li>
                  )}
                  <li>• Participate actively in group meetings</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Group Rules */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3">Group Lending Rules</h4>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex justify-between">
              <span>Maximum loan-to-savings ratio:</span>
              <span className="font-medium text-foreground">3:1</span>
            </div>
            <div className="flex justify-between">
              <span>Processing time:</span>
              <span className="font-medium text-foreground">3-5 business days</span>
            </div>
            <div className="flex justify-between">
              <span>Late payment penalty:</span>
              <span className="font-medium text-foreground">2% per month</span>
            </div>
            <div className="flex justify-between">
              <span>Required guarantors:</span>
              <span className="font-medium text-foreground">1 minimum</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityPanel;