import React, { useState } from 'react';
import Sidebar from './layout/Sidebar';
import Topbar from './layout/Topbar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = ({ title, subtitle, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} subtitle={subtitle} onToggle={() => setCollapsed(!collapsed)} />
        <main className="flex-1 p-8 overflow-x-hidden">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
