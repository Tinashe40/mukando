import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityNotice = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: '256-bit SSL Encryption',
      description: 'All transactions are protected with bank-level security'
    },
    {
      icon: 'Lock',
      title: 'Secure Authentication',
      description: 'Multi-factor authentication for all payment confirmations'
    },
    {
      icon: 'Eye',
      title: 'Fraud Monitoring',
      description: '24/7 monitoring for suspicious activities and transactions'
    },
    {
      icon: 'FileCheck',
      title: 'Compliance Certified',
      description: 'Fully compliant with Zimbabwean financial regulations'
    }
  ];

  const certifications = [
    { name: 'RBZ Approved', icon: 'Award' },
    { name: 'PCI DSS Compliant', icon: 'Shield' },
    { name: 'ISO 27001', icon: 'CheckCircle' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="ShieldCheck" size={20} className="text-success" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Security & Compliance</h2>
          <p className="text-sm text-muted-foreground">Your payments are protected by industry-leading security</p>
        </div>
      </div>
      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={feature?.icon} size={16} className="text-success" />
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm">{feature?.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Certifications */}
      <div className="border-t border-border pt-4">
        <h3 className="font-medium text-foreground mb-3">Certifications & Compliance</h3>
        <div className="flex flex-wrap gap-3">
          {certifications?.map((cert, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-full">
              <Icon name={cert?.icon} size={14} className="text-primary" />
              <span className="text-sm font-medium text-primary">{cert?.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Contact Support */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="HelpCircle" size={20} className="text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-foreground mb-1">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Our support team is available 24/7 to assist with payment issues
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="tel:+263123456789"
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
              >
                <Icon name="Phone" size={14} />
                +263 123 456 789
              </a>
              <a
                href="mailto:support@mukando.co.zw"
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
              >
                <Icon name="Mail" size={14} />
                support@mukando.co.zw
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityNotice;