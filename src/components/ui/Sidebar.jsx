import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';
import { getFinancialOverview } from '../../lib/supabase';

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const { user, profile } = useAuth();
  const [financialStatus, setFinancialStatus] = useState(null);

  useEffect(() => {
    const fetchFinancialStatus = async () => {
      if (user) {
        const data = await getFinancialOverview(user.id);
        setFinancialStatus(data);
      }
    };
    fetchFinancialStatus();
  }, [user]);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/member-dashboard',
      icon: 'LayoutDashboard',
      roles: ['member', 'admin', 'treasurer']
    },
    {
      label: 'My Loans',
      path: '/loan-request',
      icon: 'CreditCard',
      roles: ['member', 'admin', 'treasurer']
    },
    {
      label: 'Payments',
      path: '/payment-processing',
      icon: 'Wallet',
      roles: ['member', 'admin', 'treasurer']
    },
    {
      label: 'Notifications',
      path: '/notifications-center',
      icon: 'Bell',
      roles: ['member', 'admin', 'treasurer']
    }
  ];

  const adminItems = [
    {
      label: 'Group Management',
      path: '/group-management',
      icon: 'Users',
      roles: ['admin', 'treasurer']
    },
    {
      label: 'Group Analytics',
      path: '/group-analytics',
      icon: 'BarChart3',
      roles: ['admin', 'treasurer']
    }
  ];

  const filteredNavItems = navigationItems.filter(item => item.roles.includes(profile?.roles?.name));
  const filteredAdminItems = adminItems.filter(item => item.roles.includes(profile?.roles?.name));

  return (
    <>
      <aside className={`fixed left-0 top-0 z-40 h-screen bg-card border-r border-border shadow-warm transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      } hidden lg:block`}>
        <div className="flex flex-col h-full">
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
            <Button variant="ghost" size="icon" onClick={onToggle} className="hidden lg:flex">
              <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={16} />
            </Button>
          </div>

          {!isCollapsed && financialStatus && (
            <div className="p-4 border-b border-border">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Balance</span>
                </div>
                <div className="text-lg font-semibold text-foreground font-data">
                  {`$${financialStatus.total_savings}`}
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 p-4 space-y-2">
            <div className="space-y-1">
              {filteredNavItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    location.pathname === item.path
                      ? 'bg-primary text-primary-foreground shadow-warm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  } ${isCollapsed ? 'justify-center' : ''}`}>
                  <Icon name={item.icon} size={20} />
                  {!isCollapsed && <span className="flex-1">{item.label}</span>}
                </a>
              ))}
            </div>

            {filteredAdminItems.length > 0 && (
              <div className="pt-4">
                {!isCollapsed && (
                  <div className="px-3 py-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Administration
                    </span>
                  </div>
                )}
                <div className="space-y-1">
                  {filteredAdminItems.map((item) => (
                    <a
                      key={item.path}
                      href={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                        location.pathname === item.path
                          ? 'bg-secondary text-secondary-foreground shadow-warm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      } ${isCollapsed ? 'justify-center' : ''}`}>
                      <Icon name={item.icon} size={20} />
                      {!isCollapsed && <span className="flex-1">{item.label}</span>}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </nav>

          <div className="p-4 border-t border-border">
            {!isCollapsed ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{profile?.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile?.roles?.name}</p>
                </div>
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
    </>
  );
};

export default Sidebar;
