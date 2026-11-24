import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { SearchInput } from '@/components/ui';
import { db, getSchool, membershipsByUser } from '@/services/db';
import { UserAvatar } from '@/components/ui';
import type { User } from '@/types';

export function PlatformUsersPage() {
  const [search, setSearch] = useState('');
  const users = db.users;
  const filtered = users.filter(u => u.name.includes(search) || u.nationalId.includes(search));

  const columns = [
    {
      key: 'name', header: 'المستخدم',
      render: (u: User) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={u.name} color={u.avatarColor} size={32} />
          <div>
            <div className="font-medium text-sand-800">{u.name}</div>
            <div className="text-xs text-sand-400 ltr-numbers">{u.nationalId}</div>
          </div>
        </div>
      ),
    },
    { key: 'email', header: 'البريد', render: (u: User) => <span className="ltr-numbers text-sand-500 text-sm">{u.email ?? '—'}</span> },
    { key: 'phone', header: 'الهاتف', render: (u: User) => <span className="ltr-numbers text-sand-500 text-sm">{u.phone ?? '—'}</span> },
    {
      key: 'schools', header: 'المدارس',
      render: (u: User) => {
        const mems = membershipsByUser(u.id);
        const schools = mems.map(m => getSchool(m.schoolId)?.name).filter(Boolean);
        return <span className="text-sand-600 text-sm">{schools.join('، ') || '—'}</span>;
      },
    },
    {
      key: 'status', header: 'الحالة',
      render: (u: User) => u.loginEnabled
        ? <span className="text-green-600 text-sm">مفعّل</span>
        : <span className="text-sand-400 text-sm">غير مفعّل</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="مستخدمو المنصة"
        description="جميع المستخدمين عبر المدارس"
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'المنصة' }, { label: 'المستخدمون' }]}
      />
      <div className="card p-0">
        <div className="p-4 border-b border-sand-100">
          <div className="max-w-xs"><SearchInput value={search} onChange={setSearch} placeholder="بحث بالاسم أو رقم الهوية..." /></div>
        </div>
        <DataTable columns={columns} data={filtered} rowKey={(u) => u.id} emptyMessage="لا يوجد مستخدمون" />
      </div>
    </div>
  );
}
