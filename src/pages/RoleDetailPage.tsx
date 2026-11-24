import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { db, getRole } from '@/services/db';
import { showToast } from '@/components/ui';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import type { Permission } from '@/types';

const permissionGroups: { domain: string; label: string; permissions: { key: Permission; label: string }[] }[] = [
  { domain: 'students', label: 'الطلاب', permissions: [
    { key: 'students.view', label: 'عرض الطلاب' }, { key: 'students.create', label: 'إضافة طالب' },
    { key: 'students.edit', label: 'تعديل طالب' }, { key: 'students.delete', label: 'حذف طالب' },
    { key: 'students.transfer', label: 'تحويل طالب' },
  ]},
  { domain: 'teachers', label: 'المعلمون', permissions: [
    { key: 'teachers.view', label: 'عرض المعلمين' }, { key: 'teachers.manage', label: 'إدارة المعلمين' },
  ]},
  { domain: 'branches', label: 'الفروع', permissions: [
    { key: 'branches.view', label: 'عرض الفروع' }, { key: 'branches.manage', label: 'إدارة الفروع' },
  ]},
  { domain: 'academic', label: 'الشؤون الأكاديمية', permissions: [
    { key: 'academic.years.view', label: 'عرض السنوات' }, { key: 'academic.years.manage', label: 'إدارة السنوات' },
    { key: 'sections.view', label: 'عرض الشعب' }, { key: 'sections.manage', label: 'إدارة الشعب' },
    { key: 'subjects.view', label: 'عرض المواد' }, { key: 'subjects.manage', label: 'إدارة المواد' },
  ]},
  { domain: 'attendance', label: 'الحضور والجدول', permissions: [
    { key: 'attendance.view', label: 'عرض الحضور' }, { key: 'attendance.manage', label: 'تسجيل الحضور' },
    { key: 'timetable.view', label: 'عرض الجدول' }, { key: 'timetable.manage', label: 'إدارة الجدول' },
  ]},
  { domain: 'documents', label: 'الوثائق', permissions: [
    { key: 'documents.view', label: 'عرض الوثائق' }, { key: 'documents.manage', label: 'إدارة الوثائق' },
  ]},
];

export function RoleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const role = id ? getRole(id) : undefined;
  const [permissions, setPermissions] = useState<Permission[]>(role?.permissions ?? []);

  if (!role) return <div>الدور غير موجود</div>;

  function togglePermission(perm: Permission) {
    setPermissions(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);
  }

  return (
    <div>
      <PageHeader
        title={role.name}
        description={`النطاق: ${role.scope === 'school' ? 'على مستوى المدرسة' : role.scope === 'branch' ? 'فرع / عدة فروع' : 'على مستوى المنصة'} · ${permissions.length} صلاحية`}
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'إدارة المدرسة' }, { label: 'الأدوار' }, { label: role.name }]}
        actions={
          <>
            <button className="btn-secondary btn-sm" onClick={() => navigate('/roles')}><ArrowRight size={14} /> رجوع</button>
            <button className="btn-primary btn-sm" onClick={() => showToast('تم حفظ الصلاحيات (محاكاة)', 'success')}>حفظ التغييرات</button>
          </>
        }
      />

      <div className="card p-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center"><ShieldCheck size={24} className="text-brand-600" /></div>
          <div>
            <h2 className="text-base font-semibold text-sand-900">{role.name}</h2>
            <p className="text-sm text-sand-400">{role.userCount} مستخدم · {role.status === 'active' ? 'نشط' : 'غير نشط'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {permissionGroups.map(group => (
          <div key={group.domain} className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-4">{group.label}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.permissions.map(p => {
                const checked = permissions.includes(p.key);
                return (
                  <label key={p.key} className="flex items-center gap-3 p-3 rounded-lg border border-sand-200 cursor-pointer hover:bg-sand-50">
                    <input type="checkbox" checked={checked} onChange={() => togglePermission(p.key)} className="w-4 h-4 rounded accent-brand-600" />
                    <span className="text-sm text-sand-700">{p.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
