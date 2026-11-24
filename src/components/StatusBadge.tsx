import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

type Variant = 'success' | 'warning' | 'error' | 'neutral' | 'info';

const variants: Record<Variant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  neutral: 'bg-sand-100 text-sand-600 border-sand-200',
  info: 'bg-brand-50 text-brand-700 border-brand-200',
};

export function StatusBadge({ variant, children, className }: { variant: Variant; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border', variants[variant], className)}>
      {children}
    </span>
  );
}

export function ComingSoonBadge({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-sand-100 text-sand-500 border border-sand-200', className)}>
      قريبًا
    </span>
  );
}
