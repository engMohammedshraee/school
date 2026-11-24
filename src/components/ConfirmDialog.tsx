import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

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

// Toast notification
let toastId = 0;
const toastListeners: ((toast: { id: number; message: string; type: 'success' | 'error' | 'info' }) => void)[] = [];

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  const id = ++toastId;
  toastListeners.forEach(fn => fn({ id, message, type }));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: string }[]>([]);

  useEffect(() => {
    const listener = (toast: { id: number; message: string; type: string }) => {
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

import { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
