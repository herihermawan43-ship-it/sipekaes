import React, { useState } from 'react';
import Sidebar from './layout/Sidebar';
import Topbar from './layout/Topbar';
import { Outlet } from 'react-router-dom';
import { Sheet, SheetContent } from './ui/sheet';

const DashboardLayout = ({ title, subtitle, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onClose={() => setMobileOpen(false)} />
      </div>

      {/* Mobile sidebar (drawer) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 border-none">
          <Sidebar collapsed={false} onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          title={title}
          subtitle={subtitle}
          onToggle={() => setCollapsed(!collapsed)}
          onMobileToggle={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
