import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/services/authContext';
import { getSchool, getAcademicYear } from '@/services/db';
import { Wallet, FileText, Receipt, BarChart3 } from 'lucide-react';

export function AccountantDashboard() {
  const { session } = useAuth();
  if (!session) return null;

  const school = getSchool(session.activeSchoolId);
  const year = getAcademicYear(session.activeAcademicYearId);

  return (
    <div>
      <PageHeader
        title="لوحة المحاسب"
        description={`${school?.name ?? ''} · ${year?.label ?? ''}`}
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'المالية' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="الفواتير" value="— " icon={<FileText size={20} />} variant="info" />
        <StatCard label="المدفوعات" value="—" icon={<Wallet size={20} />} variant="success" />
        <StatCard label="الإيصالات" value="—" icon={<Receipt size={20} />} />
        <StatCard label="التقارير المالية" value="—" icon={<BarChart3 size={20} />} />
      </div>

      <div className="card p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-50 flex items-center justify-center">
          <Wallet size={28} className="text-brand-600" />
        </div>
        <h2 className="text-lg font-semibold text-sand-800 mb-2">الوحدة المالية</h2>
        <p className="text-sm text-sand-500 max-w-md mx-auto mb-4">
          الوحدة المالية الكاملة (الفواتير، المدفوعات، الإيصالات، التقارير المالية) ستكون متاحة في إصدار لاحق من نظام مسار.
        </p>
        <StatusBadge variant="neutral">قريبًا</StatusBadge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'الفواتير', icon: FileText, desc: 'إدارة فواتير الطلاب' },
          { label: 'المدفوعات', icon: Wallet, desc: 'تسجيل المدفوعات' },
          { label: 'الإيصالات', icon: Receipt, desc: 'إصدار الإيصالات' },
          { label: 'التقارير المالية', icon: BarChart3, desc: 'تقارير مالية تفصيلية' },
        ].map((item, i) => (
          <div key={i} className="card p-5 opacity-60">
            <div className="w-10 h-10 rounded-lg bg-sand-100 flex items-center justify-center mb-3">
              <item.icon size={18} className="text-sand-400" />
            </div>
            <h3 className="text-sm font-semibold text-sand-700 mb-1">{item.label}</h3>
            <p className="text-xs text-sand-400">{item.desc}</p>
            <div className="mt-2"><StatusBadge variant="neutral">قريبًا</StatusBadge></div>
          </div>
        ))}
      </div>
    </div>
  );
}
