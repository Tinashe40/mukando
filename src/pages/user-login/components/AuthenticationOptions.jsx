import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AuthenticationOptions = () => {
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const socialLoginOptions = [
    {
      name: 'Google',
      icon: 'Chrome',
      color: 'bg-red-500',
      available: false
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      color: 'bg-blue-600',
      available: false
    },
    {
      name: 'WhatsApp',
      icon: 'MessageCircle',
      color: 'bg-green-500',
      available: false
    }
  ];

  const handleMFAVerification = async () => {
    if (!mfaCode || mfaCode?.length !== 6) return;
    
    setIsVerifying(true);
    
    // Simulate MFA verification
    setTimeout(() => {
      if (mfaCode === '123456') {
        console.log('MFA verified successfully');
        setShowMFA(false);
      } else {
        console.log('Invalid MFA code');
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleBiometricLogin = () => {
    // Check if biometric authentication is available
    if (navigator.credentials && window.PublicKeyCredential) {
      console.log('Biometric authentication available');
      // Implement WebAuthn here
    } else {
      console.log('Biometric authentication not supported');
    }
  };

  return (
    <div className="space-y-6">
      {/* Multi-Factor Authentication */}
      {showMFA && (
        <div className="bg-card rounded-lg p-6 border border-border shadow-warm">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Shield" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Enter the 6-digit code sent to your registered phone number
          </p>
          
          <div className="space-y-4">
            <Input
              label="Verification Code"
              type="text"
              placeholder="Enter 6-digit code"
              value={mfaCode}
              onChange={(e) => setMfaCode(e?.target?.value?.replace(/\D/g, '')?.slice(0, 6))}
              maxLength={6}
              className="text-center font-data text-lg tracking-widest"
            />
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowMFA(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleMFAVerification}
                loading={isVerifying}
                disabled={mfaCode?.length !== 6}
                className="flex-1"
              >
                Verify
              </Button>
            </div>
            
            <button className="text-sm text-primary hover:text-primary/80 transition-colors w-full text-center">
              Resend code
            </button>
          </div>
        </div>
      )}
      {/* Biometric Authentication */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-warm">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Fingerprint" size={20} className="text-secondary" />
          <h3 className="font-semibold text-foreground">Quick Access</h3>
        </div>
        
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleBiometricLogin}
            iconName="Fingerprint"
            iconPosition="left"
            fullWidth
            className="justify-start"
          >
            Use Fingerprint or Face ID
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowMFA(true)}
            iconName="Smartphone"
            iconPosition="left"
            fullWidth
            className="justify-start"
          >
            SMS Verification
          </Button>
        </div>
      </div>
      {/* Social Login (Coming Soon) */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-warm opacity-60">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Zap" size={20} className="text-warning" />
          <h3 className="font-semibold text-foreground">Social Login</h3>
          <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded-full">
            Coming Soon
          </span>
        </div>
        
        <div className="space-y-2">
          {socialLoginOptions?.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              disabled={!option?.available}
              iconName={option?.icon}
              iconPosition="left"
              fullWidth
              className="justify-start opacity-50"
            >
              Continue with {option?.name}
            </Button>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground mt-3">
          Social login options will be available in future updates
        </p>
      </div>
      {/* Security Notice */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Security Notice</p>
            <p className="text-xs text-muted-foreground mt-1">
              For enhanced security, we recommend enabling two-factor authentication 
              and using biometric login where available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationOptions;