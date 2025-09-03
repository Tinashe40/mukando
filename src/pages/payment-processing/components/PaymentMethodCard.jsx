import React from 'react';
import Icon from '../../../components/AppIcon';


const PaymentMethodCard = ({ 
  method, 
  isSelected, 
  onSelect, 
  isAvailable = true 
}) => {
  const getMethodIcon = (methodType) => {
    switch (methodType) {
      case 'ecocash': return 'Smartphone';
      case 'onemoney': return 'CreditCard';
      case 'telecash': return 'Phone';
      case 'pesepay': return 'Wallet';
      case 'bank': return 'Building2';
      case 'cash': return 'Banknote';
      default: return 'CreditCard';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-success';
      case 'maintenance': return 'text-warning';
      case 'unavailable': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-warm'
          : 'border-border bg-card hover:border-primary/50 hover:shadow-warm'
      } ${!isAvailable ? 'opacity-60 cursor-not-allowed' : ''}`}
      onClick={() => isAvailable && onSelect(method)}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <Icon name="Check" size={14} color="white" />
        </div>
      )}
      <div className="flex items-start gap-3">
        {/* Method Icon */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          method?.type === 'ecocash' ? 'bg-green-100' :
          method?.type === 'onemoney' ? 'bg-blue-100' :
          method?.type === 'telecash' ? 'bg-purple-100' :
          method?.type === 'pesepay' ? 'bg-orange-100' :
          method?.type === 'bank'? 'bg-gray-100' : 'bg-yellow-100'
        }`}>
          <Icon 
            name={getMethodIcon(method?.type)} 
            size={24} 
            className={
              method?.type === 'ecocash' ? 'text-green-600' :
              method?.type === 'onemoney' ? 'text-blue-600' :
              method?.type === 'telecash' ? 'text-purple-600' :
              method?.type === 'pesepay' ? 'text-orange-600' :
              method?.type === 'bank'? 'text-gray-600' : 'text-yellow-600'
            }
          />
        </div>

        {/* Method Details */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground">{method?.name}</h3>
            <div className={`flex items-center gap-1 ${getStatusColor(method?.status)}`}>
              <div className={`w-2 h-2 rounded-full ${
                method?.status === 'available' ? 'bg-success' :
                method?.status === 'maintenance'? 'bg-warning' : 'bg-error'
              }`}></div>
              <span className="text-xs font-medium capitalize">{method?.status}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-2">{method?.description}</p>

          {/* Fee Information */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Fee: {method?.feeType === 'percentage' ? `${method?.fee}%` : `$${method?.fee}`}
            </span>
            <span className="text-muted-foreground">
              Limit: ${method?.dailyLimit?.toLocaleString()}
            </span>
          </div>

          {/* Processing Time */}
          <div className="mt-2 text-xs text-muted-foreground">
            <Icon name="Clock" size={12} className="inline mr-1" />
            {method?.processingTime}
          </div>
        </div>
      </div>
      {/* Maintenance Notice */}
      {method?.status === 'maintenance' && (
        <div className="mt-3 p-2 bg-warning/10 rounded border border-warning/20">
          <p className="text-xs text-warning">
            <Icon name="AlertTriangle" size={12} className="inline mr-1" />
            Scheduled maintenance until {method?.maintenanceUntil}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodCard;