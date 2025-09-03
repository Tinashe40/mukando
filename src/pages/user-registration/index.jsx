import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import RegistrationHeader from './components/RegistrationHeader';
import TrustSignals from './components/TrustSignals';
// import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import LoadingSpinner from '../../components/ui/LoadingSpinner';


const UserRegistration = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [registrationStatus, setRegistrationStatus] = useState({
    loading: false,
    success: false,
    error: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('mukando_language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleRegistrationSuccess = () => {
    setRegistrationStatus({ loading: false, success: true, error: null });
    
    // Redirect to login after a short delay
    setTimeout(() => {
      navigate('/user-login', { 
        state: { 
          message: 'Registration successful! Please check your email to verify your account.',
          registrationSuccess: true
        } 
      });
    }, 2000);
  };

  const handleRegistrationError = (error) => {
    setRegistrationStatus({ loading: false, success: false, error });
  };

  const handleRegistrationStart = () => {
    setRegistrationStatus({ loading: true, success: false, error: null });
  };

  if (registrationStatus.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">Creating your account...</h2>
          <p className="text-muted-foreground">This will just take a moment</p>
        </div>
      </div>
    );
  }

  if (registrationStatus.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-6 bg-card rounded-lg border border-border shadow-warm">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Registration Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your account has been created successfully. Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Join Mukando - Community Savings Platform | Register Now</title>
        <meta 
          name="description" 
          content="Create your Mukando account and join thousands of Africans building wealth through community savings groups. Secure, transparent, and culturally rooted digital finance." 
        />
        <meta name="keywords" content="mukando, community savings, african finance, digital savings groups, microfinance, zimbabwe" />
        <meta property="og:title" content="Join Mukando - Community Savings Platform" />
        <meta property="og:description" content="Start your journey with Africa's leading community savings platform" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/user-registration" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Column - Registration Form */}
              <div className="order-2 lg:order-1">
                <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-warm-lg">
                  {/* Header Section */}
                  <div className="mb-8">
                    <RegistrationHeader />
                  </div>

                  {/* Registration Form */}
                  <div className="space-y-6">
                    <RegistrationForm 
                      onRegistrationStart={handleRegistrationStart}
                      onRegistrationSuccess={handleRegistrationSuccess}
                      onRegistrationError={handleRegistrationError}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Trust Signals */}
              <div className="order-1 lg:order-2">
                <div className="lg:sticky lg:top-8">
                  <TrustSignals />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border bg-card mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <a href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
                <a href="/support" className="hover:text-foreground transition-colors">
                  Support
                </a>
                <a href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </a>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  © {new Date().getFullYear()} Mukando. All rights reserved. 
                  Empowering African communities through digital savings.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span>🇿🇼 Made in Zimbabwe</span>
                <span>•</span>
                <span>🔒 Bank-level Security</span>
                <span>•</span>
                <span>📱 Mobile Optimized</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default UserRegistration;