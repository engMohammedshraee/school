import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { UserAvatar, Tabs } from '@/components/ui';
import { db, getStudent, getUser, getSchool, getBranch, getGrade, getSection, getAcademicYear, enrollmentsByStudent, documentsByStudent, attendanceByStudent, guardianLinksByStudent, getGuardian } from '@/services/db';
import { ArrowRight, ArrowLeftRight, FileWarning } from 'lucide-react';

export function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const student = id ? getStudent(id) : undefined;
  if (!student) return <div>الطالب غير موجود</div>;
  const user = getUser(student.userId);
  if (!user) return <div>المستخدم غير موجود</div>;

  const enrollments = enrollmentsByStudent(student.id);
  const docs = documentsByStudent(student.id);
  const attendance = attendanceByStudent(student.id);
  const guardianLinks = guardianLinksByStudent(student.id);

  const docLabels: Record<string, string> = { birth_certificate: 'شهادة الميلاد', personal_photo: 'الصورة الشخصية', previous_certificate: 'شهادة الصف السابق', transfer_document: 'وثيقة النقل' };
  const statusMap: Record<string, { variant: 'success' | 'warning' | 'error' | 'neutral' | 'info'; label: string }> = {
    missing: { variant: 'error', label: 'مفقود' }, received: { variant: 'info', label: 'مستلم' }, under_review: { variant: 'warning', label: 'قيد المراجعة' },
    accepted: { variant: 'success', label: 'مقبول' }, rejected: { variant: 'error', label: 'مرفوض' }, needs_replacement: { variant: 'warning', label: 'يحتاج استبدال' },
  };
  const attStatusMap: Record<string, { variant: 'success' | 'warning' | 'error' | 'neutral' | 'info'; label: string }> = {
    present: { variant: 'success', label: 'حاضر' }, absent: { variant: 'error', label: 'غائب' }, late: { variant: 'warning', label: 'متأخر' }, excused: { variant: 'info', label: 'بعذر' },
  };

  return (
    <div>
      <PageHeader
        title={user.name}
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الطلاب' }, { label: user.name }]}
        actions={
          <>
            <button className="btn-secondary btn-sm" onClick={() => navigate('/students')}><ArrowRight size={14} /> رجوع</button>
            <button className="btn-secondary btn-sm" onClick={() => navigate(`/students/${student.id}/transfer`)}><ArrowLeftRight size={14} /> تحويل</button>
          </>
        }
      />

      <div className="card p-5 mb-6">
        <div className="flex items-center gap-4">
          <UserAvatar name={user.name} color={user.avatarColor} size={64} />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-sand-900">{user.name}</h2>
            <p className="text-sm text-sand-500 ltr-numbers">{student.studentNumber}</p>
            <div className="flex gap-2 mt-2">
              <StatusBadge variant="success">نشط</StatusBadge>
              {docs.every(d => d.status === 'accepted' || d.status === 'received') && docs.length > 0
                ? <StatusBadge variant="success">وثائق مكتملة</StatusBadge>
                : <StatusBadge variant="warning">وثائق غير مكتملة</StatusBadge>}
            </div>
          </div>
        </div>
      </div>

      <Tabs
        tabs={[
          { key: 'overview', label: 'نظرة عامة' }, { key: 'enrollments', label: 'التسجيلات' },
          { key: 'attendance', label: 'الحضور' }, { key: 'documents', label: 'الوثائق' },
          { key: 'guardians', label: 'أولياء الأمور' }, { key: 'timetable', label: 'الجدول' },
          { key: 'results', label: 'النتائج', soon: true }, { key: 'finance', label: 'المالية', soon: true },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-4">
        {activeTab === 'overview' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-4">التسجيل الحالي</h3>
            {(() => {
              const enr = enrollments.find(e => e.status === 'active');
              if (!enr) return <p className="text-sm text-sand-400">لا يوجد تسجيل نشط</p>;
              const school = getSchool(enr.schoolId);
              const branch = getBranch(enr.branchId);
              const grade = getGrade(enr.gradeId);
              const section = enr.sectionId ? getSection(enr.sectionId) : null;
              const year = getAcademicYear(enr.academicYearId);
              return (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div><p className="text-xs text-sand-400">المدرسة</p><p className="text-sand-700">{school?.name}</p></div>
                  <div><p className="text-xs text-sand-400">الفرع</p><p className="text-sand-700">{branch?.name}</p></div>
                  <div><p className="text-xs text-sand-400">الصف</p><p className="text-sand-700">{grade?.name}</p></div>
                  <div><p className="text-xs text-sand-400">الشعبة</p><p className="text-sand-700">{section?.name ?? '—'}</p></div>
                  <div><p className="text-xs text-sand-400">السنة الدراسية</p><p className="text-sand-700 ltr-numbers">{year?.label}</p></div>
                </div>
              );
            })()}
          </div>
        )}

        {activeTab === 'enrollments' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-4">سجل التسجيل</h3>
            <div className="space-y-3">
              {enrollments.map(enr => {
                const school = getSchool(enr.schoolId);
                const branch = getBranch(enr.branchId);
                const grade = getGrade(enr.gradeId);
                const year = getAcademicYear(enr.academicYearId);
                return (
                  <div key={enr.id} className="flex items-center gap-3 p-3 rounded-lg border border-sand-200">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: school?.logoColor ?? '#78716c' }}>{school?.name[0]}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-sand-800">{grade?.name} · {school?.name} · {branch?.name}</p>
                      <p className="text-xs text-sand-400 ltr-numbers">{year?.label} · {enr.startDate} → {enr.endDate ?? 'الحالي'}</p>
                    </div>
                    {enr.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : enr.status === 'completed' ? <StatusBadge variant="neutral">مكتمل</StatusBadge> : enr.status === 'transferred' ? <StatusBadge variant="info">محول</StatusBadge> : <StatusBadge variant="neutral">منتهي</StatusBadge>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-4">سجل الحضور</h3>
            {attendance.length === 0 ? <p className="text-sm text-sand-400 text-center py-8">لا يوجد سجل حضور</p> : (
              <div className="space-y-2">
                {attendance.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-sand-200">
                    <span className="text-sm text-sand-700 ltr-numbers">{a.date}</span>
                    <StatusBadge variant={attStatusMap[a.status].variant}>{attStatusMap[a.status].label}</StatusBadge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-4">الوثائق</h3>
            <div className="space-y-2">
              {docs.map(d => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border border-sand-200">
                  <div><p className="text-sm text-sand-700">{docLabels[d.type]}</p>{d.notes && <p className="text-xs text-sand-400 mt-0.5">{d.notes}</p>}</div>
                  <div className="flex items-center gap-2">
                    {d.uploadedDate && <span className="text-xs text-sand-400 ltr-numbers">{d.uploadedDate}</span>}
                    <StatusBadge variant={statusMap[d.status].variant}>{statusMap[d.status].label}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'guardians' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-4">أولياء الأمور</h3>
            <div className="space-y-3">
              {guardianLinks.map(gl => {
                const guardian = getGuardian(gl.guardianId);
                const gUser = guardian ? getUser(guardian.userId) : null;
                if (!guardian || !gUser) return null;
                return (
                  <div key={gl.id} className="flex items-center gap-3 p-3 rounded-lg border border-sand-200">
                    <UserAvatar name={gUser.name} color={gUser.avatarColor} size={40} />
                    <div className="flex-1"><p className="text-sm font-medium text-sand-800">{gUser.name}</p><p className="text-xs text-sand-400 ltr-numbers">{guardian.phone}</p></div>
                    <StatusBadge variant="info">{gl.relationshipLabel}</StatusBadge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-4">الجدول الدراسي</h3>
            {(() => {
              const enr = enrollments.find(e => e.status === 'active');
              if (!enr?.sectionId) return <p className="text-sm text-sand-400 text-center py-8">لا يوجد جدول متاح</p>;
              const slots = db.timetableSlots.filter(t => t.sectionId === enr.sectionId);
              if (slots.length === 0) return <p className="text-sm text-sand-400 text-center py-8">لا يوجد حصص مجدولة</p>;
              const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء'];
              return (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-sand-200">{days.map(d => <th key={d} className="px-3 py-2 text-right text-xs text-sand-500">{d}</th>)}</tr></thead>
                    <tbody>
                      {[0, 1, 2, 3, 4].map(period => (
                        <tr key={period} className="border-b border-sand-100">
                          {days.map((_, dayIdx) => {
                            const slot = slots.find(s => s.day === dayIdx && s.periodIndex === period);
                            const subject = slot ? db.subjects.find(s => s.id === slot.subjectId) : null;
                            return <td key={dayIdx} className="px-3 py-3">{slot ? <div className="p-2 rounded-lg bg-brand-50 text-brand-700 text-xs"><p className="font-medium">{subject?.name}</p><p className="text-brand-400 ltr-numbers">{slot.startTime}</p></div> : <div className="text-sand-200 text-xs">—</div>}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
