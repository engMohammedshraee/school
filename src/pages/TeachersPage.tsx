import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { UserAvatar, SearchInput } from '@/components/ui';
import { useAuth } from '@/services/authContext';
import { db, teachersBySchool, getUser, getSchool, branchAssignmentsByTeacher } from '@/services/db';
import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

export function TeachersPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  if (!session) return null;

  let teachers = teachersBySchool(session.activeSchoolId).map(t => {
    const user = getUser(t.userId);
    const branchAssignments = branchAssignmentsByTeacher(t.id).filter(ba => ba.status === 'active');
    const branches = branchAssignments.map(ba => db.branches.find(b => b.id === ba.branchId)).filter(Boolean);
    return { teacher: t, user, branches };
  }).filter(t => t.user !== undefined);

  if (debouncedSearch) {
    teachers = teachers.filter(t => t.user!.name.includes(debouncedSearch) || t.teacher.employeeNumber.includes(debouncedSearch));
  }

  const columns = [
    { key: 'name', header: 'المعلم', render: (t: typeof teachers[0]) => <div className="flex items-center gap-2"><UserAvatar name={t.user!.name} color={t.user!.avatarColor} size={32} /><span className="font-medium text-sand-800">{t.user!.name}</span></div> },
    { key: 'employeeNumber', header: 'الرقم الوظيفي', render: (t: typeof teachers[0]) => <span className="ltr-numbers text-sand-500">{t.teacher.employeeNumber}</span> },
    { key: 'school', header: 'المدرسة', render: () => <span className="text-sand-600 text-sm">{getSchool(session.activeSchoolId)?.name}</span> },
    { key: 'branches', header: 'الفروع', render: (t: typeof teachers[0]) => <span className="text-sand-600 text-xs">{t.branches.map(b => b!.name).join('، ') || '—'}</span> },
    { key: 'specialization', header: 'التخصص', render: (t: typeof teachers[0]) => <span className="text-sand-600 text-sm">{t.teacher.specialization}</span> },
    { key: 'status', header: 'الحالة', render: (t: typeof teachers[0]) => t.teacher.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : <StatusBadge variant="neutral">غير نشط</StatusBadge> },
    { key: 'actions', header: 'الإجراءات', render: (t: typeof teachers[0]) => <button className="btn-ghost btn-sm" onClick={() => navigate(`/teachers/${t.teacher.id}`)}><Eye size={14} /></button> },
  ];

  return (
    <div>
      <PageHeader title="قائمة المعلمين" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'المعلمون' }, { label: 'قائمة المعلمين' }]} />
      <div className="card p-0">
        <div className="p-4 border-b border-sand-100"><div className="max-w-xs"><SearchInput value={search} onChange={setSearch} placeholder="بحث بالاسم أو الرقم الوظيفي..." /></div></div>
        <DataTable columns={columns} data={teachers} rowKey={(t) => t.teacher.id} onRowClick={(t) => navigate(`/teachers/${t.teacher.id}`)} emptyMessage="لا يوجد معلمون" />
      </div>
    </div>
  );
}
