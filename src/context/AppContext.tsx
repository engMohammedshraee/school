import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Role } from '@/types';
import { ROLES } from '@/data/mockData';
import type { ReactNode } from 'react';

interface AppContextValue {
  role: Role;
  setRole: (role: Role) => void;
  roleName: string;
  userName: string;
  isMobileRole: boolean;
  currentPage: string;
  navigate: (page: string) => void;
  notifications: typeof import('@/data/mockData').notifications;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  isDemo: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

import { notifications as initialNotifications } from '@/data/mockData';

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>('transport_manager');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notifications, setNotifications] = useState(initialNotifications);

  const roleInfo = ROLES.find((r) => r.id === role)!;

  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole);
    setCurrentPage('dashboard');
  }, []);

  const navigate = useCallback((page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        roleName: roleInfo.nameAr,
        userName: roleInfo.sampleUserName,
        isMobileRole: roleInfo.isMobile || false,
        currentPage,
        navigate,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        isDemo: true,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
