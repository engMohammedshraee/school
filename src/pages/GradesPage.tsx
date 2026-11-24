import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { useAuth } from '@/services/authContext';
import { gradesBySchool, getStage } from '@/services/db';
import { Plus } from 'lucide-react';

export function GradesPage() {
  const { session, membership } = useAuth();
  if (!session) return null;
  const grades = gradesBySchool(session.activeSchoolId);

  const columns = [
    { key: 'name', header: 'الصف', render: (g: typeof grades[0]) => <span className="font-medium text-sand-800">{g.name}</span> },
    { key: 'stage', header: 'المرحلة', render: (g: typeof grades[0]) => <span className="text-sand-600">{getStage(g.stageId)?.name ?? '—'}</span> },
    { key: 'sequence', header: 'الترتيب', render: (g: typeof grades[0]) => <span className="ltr-numbers text-sand-500">{g.sequence}</span> },
  ];

  return (
    <div>
      <PageHeader title="الصفوف" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الشؤون الأكاديمية' }, { label: 'الصفوف' }]}
        actions={membership && <button className="btn-primary btn-sm"><Plus size={14} /> صف جديد</button>} />
      <div className="card p-0"><DataTable columns={columns} data={grades} rowKey={(g) => g.id} emptyMessage="لا توجد صفوف" /></div>
    </div>
  );
}
