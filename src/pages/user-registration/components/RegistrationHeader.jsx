import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegistrationHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-6">
      {/* Logo and Brand */}
      <div className="flex items-center justify-center gap-3">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-warm">
          <Icon name="Coins" size={28} color="white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-foreground font-heading">Mukando</h1>
          <p className="text-sm text-muted-foreground">Community Savings Platform</p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-foreground font-heading">
          Join the Community
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Create your account to start saving, lending, and building wealth with your community through our secure digital platform.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
            1
          </div>
          <span className="text-sm font-medium text-primary">Register</span>
        </div>
        <div className="w-8 h-px bg-border"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
            2
          </div>
          <span className="text-sm text-muted-foreground">Verify</span>
        </div>
        <div className="w-8 h-px bg-border"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
            3
          </div>
          <span className="text-sm text-muted-foreground">Join Group</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        <div className="text-center">
          <div className="text-lg font-bold text-primary">10K+</div>
          <div className="text-xs text-muted-foreground">Active Users</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-secondary">500+</div>
          <div className="text-xs text-muted-foreground">Savings Groups</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-success">$2M+</div>
          <div className="text-xs text-muted-foreground">Saved Together</div>
        </div>
      </div>

      {/* Alternative Login Option */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-3">
          Already part of the community?
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/user-login')}
          iconName="LogIn"
          iconPosition="left"
        >
          Sign In Instead
        </Button>
      </div>
    </div>
  );
};

export default RegistrationHeader;