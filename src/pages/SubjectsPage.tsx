import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/services/authContext';
import { subjectsBySchool, getStage } from '@/services/db';
import { Plus } from 'lucide-react';
import type { Subject } from '@/types';

export function SubjectsPage() {
  const { session, membership } = useAuth();
  if (!session) return null;
  const subjects = subjectsBySchool(session.activeSchoolId);

  const columns = [
    { key: 'name', header: 'المادة', render: (s: Subject) => <span className="font-medium text-sand-800">{s.name}</span> },
    { key: 'code', header: 'الكود', render: (s: Subject) => <span className="ltr-numbers text-sand-500">{s.code}</span> },
    { key: 'stages', header: 'المراحل / الصفوف', render: (s: Subject) => <span className="text-sand-600 text-sm">{s.stageIds.map(sid => getStage(sid)?.name).join('، ')}</span> },
    { key: 'status', header: 'الحالة', render: (s: Subject) => s.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : <StatusBadge variant="neutral">غير نشط</StatusBadge> },
  ];

  return (
    <div>
      <PageHeader title="المواد" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الشؤون الأكاديمية' }, { label: 'المواد' }]}
        actions={membership && <button className="btn-primary btn-sm"><Plus size={14} /> مادة جديدة</button>} />
      <div className="card p-0"><DataTable columns={columns} data={subjects} rowKey={(s) => s.id} emptyMessage="لا توجد مواد" /></div>
    </div>
  );
}
