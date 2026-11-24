import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { UserAvatar } from '@/components/ui';
import { useAuth } from '@/services/authContext';
import { db, getUser, getSchool, getBranch, getGrade, getSection, getAcademicYear, guardianLinksByGuardian, getStudent, getGuardian, documentsByStudent, attendanceByStudent } from '@/services/db';
import { useNavigate, useState } from 'react-router-dom';
import { Users, CalendarDays, FileText, ClipboardCheck, GraduationCap } from 'lucide-react';
import { useState as useStateReact } from 'react';

export function GuardianDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useStateReact<string | null>(null);
  if (!session) return null;

  const user = getUser(session.userId);
  const guardian = db.guardians.find(g => g.userId === session.userId);
  if (!guardian) return <div>لا يوجد ملف ولي أمر مرتبط بهذا المستخدم</div>;

  const links = guardianLinksByGuardian(guardian.id);
  const students = links.map(l => getStudent(l.studentId)).filter((s): s is NonNullable<typeof s> => s !== undefined);

  const selectedStudent = selectedStudentId ? getStudent(selectedStudentId) : students[0];
  if (!selectedStudent) return <div>لا يوجد أبناء مرتبطون</div>;

  const selectedStudentUser = getUser(selectedStudent.userId);
  const enrollment = db.enrollments.find(e => e.studentId === selectedStudent.id && e.status === 'active');
  const school = enrollment ? getSchool(enrollment.schoolId) : null;
  const branch = enrollment ? getBranch(enrollment.branchId) : null;
  const grade = enrollment ? getGrade(enrollment.gradeId) : null;
  const section = enrollment?.sectionId ? getSection(enrollment.sectionId) : null;
  const docs = documentsByStudent(selectedStudent.id);
  const attendance = attendanceByStudent(selectedStudent.id);
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 100;

  const link = links.find(l => l.studentId === selectedStudent.id);

  return (
    <div>
      <PageHeader
        title={`مرحبًا، ${user?.name ?? ''}`}
        description="لوحة ولي الأمر"
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'أبنائي' }]}
      />

      {/* Student selector */}
      {students.length > 1 && (
        <div className="card p-4 mb-6">
          <p className="text-sm font-medium text-sand-700 mb-3">اختر الابن:</p>
          <div className="flex gap-2 flex-wrap">
            {students.map(s => {
              const su = getUser(s.userId);
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${selectedStudent.id === s.id ? 'border-brand-300 bg-brand-50' : 'border-sand-200 hover:bg-sand-50'}`}
                >
                  <UserAvatar name={su?.name ?? '?'} color={su?.avatarColor ?? '#78716c'} size={28} />
                  <span className="text-sm font-medium text-sand-700">{su?.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student info card */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <UserAvatar name={selectedStudentUser?.name ?? '?'} color={selectedStudentUser?.avatarColor ?? '#0284c7'} size={48} />
            <div>
              <h3 className="text-base font-semibold text-sand-900">{selectedStudentUser?.name}</h3>
              <p className="text-xs text-sand-400 ltr-numbers">{selectedStudent.studentNumber}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-sand-500">المدرسة:</span><span className="font-medium text-sand-800">{school?.name}</span></div>
            <div className="flex justify-between"><span className="text-sand-500">الفرع:</span><span className="font-medium text-sand-800">{branch?.name}</span></div>
            <div className="flex justify-between"><span className="text-sand-500">الصف:</span><span className="font-medium text-sand-800">{grade?.name}</span></div>
            <div className="flex justify-between"><span className="text-sand-500">الشعبة:</span><span className="font-medium text-sand-800">{section?.name}</span></div>
            <div className="flex justify-between"><span className="text-sand-500">العلاقة:</span><span className="font-medium text-sand-800">{link?.relationshipLabel}</span></div>
          </div>
        </div>

        {/* Attendance */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4 flex items-center gap-2"><ClipboardCheck size={16} className="text-brand-600" /> الحضور</h3>
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
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-emerald-50"><p className="text-emerald-600">حاضر</p><p className="font-bold text-emerald-700 ltr-numbers">{presentCount}</p></div>
            <div className="p-2 rounded-lg bg-red-50"><p className="text-red-600">غائب</p><p className="font-bold text-red-700 ltr-numbers">{attendance.filter(a => a.status === 'absent').length}</p></div>
          </div>
        </div>

        {/* Documents */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4 flex items-center gap-2"><FileText size={16} className="text-brand-600" /> الوثائق</h3>
          <div className="space-y-2">
            {docs.map(d => {
              const labels: Record<string, string> = { birth_certificate: 'شهادة الميلاد', personal_photo: 'الصورة الشخصية', previous_certificate: 'شهادة الصف السابق', transfer_document: 'وثيقة النقل' };
              const statusMap: Record<string, { variant: 'success' | 'warning' | 'error' | 'neutral' | 'info'; label: string }> = {
                missing: { variant: 'error', label: 'مفقود' },
                received: { variant: 'info', label: 'مستلم' },
                under_review: { variant: 'warning', label: 'قيد المراجعة' },
                accepted: { variant: 'success', label: 'مقبول' },
                rejected: { variant: 'error', label: 'مرفوض' },
                needs_replacement: { variant: 'warning', label: 'يحتاج استبدال' },
              };
              const st = statusMap[d.status];
              return (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <span className="text-sand-700">{labels[d.type]}</span>
                  <StatusBadge variant={st.variant}>{st.label}</StatusBadge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timetable preview */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-sand-800 flex items-center gap-2"><CalendarDays size={16} className="text-brand-600" /> الجدول الدراسي</h3>
            <button onClick={() => navigate('/student/timetable')} className="text-xs text-brand-600 hover:text-brand-700 font-medium">عرض كامل</button>
          </div>
          {section ? (
            <div className="text-sm text-sand-500 text-center py-8">اضغط لعرض الجدول الكامل لـ {selectedStudentUser?.name}</div>
          ) : (
            <p className="text-sm text-sand-400 text-center py-8">لا يوجد جدول متاح</p>
          )}
        </div>

        {/* Future modules */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4">وحدات مستقبلية</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-sand-50">
              <span className="text-sm text-sand-600">النتائج</span>
              <StatusBadge variant="neutral">قريبًا</StatusBadge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-sand-50">
              <span className="text-sm text-sand-600">المالية</span>
              <StatusBadge variant="neutral">قريبًا</StatusBadge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
