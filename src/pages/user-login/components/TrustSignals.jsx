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
    <div className="space-y-4 sm:space-y-6">
      {/* Security Features */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Icon name="Shield" size={18} className="text-blue-600" />
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Secure & Trusted</h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={feature?.icon} size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900 text-xs sm:text-sm">{feature?.title}</p>
                <p className="text-xs text-slate-500">{feature?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Compliance Badges */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-3 sm:mb-4">Regulatory Compliance</h3>
        <div className="grid grid-cols-1 gap-2 sm:gap-3">
          {complianceBadges?.map((badge, index) => (
            <div key={index} className="flex items-center gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg">
              <Icon name={badge?.icon} size={14} className="text-green-600" />
              <div>
                <p className="font-medium text-slate-900 text-xs sm:text-sm">{badge?.name}</p>
                <p className="text-xs text-slate-500">{badge?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Community Stats */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-3 sm:mb-4">Trusted by Communities</h3>
        <div className="space-y-2 sm:space-y-3">
          {communityStats?.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name={stat?.icon} size={14} className="text-indigo-600" />
                <span className="text-xs sm:text-sm text-slate-500">{stat?.label}</span>
              </div>
              <span className="font-semibold text-slate-900 text-xs sm:text-sm">{stat?.value}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Cultural Elements */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-slate-200">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <Icon name="Heart" size={14} className="text-blue-600" />
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Community First</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Built for African communities, by Africans. We understand the importance of trust, 
          transparency, and collective growth in traditional savings groups.
        </p>
        <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
          <div className="flex items-center gap-1">
            <Icon name="MapPin" size={12} className="text-indigo-600" />
            <span className="text-xs text-slate-500">Zimbabwe</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Globe" size={12} className="text-indigo-600" />
            <span className="text-xs text-slate-500">Pan-African</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;
