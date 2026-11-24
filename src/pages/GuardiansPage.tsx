import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { UserAvatar, SearchInput, Pagination } from '@/components/ui';
import { useAuth } from '@/services/authContext';
import { db, getSchool, getUser } from '@/services/db';
import { maskNationalId } from '@/services/userService';
import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

export function GuardiansPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  if (!session) return null;

  let guardians = db.guardians.map(g => {
    const user = getUser(g.userId);
    const links = db.guardianLinks.filter(l => l.guardianId === g.id);
    return { guardian: g, user, childCount: links.length };
  }).filter(g => g.user !== undefined);

  if (debouncedSearch) {
    guardians = guardians.filter(g => g.user!.name.includes(debouncedSearch) || g.user!.nationalId.includes(debouncedSearch));
  }

  const totalPages = Math.ceil(guardians.length / pageSize);
  const paged = guardians.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: 'name', header: 'ولي الأمر', render: (g: typeof guardians[0]) => <div className="flex items-center gap-2"><UserAvatar name={g.user!.name} color={g.user!.avatarColor} size={32} /><span className="font-medium text-sand-800">{g.user!.name}</span></div> },
    { key: 'nationalId', header: 'رقم الهوية', render: (g: typeof guardians[0]) => <span className="ltr-numbers text-sand-500">{maskNationalId(g.user!.nationalId)}</span> },
    { key: 'phone', header: 'الهاتف', render: (g: typeof guardians[0]) => <span className="ltr-numbers text-sand-600">{g.guardian.phone}</span> },
    { key: 'children', header: 'عدد الأبناء', render: (g: typeof guardians[0]) => <span className="ltr-numbers">{g.childCount}</span> },
    { key: 'actions', header: 'الإجراءات', render: (g: typeof guardians[0]) => <button className="btn-ghost btn-sm" onClick={() => navigate(`/guardians/${g.guardian.id}`)}><Eye size={14} /></button> },
  ];

  return (
    <div>
      <PageHeader title="أولياء الأمور" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الطلاب' }, { label: 'أولياء الأمور' }]} />
      <div className="card p-0">
        <div className="p-4 border-b border-sand-100"><div className="max-w-xs"><SearchInput value={search} onChange={setSearch} placeholder="بحث بالاسم أو رقم الهوية..." /></div></div>
        <DataTable columns={columns} data={paged} rowKey={(g) => g.guardian.id} onRowClick={(g) => navigate(`/guardians/${g.guardian.id}`)} emptyMessage="لا يوجد أولياء أمور" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
