import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ onMenuToggle, isMenuOpen = false }) => {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigationItems = [
    { label: 'Dashboard', path: '/member-dashboard', icon: 'LayoutDashboard' },
    { label: 'My Loans', path: '/loan-request', icon: 'CreditCard' },
    { label: 'Payments', path: '/payment-processing', icon: 'Wallet' },
    { label: 'Groups', path: '/group-management', icon: 'Users' },
    { label: 'Analytics', path: '/group-analytics', icon: 'BarChart3' }
  ];

  const handleProfileToggle = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    // Logout logic here
    console.log('Logging out...');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-warm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Icon name={isMenuOpen ? 'X' : 'Menu'} size={20} />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Coins" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground font-heading">
              Mukando
            </span>
          </div>
        </div>

        {/* Center Section - Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.slice(0, 4)?.map((item) => (
            <a
              key={item?.path}
              href={item?.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                location?.pathname === item?.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              {item?.label}
            </a>
          ))}
          
          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="MoreHorizontal" size={16} />
              More
            </Button>
          </div>
        </nav>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationToggle}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-warm-lg z-50 animate-slide-in">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-border hover:bg-muted cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Loan Approved</p>
                        <p className="text-xs text-muted-foreground">Your loan request has been approved</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-b border-border hover:bg-muted cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Payment Due</p>
                        <p className="text-xs text-muted-foreground">Monthly contribution due tomorrow</p>
                        <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-muted cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Group Meeting</p>
                        <p className="text-xs text-muted-foreground">Weekly group meeting scheduled</p>
                        <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" fullWidth>
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={handleProfileToggle}
              className="flex items-center gap-2 px-3"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <span className="hidden sm:block text-sm font-medium">Sarah M.</span>
              <Icon name="ChevronDown" size={16} />
            </Button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-warm-lg z-50 animate-slide-in">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-foreground">Sarah Mwangi</p>
                  <p className="text-sm text-muted-foreground">sarah@example.com</p>
                </div>
                <div className="py-2">
                  <a
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <Icon name="User" size={16} />
                    Profile Settings
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <Icon name="Settings" size={16} />
                    Account Settings
                  </a>
                  <a
                    href="/help"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <Icon name="HelpCircle" size={16} />
                    Help & Support
                  </a>
                </div>
                <div className="border-t border-border py-2">
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
      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background z-40">
          <nav className="p-4 space-y-2">
            {navigationItems?.map((item) => (
              <a
                key={item?.path}
                href={item?.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  location?.pathname === item?.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                {item?.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;