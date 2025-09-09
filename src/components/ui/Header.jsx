import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';
import { cn } from '../../utils/cn';

const Header = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const navigationItems = [
    { path: '/member-dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/group-management', label: 'Groups', icon: 'Users' },
    { path: '/loan-request', label: 'Loans', icon: 'CreditCard' },
    { path: '/payment-processing', label: 'Payments', icon: 'DollarSign' },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Icon name="Coins" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Mukando
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )
                }
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Icon name="Menu" size={20} />
            </Button>

            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(prev => !prev)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-900">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <Icon 
                  name="ChevronDown" 
                  size={16} 
                  className={cn(
                    "text-slate-500 transition-transform duration-200",
                    profileMenuOpen && "rotate-180"
                  )} 
                />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{profile?.full_name}</p>
                    <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                  </div>
                  
                  <NavLink 
                    to="/profile" 
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Icon name="User" size={16} />
                    Profile
                  </NavLink>
                  
                  <NavLink 
                    to="/settings" 
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Icon name="Settings" size={16} />
                    Settings
                  </NavLink>
                  
                  <div className="my-2 h-px bg-slate-100" />
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                  >
                    <Icon name="LogOut" size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-slate-900">Menu</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <nav className="flex flex-col gap-2">
              {navigationItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                      isActive 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-slate-700 hover:bg-slate-50"
                    )
                  }
                >
                  <Icon name={item.icon} size={20} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            
            <div className="mt-8 pt-6 border-t border-slate-200">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Icon name="LogOut" size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;