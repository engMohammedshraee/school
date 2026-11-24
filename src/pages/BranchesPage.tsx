import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { ConfirmDialog, showToast, SearchInput } from '@/components/ui';
import { useAuth } from '@/services/authContext';
import { db, branchesBySchool, studentsByBranch, teachersByBranch, getSchool } from '@/services/db';
import { can } from '@/services/permissions';
import { Plus, Eye, Pencil, XCircle } from 'lucide-react';
import type { Branch } from '@/types';

export function BranchesPage() {
  const { session, membership } = useAuth();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [closeTarget, setCloseTarget] = useState<Branch | null>(null);
  const [form, setForm] = useState({ name: '', code: '', status: 'active' });

  if (!session || !membership) return null;
  const school = getSchool(session.activeSchoolId);
  const branches = branchesBySchool(session.activeSchoolId);

  const filtered = branches.filter(b => b.name.includes(search) || b.code.includes(search));

  const columns = [
    { key: 'name', header: 'اسم الفرع', render: (b: Branch) => <span className="font-medium text-sand-800">{b.name}</span> },
    { key: 'code', header: 'الكود', render: (b: Branch) => <span className="ltr-numbers text-sand-500">{b.code}</span> },
    { key: 'status', header: 'الحالة', render: (b: Branch) => b.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : b.status === 'inactive' ? <StatusBadge variant="warning">غير نشط</StatusBadge> : <StatusBadge variant="error">مغلق</StatusBadge> },
    { key: 'students', header: 'عدد الطلاب', render: (b: Branch) => studentsByBranch(b.id, session.activeAcademicYearId).length },
    { key: 'teachers', header: 'عدد المعلمين', render: (b: Branch) => teachersByBranch(b.id).length },
    {
      key: 'actions', header: 'الإجراءات',
      render: (b: Branch) => (
        <div className="flex items-center gap-1">
          <button className="btn-ghost btn-sm" title="عرض"><Eye size={14} /></button>
          {can('branches.manage', membership) && (
            <>
              <button className="btn-ghost btn-sm" title="تعديل" onClick={() => { setEditBranch(b); setForm({ name: b.name, code: b.code, status: b.status }); setShowAddModal(true); }}><Pencil size={14} /></button>
              {b.status !== 'closed' && <button className="btn-ghost btn-sm text-red-600" title="إغلاق" onClick={() => setCloseTarget(b)}><XCircle size={14} /></button>}
            </>
          )}
        </div>
      ),
    },
  ];

  function handleSave() {
    if (!form.name || !form.code) { showToast('يرجى ملء جميع الحقول', 'error'); return; }
    if (editBranch) {
      showToast('تم تحديث الفرع بنجاح (محاكاة)', 'success');
    } else {
      showToast('تم إضافة الفرع بنجاح (محاكاة)', 'success');
    }
    setShowAddModal(false);
    setEditBranch(null);
    setForm({ name: '', code: '', status: 'active' });
  }

  return (
    <div>
      <PageHeader
        title="الفروع"
        description={school?.name}
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'إدارة المدرسة' }, { label: 'الفروع' }]}
        actions={can('branches.manage', membership) && <button className="btn-primary btn-sm" onClick={() => { setEditBranch(null); setForm({ name: '', code: '', status: 'active' }); setShowAddModal(true); }}><Plus size={14} /> إضافة فرع</button>}
      />

      <div className="card p-0">
        <div className="p-4 border-b border-sand-100">
          <div className="max-w-xs"><SearchInput value={search} onChange={setSearch} placeholder="بحث باسم الفرع أو الكود..." /></div>
        </div>
        <DataTable columns={columns} data={filtered} rowKey={(b) => b.id} emptyMessage="لا توجد فروع" />
      </div>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title={editBranch ? 'تعديل فرع' : 'إضافة فرع جديد'}
        footer={<><button className="btn-secondary" onClick={() => setShowAddModal(false)}>إلغاء</button><button className="btn-primary" onClick={handleSave}>حفظ</button></>}>
        <div className="space-y-4">
          <div><label className="label">اسم الفرع</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="الفرع الرئيسي" /></div>
          <div><label className="label">الكود</label><input className="input ltr-numbers" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="RYD-MAIN" dir="ltr" /></div>
          <div>
            <label className="label">الحالة</label>
            <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="closed">مغلق</option>
            </select>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!closeTarget}
        onClose={() => setCloseTarget(null)}
        onConfirm={() => { showToast('تم إغلاق الفرع (محاكاة)', 'success'); }}
        title="إغلاق الفرع؟"
        message={`هل أنت متأكد من إغلاق فرع "${closeTarget?.name}"؟ سيبقى السجل التاريخي محفوظًا، لكن الفرع لن يكون متاحًا للعمليات الجديدة.`}
        confirmLabel="إغلاق الفرع"
        destructive
      />
    </div>
  );
}
