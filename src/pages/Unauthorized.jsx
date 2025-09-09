import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { cn } from 'utils/cn';


const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-error/10 rounded-full blur-lg animate-pulse"></div>
          <div className="relative bg-card rounded-2xl p-6 shadow-warm-lg border border-border">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-error" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have the necessary permissions to access this page. Please contact your group administrator if you believe this is an error.
            </p>
            <Link to="/member-dashboard">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-warm">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Need help? <a href="mailto:support@mukando.com" className="text-primary hover:underline">Contact support</a></p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;