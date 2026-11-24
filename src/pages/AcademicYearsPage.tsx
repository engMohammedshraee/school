import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/services/authContext';
import { db, academicYearsBySchool } from '@/services/db';
import { can } from '@/services/permissions';
import { Eye, Pencil, Plus, Lock, Unlock } from 'lucide-react';
import type { AcademicYear } from '@/types';

export function AcademicYearsPage() {
  const { session, membership } = useAuth();
  const navigate = useNavigate();
  if (!session || !membership) return null;

  const years = academicYearsBySchool(session.activeSchoolId);

  const columns = [
    { key: 'label', header: 'السنة الدراسية', render: (y: AcademicYear) => <span className="font-medium text-sand-800 ltr-numbers">{y.label}</span> },
    { key: 'status', header: 'الحالة', render: (y: AcademicYear) => y.status === 'active' ? <StatusBadge variant="success">نشطة</StatusBadge> : y.status === 'closed' ? <StatusBadge variant="neutral">مغلقة</StatusBadge> : <StatusBadge variant="warning">قيد الإعداد</StatusBadge> },
    { key: 'start', header: 'تاريخ البداية', render: (y: AcademicYear) => <span className="ltr-numbers text-sand-500">{y.startDate}</span> },
    { key: 'end', header: 'تاريخ النهاية', render: (y: AcademicYear) => <span className="ltr-numbers text-sand-500">{y.endDate}</span> },
    { key: 'terms', header: 'الفصول', render: (y: AcademicYear) => db.terms.filter(t => t.academicYearId === y.id).length },
    {
      key: 'actions', header: 'الإجراءات',
      render: (y: AcademicYear) => (
        <div className="flex items-center gap-1">
          <button className="btn-ghost btn-sm" onClick={() => navigate(`/academic-years/${y.id}`)}><Eye size={14} /></button>
          {can('academic.years.manage', membership) && (
            <>
              <button className="btn-ghost btn-sm" title="تعديل"><Pencil size={14} /></button>
              {y.status === 'preparing' && <button className="btn-ghost btn-sm text-emerald-600" title="تفعيل"><Unlock size={14} /></button>}
              {y.status === 'active' && <button className="btn-ghost btn-sm text-red-600" title="إغلاق"><Lock size={14} /></button>}
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="السنوات الدراسية" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الشؤون الأكاديمية' }, { label: 'السنوات الدراسية' }]}
        actions={can('academic.years.manage', membership) && <button className="btn-primary btn-sm"><Plus size={14} /> سنة دراسية جديدة</button>} />
      <div className="card p-0"><DataTable columns={columns} data={years} rowKey={(y) => y.id} onRowClick={(y) => navigate(`/academic-years/${y.id}`)} emptyMessage="لا توجد سنوات دراسية" /></div>
    </div>
  );
}
