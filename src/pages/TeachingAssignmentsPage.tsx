import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/services/authContext';
import { db, getTeacher, getUser, getBranch, getGrade, getSection, getSubject, getAcademicYear, getTerm } from '@/services/db';
import { Plus } from 'lucide-react';
import type { TeachingAssignment } from '@/types';

export function TeachingAssignmentsPage() {
  const { session, membership } = useAuth();
  if (!session) return null;

  const assignments = db.teachingAssignments.filter(a => a.academicYearId === session.activeAcademicYearId);

  const columns = [
    { key: 'teacher', header: 'المعلم', render: (a: TeachingAssignment) => { const t = getTeacher(a.teacherId); const u = t ? getUser(t.userId) : null; return <span className="font-medium text-sand-800">{u?.name ?? '—'}</span>; } },
    { key: 'branch', header: 'الفرع', render: (a: TeachingAssignment) => <span className="text-sand-600 text-sm">{getBranch(a.branchId)?.name ?? '—'}</span> },
    { key: 'subject', header: 'المادة', render: (a: TeachingAssignment) => <span className="text-sand-600">{getSubject(a.subjectId)?.name ?? '—'}</span> },
    { key: 'grade', header: 'الصف', render: (a: TeachingAssignment) => <span className="text-sand-600">{getGrade(a.gradeId)?.name ?? '—'}</span> },
    { key: 'section', header: 'الشعبة', render: (a: TeachingAssignment) => <span className="text-sand-600">{getSection(a.sectionId)?.name ?? '—'}</span> },
    { key: 'term', header: 'الفصل', render: (a: TeachingAssignment) => <span className="text-sand-600 text-sm">{getTerm(a.termId)?.name ?? '—'}</span> },
    { key: 'status', header: 'الحالة', render: (a: TeachingAssignment) => a.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : <StatusBadge variant="neutral">منتهي</StatusBadge> },
  ];

  return (
    <div>
      <PageHeader title="التكليفات التدريسية" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'المعلمون' }, { label: 'التكليفات التدريسية' }]}
        actions={membership && <button className="btn-primary btn-sm"><Plus size={14} /> تكليف جديد</button>} />
      <div className="card p-0"><DataTable columns={columns} data={assignments} rowKey={(a) => a.id} emptyMessage="لا توجد تكليفات" /></div>
    </div>
  );
}
