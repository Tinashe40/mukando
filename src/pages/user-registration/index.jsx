import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import RegistrationForm from './components/RegistrationForm';

const UserRegistration = () => {
  const navigate = useNavigate();

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

          {/* Registration Form */}
          <RegistrationForm />

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
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1604328698692-63c218d4b35a?q=80&w=1974&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Join a Community of Savers and Builders.
          </h2>
          <p className="text-lg text-white/80">
            Create your account and start your journey towards financial empowerment with Mukando.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
