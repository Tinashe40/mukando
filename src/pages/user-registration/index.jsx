import React from 'react';
import { Link } from 'react-router-dom';
import AppIcon from '../../components/AppIcon';
import RegistrationForm from './components/RegistrationForm';
import TrustSignals from './components/TrustSignals';

const UserRegistration = () => {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 rounded-2xl shadow-warm-lg overflow-hidden border border-border">
        
        {/* Left Column: Registration Form */}
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-card">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <AppIcon name="Coins" size={24} className="text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Mukando</h1>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-2">Create your account</h2>
            <p className="text-muted-foreground mb-8">Join our community and start saving for your future.</p>
            
            <RegistrationForm />

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>
                Already have an account?{' '}
                <Link to="/auth/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>By creating an account, you agree to our</p>
              <div>
                <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                <span className="mx-2">and</span>
                <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Branding and Trust Signals */}
        <div className="hidden lg:block relative bg-gradient-to-br from-primary/10 to-background">
          <div className="sticky top-0 h-screen overflow-y-auto p-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <AppIcon name="Coins" size={28} className="text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Mukando</h1>
            </div>
            <p className="mt-4 text-lg text-muted-foreground max-w-md">
              Join thousands of users who are building a brighter financial future with Mukando.
            </p>
            <div className="mt-12">
              <TrustSignals />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
