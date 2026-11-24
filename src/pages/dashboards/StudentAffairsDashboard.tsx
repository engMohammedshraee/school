import { StatCard } from '@/components/StatCard';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { UserAvatar } from '@/components/ui';
import { useAuth } from '@/services/authContext';
import { studentsBySchool, getSchool, getBranch, getUser, getAcademicYear, documentsByStudent } from '@/services/db';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, UserPlus, FileWarning, Users, FileText, ArrowLeftRight } from 'lucide-react';

export function StudentAffairsDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  if (!session) return null;

  const school = getSchool(session.activeSchoolId);
  const year = getAcademicYear(session.activeAcademicYearId);
  const allStudents = studentsBySchool(session.activeSchoolId, session.activeAcademicYearId);

  const missingDocs = allStudents.filter(s => {
    const docs = documentsByStudent(s.id);
    return docs.some(d => d.status === 'missing' || d.status === 'rejected' || d.status === 'needs_replacement');
  });

  const recentStudents = allStudents.slice(-5).reverse();

  return (
    <div>
      <PageHeader
        title={`مرحبًا، ${getUser(session.userId)?.name ?? ''}`}
        description={`${school?.name ?? ''} · ${year?.label ?? ''}`}
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'شؤون الطلاب' }]}
        actions={
          <button className="btn-primary btn-sm" onClick={() => navigate('/students/new')}>
            <UserPlus size={14} /> تسجيل طالب
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="عدد الطلاب" value={allStudents.length} icon={<GraduationCap size={20} />} variant="info" />
        <StatCard label="التسجيلات الجديدة" value={recentStudents.length} icon={<UserPlus size={20} />} variant="success" />
        <StatCard label="الوثائق الناقصة" value={missingDocs.length} icon={<FileWarning size={20} />} variant="warning" />
        <StatCard label="أولياء الأمور" value={10} icon={<Users size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-sand-800">التسجيلات الجديدة</h3>
            <button onClick={() => navigate('/students')} className="text-xs text-brand-600 hover:text-brand-700 font-medium">عرض الكل</button>
          </div>
          <div className="space-y-3">
            {recentStudents.map(s => {
              const user = getUser(s.userId);
              return (
                <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-sand-50 cursor-pointer" onClick={() => navigate(`/students/${s.id}`)}>
                  <UserAvatar name={user?.name ?? '?'} color={user?.avatarColor ?? '#78716c'} size={36} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-sand-800">{user?.name}</p>
                    <p className="text-xs text-sand-400 ltr-numbers">{s.studentNumber}</p>
                  </div>
                  <StatusBadge variant="success">نشط</StatusBadge>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4">الوثائق الناقصة</h3>
          <div className="space-y-3">
            {missingDocs.slice(0, 5).map(s => {
              const user = getUser(s.userId);
              const docs = documentsByStudent(s.id);
              const missing = docs.filter(d => d.status === 'missing' || d.status === 'rejected' || d.status === 'needs_replacement');
              return (
                <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-sand-50 cursor-pointer" onClick={() => navigate(`/students/${s.id}`)}>
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center"><FileText size={16} className="text-amber-600" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-sand-800">{user?.name}</p>
                    <p className="text-xs text-sand-400">{missing.length} وثائق بحاجة مراجعة</p>
                  </div>
                  <StatusBadge variant="warning">غير مكتملة</StatusBadge>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4">التحويلات</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-sand-200">
              <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center"><ArrowLeftRight size={16} className="text-brand-600" /></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-sand-800">تحويل بين الفروع</p>
                <p className="text-xs text-sand-400">يمكن تحويل الطالب بين فروع المدرسة مع الحفاظ على السجل التاريخي</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
