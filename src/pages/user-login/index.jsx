import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import LoginForm from './components/LoginForm';

const UserLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* Left Column: Login Form */}
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

          {/* Login Form */}
          <LoginForm />

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Mukando. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="/terms" className="hover:text-primary">Terms of Service</a>
              <a href="/privacy" className="hover:text-primary">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Branding and Image */}
      <div className="hidden lg:block relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://img.freepik.com/free-photo/group-diverse-people-stacking-hands-together_53876-64956.jpg?w=1380&t=st=1725541396~exp=1725541996~hmac=3c4d6f969f9f95501a99734639579a79d799c4ab9a3e1e4a5c5de355d639409e')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Welcome Back to Mukando.
          </h2>
          <p className="text-lg text-white/80">
            Your community is waiting. Let's continue building your financial future, together.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
