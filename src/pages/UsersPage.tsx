import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { UserAvatar, SearchInput, Pagination } from '@/components/ui';
import { useAuth } from '@/services/authContext';
import { db, membershipsBySchool, getSchool, getUser } from '@/services/db';
import { maskNationalId } from '@/services/userService';
import { can } from '@/services/permissions';
import { Eye, UserPlus } from 'lucide-react';

export function UsersPage() {
  const { session, membership } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  if (!session || !membership) return null;
  const school = getSchool(session.activeSchoolId);

  const schoolMemberships = membershipsBySchool(session.activeSchoolId);
  const userIds = [...new Set(schoolMemberships.map(m => m.userId))];

  let users = userIds.map(uid => {
    const user = getUser(uid);
    const userMemberships = db.memberships.filter(m => m.userId === uid);
    const schoolMems = userMemberships.filter(m => m.schoolId === session.activeSchoolId);
    const roles = schoolMems.map(m => db.roles.find(r => r.id === m.roleId)?.name).filter(Boolean);
    const status = schoolMems.some(m => m.status === 'active') ? 'active' : 'inactive';
    return { user, schools: userMemberships.map(m => getSchool(m.schoolId)?.name).filter(Boolean), roles, status, loginEnabled: user?.loginEnabled ?? false };
  }).filter(u => u.user !== undefined);

  if (debouncedSearch) {
    users = users.filter(u => u.user!.name.includes(debouncedSearch) || u.user!.nationalId.includes(debouncedSearch));
  }
  if (statusFilter) users = users.filter(u => u.status === statusFilter);
  if (roleFilter) users = users.filter(u => u.roles.some(r => r.includes(roleFilter)));

  const totalPages = Math.ceil(users.length / pageSize);
  const paged = users.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: 'name', header: 'الاسم', render: (u: typeof users[0]) => <div className="flex items-center gap-2"><UserAvatar name={u.user!.name} color={u.user!.avatarColor} size={32} /><span className="font-medium text-sand-800">{u.user!.name}</span></div> },
    { key: 'nationalId', header: 'رقم الهوية', render: (u: typeof users[0]) => <span className="ltr-numbers text-sand-500">{maskNationalId(u.user!.nationalId)}</span> },
    { key: 'schools', header: 'المدارس', render: (u: typeof users[0]) => <span className="text-sand-600 text-xs">{u.schools.join('، ')}</span> },
    { key: 'status', header: 'حالة الحساب', render: (u: typeof users[0]) => u.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : <StatusBadge variant="error">موقوف</StatusBadge> },
    { key: 'login', header: 'الدخول', render: (u: typeof users[0]) => u.loginEnabled ? <StatusBadge variant="info">مفعّل</StatusBadge> : <StatusBadge variant="neutral">غير مفعّل</StatusBadge> },
    { key: 'roles', header: 'الأدوار', render: (u: typeof users[0]) => <div className="flex gap-1 flex-wrap">{u.roles.map((r, i) => <span key={i} className="badge-neutral text-[10px]">{r}</span>)}</div> },
    { key: 'actions', header: 'الإجراءات', render: (u: typeof users[0]) => <button className="btn-ghost btn-sm" onClick={() => navigate(`/users/${u.user!.id}`)}><Eye size={14} /></button> },
  ];

  return (
    <div>
      <PageHeader
        title="المستخدمون"
        description={school?.name}
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'إدارة المدرسة' }, { label: 'المستخدمون' }]}
        actions={can('users.manage', membership) && <button className="btn-primary btn-sm" onClick={() => navigate('/users/new')}><UserPlus size={14} /> مستخدم جديد</button>}
      />

      <div className="card p-0">
        <div className="p-4 border-b border-sand-100 flex flex-wrap gap-3 items-center">
          <div className="max-w-xs flex-1"><SearchInput value={search} onChange={setSearch} placeholder="بحث بالاسم أو رقم الهوية..." /></div>
          <select className="select max-w-[150px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">موقوف</option>
          </select>
          <select className="select max-w-[150px]" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">كل الأدوار</option>
            <option value="مدير">مدير</option>
            <option value="معلم">معلم</option>
            <option value="شؤون">شؤون</option>
            <option value="محاسب">محاسب</option>
          </select>
        </div>
        <DataTable columns={columns} data={paged} rowKey={(u) => u.user!.id} onRowClick={(u) => navigate(`/users/${u.user!.id}`)} emptyMessage="لا يوجد مستخدمون" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
