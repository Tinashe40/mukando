import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Coins } from 'lucide-react';

const AuthCallback = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/member-dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-primary/10 rounded-full blur-lg animate-pulse"></div>
          <div className="relative">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Coins size={32} className="text-primary animate-spin duration-1000" />
            </div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Completing Authentication</h2>
        <p className="text-muted-foreground">Please wait while we verify your account...</p>
        
        <div className="mt-6 flex justify-center">
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;