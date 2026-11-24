import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/services/authContext';
import { db, getUser, getSchool, getBranch, getAcademicYear, getSubject, getGrade, getSection, teachingAssignmentsByTeacher, timetableByTeacher, studentsBySection } from '@/services/db';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, BookMarked, Grid3x3, ClipboardCheck } from 'lucide-react';

export function TeacherDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  if (!session) return null;

  const user = getUser(session.userId);
  const teacher = db.teachers.find(t => t.userId === session.userId);
  if (!teacher) return <div>لا يوجد ملف معلم مرتبط بهذا المستخدم</div>;

  const school = getSchool(session.activeSchoolId);
  const year = getAcademicYear(session.activeAcademicYearId);

  const assignments = teachingAssignmentsByTeacher(teacher.id).filter(a => a.academicYearId === session.activeAcademicYearId && a.status === 'active');
  const todaySlots = timetableByTeacher(teacher.id).filter(t => t.day === 0); // Day 0 = Saturday

  // Unique sections
  const sectionIds = [...new Set(assignments.map(a => a.sectionId))];
  const subjectIds = [...new Set(assignments.map(a => a.subjectId))];

  return (
    <div>
      <PageHeader
        title={`مرحبًا، ${user?.name ?? ''}`}
        description={`${school?.name ?? ''} · ${year?.label ?? ''}`}
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'لوحتي' }]}
        actions={
          <button className="btn-primary btn-sm" onClick={() => navigate('/teacher/attendance')}>
            <ClipboardCheck size={14} /> تسجيل الحضور
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sand-500 mb-1">حصصي اليوم</p>
              <p className="text-2xl font-bold text-brand-600 ltr-numbers">{todaySlots.length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center"><Clock size={20} className="text-brand-600" /></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sand-500 mb-1">الشعب التي أدرسها</p>
              <p className="text-2xl font-bold text-sand-700 ltr-numbers">{sectionIds.length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sand-100 flex items-center justify-center"><Grid3x3 size={20} className="text-sand-500" /></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sand-500 mb-1">المواد</p>
              <p className="text-2xl font-bold text-sand-700 ltr-numbers">{subjectIds.length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sand-100 flex items-center justify-center"><BookMarked size={20} className="text-sand-500" /></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sand-500 mb-1">الحضور المطلوب</p>
              <p className="text-2xl font-bold text-sand-700 ltr-numbers">{sectionIds.length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sand-100 flex items-center justify-center"><ClipboardCheck size={20} className="text-sand-500" /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's classes */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4 flex items-center gap-2"><CalendarDays size={16} className="text-brand-600" /> حصصي اليوم</h3>
          {todaySlots.length === 0 ? (
            <p className="text-sm text-sand-400 text-center py-8">لا توجد حصص اليوم</p>
          ) : (
            <div className="space-y-3">
              {todaySlots.map(slot => {
                const subject = getSubject(slot.subjectId);
                const section = getSection(slot.sectionId);
                const grade = section ? getGrade(section.gradeId) : null;
                const branch = section ? getBranch(section.branchId) : null;
                return (
                  <div key={slot.id} className="flex items-center gap-3 p-3 rounded-lg border border-sand-200 hover:border-brand-300 cursor-pointer" onClick={() => navigate('/teacher/attendance')}>
                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700 font-bold text-sm ltr-numbers">{slot.startTime}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-sand-800">{subject?.name}</p>
                      <p className="text-xs text-sand-400">{grade?.name} · شعبة {section?.name} · {branch?.name}</p>
                    </div>
                    <StatusBadge variant="info">حصة</StatusBadge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* My sections */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4 flex items-center gap-2"><Grid3x3 size={16} className="text-brand-600" /> الشعب التي أدرسها</h3>
          <div className="space-y-3">
            {assignments.map(a => {
              const section = getSection(a.sectionId);
              const grade = section ? getGrade(section.gradeId) : null;
              const subject = getSubject(a.subjectId);
              const branch = section ? getBranch(section.branchId) : null;
              const studentCount = section ? studentsBySection(section.id).length : 0;
              return (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border border-sand-200 hover:border-brand-300 cursor-pointer" onClick={() => navigate('/teacher/attendance')}>
                  <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center"><BookMarked size={16} className="text-brand-600" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-sand-800">{subject?.name} · {grade?.name}</p>
                    <p className="text-xs text-sand-400">شعبة {section?.name} · {branch?.name} · {studentCount} طالب</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
