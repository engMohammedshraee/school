import { StatCard } from '@/components/StatCard';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { UserAvatar } from '@/components/ui';
import { useAuth } from '@/services/authContext';
import { studentsBySchool, teachersBySchool, branchesBySchool, sectionsBySchool, getSchool, getBranch, getGrade, getUser, getAcademicYear, documentsByStudent } from '@/services/db';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, GitBranch, Grid3x3, ClipboardCheck, FileWarning, UserPlus, Presentation, CalendarDays } from 'lucide-react';

export function SchoolManagerDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  if (!session) return null;

  const school = getSchool(session.activeSchoolId);
  const year = getAcademicYear(session.activeAcademicYearId);
  const branchId = session.activeBranchId;

  const allStudents = studentsBySchool(session.activeSchoolId, session.activeAcademicYearId);
  const teachers = teachersBySchool(session.activeSchoolId);
  const branches = branchesBySchool(session.activeSchoolId);
  const sections = sectionsBySchool(session.activeSchoolId).filter(s => s.academicYearId === session.activeAcademicYearId);

  // Missing documents count
  const missingDocsCount = allStudents.filter(s => {
    const docs = documentsByStudent(s.id);
    return docs.some(d => d.status === 'missing' || d.status === 'rejected' || d.status === 'needs_replacement');
  }).length;

  const recentStudents = allStudents.slice(-5).reverse();

  return (
    <div>
      <PageHeader
        title={`مرحبًا، ${getUser(session.userId)?.name ?? ''}`}
        description={`${school?.name ?? ''} · ${year?.label ?? ''} ${branchId ? '· ' + getBranch(branchId)?.name : ''}`}
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'لوحة التحكم' }]}
        actions={
          <>
            <button className="btn-secondary btn-sm" onClick={() => navigate('/students/new')}>
              <UserPlus size={14} /> تسجيل طالب
            </button>
            <button className="btn-primary btn-sm" onClick={() => navigate('/attendance')}>
              <ClipboardCheck size={14} /> تسجيل حضور
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard label="إجمالي الطلاب" value={allStudents.length} icon={<GraduationCap size={20} />} variant="info" />
        <StatCard label="إجمالي المعلمين" value={teachers.length} icon={<Users size={20} />} />
        <StatCard label="الفروع" value={branches.length} icon={<GitBranch size={20} />} />
        <StatCard label="الشعب" value={sections.length} icon={<Grid3x3 size={20} />} />
        <StatCard label="الحضور اليوم" value="94%" icon={<ClipboardCheck size={20} />} variant="success" />
        <StatCard label="وثائق ناقصة" value={missingDocsCount} icon={<FileWarning size={20} />} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
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
          <h3 className="text-sm font-semibold text-sand-800 mb-4">إجراءات سريعة</h3>
          <div className="space-y-2">
            <button onClick={() => navigate('/students/new')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-sand-200 hover:border-brand-300 hover:bg-brand-50/30 transition-colors text-right">
              <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center"><UserPlus size={16} className="text-brand-600" /></div>
              <span className="text-sm font-medium text-sand-700">تسجيل طالب</span>
            </button>
            <button onClick={() => navigate('/teachers')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-sand-200 hover:border-brand-300 hover:bg-brand-50/30 transition-colors text-right">
              <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center"><Presentation size={16} className="text-brand-600" /></div>
              <span className="text-sm font-medium text-sand-700">إضافة معلم</span>
            </button>
            <button onClick={() => navigate('/sections')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-sand-200 hover:border-brand-300 hover:bg-brand-50/30 transition-colors text-right">
              <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center"><Grid3x3 size={16} className="text-brand-600" /></div>
              <span className="text-sm font-medium text-sand-700">إنشاء شعبة</span>
            </button>
            <button onClick={() => navigate('/attendance')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-sand-200 hover:border-brand-300 hover:bg-brand-50/30 transition-colors text-right">
              <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center"><ClipboardCheck size={16} className="text-brand-600" /></div>
              <span className="text-sm font-medium text-sand-700">تسجيل حضور</span>
            </button>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4">نظرة عامة على الحضور</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e7e5e4" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#0d9488" strokeWidth="10" strokeDasharray="294" strokeDashoffset="18" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-sand-900 ltr-numbers">94%</span>
                <span className="text-xs text-sand-400">حضور</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-lg bg-emerald-50"><p className="text-xs text-emerald-600">حاضر</p><p className="text-lg font-bold text-emerald-700 ltr-numbers">1,208</p></div>
            <div className="p-2 rounded-lg bg-red-50"><p className="text-xs text-red-600">غائب</p><p className="text-lg font-bold text-red-700 ltr-numbers">42</p></div>
            <div className="p-2 rounded-lg bg-amber-50"><p className="text-xs text-amber-600">متأخر</p><p className="text-lg font-bold text-amber-700 ltr-numbers">28</p></div>
            <div className="p-2 rounded-lg bg-sand-100"><p className="text-xs text-sand-600">بعذر</p><p className="text-lg font-bold text-sand-700 ltr-numbers">6</p></div>
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-sand-800">جدول اليوم</h3>
            <button onClick={() => navigate('/timetable')} className="text-xs text-brand-600 hover:text-brand-700 font-medium">عرض الجدول الكامل</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sections.slice(0, 6).map(sec => {
              const grade = getGrade(sec.gradeId);
              return (
                <div key={sec.id} className="p-3 rounded-lg border border-sand-200 hover:border-brand-300 transition-colors cursor-pointer" onClick={() => navigate('/timetable')}>
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays size={14} className="text-brand-600" />
                    <span className="text-sm font-medium text-sand-800">{grade?.name} - شعبة {sec.name}</span>
                  </div>
                  <p className="text-xs text-sand-400">{getBranch(sec.branchId)?.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
