import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggle, userRole = 'member' }) => {
  const location = useLocation();
  const [notificationCounts, setNotificationCounts] = useState({
    loans: 2,
    payments: 1,
    notifications: 3
  });
  const [financialStatus, setFinancialStatus] = useState({
    balance: 45000,
    currency: 'KES',
    pendingLoans: 1,
    overduePayments: 0
  });

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/member-dashboard',
      icon: 'LayoutDashboard',
      roles: ['member', 'admin', 'moderator', 'superadmin']
    },
    {
      label: 'My Loans',
      path: '/loan-request',
      icon: 'CreditCard',
      roles: ['member', 'admin', 'moderator', 'superadmin'],
      badge: notificationCounts?.loans
    },
    {
      label: 'Payments',
      path: '/payment-processing',
      icon: 'Wallet',
      roles: ['member', 'admin', 'moderator', 'superadmin'],
      badge: notificationCounts?.payments
    },
    {
      label: 'Notifications',
      path: '/notifications-center',
      icon: 'Bell',
      roles: ['member', 'admin', 'moderator', 'superadmin'],
      badge: notificationCounts?.notifications
    }
  ];

  const adminItems = [
    {
      label: 'Group Management',
      path: '/group-management',
      icon: 'Users',
      roles: ['admin', 'moderator', 'superadmin']
    },
    {
      label: 'Group Analytics',
      path: '/group-analytics',
      icon: 'BarChart3',
      roles: ['admin', 'superadmin']
    }
  ];

  const filteredNavItems = navigationItems?.filter(item => 
    item?.roles?.includes(userRole)
  );

  const filteredAdminItems = adminItems?.filter(item => 
    item?.roles?.includes(userRole)
  );

  const hasAdminAccess = ['admin', 'moderator', 'superadmin']?.includes(userRole);

  useEffect(() => {
    // Simulate real-time updates for notifications and financial status
    const interval = setInterval(() => {
      setNotificationCounts(prev => ({
        ...prev,
        notifications: Math.floor(Math.random() * 5) + 1
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    })?.format(amount);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen bg-card border-r border-border shadow-warm transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      } hidden lg:block`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Coins" size={20} color="white" />
                </div>
                <span className="text-xl font-semibold text-foreground font-heading">
                  Mukando
                </span>
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <Icon name="Coins" size={20} color="white" />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hidden lg:flex"
            >
              <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={16} />
            </Button>
          </div>

          {/* Financial Status */}
          {!isCollapsed && (
            <div className="p-4 border-b border-border">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Balance</span>
                  <Icon name="Eye" size={14} className="text-muted-foreground" />
                </div>
                <div className="text-lg font-semibold text-foreground font-data">
                  {formatCurrency(financialStatus?.balance, financialStatus?.currency)}
                </div>
                {financialStatus?.pendingLoans > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-xs text-muted-foreground">
                      {financialStatus?.pendingLoans} pending loan
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="p-2 border-b border-border">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mx-auto">
                <Icon name="Wallet" size={16} className="text-muted-foreground" />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              {filteredNavItems?.map((item) => (
                <a
                  key={item?.path}
                  href={item?.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    location?.pathname === item?.path
                      ? 'bg-primary text-primary-foreground shadow-warm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item?.label : ''}
                >
                  <div className="relative">
                    <Icon name={item?.icon} size={20} />
                    {item?.badge && item?.badge > 0 && (
                      <span className={`absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center ${
                        isCollapsed ? 'scale-75' : ''
                      }`}>
                        {item?.badge > 9 ? '9+' : item?.badge}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className="flex-1">{item?.label}</span>
                  )}
                </a>
              ))}
            </div>

            {/* Admin Section */}
            {hasAdminAccess && filteredAdminItems?.length > 0 && (
              <div className="pt-4">
                {!isCollapsed && (
                  <div className="px-3 py-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Administration
                    </span>
                  </div>
                )}
                {isCollapsed && (
                  <div className="border-t border-border pt-4"></div>
                )}
                <div className="space-y-1">
                  {filteredAdminItems?.map((item) => (
                    <a
                      key={item?.path}
                      href={item?.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                        location?.pathname === item?.path
                          ? 'bg-secondary text-secondary-foreground shadow-warm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item?.label : ''}
                    >
                      <Icon name={item?.icon} size={20} />
                      {!isCollapsed && (
                        <span className="flex-1">{item?.label}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            {!isCollapsed ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">Sarah Mwangi</p>
                  <p className="text-xs text-muted-foreground truncate">Member</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Icon name="Settings" size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-warm-lg">
        <nav className="flex items-center justify-around py-2">
          {filteredNavItems?.slice(0, 4)?.map((item) => (
            <a
              key={item?.path}
              href={item?.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                location?.pathname === item?.path
                  ? 'text-primary' :'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon name={item?.icon} size={20} />
                {item?.badge && item?.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                    {item?.badge > 9 ? '9+' : item?.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item?.label}</span>
            </a>
          ))}
          
          {/* More Menu for Mobile */}
          {(filteredNavItems?.length > 4 || hasAdminAccess) && (
            <button className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-muted-foreground">
              <Icon name="MoreHorizontal" size={20} />
              <span className="text-xs font-medium">More</span>
            </button>
          )}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;