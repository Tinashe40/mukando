import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import AuthenticationOptions from './components/AuthenticationOptions';
import CulturalElements from './components/CulturalElements';

const UserLogin = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showAdvancedAuth, setShowAdvancedAuth] = useState(false);

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLanguage(savedLanguage);

    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/member-dashboard');
    }
  }, [navigate]);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language);
  };

  const currentYear = new Date()?.getFullYear();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Coins" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground font-heading">Mukando</h1>
                <p className="text-xs text-muted-foreground">Community Savings Platform</p>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Icon name="Globe" size={16} className="text-muted-foreground" />
                <select
                  value={currentLanguage}
                  onChange={(e) => handleLanguageChange(e?.target?.value)}
                  className="text-sm bg-transparent border-none text-foreground focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="sn" disabled>Shona (Soon)</option>
                  <option value="nd" disabled>Ndebele (Soon)</option>
                </select>
              </div>
              
              <button
                onClick={() => navigate('/user-registration')}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cultural Elements & Community */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-8">
              <CulturalElements />
            </div>
          </div>

          {/* Center Column - Login Form */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-card rounded-lg shadow-warm-lg border border-border p-8">
              {/* Welcome Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="LogIn" size={24} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground font-heading mb-2">
                  Welcome Back
                </h2>
                <p className="text-muted-foreground">
                  Sign in to access your savings group and continue your financial journey
                </p>
              </div>

              {/* Login Form */}
              <LoginForm />

              {/* Advanced Authentication Toggle */}
              <div className="mt-6 pt-6 border-t border-border">
                <button
                  onClick={() => setShowAdvancedAuth(!showAdvancedAuth)}
                  className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name="Settings" size={14} />
                  {showAdvancedAuth ? 'Hide' : 'Show'} Advanced Options
                  <Icon name={showAdvancedAuth ? 'ChevronUp' : 'ChevronDown'} size={14} />
                </button>
              </div>

              {/* Advanced Authentication Options */}
              {showAdvancedAuth && (
                <div className="mt-6 pt-6 border-t border-border">
                  <AuthenticationOptions />
                </div>
              )}
            </div>

            {/* Help Section */}
            <div className="mt-6 bg-card rounded-lg p-6 border border-border shadow-warm">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="HelpCircle" size={18} className="text-secondary" />
                <h3 className="font-semibold text-foreground">Need Help?</h3>
              </div>
              <div className="space-y-2">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="MessageCircle" size={14} />
                  Contact Support
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="Book" size={14} />
                  User Guide
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="Phone" size={14} />
                  Call: +263 77 123 4567
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Trust Signals & Security */}
          <div className="lg:col-span-1 order-3">
            <div className="sticky top-8">
              <TrustSignals />
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Coins" size={20} color="white" />
                </div>
                <span className="text-lg font-semibold text-foreground font-heading">Mukando</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Empowering African communities through digital transformation of traditional 
                savings groups. Building financial inclusion one community at a time.
              </p>
              <div className="flex items-center gap-4">
                <Icon name="MapPin" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Harare, Zimbabwe</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <div className="space-y-2">
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Security
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </button>
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <div className="space-y-2">
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Mukando. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground">Powered by</span>
              <div className="flex items-center gap-2">
                <Icon name="Zap" size={14} className="text-primary" />
                <span className="text-sm font-medium text-foreground">African Innovation</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLogin;