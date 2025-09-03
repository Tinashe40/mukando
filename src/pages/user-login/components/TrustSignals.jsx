import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Bank-Level Security',
      description: '256-bit SSL encryption protects your data'
    },
    {
      icon: 'Lock',
      title: 'Multi-Factor Authentication',
      description: 'Additional security layer with SMS verification'
    },
    {
      icon: 'Eye',
      title: 'Privacy Protected',
      description: 'Your financial data remains confidential'
    }
  ];

  const complianceBadges = [
    {
      name: 'RBZ Compliant',
      description: 'Reserve Bank of Zimbabwe approved',
      icon: 'CheckCircle'
    },
    {
      name: 'ISO 27001',
      description: 'International security standard',
      icon: 'Award'
    },
    {
      name: 'GDPR Ready',
      description: 'Data protection compliant',
      icon: 'ShieldCheck'
    }
  ];

  const communityStats = [
    { label: 'Active Groups', value: '2,500+', icon: 'Users' },
    { label: 'Total Savings', value: 'USD 1.2M+', icon: 'DollarSign' },
    { label: 'Loans Processed', value: '15,000+', icon: 'CreditCard' }
  ];

  return (
    <div className="space-y-8">
      {/* Security Features */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-warm">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Secure & Trusted</h3>
        </div>
        <div className="space-y-4">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={feature?.icon} size={16} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{feature?.title}</p>
                <p className="text-xs text-muted-foreground">{feature?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Compliance Badges */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-warm">
        <h3 className="font-semibold text-foreground mb-4">Regulatory Compliance</h3>
        <div className="grid grid-cols-1 gap-3">
          {complianceBadges?.map((badge, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Icon name={badge?.icon} size={16} className="text-success" />
              <div>
                <p className="font-medium text-foreground text-sm">{badge?.name}</p>
                <p className="text-xs text-muted-foreground">{badge?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Community Stats */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-warm">
        <h3 className="font-semibold text-foreground mb-4">Trusted by Communities</h3>
        <div className="space-y-3">
          {communityStats?.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name={stat?.icon} size={16} className="text-secondary" />
                <span className="text-sm text-muted-foreground">{stat?.label}</span>
              </div>
              <span className="font-semibold text-foreground font-data">{stat?.value}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Cultural Elements */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Heart" size={16} className="text-primary" />
          <h3 className="font-semibold text-foreground">Community First</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Built for African communities, by Africans. We understand the importance of trust, 
          transparency, and collective growth in traditional savings groups.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <Icon name="MapPin" size={14} className="text-secondary" />
            <span className="text-xs text-muted-foreground">Zimbabwe</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Globe" size={14} className="text-secondary" />
            <span className="text-xs text-muted-foreground">Pan-African</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;