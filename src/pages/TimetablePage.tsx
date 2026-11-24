import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/services/authContext';
import { db, sectionsBySchool, getSection, getSubject, getTeacher, getUser, timetableBySection, timetableByTeacher, getGrade, getBranch } from '@/services/db';
import { cn } from '@/utils/cn';

const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء'];
const periodTimes = ['07:00 - 07:45', '07:50 - 08:35', '08:40 - 09:25', '09:40 - 10:25', '10:30 - 11:15'];

export function TimetablePage({ teacherView, studentView }: { teacherView?: boolean; studentView?: boolean }) {
  const { session } = useAuth();
  const [selectedSection, setSelectedSection] = useState('');

  if (!session) return null;

  let slots;
  let title = 'الجدول الدراسي';

  if (teacherView) {
    title = 'جدولي';
    const teacher = db.teachers.find(t => t.userId === session.userId);
    slots = teacher ? timetableByTeacher(teacher.id) : [];
  } else if (studentView) {
    title = 'جدولي';
    const student = db.students.find(s => s.userId === session.userId);
    const enr = student ? db.enrollments.find(e => e.studentId === student.id && e.status === 'active') : null;
    slots = enr?.sectionId ? timetableBySection(enr.sectionId) : [];
  } else {
    const sectionId = selectedSection || sectionsBySchool(session.activeSchoolId).find(s => s.academicYearId === session.activeAcademicYearId)?.id || '';
    slots = sectionId ? timetableBySection(sectionId) : [];
  }

  const sections = sectionsBySchool(session.activeSchoolId).filter(s => s.academicYearId === session.activeAcademicYearId);

  return (
    <div>
      <PageHeader title={title} breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الشؤون الأكاديمية' }, { label: title }]} />

      {!teacherView && !studentView && (
        <div className="card p-4 mb-4">
          <label className="label">اختر الشعبة</label>
          <select className="select max-w-xs" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
            <option value="">اختر شعبة</option>
            {sections.map(s => <option key={s.id} value={s.id}>{getGrade(s.gradeId)?.name} - شعبة {s.name} · {getBranch(s.branchId)?.name}</option>)}
          </select>
        </div>
      )}

      <div className="card p-5">
        {slots.length === 0 ? (
          <p className="text-sm text-sand-400 text-center py-12">لا يوجد جدول متاح</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sand-200">
                  <th className="px-3 py-3 text-right text-xs font-semibold text-sand-500 w-32">الحصة / اليوم</th>
                  {days.map(d => <th key={d} className="px-3 py-3 text-right text-xs font-semibold text-sand-500">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3, 4].map(period => (
                  <tr key={period} className="border-b border-sand-100">
                    <td className="px-3 py-3 text-xs text-sand-400 ltr-numbers">{periodTimes[period]}</td>
                    {[0, 1, 2, 3, 4].map(dayIdx => {
                      const slot = slots.find(s => s.day === dayIdx && s.periodIndex === period);
                      const subject = slot ? getSubject(slot.subjectId) : null;
                      const teacher = slot ? getTeacher(slot.teacherId) : null;
                      const teacherUser = teacher ? getUser(teacher.userId) : null;
                      return (
                        <td key={dayIdx} className="px-2 py-2">
                          {slot ? (
                            <div className="p-2 rounded-lg bg-brand-50 border border-brand-100 text-xs">
                              <p className="font-semibold text-brand-700">{subject?.name}</p>
                              <p className="text-brand-500 mt-0.5">{teacherUser?.name}</p>
                              <p className="text-brand-400 ltr-numbers mt-0.5">{slot.startTime} - {slot.endTime}</p>
                            </div>
                          ) : (
                            <div className="text-sand-200 text-xs text-center py-4">—</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
