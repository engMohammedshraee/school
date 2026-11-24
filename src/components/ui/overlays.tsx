import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  danger = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  danger?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-emerald-deep/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'relative bg-white rounded-2xl shadow-elevated w-full animate-scale-in overflow-hidden',
          sizes[size]
        )}
      >
        <div className={cn('flex items-start justify-between gap-4 p-5 border-b', danger ? 'border-danger/20 bg-danger/5' : 'border-line')}>
          <div className="min-w-0">
            <h3 className={cn('text-lg font-semibold', danger ? 'text-danger' : 'text-ink-900')}>{title}</h3>
            {description && <p className="text-sm text-ink-500 mt-1">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-surface-subtle hover:text-ink-900 transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>
        {children && <div className="p-5">{children}</div>}
        {footer && (
          <div className="flex items-center justify-end gap-2 p-4 border-t border-line bg-surface-subtle/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  width?: 'sm' | 'md' | 'lg';
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-xl' };

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      <div className="absolute inset-0 bg-emerald-deep/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'absolute top-0 bottom-0 left-0 bg-white shadow-elevated flex flex-col animate-slide-in-right w-full',
          widths[width]
        )}
      >
        <div className="flex items-start justify-between gap-4 p-5 border-b border-line shrink-0">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
            {description && <p className="text-sm text-ink-500 mt-1">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-surface-subtle transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 p-4 border-t border-line bg-surface-subtle/50 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  danger = false,
  requireText = false,
  placeholder,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  requireText?: boolean;
  placeholder?: string;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      danger={danger}
      size="sm"
      footer={
        <>
          <button className="btn-ghost" onClick={onClose}>
            {cancelLabel}
          </button>
          <ConfirmButton danger={danger} confirmLabel={confirmLabel} onConfirm={onConfirm} requireText={requireText} />
        </>
      }
    >
      <p className="text-sm text-ink-700 leading-relaxed">{description}</p>
      {requireText && (
        <input
          type="text"
          className="input mt-4"
          placeholder={placeholder}
          id="confirm-reason-input"
        />
      )}
    </Modal>
  );
}

function ConfirmButton({
  danger,
  confirmLabel,
  onConfirm,
  requireText,
}: {
  danger: boolean;
  confirmLabel: string;
  onConfirm: (reason?: string) => void;
  requireText: boolean;
}) {
  const handleConfirm = () => {
    if (requireText) {
      const input = document.getElementById('confirm-reason-input') as HTMLInputElement | null;
      onConfirm(input?.value || '');
    } else {
      onConfirm();
    }
  };
  return (
    <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={handleConfirm}>
      {confirmLabel}
    </button>
  );
}
