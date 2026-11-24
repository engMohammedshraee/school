import { PageHeader } from '@/components/PageHeader';
import { showToast } from '@/components/ui';
import { useAuth } from '@/services/authContext';
import { getSchool } from '@/services/db';
import { Save, Building2, Bell, Globe, Shield } from 'lucide-react';

export function SettingsPage() {
  const { session } = useAuth();
  if (!session) return null;
  const school = getSchool(session.activeSchoolId);

  return (
    <div>
      <PageHeader title="الإعدادات" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الإعدادات' }]} />
      <div className="space-y-6 max-w-2xl">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4 flex items-center gap-2"><Building2 size={16} className="text-brand-600" /> معلومات المدرسة</h3>
          <div className="space-y-4">
            <div><label className="label">اسم المدرسة</label><input className="input" defaultValue={school?.name} /></div>
            <div><label className="label">الكود</label><input className="input ltr-numbers" defaultValue={school?.code} dir="ltr" /></div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4 flex items-center gap-2"><Globe size={16} className="text-brand-600" /> اللغة والاتجاه</h3>
          <div className="space-y-4">
            <div><label className="label">اللغة الافتراضية</label><select className="select"><option value="ar">العربية</option><option value="en">English (قريبًا)</option></select></div>
            <div><label className="label">الاتجاه</label><select className="select"><option>من اليمين إلى اليسار (RTL)</option><option>من اليسار إلى اليمين (LTR) — قريبًا</option></select></div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4 flex items-center gap-2"><Bell size={16} className="text-brand-600" /> الإشعارات</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3"><input type="checkbox" className="w-4 h-4 accent-brand-600" defaultChecked /><span className="text-sm text-sand-700">إشعارات التسجيل الجديد</span></label>
            <label className="flex items-center gap-3"><input type="checkbox" className="w-4 h-4 accent-brand-600" defaultChecked /><span className="text-sm text-sand-700">إشعارات الوثائق الناقصة</span></label>
            <label className="flex items-center gap-3"><input type="checkbox" className="w-4 h-4 accent-brand-600" /><span className="text-sm text-sand-700">إشعارات الحضور (قريبًا)</span></label>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4 flex items-center gap-2"><Shield size={16} className="text-brand-600" /> الأمان</h3>
          <p className="text-xs text-sand-400">الصلاحيات في هذه الشاشة للعرض فقط في النموذج التجريبي. التحكم الفعلي بالصلاحيات سيكون في نظام Laravel الإنتاجي.</p>
        </div>

        <button className="btn-primary" onClick={() => showToast('تم حفظ الإعدادات (محاكاة)', 'success')}><Save size={14} /> حفظ الإعدادات</button>
      </div>
    </div>
  );
}
