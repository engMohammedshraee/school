import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/services/authContext';
import { can } from '@/services/permissions';
import { getNavigationForRole } from '@/config/navigation';
import type { NavItem } from '@/config/navigation';
import type { LucideIcon } from 'lucide-react';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const { membership } = useAuth();
  const location = useLocation();

  if (!membership) return null;

  const navGroups = getNavigationForRole(membership.roleKey);

  function filterItems(items: NavItem[]): NavItem[] {
    return items.filter(item => {
      if (item.soon) return true;
      if (!item.permission) return true;
      return can(item.permission, membership);
    });
  }

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-sand-900/30 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
      <aside
        className={cn(
          'fixed top-0 right-0 h-full bg-white border-l border-sand-200 z-40 transition-all duration-300 flex flex-col',
          collapsed ? 'w-0 lg:w-20 overflow-hidden' : 'w-72',
          'lg:translate-x-0',
          collapsed ? 'translate-x-full lg:translate-x-0' : 'translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-sand-200 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            م
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-sand-900 text-base leading-tight">مسار</h1>
              <p className="text-[10px] text-sand-400 leading-tight">نظام إدارة المدارس</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map((group, gi) => {
            const filtered = filterItems(group.items);
            if (filtered.length === 0) return null;
            return (
              <div key={gi}>
                {!collapsed && (
                  <p className="px-3 mb-2 text-[11px] font-semibold text-sand-400 uppercase tracking-wider">{group.label}</p>
                )}
                <div className="space-y-1">
                  {filtered.map((item) => {
                    const Icon = (Icons as Record<string, LucideIcon>)[item.icon] ?? Icons.Circle;
                    const isActive = location.pathname === item.path ||
                      (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => { if (window.innerWidth < 1024) onToggle(); }}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group',
                          isActive
                            ? 'bg-brand-50 text-brand-700'
                            : 'text-sand-600 hover:bg-sand-50 hover:text-sand-900',
                          collapsed && 'lg:justify-center'
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon size={18} className="flex-shrink-0" />
                        {!collapsed && <span className="flex-1">{item.label}</span>}
                        {!collapsed && item.soon && (
                          <span className="badge-soon">قريبًا</span>
                        )}
                        {collapsed && item.soon && (
                          <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-sand-300" />
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="px-5 py-3 border-t border-sand-200 flex-shrink-0">
            <p className="text-[10px] text-sand-400 text-center">MASAR — مسار · نموذج تجريبي</p>
          </div>
        )}
      </aside>
    </>
  );
}
