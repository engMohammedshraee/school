import { StatCard } from '@/components/StatCard';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Building2, Users, CheckCircle2, XCircle, Activity } from 'lucide-react';
import { db, getSchool, getUser } from '@/services/db';
import { useNavigate } from 'react-router-dom';

export function PlatformDashboard() {
  const navigate = useNavigate();
  const schools = db.schools;
  const totalUsers = db.users.length;
  const activeSchools = schools.filter(s => s.status === 'active').length;
  const suspendedSchools = schools.filter(s => s.status === 'suspended').length;

  const columns = [
    {
      key: 'name', header: 'المدرسة',
      render: (s: typeof schools[0]) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: s.logoColor }}>
            {s.name[0]}
          </div>
          <span className="font-medium text-sand-800">{s.name}</span>
        </div>
      ),
    },
    { key: 'code', header: 'الكود', render: (s: typeof schools[0]) => <span className="ltr-numbers text-sand-500">{s.code}</span> },
    {
      key: 'status', header: 'الحالة',
      render: (s: typeof schools[0]) => s.status === 'active'
        ? <StatusBadge variant="success">نشط</StatusBadge>
        : <StatusBadge variant="error">موقوف</StatusBadge>,
    },
    { key: 'branches', header: 'الفروع', render: (s: typeof schools[0]) => db.branches.filter(b => b.schoolId === s.id).length },
    { key: 'students', header: 'الطلاب', render: (s: typeof schools[0]) => db.enrollments.filter(e => e.schoolId === s.id && e.status === 'active').length },
    { key: 'users', header: 'المستخدمون', render: (s: typeof schools[0]) => db.memberships.filter(m => m.schoolId === s.id).length },
    {
      key: 'createdAt', header: 'تاريخ الإنشاء',
      render: (s: typeof schools[0]) => <span className="ltr-numbers text-sand-500">{s.createdAt}</span>,
    },
    {
      key: 'actions', header: 'الإجراءات',
      render: (s: typeof schools[0]) => (
        <button onClick={() => navigate('/platform/schools')} className="btn-ghost btn-sm">عرض</button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="لوحة المنصة" description="نظرة عامة على جميع المدارس في المنصة" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'لوحة المنصة' }]} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="إجمالي المدارس" value={schools.length} icon={<Building2 size={20} />} variant="info" />
        <StatCard label="المدارس النشطة" value={activeSchools} icon={<CheckCircle2 size={20} />} variant="success" />
        <StatCard label="إجمالي المستخدمين" value={totalUsers} icon={<Users size={20} />} />
        <StatCard label="المدارس الموقوفة" value={suspendedSchools} icon={<XCircle size={20} />} variant="error" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-sand-800 mb-4">قائمة المدارس</h3>
          <DataTable columns={columns} data={schools} rowKey={(s) => s.id} onRowClick={() => navigate('/platform/schools')} />
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4 flex items-center gap-2"><Activity size={16} className="text-brand-600" /> نشاط المنصة</h3>
          <div className="space-y-3">
            {db.auditLogs.slice(0, 6).map(log => {
              const u = getUser(log.userId);
              const s = log.schoolId ? getSchool(log.schoolId) : null;
              return (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sand-700">{log.action}</p>
                    <p className="text-xs text-sand-400">{u?.name} · {s?.name ?? '—'} · {new Date(log.timestamp).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
