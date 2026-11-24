import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

const ToastContext = createContext<{ push: (type: ToastType, message: string) => void }>({
  push: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const icons: Record<ToastType, ReactNode> = {
    success: <CheckCircle2 size={18} className="text-success" />,
    error: <XCircle size={18} className="text-danger" />,
    info: <Info size={18} className="text-info" />,
    warning: <AlertCircle size={18} className="text-warning" />,
  };

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 bg-white rounded-xl shadow-elevated border border-line px-4 py-3 animate-slide-up"
          >
            {icons[toast.type]}
            <p className="text-sm text-ink-900 flex-1">{toast.message}</p>
            <button onClick={() => remove(toast.id)} className="text-ink-300 hover:text-ink-700">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function ConnectionIndicator({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string; pulse?: boolean }> = {
    online: { color: 'bg-success', label: 'متصل' },
    weak: { color: 'bg-warning', label: 'اتصال ضعيف', pulse: true },
    offline: { color: 'bg-danger', label: 'غير متصل' },
    syncing: { color: 'bg-info', label: 'جارٍ المزامنة', pulse: true },
    gps_unavailable: { color: 'bg-danger', label: 'GPS غير متاح' },
  };
  const c = config[status] || config.online;
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        {c.pulse && (
          <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-60 animate-pulse-ring', c.color)} />
        )}
        <span className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', c.color)} />
      </span>
      <span className="text-xs font-medium text-ink-700">{c.label}</span>
    </div>
  );
}
