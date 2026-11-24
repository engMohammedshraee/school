import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { SearchInput, Pagination } from '@/components/ui';
import { useAuth } from '@/services/authContext';
import { db, getUser, getSchool, getBranch, auditLogsBySchool } from '@/services/db';
import { ScrollText } from 'lucide-react';
import type { AuditLog } from '@/types';

export function AuditLogPage() {
  const { session } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  if (!session) return null;

  let logs = auditLogsBySchool(session.activeSchoolId);

  if (search) {
    logs = logs.filter(l => {
      const user = getUser(l.userId);
      return user?.name.includes(search) || l.action.includes(search);
    });
  }

  const totalPages = Math.ceil(logs.length / pageSize);
  const paged = logs.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: 'user', header: 'المستخدم', render: (l: AuditLog) => <span className="font-medium text-sand-800">{getUser(l.userId)?.name ?? '—'}</span> },
    { key: 'action', header: 'العملية', render: (l: AuditLog) => <span className="text-sand-700">{l.action}</span> },
    { key: 'school', header: 'المدرسة', render: (l: AuditLog) => <span className="text-sand-500 text-sm">{l.schoolId ? getSchool(l.schoolId)?.name : '—'}</span> },
    { key: 'branch', header: 'الفرع', render: (l: AuditLog) => <span className="text-sand-500 text-sm">{l.branchId ? getBranch(l.branchId)?.name : '—'}</span> },
    { key: 'resource', header: 'المورد', render: (l: AuditLog) => <span className="ltr-numbers text-sand-400 text-xs">{l.resource}</span> },
    { key: 'time', header: 'الوقت', render: (l: AuditLog) => <span className="ltr-numbers text-sand-400 text-xs">{new Date(l.timestamp).toLocaleString('ar-SA')}</span> },
  ];

  return (
    <div>
      <PageHeader title="سجل التدقيق" description="سجل غير قابل للتعديل لجميع العمليات في النظام" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الإدارة' }, { label: 'سجل التدقيق' }]} />
      <div className="card p-0">
        <div className="p-4 border-b border-sand-100 flex items-center gap-3">
          <div className="max-w-xs flex-1"><SearchInput value={search} onChange={setSearch} placeholder="بحث بالاسم أو نوع العملية..." /></div>
          <div className="flex items-center gap-2 text-xs text-sand-400"><ScrollText size={14} /> سجل غير قابل للتعديل</div>
        </div>
        <DataTable columns={columns} data={paged} rowKey={(l) => l.id} emptyMessage="لا يوجد سجل" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
