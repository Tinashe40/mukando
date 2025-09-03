import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AuthenticationOptions = () => {
  const { socialLogin } = useAuth();
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(null);

  const socialLoginOptions = [
    {
      name: 'Google',
      icon: 'Chrome',
      provider: 'google',
      available: true,
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      provider: 'facebook',
      available: true,
    },
    {
      name: 'WhatsApp',
      icon: 'MessageCircle',
      provider: 'whatsapp',
      available: false, // WhatsApp login is not directly supported
    },
  ];

  const handleSocialLogin = async (provider) => {
    setIsLoading(provider);
    try {
      await socialLogin(provider);
      // The user will be redirected to the social provider's login page.
      // After successful login, they will be redirected back to the app.
    } catch (error) {
      console.error(`Error with ${provider} login:`, error);
    } finally {
      setIsLoading(null);
    }
  };

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
      {/* Social Login */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-warm">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Zap" size={20} className="text-warning" />
          <h3 className="font-semibold text-foreground">Social Login</h3>
        </div>
        
        <div className="space-y-2">
          {socialLoginOptions?.map((option) => (
            <Button
              key={option.provider}
              variant="outline"
              onClick={() => handleSocialLogin(option.provider)}
              disabled={!option.available || isLoading === option.provider}
              loading={isLoading === option.provider}
              iconName={option.icon}
              iconPosition="left"
              fullWidth
              className="justify-start"
            >
              Continue with {option.name}
            </Button>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground mt-3">
          Login using your favorite social accounts.
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