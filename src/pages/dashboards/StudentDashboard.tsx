import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/services/authContext';
import { db, getUser, getSchool, getBranch, getGrade, getSection, getAcademicYear, documentsByStudent, attendanceByStudent, timetableBySection } from '@/services/db';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, ClipboardCheck, FileText, GraduationCap } from 'lucide-react';

export function StudentDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  if (!session) return null;

  const user = getUser(session.userId);
  const student = db.students.find(s => s.userId === session.userId);
  if (!student) return <div>لا يوجد ملف طالب مرتبط</div>;

  const enrollment = db.enrollments.find(e => e.studentId === student.id && e.status === 'active');
  const school = enrollment ? getSchool(enrollment.schoolId) : null;
  const branch = enrollment ? getBranch(enrollment.branchId) : null;
  const grade = enrollment ? getGrade(enrollment.gradeId) : null;
  const section = enrollment?.sectionId ? getSection(enrollment.sectionId) : null;
  const year = enrollment ? getAcademicYear(enrollment.academicYearId) : null;

  const docs = documentsByStudent(student.id);
  const attendance = attendanceByStudent(student.id);
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 100;
  const todaySlots = section ? timetableBySection(section.id).filter(t => t.day === 0) : [];
  const docsComplete = docs.every(d => d.status === 'accepted' || d.status === 'received');

  return (
    <div>
      <PageHeader
        title={`مرحبًا، ${user?.name ?? ''}`}
        description={`${school?.name ?? ''} · ${year?.label ?? ''}`}
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'لوحتي' }]}
      />

      {/* Current info */}
      <div className="card p-5 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div><p className="text-xs text-sand-400 mb-1">المدرسة</p><p className="text-sm font-medium text-sand-800">{school?.name}</p></div>
          <div><p className="text-xs text-sand-400 mb-1">الفرع</p><p className="text-sm font-medium text-sand-800">{branch?.name}</p></div>
          <div><p className="text-xs text-sand-400 mb-1">الصف</p><p className="text-sm font-medium text-sand-800">{grade?.name}</p></div>
          <div><p className="text-xs text-sand-400 mb-1">الشعبة</p><p className="text-sm font-medium text-sand-800">{section?.name}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's classes */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-sand-800 mb-4 flex items-center gap-2"><CalendarDays size={16} className="text-brand-600" /> حصص اليوم</h3>
          {todaySlots.length === 0 ? (
            <p className="text-sm text-sand-400 text-center py-8">لا توجد حصص اليوم</p>
          ) : (
            <div className="space-y-3">
              {todaySlots.map(slot => {
                const subject = db.subjects.find(s => s.id === slot.subjectId);
                const teacher = db.teachers.find(t => t.id === slot.teacherId);
                const teacherUser = teacher ? getUser(teacher.userId) : null;
                return (
                  <div key={slot.id} className="flex items-center gap-3 p-3 rounded-lg border border-sand-200">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700 font-bold text-sm ltr-numbers">{slot.startTime}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-sand-800">{subject?.name}</p>
                      <p className="text-xs text-sand-400">{teacherUser?.name} · {slot.startTime} - {slot.endTime}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Attendance */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4 flex items-center gap-2"><ClipboardCheck size={16} className="text-brand-600" /> نسبة الحضور</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e7e5e4" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#0d9488" strokeWidth="10" strokeDasharray="294" strokeDashoffset={294 - (294 * attendanceRate / 100)} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-sand-900 ltr-numbers">{attendanceRate}%</span>
                <span className="text-xs text-sand-400">حضور</span>
              </div>
            </div>
          </div>
          <button onClick={() => navigate('/student/attendance')} className="text-xs text-brand-600 hover:text-brand-700 font-medium w-full text-center">عرض التفاصيل</button>
        </div>

        {/* Documents */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4 flex items-center gap-2"><FileText size={16} className="text-brand-600" /> حالة الوثائق</h3>
          <div className="mb-4">
            {docsComplete ? <StatusBadge variant="success">مكتملة</StatusBadge> : <StatusBadge variant="warning">غير مكتملة</StatusBadge>}
          </div>
          <div className="space-y-2">
            {docs.map(d => {
              const labels: Record<string, string> = { birth_certificate: 'شهادة الميلاد', personal_photo: 'الصورة الشخصية', previous_certificate: 'شهادة الصف السابق', transfer_document: 'وثيقة النقل' };
              const statusMap: Record<string, { variant: 'success' | 'warning' | 'error' | 'neutral' | 'info'; label: string }> = {
                missing: { variant: 'error', label: 'مفقود' }, received: { variant: 'info', label: 'مستلم' },
                under_review: { variant: 'warning', label: 'قيد المراجعة' }, accepted: { variant: 'success', label: 'مقبول' },
                rejected: { variant: 'error', label: 'مرفوض' }, needs_replacement: { variant: 'warning', label: 'يحتاج استبدال' },
              };
              const st = statusMap[d.status];
              return <div key={d.id} className="flex items-center justify-between text-sm"><span className="text-sand-700">{labels[d.type]}</span><StatusBadge variant={st.variant}>{st.label}</StatusBadge></div>;
            })}
          </div>
          <button onClick={() => navigate('/student/documents')} className="text-xs text-brand-600 hover:text-brand-700 font-medium mt-3 w-full text-center">عرض الوثائق</button>
        </div>

        {/* Future */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-sand-800 mb-4">وحدات مستقبلية</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-sand-50 flex items-center justify-between"><span className="text-sm text-sand-600">نتائجي</span><StatusBadge variant="neutral">قريبًا</StatusBadge></div>
            <div className="p-3 rounded-lg bg-sand-50 flex items-center justify-between"><span className="text-sm text-sand-600">الرسوم</span><StatusBadge variant="neutral">قريبًا</StatusBadge></div>
          </div>
        </div>
      </div>
    </div>
  );
}
