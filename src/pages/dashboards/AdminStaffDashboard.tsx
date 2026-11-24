import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/services/authContext';
import { getSchool, getAcademicYear, studentsBySchool } from '@/services/db';
import { getMembershipPermissions } from '@/services/permissions';
import { GraduationCap, Users, FileText, ClipboardCheck, ShieldCheck } from 'lucide-react';

export function AdminStaffDashboard() {
  const { session, membership } = useAuth();
  if (!session || !membership) return null;

  const school = getSchool(session.activeSchoolId);
  const year = getAcademicYear(session.activeAcademicYearId);
  const allStudents = studentsBySchool(session.activeSchoolId, session.activeAcademicYearId);
  const permissions = getMembershipPermissions(membership);

  // Permission-driven modules
  const modules = [
    { label: 'الطلاب', icon: GraduationCap, perm: 'students.view' as const, count: allStudents.length },
    { label: 'أولياء الأمور', icon: Users, perm: 'guardians.view' as const, count: 10 },
    { label: 'الحضور', icon: ClipboardCheck, perm: 'attendance.view' as const, count: null },
    { label: 'الوثائق', icon: FileText, perm: 'documents.view' as const, count: null },
  ];

  return (
    <div>
      <PageHeader
        title="لوحة الموظف الإداري"
        description={`${school?.name ?? ''} · ${year?.label ?? ''}`}
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'لوحة التحكم' }]}
      />

      {/* Permission info banner */}
      <div className="card p-4 mb-6 bg-brand-50/30 border-brand-200">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={18} className="text-brand-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-sand-800">الصلاحيات المفعّلة</p>
            <p className="text-xs text-sand-500 mt-0.5">
              القائمة أدناه تعرض الوحدات المتاحة بناءً على الصلاحيات الممنوحة لك. الاسم الوظيفي لا يحدد الصلاحيات — الصلاحيات هي ما يحدد الوصول.
            </p>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {permissions.map(p => (
                <span key={p} className="badge-neutral text-[10px]">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {modules.map((m, i) => {
          const hasPerm = permissions.includes(m.perm);
          return (
            <div key={i} className={`card p-5 ${!hasPerm ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sand-500 mb-1">{m.label}</p>
                  <p className="text-2xl font-bold text-sand-700 ltr-numbers">{hasPerm ? (m.count ?? '—') : 'مقيد'}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${hasPerm ? 'bg-brand-50 text-brand-600' : 'bg-sand-100 text-sand-400'}`}>
                  <m.icon size={20} />
                </div>
              </div>
              {!hasPerm && <div className="mt-2"><StatusBadge variant="neutral">لا صلاحية</StatusBadge></div>}
            </div>
          );
        })}
      </div>

      <div className="card p-5">
        <h3 className="text-sm font-semibold text-sand-800 mb-4">الوحدات المتاحة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.map((m, i) => {
            const hasPerm = permissions.includes(m.perm);
            return (
              <div key={i} className={`p-3 rounded-lg border ${hasPerm ? 'border-sand-200 hover:border-brand-300 cursor-pointer' : 'border-sand-100 opacity-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${hasPerm ? 'bg-brand-50 text-brand-600' : 'bg-sand-100 text-sand-400'}`}>
                    <m.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-sand-700">{m.label}</p>
                    <p className="text-xs text-sand-400">{hasPerm ? 'متاح' : 'مقيد بالصلاحيات'}</p>
                  </div>
                  {hasPerm ? <StatusBadge variant="success">متاح</StatusBadge> : <StatusBadge variant="neutral">مقيد</StatusBadge>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
