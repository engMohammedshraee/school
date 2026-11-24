import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/services/authContext';
import { db, sectionsBySchool, getBranch, getGrade, getAcademicYear, getUser, getTeacher, studentsBySection } from '@/services/db';
import { can } from '@/services/permissions';
import { Eye, Plus } from 'lucide-react';
import type { Section } from '@/types';

export function SectionsPage() {
  const { session, membership } = useAuth();
  const navigate = useNavigate();
  if (!session || !membership) return null;

  const sections = sectionsBySchool(session.activeSchoolId).filter(s => s.academicYearId === session.activeAcademicYearId);

  const columns = [
    { key: 'name', header: 'الشعبة', render: (s: Section) => <span className="font-medium text-sand-800">شعبة {s.name}</span> },
    { key: 'grade', header: 'الصف', render: (s: Section) => <span className="text-sand-600">{getGrade(s.gradeId)?.name ?? '—'}</span> },
    { key: 'year', header: 'السنة الدراسية', render: (s: Section) => <span className="ltr-numbers text-sand-500">{getAcademicYear(s.academicYearId)?.label ?? '—'}</span> },
    { key: 'branch', header: 'الفرع', render: (s: Section) => <span className="text-sand-600 text-sm">{getBranch(s.branchId)?.name ?? '—'}</span> },
    { key: 'supervisor', header: 'المشرف', render: (s: Section) => { const sup = s.supervisorHistory.find(h => h.endDate === null); const teacher = sup ? getTeacher(sup.teacherId) : null; const user = teacher ? getUser(teacher.userId) : null; return <span className="text-sand-600 text-sm">{user?.name ?? '—'}</span>; } },
    { key: 'students', header: 'عدد الطلاب', render: (s: Section) => <span className="ltr-numbers">{studentsBySection(s.id).length}</span> },
    { key: 'status', header: 'الحالة', render: (s: Section) => s.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : <StatusBadge variant="neutral">غير نشط</StatusBadge> },
    { key: 'actions', header: 'الإجراءات', render: (s: Section) => <button className="btn-ghost btn-sm" onClick={() => navigate(`/sections/${s.id}`)}><Eye size={14} /></button> },
  ];

  return (
    <div>
      <PageHeader title="الشعب" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الشؤون الأكاديمية' }, { label: 'الشعب' }]}
        actions={can('sections.manage', membership) && <button className="btn-primary btn-sm"><Plus size={14} /> شعبة جديدة</button>} />
      <div className="card p-0"><DataTable columns={columns} data={sections} rowKey={(s) => s.id} onRowClick={(s) => navigate(`/sections/${s.id}`)} emptyMessage="لا توجد شعب" /></div>
    </div>
  );
}
