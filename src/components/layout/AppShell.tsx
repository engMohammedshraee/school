import { useState } from 'react';
import { Menu, X, Search, Bell, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { navigation } from '@/config/navigation';
import { RoleSwitcher, BrandLogo } from './RoleSwitcher';
import { NotificationCenter } from '@/components/layout/NotificationCenter';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { role, currentPage, navigate, isMobileRole } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const nav = navigation[role];
  const unreadCount = useApp().notifications.filter((n) => !n.read).length;

  if (isMobileRole) {
    return <MobileShell>{children}</MobileShell>;
  }

  return (
    <div className="min-h-screen flex bg-surface-page">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 right-0 w-64 bg-emerald-deep flex flex-col z-30 transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
          <div className="[&_p]:text-white [&_.text-ink-500]:text-white/50">
            <BrandLogo />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden h-8 w-8 rounded-lg flex items-center justify-center text-white/70 hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
          {nav.map((group, gi) => (
            <div key={gi} className="mb-5">
              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider px-3 mb-2">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = currentPage === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.id);
                        setSidebarOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group',
                        isActive
                          ? 'bg-white/12 text-white font-medium'
                          : 'text-white/70 hover:bg-white/8 hover:text-white'
                      )}
                    >
                      <Icon
                        size={18}
                        className={cn('shrink-0 transition-colors', isActive ? 'text-gold' : 'text-white/60 group-hover:text-white/90')}
                      />
                      <span className="flex-1 text-right truncate">{item.label}</span>
                      {item.badge && (
                        <span className={cn(
                          'text-[10px] font-semibold px-1.5 py-0.5 rounded-md num',
                          isActive ? 'bg-gold text-emerald-deep' : 'bg-white/15 text-white'
                        )}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
            <div className="h-8 w-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold text-xs font-bold shrink-0">
              م
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{useApp().userName}</p>
              <p className="text-[10px] text-white/50 truncate">{useApp().roleName}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-emerald-deep/40 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:mr-64 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-line sticky top-0 z-20 flex items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-ink-700 hover:bg-surface-subtle"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-surface-subtle rounded-xl px-3 py-2 w-64 lg:w-80">
              <Search size={16} className="text-ink-300 shrink-0" />
              <input
                type="text"
                placeholder="بحث سريع..."
                className="bg-transparent text-sm flex-1 outline-none placeholder:text-ink-300"
              />
              <kbd className="text-[10px] text-ink-300 bg-white border border-line rounded px-1.5 py-0.5 num">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setNotifOpen(true)}
              className="relative h-9 w-9 rounded-lg flex items-center justify-center text-ink-700 hover:bg-surface-subtle transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
              )}
            </button>
            <RoleSwitcher />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>

      <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}

function MobileShell({ children }: { children: React.ReactNode }) {
  const { role, currentPage, navigate } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = navigation[role];

  const bottomNav = nav[0]?.items.slice(0, 4) || [];
  const unreadCount = useApp().notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-surface-page flex flex-col max-w-md mx-auto relative">
      {/* Mobile header */}
      <header className="sticky top-0 z-30 bg-white border-b border-line">
        <div className="flex items-center justify-between px-4 h-14">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <button className="relative h-9 w-9 rounded-lg flex items-center justify-center text-ink-700 hover:bg-surface-subtle">
              <Bell size={20} />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-white" />}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-ink-700 hover:bg-surface-subtle"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-20 animate-fade-in">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-line z-30">
        <div className="flex items-center justify-around px-2 py-1.5 safe-bottom">
          {bottomNav.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors flex-1',
                  isActive ? 'text-emerald' : 'text-ink-500'
                )}
              >
                <Icon size={22} className={cn(isActive && 'text-emerald')} />
                <span className="text-[10px] font-medium truncate max-w-full">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Full menu drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 max-w-md mx-auto animate-fade-in">
          <div className="absolute inset-0 bg-emerald-deep/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 bottom-0 right-0 w-72 bg-white shadow-elevated flex flex-col animate-slide-in-right">
            <div className="h-14 flex items-center justify-between px-4 border-b border-line">
              <RoleSwitcher compact />
              <button onClick={() => setMenuOpen(false)} className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-surface-subtle">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              {nav.map((group, gi) => (
                <div key={gi} className="mb-4">
                  <p className="text-[10px] font-semibold text-ink-300 uppercase tracking-wider px-3 mb-1.5">{group.label}</p>
                  {group.items.map((item) => {
                    const isActive = currentPage === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(item.id);
                          setMenuOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                          isActive ? 'bg-emerald-soft text-emerald-royal font-medium' : 'text-ink-700 hover:bg-surface-subtle'
                        )}
                      >
                        <Icon size={18} className="shrink-0" />
                        <span className="flex-1 text-right">{item.label}</span>
                        {item.badge && <span className="text-[10px] bg-danger/10 text-danger px-1.5 py-0.5 rounded num">{item.badge}</span>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
