import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import RegistrationForm from './components/RegistrationForm';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [registrationStatus, setRegistrationStatus] = useState({ 
    loading: false, 
    success: false, 
    message: '' 
  });

  const handleRegistrationStart = () => {
    setRegistrationStatus({ loading: true, success: false, message: '' });
  };

  const handleRegistrationSuccess = () => {
    setRegistrationStatus({ 
      loading: false, 
      success: true, 
      message: 'Registration successful! Please check your email to verify your account.' 
    });
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      navigate('/user-login', { 
        state: { 
          message: 'Registration successful! Please check your email to verify your account.',
          email: registrationStatus.email
        }
      });
    }, 3000);
  };

  const handleRegistrationError = (error) => {
    setRegistrationStatus({ 
      loading: false, 
      success: false, 
      message: error 
    });
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* Left Column: Registration Form */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-card">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-warm">
              <Icon name="Coins" size={28} color="white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-foreground font-heading">Mukando</h1>
              <p className="text-sm text-muted-foreground">Community Savings Platform</p>
            </div>
          </div>

          {/* Status Messages */}
          {registrationStatus.loading && (
            <div className="mb-6 flex items-center justify-center gap-3 p-4 bg-info/10 rounded-lg">
              <LoadingSpinner size="sm" />
              <p className="text-info">Creating your account...</p>
            </div>
          )}
          
          {registrationStatus.success && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="CheckCircle" size={20} className="text-success mt-0.5 flex-shrink-0" />
                <p className="text-sm text-success">{registrationStatus.message}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Redirecting to login page...
              </p>
            </div>
          )}
          
          {registrationStatus.message && !registrationStatus.success && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0" />
                <p className="text-sm text-error">{registrationStatus.message}</p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <RegistrationForm 
            onRegistrationStart={handleRegistrationStart}
            onRegistrationSuccess={handleRegistrationSuccess}
            onRegistrationError={handleRegistrationError}
          />

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Mukando. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Branding and Image */}
      <div className="hidden lg:block relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://img.freepik.com/free-photo/group-diverse-people-stacking-hands-together_53876-64956.jpg?w=1380&t=st=1725541396~exp=1725541996~hmac=3c4d6f969f9f95501a99734639579a79d799c4ab9a3e1e4a5c5de355d639409e')",
            backgroundColor: '#f0f4f8' // Fallback color
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Unlock Your Financial Future, Together.
          </h2>
          <p className="text-lg text-white/90">
            Join Mukando and become part of a thriving community dedicated to mutual growth and financial empowerment.
          </p>
          
          {/* Trust badges */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Icon name="ShieldCheck" size={16} className="text-success" />
              <span className="text-sm">Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Award" size={16} className="text-warning" />
              <span className="text-sm">RBZ Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;