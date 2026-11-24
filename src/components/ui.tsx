import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { cn } from '@/utils/cn';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, message,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>{cancelLabel}</button>
          <button
            className={destructive ? 'btn-destructive' : 'btn-primary'}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        {destructive && (
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
        )}
        <p className="text-sm text-sand-600 leading-relaxed">{message}</p>
      </div>
    </Modal>
  );
}

// Toast notification system
let toastId = 0;
type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' };
const toastListeners: ((toast: Toast) => void)[] = [];

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  const id = ++toastId;
  toastListeners.forEach(fn => fn({ id, message, type }));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3000);
    };
    toastListeners.push(listener);
    return () => {
      const idx = toastListeners.indexOf(listener);
      if (idx >= 0) toastListeners.splice(idx, 1);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={cn(
            'px-4 py-3 rounded-lg shadow-elevated text-sm font-medium animate-slide-in',
            t.type === 'success' && 'bg-emerald-600 text-white',
            t.type === 'error' && 'bg-red-600 text-white',
            t.type === 'info' && 'bg-brand-600 text-white',
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="text-center py-16">
      {icon && <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sand-100 flex items-center justify-center text-sand-400">{icon}</div>}
      <h3 className="text-base font-semibold text-sand-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-sand-400 max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 bg-sand-200 rounded animate-pulse w-1/4" />
          <div className="h-4 bg-sand-200 rounded animate-pulse w-1/3" />
          <div className="h-4 bg-sand-200 rounded animate-pulse w-1/5" />
        </div>
      ))}
    </div>
  );
}

export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-sand-200">
      <p className="text-xs text-sand-500">
        صفحة <span className="font-semibold text-sand-700">{page}</span> من {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          className="btn-secondary btn-sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          السابق
        </button>
        <button
          className="btn-secondary btn-sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          التالي
        </button>
      </div>
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = 'بحث...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pr-9"
      />
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: { key: string; label: string; soon?: boolean }[]; active: string; onChange: (key: string) => void }) {
  return (
    <div className="flex items-center gap-1 border-b border-sand-200 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => !tab.soon && onChange(tab.key)}
          disabled={tab.soon}
          className={cn(
            'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2',
            active === tab.key
              ? 'border-brand-600 text-brand-700'
              : tab.soon
                ? 'border-transparent text-sand-300 cursor-not-allowed'
                : 'border-transparent text-sand-500 hover:text-sand-700'
          )}
        >
          {tab.label}
          {tab.soon && <span className="badge-soon">قريبًا</span>}
        </button>
      ))}
    </div>
  );
}

export function FormSection({ title, children, description }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-sand-800">{title}</h3>
        {description && <p className="text-xs text-sand-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function UserAvatar({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('');
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}
