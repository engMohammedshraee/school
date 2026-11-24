import { useState } from 'react';
import {
  Bell, BusFront, UserCheck, Home, CheckCircle2, AlertTriangle,
  WifiOff, MapPinOff, PauseCircle, OctagonAlert, Navigation, X, CheckCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import type { NotificationItem } from '@/types';

const iconMap: Record<NotificationItem['type'], { icon: typeof Bell; color: string; bg: string }> = {
  bus_approaching: { icon: BusFront, color: 'text-emerald', bg: 'bg-emerald-soft' },
  student_boarded: { icon: UserCheck, color: 'text-info', bg: 'bg-info/10' },
  student_arrived: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  student_dropped: { icon: Home, color: 'text-success', bg: 'bg-success/10' },
  absence_reported: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  trip_started: { icon: Navigation, color: 'text-emerald', bg: 'bg-emerald-soft' },
  trip_completed: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  driver_offline: { icon: WifiOff, color: 'text-danger', bg: 'bg-danger/10' },
  gps_lost: { icon: MapPinOff, color: 'text-danger', bg: 'bg-danger/10' },
  financial_suspension: { icon: PauseCircle, color: 'text-danger', bg: 'bg-danger/10' },
  emergency_termination: { icon: OctagonAlert, color: 'text-danger', bg: 'bg-danger/10' },
};

const filters = [
  { id: 'all', label: 'الكل' },
  { id: 'unread', label: 'غير مقروء' },
  { id: 'trips', label: 'الرحلات' },
  { id: 'students', label: 'الطلاب' },
  { id: 'alerts', label: 'تنبيهات' },
];

export function NotificationCenter({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState('all');

  if (!open) return null;

  const tripTypes = ['trip_started', 'trip_completed', 'bus_approaching'];
  const studentTypes = ['student_boarded', 'student_arrived', 'student_dropped', 'absence_reported'];
  const alertTypes = ['driver_offline', 'gps_lost', 'financial_suspension', 'emergency_termination'];

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'trips') return tripTypes.includes(n.type);
    if (filter === 'students') return studentTypes.includes(n.type);
    if (filter === 'alerts') return alertTypes.includes(n.type);
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      <div className="absolute inset-0 bg-emerald-deep/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-0 bottom-0 left-0 w-full max-w-md bg-white shadow-elevated flex flex-col animate-slide-in-right">
        <div className="p-5 border-b border-line shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-ink-900">الإشعارات</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-danger/10 text-danger px-2 py-0.5 rounded-lg font-medium num">{unreadCount} جديد</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-emerald hover:bg-emerald-soft px-2 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <CheckCheck size={14} />
                تعليم الكل كمقروء
              </button>
              <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-surface-subtle">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                  filter === f.id ? 'bg-emerald text-white' : 'bg-surface-subtle text-ink-700 hover:bg-line'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-14 w-14 rounded-2xl bg-surface-subtle flex items-center justify-center text-ink-300 mb-3">
                <Bell size={24} />
              </div>
              <p className="text-sm text-ink-500">لا توجد إشعارات</p>
            </div>
          ) : (
            filtered.map((n) => {
              const config = iconMap[n.type];
              const Icon = config.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-4 border-b border-line text-right transition-colors hover:bg-surface-subtle/50',
                    !n.read && 'bg-emerald-soft/30'
                  )}
                >
                  <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', config.bg)}>
                    <Icon size={18} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-ink-900">{n.title}</p>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-emerald shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">{n.description}</p>
                    <p className="text-[10px] text-ink-300 mt-1.5">{n.timestamp}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
