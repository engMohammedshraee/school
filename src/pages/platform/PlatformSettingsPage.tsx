import { PageHeader } from '@/components/PageHeader';
import { showToast } from '@/components/ui';

export function PlatformSettingsPage() {
  return (
    <div>
      <PageHeader
        title="إعدادات المنصة"
        description="الإعدادات العامة للمنصة"
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'المنصة' }, { label: 'الإعدادات' }]}
      />
      <div className="card p-6">
        <p className="text-sand-500 text-sm mb-4">إعدادات المنصة العامة ستظهر هنا.</p>
        <button className="btn-primary" onClick={() => showToast('الإعدادات قيد التطوير', 'info')}>
          حفظ الإعدادات
        </button>
      </div>
    </div>
  );
}
