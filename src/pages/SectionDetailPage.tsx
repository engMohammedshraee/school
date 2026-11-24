import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { Tabs } from '@/components/ui';
import { useState } from 'react';
import { db, getSection, getBranch, getGrade, getAcademicYear, getUser, getTeacher, studentsBySection, timetableBySection, getSubject } from '@/services/db';
import { ArrowRight } from 'lucide-react';

export function SectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const section = id ? getSection(id) : undefined;
  if (!section) return <div>الشعبة غير موجودة</div>;

  const grade = getGrade(section.gradeId);
  const branch = getBranch(section.branchId);
  const year = getAcademicYear(section.academicYearId);
  const sectionStudents = studentsBySection(section.id);
  const slots = timetableBySection(section.id);

  return (
    <div>
      <PageHeader title={`شعبة ${section.name} · ${grade?.name}`} breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الشعب' }, { label: `شعبة ${section.name}` }]}
        actions={<button className="btn-secondary btn-sm" onClick={() => navigate('/sections')}><ArrowRight size={14} /> رجوع</button>} />

      <div className="card p-5 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div><p className="text-xs text-sand-400">الصف</p><p className="text-sand-700">{grade?.name}</p></div>
          <div><p className="text-xs text-sand-400">الفرع</p><p className="text-sand-700">{branch?.name}</p></div>
          <div><p className="text-xs text-sand-400">السنة الدراسية</p><p className="text-sand-700 ltr-numbers">{year?.label}</p></div>
          <div><p className="text-xs text-sand-400">الطلاب</p><p className="text-sand-700 ltr-numbers">{sectionStudents.length} / {section.capacity}</p></div>
        </div>
      </div>

      <Tabs tabs={[{ key: 'overview', label: 'نظرة عامة' }, { key: 'students', label: 'الطلاب' }, { key: 'supervisors', label: 'المشرفون' }, { key: 'timetable', label: 'الجدول' }]} active={activeTab} onChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === 'overview' && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">{section.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : <StatusBadge variant="neutral">غير نشط</StatusBadge>}</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-sand-400">السعة</p><p className="text-sand-700 ltr-numbers">{section.capacity}</p></div>
              <div><p className="text-xs text-sand-400">الطلاب المسجلون</p><p className="text-sand-700 ltr-numbers">{sectionStudents.length}</p></div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-4">طلاب الشعبة ({sectionStudents.length})</h3>
            <div className="space-y-2">
              {sectionStudents.map(s => {
                const user = getUser(s.userId);
                return <div key={s.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-sand-50"><span className="text-sm text-sand-700">{user?.name}</span><span className="text-xs text-sand-400 ltr-numbers">{s.studentNumber}</span></div>;
              })}
              {sectionStudents.length === 0 && <p className="text-sm text-sand-400 text-center py-4">لا يوجد طلاب</p>}
            </div>
          </div>
        )}

        {activeTab === 'supervisors' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-4">سجل المشرفين</h3>
            <div className="space-y-3">
              {section.supervisorHistory.map(sup => {
                const teacher = getTeacher(sup.teacherId);
                const user = teacher ? getUser(teacher.userId) : null;
                return (
                  <div key={sup.id} className="flex items-center gap-3 p-3 rounded-lg border border-sand-200">
                    <div className="flex-1"><p className="text-sm font-medium text-sand-800">{user?.name ?? '—'}</p><p className="text-xs text-sand-400 ltr-numbers">{sup.startDate} → {sup.endDate ?? 'الحالي'}</p></div>
                    {sup.endDate === null ? <StatusBadge variant="success">المشرف الحالي</StatusBadge> : <StatusBadge variant="neutral">سابق</StatusBadge>}
                  </div>
                );
              })}
              {section.supervisorHistory.length === 0 && <p className="text-sm text-sand-400 text-center py-4">لا يوجد سجل مشرفين</p>}
            </div>
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-4">الجدول الأسبوعي</h3>
            {slots.length === 0 ? <p className="text-sm text-sand-400 text-center py-8">لا يوجد جدول</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-sand-200">{['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء'].map(d => <th key={d} className="px-3 py-2 text-right text-xs text-sand-500">{d}</th>)}</tr></thead>
                  <tbody>
                    {[0, 1, 2, 3, 4].map(period => (
                      <tr key={period} className="border-b border-sand-100">
                        {[0, 1, 2, 3, 4].map(dayIdx => {
                          const slot = slots.find(s => s.day === dayIdx && s.periodIndex === period);
                          const subject = slot ? getSubject(slot.subjectId) : null;
                          return <td key={dayIdx} className="px-3 py-3">{slot ? <div className="p-2 rounded-lg bg-brand-50 text-brand-700 text-xs"><p className="font-medium">{subject?.name}</p><p className="text-brand-400 ltr-numbers">{slot.startTime}</p></div> : <span className="text-sand-200 text-xs">—</span>}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
