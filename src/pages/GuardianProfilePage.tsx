import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { UserAvatar } from '@/components/ui';
import { db, getGuardian, getUser, getStudent, getSchool, getGrade, getSection, getBranch } from '@/services/db';
import { maskNationalId } from '@/services/userService';
import { ArrowRight } from 'lucide-react';

export function GuardianProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const guardian = id ? getGuardian(id) : undefined;
  if (!guardian) return <div>ولي الأمر غير موجود</div>;
  const user = getUser(guardian.userId);
  if (!user) return <div>المستخدم غير موجود</div>;

  const links = db.guardianLinks.filter(l => l.guardianId === guardian.id);
  const children = links.map(l => {
    const student = getStudent(l.studentId);
    const user = student ? getUser(student.userId) : null;
    const enr = student ? db.enrollments.find(e => e.studentId === student.id && e.status === 'active') : null;
    const school = enr ? getSchool(enr.schoolId) : null;
    const grade = enr ? getGrade(enr.gradeId) : null;
    const section = enr?.sectionId ? getSection(enr.sectionId) : null;
    return { student, user, school, grade, section, relationship: l.relationshipLabel };
  }).filter(c => c.student && c.user);

  return (
    <div>
      <PageHeader
        title={user.name}
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'أولياء الأمور' }, { label: user.name }]}
        actions={<button className="btn-secondary btn-sm" onClick={() => navigate('/guardians')}><ArrowRight size={14} /> رجوع</button>}
      />

      <div className="card p-5 mb-6">
        <div className="flex items-center gap-4">
          <UserAvatar name={user.name} color={user.avatarColor} size={64} />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-sand-900">{user.name}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-3 text-sm">
              <div><p className="text-xs text-sand-400">رقم الهوية</p><p className="ltr-numbers text-sand-700">{maskNationalId(user.nationalId)}</p></div>
              <div><p className="text-xs text-sand-400">الهاتف</p><p className="ltr-numbers text-sand-700">{guardian.phone}</p></div>
              <div><p className="text-xs text-sand-400">المهنة</p><p className="text-sand-700">{guardian.occupation ?? '—'}</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-sm font-semibold text-sand-800 mb-4">الأبناء ({children.length})</h3>
        <div className="space-y-3">
          {children.map(c => (
            <div key={c.student!.id} className="flex items-center gap-3 p-3 rounded-lg border border-sand-200 hover:border-brand-300 cursor-pointer" onClick={() => navigate(`/students/${c.student!.id}`)}>
              <UserAvatar name={c.user!.name} color={c.user!.avatarColor} size={40} />
              <div className="flex-1">
                <p className="text-sm font-medium text-sand-800">{c.user!.name}</p>
                <p className="text-xs text-sand-400">{c.school?.name} · {c.grade?.name} · شعبة {c.section?.name ?? '—'}</p>
              </div>
              <div className="text-left">
                <StatusBadge variant="info">{c.relationship}</StatusBadge>
                <p className="text-xs text-sand-400 mt-1">{c.school?.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
