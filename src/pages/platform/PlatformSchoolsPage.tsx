import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { SearchInput, showToast } from '@/components/ui';
import { db, branchesBySchool } from '@/services/db';
import { Plus, Eye, Building2 } from 'lucide-react';
import type { School } from '@/types';

export function PlatformSchoolsPage() {
  const [search, setSearch] = useState('');
  const schools = db.schools;
  const filtered = schools.filter(s => s.name.includes(search) || s.code.includes(search));

  const columns = [
    {
      key: 'name', header: 'اسم المدرسة',
      render: (s: School) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: s.logoColor }}>
            <Building2 size={16} />
          </div>
          <div>
            <div className="font-medium text-sand-800">{s.name}</div>
            <div className="text-xs text-sand-400">{s.code}</div>
          </div>
        </div>
      ),
    },
    { key: 'branches', header: 'الفروع', render: (s: School) => branchesBySchool(s.id).length },
    {
      key: 'status', header: 'الحالة',
      render: (s: School) => s.status === 'active'
        ? <StatusBadge variant="success">نشط</StatusBadge>
        : <StatusBadge variant="error">موقوف</StatusBadge>,
    },
    {
      key: 'createdAt', header: 'تاريخ الإنشاء',
      render: (s: School) => <span className="ltr-numbers text-sand-400 text-sm">{s.createdAt}</span>,
    },
    {
      key: 'actions', header: 'الإجراءات',
      render: (_s: School) => (
        <div className="flex items-center gap-1">
          <button className="btn-ghost btn-sm" title="عرض"><Eye size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="المدارس"
        description="إدارة جميع المدارس على المنصة"
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'المنصة' }, { label: 'المدارس' }]}
        actions={<button className="btn-primary btn-sm" onClick={() => showToast('إضافة مدرسة جديدة (محاكاة)', 'info')}><Plus size={14} /> إضافة مدرسة</button>}
      />
      <div className="card p-0">
        <div className="p-4 border-b border-sand-100">
          <div className="max-w-xs"><SearchInput value={search} onChange={setSearch} placeholder="بحث باسم المدرسة أو الكود..." /></div>
        </div>
        <DataTable columns={columns} data={filtered} rowKey={(s) => s.id} emptyMessage="لا توجد مدارس" />
      </div>
    </div>
  );
}
