import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/AppIcon';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Icon name="Lock" size={48} className="text-error mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-lg text-muted-foreground mb-8">
          You do not have the necessary permissions to access this page.
        </p>
        <Link to="/member-dashboard">
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold">
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
