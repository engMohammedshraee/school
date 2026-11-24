import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { UserAvatar, Tabs } from '@/components/ui';
import { useState } from 'react';
import { db, getUser, getSchool, membershipsByUser, getMembership, getRole } from '@/services/db';
import { maskNationalId } from '@/services/userService';
import { ArrowRight } from 'lucide-react';

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const user = id ? getUser(id) : undefined;
  if (!user) return <div>المستخدم غير موجود</div>;

  const userMemberships = membershipsByUser(user.id);

  return (
    <div>
      <PageHeader
        title={user.name}
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'إدارة المدرسة' }, { label: 'المستخدمون' }, { label: user.name }]}
        actions={<button className="btn-secondary btn-sm" onClick={() => navigate('/users')}><ArrowRight size={14} /> رجوع</button>}
      />

      <div className="card p-5 mb-6">
        <div className="flex items-center gap-4">
          <UserAvatar name={user.name} color={user.avatarColor} size={64} />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-sand-900">{user.name}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3 text-sm">
              <div><p className="text-xs text-sand-400">رقم الهوية</p><p className="ltr-numbers text-sand-700">{maskNationalId(user.nationalId)}</p></div>
              <div><p className="text-xs text-sand-400">البريد</p><p className="text-sand-700">{user.email ?? '—'}</p></div>
              <div><p className="text-xs text-sand-400">الهاتف</p><p className="ltr-numbers text-sand-700">{user.phone ?? '—'}</p></div>
              <div><p className="text-xs text-sand-400">الدخول</p>{user.loginEnabled ? <StatusBadge variant="success">مفعّل</StatusBadge> : <StatusBadge variant="neutral">غير مفعّل</StatusBadge>}</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs
        tabs={[{ key: 'overview', label: 'نظرة عامة' }, { key: 'memberships', label: 'عضويات المدرسة' }, { key: 'identity', label: 'الهوية' }]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-4">
        {activeTab === 'overview' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-4">معلومات المستخدم</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-sand-400 mb-1">الاسم الكامل</p><p className="text-sand-700">{user.name}</p></div>
              <div><p className="text-xs text-sand-400 mb-1">رقم الهوية الوطنية</p><p className="ltr-numbers text-sand-700">{maskNationalId(user.nationalId)}</p></div>
              <div><p className="text-xs text-sand-400 mb-1">البريد الإلكتروني</p><p className="text-sand-700">{user.email ?? '—'}</p></div>
              <div><p className="text-xs text-sand-400 mb-1">الهاتف</p><p className="ltr-numbers text-sand-700">{user.phone ?? '—'}</p></div>
              <div><p className="text-xs text-sand-400 mb-1">تاريخ الميلاد</p><p className="ltr-numbers text-sand-700">{user.birthDate ?? '—'}</p></div>
              <div><p className="text-xs text-sand-400 mb-1">حالة الدخول</p>{user.loginEnabled ? <StatusBadge variant="success">مفعّل</StatusBadge> : <StatusBadge variant="neutral">غير مفعّل</StatusBadge>}</div>
            </div>
          </div>
        )}

        {activeTab === 'memberships' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-4">عضويات المدرسة</h3>
            <div className="space-y-3">
              {userMemberships.map(m => {
                const school = getSchool(m.schoolId);
                const role = getRole(m.roleId);
                return (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-sand-200">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: school?.logoColor ?? '#78716c' }}>{school?.name[0]}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-sand-800">{school?.name}</p>
                      <p className="text-xs text-sand-400">{role?.name} · {m.branchIds.length > 0 ? `${m.branchIds.length} فروع` : 'كل الفروع'}</p>
                    </div>
                    <div className="text-left">
                      {m.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : m.status === 'suspended' ? <StatusBadge variant="warning">موقوف</StatusBadge> : <StatusBadge variant="neutral">منتهي</StatusBadge>}
                      <p className="text-xs text-sand-400 mt-1 ltr-numbers">{m.startDate} → {m.endDate ?? 'الحالي'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'identity' && (
          <div className="card p-5">
            <div className="bg-brand-50/30 border border-brand-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-sand-700">
                <strong>الهوية ≠ الدخول ≠ العضوية ≠ الدور</strong>
                <br />
                المستخدم له هوية موحدة. الدخول، العضويات في المدارس، والأدوار مفاهيم منفصلة. يمكن للمستخدم نفسه أن يكون له أدوار مختلفة في مدارس مختلفة.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-sand-400 mb-1">رقم الهوية الوطنية (الكامل)</p><p className="ltr-numbers text-sand-700">{user.nationalId}</p></div>
              <div><p className="text-xs text-sand-400 mb-1">عدد العضويات</p><p className="text-sand-700 ltr-numbers">{userMemberships.length}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
