import { useState } from 'react';
import { ChevronDown, Check, UserCircle2, Smartphone, Monitor } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ROLES } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

export function RoleSwitcher({ compact = false }: { compact?: boolean }) {
  const { role, setRole, roleName, userName } = useApp();
  const [open, setOpen] = useState(false);
  const currentRole = ROLES.find((r) => r.id === role)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2 transition-all hover:border-line-strong',
          compact && 'px-2'
        )}
      >
        <div className="h-8 w-8 rounded-lg bg-emerald-soft flex items-center justify-center text-emerald shrink-0">
          <UserCircle2 size={20} />
        </div>
        {!compact && (
          <div className="text-right min-w-0">
            <p className="text-sm font-semibold text-ink-900 truncate max-w-[140px]">{roleName}</p>
            <p className="text-[10px] text-ink-500 truncate max-w-[140px]">{userName}</p>
          </div>
        )}
        <ChevronDown size={16} className={cn('text-ink-500 transition-transform shrink-0', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-0 z-50 w-72 bg-white rounded-2xl shadow-elevated border border-line overflow-hidden animate-scale-in">
            <div className="p-3 border-b border-line bg-surface-subtle/50">
              <p className="text-xs font-semibold text-ink-700">تبديل الدور — وضع التجربة</p>
              <p className="text-[10px] text-ink-500 mt-0.5">جرّب المنصة من منظور كل دور</p>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setRole(r.id as Role);
                    setOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-start gap-3 p-2.5 rounded-xl text-right transition-colors',
                    role === r.id ? 'bg-emerald-soft' : 'hover:bg-surface-subtle'
                  )}
                >
                  <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', role === r.id ? 'bg-emerald text-white' : 'bg-surface-subtle text-ink-700')}>
                    {r.isMobile ? <Smartphone size={18} /> : <Monitor size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-ink-900">{r.nameAr}</p>
                      {r.isMobile && <span className="text-[9px] bg-info/10 text-info px-1.5 py-0.5 rounded">موبايل</span>}
                    </div>
                    <p className="text-[11px] text-ink-500 mt-0.5 truncate">{r.description}</p>
                    <p className="text-[10px] text-ink-300 mt-0.5">{r.sampleUserName}</p>
                  </div>
                  {role === r.id && <Check size={16} className="text-emerald shrink-0 mt-1" />}
                </button>
              ))}
            </div>
            <div className="p-2.5 border-t border-line bg-warning/5">
              <p className="text-[10px] text-warning font-medium flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                بيئة تجريبية — جميع البيانات وهمية لأغراض العرض
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function BrandLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-royal to-emerald flex items-center justify-center shrink-0 shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M4 16l4-8 4 6 3-4 5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="8" r="1.5" fill="currentColor" />
          <path d="M3 20h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="text-base font-bold text-emerald-royal leading-tight">مسار</p>
          <p className="text-[10px] text-ink-500 leading-tight">MASAR Transport</p>
        </div>
      )}
    </div>
  );
}
