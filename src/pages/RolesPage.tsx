import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/services/authContext';
import { db } from '@/services/db';
import { can } from '@/services/permissions';
import { Eye, Pencil, Plus } from 'lucide-react';
import type { Role } from '@/types';

export function RolesPage() {
  const { membership } = useAuth();
  const navigate = useNavigate();
  if (!membership) return null;

  const columns = [
    { key: 'name', header: 'الدور', render: (r: Role) => <span className="font-medium text-sand-800">{r.name}</span> },
    { key: 'scope', header: 'النطاق', render: (r: Role) => <span className="text-sand-600">{r.scope === 'school' ? 'على مستوى المدرسة' : r.scope === 'branch' ? 'فرع / عدة فروع' : 'على مستوى المنصة'}</span> },
    { key: 'userCount', header: 'عدد المستخدمين', render: (r: Role) => <span className="ltr-numbers">{r.userCount}</span> },
    { key: 'permissions', header: 'عدد الصلاحيات', render: (r: Role) => <span className="ltr-numbers">{r.permissions.length}</span> },
    { key: 'status', header: 'الحالة', render: (r: Role) => r.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : <StatusBadge variant="neutral">غير نشط</StatusBadge> },
    {
      key: 'actions', header: 'الإجراءات',
      render: (r: Role) => (
        <div className="flex items-center gap-1">
          <button className="btn-ghost btn-sm" onClick={() => navigate(`/roles/${r.id}`)}><Eye size={14} /></button>
          {can('roles.manage', membership) && <button className="btn-ghost btn-sm" onClick={() => navigate(`/roles/${r.id}`)}><Pencil size={14} /></button>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="الأدوار والصلاحيات"
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'إدارة المدرسة' }, { label: 'الأدوار والصلاحيات' }]}
        actions={can('roles.manage', membership) && <button className="btn-primary btn-sm"><Plus size={14} /> دور جديد</button>}
      />
      <div className="card p-0">
        <DataTable columns={columns} data={db.roles} rowKey={(r) => r.id} onRowClick={(r) => navigate(`/roles/${r.id}`)} emptyMessage="لا توجد أدوار" />
      </div>
    </div>
  );
}
