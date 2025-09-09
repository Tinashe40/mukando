import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppIcon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionCard = () => {
  const navigate = useNavigate();

  const actions = [
    { title: 'Make Contribution', icon: 'PlusCircle', path: '/record-contribution' },
    { title: 'Request Loan', icon: 'Handshake', path: '/loan-request' },
    { title: 'View Groups', icon: 'Users', path: '/group-management' },
    { title: 'Payment History', icon: 'History', path: '/repayment-history' },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <Button 
            key={action.title} 
            variant="outline"
            className="h-auto flex flex-col items-center justify-center text-center p-4 gap-2"
            onClick={() => navigate(action.path)}
          >
            <AppIcon name={action.icon} size={24} className="text-primary" />
            <span className="text-sm font-semibold text-foreground whitespace-normal">{action.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionCard;