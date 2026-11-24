import { PageHeader } from '@/components/PageHeader';
import { ComingSoonBadge } from '@/components/StatusBadge';
import { Sparkles } from 'lucide-react';

export function ComingSoonPage({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} breadcrumbs={[{ label: 'الرئيسية' }, { label: title }]} />
      <div className="card p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-50 flex items-center justify-center">
          <Sparkles size={28} className="text-brand-600" />
        </div>
        <h2 className="text-lg font-semibold text-sand-800 mb-2">{title}</h2>
        <p className="text-sm text-sand-500 max-w-md mx-auto mb-4">
          هذه الوحدة جزء من النسخ المستقبلية من نظام مسار. سيتم تفعيلها في إصدار لاحق.
        </p>
        <ComingSoonBadge />
      </div>
    </div>
  );
}
