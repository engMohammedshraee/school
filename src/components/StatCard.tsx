import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const variants = {
  default: 'text-sand-700',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  error: 'text-red-600',
  info: 'text-brand-600',
};

const iconBg = {
  default: 'bg-sand-100 text-sand-500',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  error: 'bg-red-50 text-red-600',
  info: 'bg-brand-50 text-brand-600',
};

export function StatCard({ label, value, icon, trend, variant = 'default', className }: StatCardProps) {
  return (
    <div className={cn('card p-5', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-sand-500 mb-1">{label}</p>
          <p className={cn('text-2xl font-bold ltr-numbers', variants[variant])}>{value}</p>
          {trend && <p className="text-xs text-sand-400 mt-1">{trend}</p>}
        </div>
        {icon && (
          <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', iconBg[variant])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
