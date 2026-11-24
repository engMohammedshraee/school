import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ToastContainer } from '@/components/ui';
import { cn } from '@/utils/cn';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1024);

  return (
    <div className="min-h-screen bg-sand-50">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={cn('transition-all duration-300', collapsed ? 'lg:pr-20' : 'lg:pr-72')}>
        <AppHeader onToggleSidebar={() => setCollapsed(!collapsed)} />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
