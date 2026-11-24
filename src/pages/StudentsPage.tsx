import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { UserAvatar, SearchInput, Pagination } from '@/components/ui';
import { useAuth } from '@/services/authContext';
import { db, studentsBySchool, getBranch, getGrade, getSection, getUser, activeEnrollment, documentsByStudent, getAcademicYear } from '@/services/db';
import { maskNationalId } from '@/services/userService';
import { can } from '@/services/permissions';
import { Eye, UserPlus } from 'lucide-react';

export function StudentsPage() {
  const { session, membership } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  if (!session || !membership) return null;

  const allStudents = studentsBySchool(session.activeSchoolId, session.activeAcademicYearId);

  let students = allStudents.map(s => {
    const user = getUser(s.userId);
    const enr = activeEnrollment(s.id, session.activeAcademicYearId);
    const branch = enr ? getBranch(enr.branchId) : null;
    const grade = enr ? getGrade(enr.gradeId) : null;
    const section = enr?.sectionId ? getSection(enr.sectionId) : null;
    const docs = documentsByStudent(s.id);
    const docsComplete = docs.every(d => d.status === 'accepted' || d.status === 'received') && docs.length > 0;
    return { student: s, user, branch, grade, section, docsComplete };
  }).filter(s => s.user !== undefined);

  if (debouncedSearch) {
    students = students.filter(s => s.user!.name.includes(debouncedSearch) || s.student.studentNumber.includes(debouncedSearch) || s.user!.nationalId.includes(debouncedSearch));
  }
  if (branchFilter) students = students.filter(s => s.branch?.id === branchFilter);
  if (gradeFilter) students = students.filter(s => s.grade?.id === gradeFilter);

  const totalPages = Math.ceil(students.length / pageSize);
  const paged = students.slice((page - 1) * pageSize, page * pageSize);

  const branches = db.branches.filter(b => b.schoolId === session.activeSchoolId);
  const grades = db.grades.filter(g => g.schoolId === session.activeSchoolId);

  const columns = [
    { key: 'name', header: 'الطالب', render: (s: typeof students[0]) => <div className="flex items-center gap-2"><UserAvatar name={s.user!.name} color={s.user!.avatarColor} size={32} /><span className="font-medium text-sand-800">{s.user!.name}</span></div> },
    { key: 'number', header: 'رقم الطالب', render: (s: typeof students[0]) => <span className="ltr-numbers text-sand-500">{s.student.studentNumber}</span> },
    { key: 'branch', header: 'الفرع', render: (s: typeof students[0]) => <span className="text-sand-600 text-sm">{s.branch?.name ?? '—'}</span> },
    { key: 'grade', header: 'الصف', render: (s: typeof students[0]) => <span className="text-sand-600 text-sm">{s.grade?.name ?? '—'}</span> },
    { key: 'section', header: 'الشعبة', render: (s: typeof students[0]) => <span className="text-sand-600 text-sm">{s.section?.name ?? '—'}</span> },
    { key: 'status', header: 'حالة التسجيل', render: () => <StatusBadge variant="success">نشط</StatusBadge> },
    { key: 'docs', header: 'الوثائق', render: (s: typeof students[0]) => s.docsComplete ? <StatusBadge variant="success">مكتملة</StatusBadge> : <StatusBadge variant="warning">غير مكتملة</StatusBadge> },
    { key: 'actions', header: 'الإجراءات', render: (s: typeof students[0]) => <button className="btn-ghost btn-sm" onClick={() => navigate(`/students/${s.student.id}`)}><Eye size={14} /></button> },
  ];

  return (
    <div>
      <PageHeader
        title="قائمة الطلاب"
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الطلاب' }, { label: 'قائمة الطلاب' }]}
        actions={can('students.create', membership) && <button className="btn-primary btn-sm" onClick={() => navigate('/students/new')}><UserPlus size={14} /> تسجيل طالب</button>}
      />

      <div className="card p-0">
        <div className="p-4 border-b border-sand-100 flex flex-wrap gap-3">
          <div className="max-w-xs flex-1"><SearchInput value={search} onChange={setSearch} placeholder="بحث بالاسم أو رقم الطالب..." /></div>
          <select className="select max-w-[150px]" value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
            <option value="">كل الفروع</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select className="select max-w-[150px]" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
            <option value="">كل الصفوف</option>
            {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <DataTable columns={columns} data={paged} rowKey={(s) => s.student.id} onRowClick={(s) => navigate(`/students/${s.student.id}`)} emptyMessage="لا يوجد طلاب" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
