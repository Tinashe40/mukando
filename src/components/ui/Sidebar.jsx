import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import AppIcon from '../AppIcon';
import Button from './Button';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

const navigationItems = [
  {
    title: 'Dashboards',
    links: [
      { path: '/member-dashboard', icon: 'LayoutDashboard', label: 'Member Dashboard', roles: ['member', 'admin'] },
      { path: '/admin-dashboard', icon: 'ShieldCheck', label: 'Admin Dashboard', roles: ['admin'] },
    ],
  },
  {
    title: 'Groups',
    links: [
      { path: '/group-creation', icon: 'PlusSquare', label: 'Create Group', roles: ['member', 'admin'] },
      { path: '/group-management', icon: 'Users', label: 'Manage Groups', roles: ['admin'] },
      { path: '/public-groups', icon: 'Globe', label: 'Public Groups', roles: ['member', 'admin'] },
    ],
  },
  {
    title: 'Finance',
    links: [
      { path: '/loan-request', icon: 'Handshake', label: 'Request Loan', roles: ['member', 'admin'] },
      { path: '/record-contribution', icon: 'PiggyBank', label: 'Record Contribution', roles: ['member', 'admin'] },
      { path: '/record-repayment', icon: 'Receipt', label: 'Record Repayment', roles: ['member', 'admin'] },
      { path: '/payment-processing', icon: 'DollarSign', label: 'Payment Processing', roles: ['member', 'admin'] },
    ],
  },
  {
    title: 'History & Analytics',
    links: [
      { path: '/contribution-history', icon: 'History', label: 'Contribution History', roles: ['member', 'admin'] },
      { path: '/repayment-history', icon: 'History', label: 'Repayment History', roles: ['member', 'admin'] },
      { path: '/group-analytics', icon: 'PieChart', label: 'Group Analytics', roles: ['admin'] },
      { path: '/audit-log', icon: 'ClipboardList', label: 'Audit Log', roles: ['admin'] },
    ],
  },
  {
    title: 'Tools',
    links: [
      { path: '/report-generation', icon: 'FileText', label: 'Generate Reports', roles: ['admin'] },
      { path: '/notifications-center', icon: 'Bell', label: 'Notifications', roles: ['member', 'admin'] },
    ],
  },
];

const Sidebar = ({ isCollapsed, onToggle }) => {
  const { user, profile, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRole = profile?.role || 'member';

  const renderNavLinks = (links) => {
    return links
      .filter(item => item.roles.includes(userRole))
      .map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
              isCollapsed ? 'justify-center' : '',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )
          }
        >
          <AppIcon name={item.icon} size={20} />
          {!isCollapsed && <span>{item.label}</span>}
        </NavLink>
      ));
  };

  const sidebarContent = (
    <>
      <div className={cn('flex items-center p-4 h-16 border-b border-border', isCollapsed ? 'justify-center' : 'justify-between')}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <AppIcon name="Coins" size={20} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Mukando</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={onToggle} className="hidden lg:flex">
          <AppIcon name={isCollapsed ? 'PanelRightOpen' : 'PanelLeftOpen'} size={18} />
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        {navigationItems.map(section => {
          const filteredLinks = section.links.filter(link => link.roles.includes(userRole));
          if (filteredLinks.length === 0) return null;

          return (
            <div key={section.title}>
              {!isCollapsed && <h2 className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{section.title}</h2>}
              <div className="space-y-1">
                {renderNavLinks(filteredLinks)}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className={cn('flex items-center gap-3', isCollapsed ? 'justify-center' : '')}>
          <img src={profile?.avatar_url || 'https://avatar.vercel.sh/Vercel'} alt="User" className="w-10 h-10 rounded-full" />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{profile?.full_name || user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
          )}
          {!isCollapsed && (
            <Button variant="ghost" size="icon" onClick={logout}>
              <AppIcon name="LogOut" size={18} />
            </Button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={cn('fixed inset-0 bg-black/50 z-40 lg:hidden', isMobileMenuOpen ? 'block' : 'hidden')} onClick={() => setMobileMenuOpen(false)} />
      <aside className={cn('fixed left-0 top-0 z-50 h-screen bg-card border-r border-border shadow-lg transition-transform duration-300 w-64 lg:hidden', isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full')}>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className={cn('fixed left-0 top-0 z-30 h-screen bg-card border-r border-border shadow-warm transition-all duration-300 hidden lg:flex flex-col', isCollapsed ? 'w-20' : 'w-64')}>
        {sidebarContent}
      </aside>

      {/* Mobile Menu Button */}
      <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="lg:hidden fixed top-4 left-4 z-20 bg-card">
        <AppIcon name="Menu" size={20} />
      </Button>
    </>
  );
};

export default Sidebar;
