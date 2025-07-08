import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, FolderOpen, History, LogOut, User, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div 
      className={cn(
        "fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div 
        className="h-full bg-white border-r border-gray-200 p-4 relative shadow-sm"
      >
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img 
            src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" 
            alt="VOIDR" 
            className={cn(
              "transition-all duration-300",
              isExpanded ? "h-10 w-auto" : "h-8 w-auto"
            )}
          />
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-700 flex-shrink-0" />
            {isExpanded && (
              <div className="transition-opacity duration-300 overflow-hidden">
                <h2 className="text-sm font-semibold text-gray-900 truncate">
                  Welcome {profile?.name || 'User'}
                </h2>
                <p className="text-xs text-gray-600 truncate">{profile?.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 relative",
                  "hover:bg-gray-100",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium border border-primary/30" 
                    : "text-gray-700 hover:text-primary",
                  !isExpanded && "justify-center"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center space-x-3 px-3 py-3 rounded-lg w-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors",
              !isExpanded && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isExpanded && (
              <span className="transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
