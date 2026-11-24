import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function Badge({
  children,
  variant = 'neutral',
  className,
  dot = false,
}: {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'emerald' | 'gold';
  className?: string;
  dot?: boolean;
}) {
  const variants: Record<string, string> = {
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-info/10 text-info',
    neutral: 'bg-ink-500/10 text-ink-700',
    emerald: 'bg-emerald-soft text-emerald-royal',
    gold: 'bg-gold-soft text-gold',
  };
  const dotColors: Record<string, string> = {
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
    neutral: 'bg-ink-500',
    emerald: 'bg-emerald',
    gold: 'bg-gold',
  };
  return (
    <span className={cn('badge', variants[variant], className)}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'emerald' | 'gold';

export function statusBadge(status: string): { variant: BadgeVariant; label: string } {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    active: { variant: 'success', label: 'نشط' },
    on_duty: { variant: 'success', label: 'في الخدمة' },
    online: { variant: 'success', label: 'متصل' },
    paid: { variant: 'success', label: 'مدفوع' },
    completed: { variant: 'success', label: 'مكتملة' },
    delivered_home: { variant: 'success', label: 'تم التوصيل' },
    arrived_school: { variant: 'success', label: 'وصل المدرسة' },
    trial: { variant: 'info', label: 'تجريبي' },
    pending: { variant: 'warning', label: 'قيد الانتظار' },
    not_started: { variant: 'warning', label: 'لم تبدأ' },
    waiting_pickup: { variant: 'warning', label: 'بانتظار الاستلام' },
    waiting_dropoff: { variant: 'warning', label: 'بانتظار التوصيل' },
    weak: { variant: 'warning', label: 'اتصال ضعيف' },
    partial: { variant: 'warning', label: 'دفعة جزئية' },
    on_leave: { variant: 'neutral', label: 'في إجازة' },
    off_duty: { variant: 'neutral', label: 'غير في الخدمة' },
    idle: { variant: 'neutral', label: 'متوقفة' },
    maintenance: { variant: 'warning', label: 'صيانة' },
    syncing: { variant: 'info', label: 'جارٍ المزامنة' },
    boarded: { variant: 'info', label: 'على متن الحافلة' },
    overdue: { variant: 'danger', label: 'متأخر' },
    offline: { variant: 'danger', label: 'غير متصل' },
    gps_unavailable: { variant: 'danger', label: 'GPS غير متاح' },
    suspended: { variant: 'danger', label: 'موقف' },
    terminated: { variant: 'danger', label: 'منتهية قسرياً' },
    absent: { variant: 'danger', label: 'غائب' },
    one_way: { variant: 'info', label: 'ذهاب فقط' },
    return_only: { variant: 'gold', label: 'إياب فقط' },
    round_trip: { variant: 'emerald', label: 'ذهاب وإياب' },
  };
  return map[status] || { variant: 'neutral', label: status };
}

export function Card({
  children,
  className,
  hover = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}) {
  return <div className={cn('card', hover && 'card-hover', className)} onClick={onClick}>{children}</div>;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendValue,
  accent = 'emerald',
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  accent?: 'emerald' | 'gold' | 'info' | 'danger' | 'warning';
}) {
  const accentColors: Record<string, string> = {
    emerald: 'bg-emerald-soft text-emerald',
    gold: 'bg-gold-soft text-gold',
    info: 'bg-info/10 text-info',
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
  };
  return (
    <Card className="p-5" hover>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-ink-500 mb-1.5 truncate">{label}</p>
          <p className="text-2xl font-bold text-ink-900 num">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn('text-xs font-medium', trend === 'up' ? 'text-success' : 'text-danger')}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="text-xs text-ink-300">عن الشهر الماضي</span>
            </div>
          )}
        </div>
        <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center shrink-0', accentColors[accent])}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <div className="mb-6">
      {breadcrumb && (
        <nav className="flex items-center gap-1.5 text-xs text-ink-500 mb-3">
          {breadcrumb.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-ink-300">/</span>}
              <span className={i === breadcrumb.length - 1 ? 'text-ink-700 font-medium' : ''}>{b.label}</span>
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900">{title}</h1>
          {description && <p className="text-sm text-ink-500 mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="h-16 w-16 rounded-2xl bg-emerald-soft flex items-center justify-center text-emerald mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-ink-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-500 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="skeleton h-4 w-24 mb-2" />
          <div className="skeleton h-8 w-32" />
        </div>
        <div className="skeleton h-11 w-11 rounded-xl" />
      </div>
    </div>
  );
}
