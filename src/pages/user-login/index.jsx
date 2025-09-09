import React from 'react';
import { Link } from 'react-router-dom';
import AppIcon from '../../components/AppIcon';
import LoginForm from './components/LoginForm';

const UserLogin = () => {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 rounded-2xl shadow-warm-lg overflow-hidden border border-border">
        
        {/* Left Column: Branding and Image */}
        <div className="hidden lg:block relative">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://img.freepik.com/free-photo/group-diverse-people-stacking-hands-together_53876-64956.jpg?w=1380&t=st=1725541396~exp=1725541996~hmac=3c4d6f969f9f95501a99734639579a79d799c4ab9a3e1e4a5c5de355d639409e')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-primary/20" />
          <div className="relative h-full flex flex-col justify-between p-12 text-white">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <AppIcon name="Coins" size={28} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold">Mukando</h1>
              </div>
              <p className="mt-4 text-lg text-white/90 max-w-md">
                Your community is waiting. Let's continue building your financial future, together.
              </p>
            </div>
            <div className="mt-8 text-sm text-white/80">
              <p>&copy; {new Date().getFullYear()} Mukando. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-card">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <AppIcon name="Coins" size={24} className="text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Mukando</h1>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back!</h2>
            <p className="text-muted-foreground mb-8">Enter your credentials to access your account.</p>
            
            <LoginForm />

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>
                Don't have an account?{' '}
                <Link to="/auth/register" className="font-semibold text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <span className="mx-2">|</span>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
