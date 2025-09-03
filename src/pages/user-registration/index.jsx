import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import RegistrationHeader from './components/RegistrationHeader';
import RegistrationForm from './components/RegistrationForm';
import TrustSignals from './components/TrustSignals';

const UserRegistration = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('mukando_language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

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
                    <RegistrationForm />
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
                  © {new Date()?.getFullYear()} Mukando. All rights reserved. 
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