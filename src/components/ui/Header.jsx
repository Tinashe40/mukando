import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onMenuToggle, isMenuOpen = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const navigationItems = [
    { label: 'Dashboard', path: '/member-dashboard', icon: 'LayoutDashboard' },
    { label: 'My Loans', path: '/loan-request', icon: 'CreditCard' },
    { label: 'Payments', path: '/payment-processing', icon: 'Wallet' },
    { label: 'Groups', path: '/group-management', icon: 'Users' },
    { label: 'Analytics', path: '/group-analytics', icon: 'BarChart3' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-warm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Icon name={isMenuOpen ? 'X' : 'Menu'} size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Coins" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground font-heading">
              Mukando
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                location.pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}>
              <Icon name={item.icon} size={16} />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <span className="hidden sm:block text-sm font-medium">{profile?.full_name}</span>
              <Icon name="ChevronDown" size={16} />
            </Button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-warm-lg z-50 animate-slide-in">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-foreground">{profile?.full_name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-muted w-full text-left"
                  >
                    <Icon name="LogOut" size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
