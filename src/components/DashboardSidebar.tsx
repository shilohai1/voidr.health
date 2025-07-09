
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, FolderOpen, History, LogOut, User, DollarSign, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'My Projects', path: '/projects', icon: FolderOpen },
    { name: 'Export History', path: '/export-history', icon: History },
    { name: 'Pricing', path: '/pricing', icon: DollarSign },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out flex flex-col",
          // Mobile styles
          "lg:relative",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop styles
          isExpanded ? "w-64" : "w-16"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="h-full bg-white border-r border-gray-200 p-4 flex flex-col shadow-sm">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <picture>
              <source srcSet="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.webp" type="image/webp" />
              <img 
                src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" 
                alt="VOIDR" 
                className={cn(
                  "transition-all duration-300",
                  isExpanded || isMobileOpen ? "h-10 w-auto" : "h-8 w-auto"
                )}
                loading="lazy"
                width="120"
                height="40"
              />
            </picture>
          </div>

          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-700 flex-shrink-0" />
              {(isExpanded || isMobileOpen) && (
                <div className="transition-opacity duration-300 overflow-hidden">
                  <h2 className="text-sm font-semibold text-gray-900 truncate">
                    Welcome {profile?.name || 'User'}
                  </h2>
                  <p className="text-xs text-gray-600 truncate">{profile?.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Menu Items - Flex grow to push logout to bottom */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 relative min-h-[44px]",
                    "hover:bg-gray-100",
                    isActive 
                      ? "bg-primary/10 text-primary font-medium border border-primary/30" 
                      : "text-gray-700 hover:text-primary",
                    !isExpanded && !isMobileOpen && "justify-center"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {(isExpanded || isMobileOpen) && (
                    <span className="transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button - Always at bottom */}
          <div className="mt-auto pt-4">
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-lg w-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors min-h-[44px]",
                !isExpanded && !isMobileOpen && "justify-center"
              )}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {(isExpanded || isMobileOpen) && (
                <span className="transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
