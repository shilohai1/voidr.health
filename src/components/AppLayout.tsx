import React from 'react';
import DashboardSidebar from './DashboardSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen relative">
      <div className="pt-20">
        {children}
      </div>
      <DashboardSidebar />
    </div>
  );
};

export default AppLayout; 
