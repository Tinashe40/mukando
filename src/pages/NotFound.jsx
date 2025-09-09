import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Mail, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  const handleReportIssue = () => {
    const subject = `404 Error on ${location.pathname}`;
    const body = `I encountered a 404 error when trying to access: ${location.pathname}`;
    window.location.href = `mailto:support@mukando.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Animated 404 graphic */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-lg animate-pulse"></div>
            <h1 className="text-9xl font-bold text-primary relative z-10">404</h1>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. It might have been moved, 
          deleted, or you entered the wrong URL.
        </p>

        {/* Additional helpful info */}
        <div className="bg-muted/50 p-4 rounded-lg mb-8 text-sm text-left">
          <p className="font-medium mb-2 flex items-center gap-2">
            <AlertCircle size={16} className="text-primary" />
            Trying to access:
          </p>
          <code className="bg-background p-2 rounded text-xs block overflow-x-auto font-data">
            {location.pathname}
          </code>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 bg-card text-foreground px-6 py-3 rounded-xl font-medium hover:bg-muted transition-all duration-200 border border-border shadow-warm"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 shadow-warm"
          >
            <Home size={18} />
            Home Page
          </button>
        </div>

        {/* Additional help option */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Can't find what you're looking for?
          </p>
          <button
            onClick={handleReportIssue}
            className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
          >
            <Mail size={16} />
            Report this issue
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-8 flex justify-center gap-4 text-xs text-muted-foreground">
          <button 
            onClick={() => navigate('/auth/login')}
            className="hover:text-foreground transition-colors"
          >
            Sign In
          </button>
          <span>•</span>
          <button 
            onClick={() => navigate('/auth/register')}
            className="hover:text-foreground transition-colors"
          >
            Sign Up
          </button>
          <span>•</span>
          <button 
            onClick={() => navigate('/member-dashboard')}
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;