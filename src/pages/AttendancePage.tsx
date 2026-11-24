import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { showToast } from '@/components/ui';
import { useAuth } from '@/services/authContext';
import { db, sectionsBySchool, studentsBySection, getSection, getGrade, getBranch, getUser, attendanceBySection } from '@/services/db';
import { cn } from '@/utils/cn';
import type { AttendanceStatus } from '@/types';
import { Save, Check, X, Clock, AlertCircle } from 'lucide-react';

const statusConfig: Record<AttendanceStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info'; icon: typeof Check; color: string }> = {
  present: { label: 'حاضر', variant: 'success', icon: Check, color: 'bg-emerald-50 border-emerald-300 text-emerald-700' },
  absent: { label: 'غائب', variant: 'error', icon: X, color: 'bg-red-50 border-red-300 text-red-700' },
  late: { label: 'متأخر', variant: 'warning', icon: Clock, color: 'bg-amber-50 border-amber-300 text-amber-700' },
  excused: { label: 'بعذر', variant: 'info', icon: AlertCircle, color: 'bg-brand-50 border-brand-300 text-brand-700' },
};

export function AttendancePage({ teacherView, studentView }: { teacherView?: boolean; studentView?: boolean }) {
  const { session } = useAuth();
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-08-25');
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});

  if (!session) return null;

  if (studentView) {
    const student = db.students.find(s => s.userId === session.userId);
    const attendance = student ? db.attendanceRecords.filter(a => a.studentId === student.id) : [];
    return (
      <div>
        <PageHeader title="حضوري" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'حضوري' }]} />
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4">سجل الحضور</h3>
          {attendance.length === 0 ? <p className="text-sm text-sand-400 text-center py-8">لا يوجد سجل حضور</p> : (
            <div className="space-y-2">
              {attendance.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-sand-200">
                  <span className="text-sm text-sand-700 ltr-numbers">{a.date}</span>
                  <StatusBadge variant={statusConfig[a.status].variant}>{statusConfig[a.status].label}</StatusBadge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Determine available sections
  let availableSections = sectionsBySchool(session.activeSchoolId).filter(s => s.academicYearId === session.activeAcademicYearId);

  if (teacherView) {
    const teacher = db.teachers.find(t => t.userId === session.userId);
    if (teacher) {
      const teacherAssignments = db.teachingAssignments.filter(a => a.teacherId === teacher.id && a.status === 'active');
      const teacherSectionIds = [...new Set(teacherAssignments.map(a => a.sectionId))];
      availableSections = availableSections.filter(s => teacherSectionIds.includes(s.id));
    }
  }

  const sectionId = selectedSection || availableSections[0]?.id || '';
  const section = sectionId ? getSection(sectionId) : null;
  const sectionStudents = sectionId ? studentsBySection(sectionId) : [];
  const existingRecords = sectionId ? attendanceBySection(sectionId, selectedDate) : [];

  // Initialize marks from existing records
  if (Object.keys(marks).length === 0 && existingRecords.length > 0) {
    const initial: Record<string, AttendanceStatus> = {};
    existingRecords.forEach(r => { initial[r.studentId] = r.status; });
    if (Object.keys(initial).length > 0) setMarks(initial);
  }

  function setMark(studentId: string, status: AttendanceStatus) {
    setMarks(prev => ({ ...prev, [studentId]: status }));
  }

  function markAll(status: AttendanceStatus) {
    const all: Record<string, AttendanceStatus> = {};
    sectionStudents.forEach(s => { all[s.id] = status; });
    setMarks(all);
  }

  function save() {
    showToast('تم حفظ الحضور بنجاح (محاكاة)', 'success');
  }

  const counts = {
    present: sectionStudents.filter(s => marks[s.id] === 'present').length,
    absent: sectionStudents.filter(s => marks[s.id] === 'absent').length,
    late: sectionStudents.filter(s => marks[s.id] === 'late').length,
    excused: sectionStudents.filter(s => marks[s.id] === 'excused').length,
  };

  return (
    <div>
      <PageHeader title="الحضور اليومي" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الحضور' }]}
        actions={<button className="btn-primary btn-sm" onClick={save}><Save size={14} /> حفظ الحضور</button>} />

      <div className="card p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div><label className="label">الفرع</label><select className="select" value={session.activeBranchId ?? ''} disabled><option>{session.activeBranchId ? getBranch(session.activeBranchId)?.name : 'كل الفروع'}</option></select></div>
          <div><label className="label">الصف</label><select className="select" disabled><option>{section ? getGrade(section.gradeId)?.name : '—'}</option></select></div>
          <div><label className="label">الشعبة</label><select className="select" value={selectedSection} onChange={(e) => { setSelectedSection(e.target.value); setMarks({}); }}>
            <option value="">اختر شعبة</option>
            {availableSections.map(s => <option key={s.id} value={s.id}>{getGrade(s.gradeId)?.name} - شعبة {s.name}</option>)}
          </select></div>
          <div><label className="label">التاريخ</label><input type="date" className="input ltr-numbers" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setMarks({}); }} /></div>
        </div>
      </div>

      {section && (
        <>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="card p-3 text-center"><p className="text-xs text-emerald-600">الحاضرون</p><p className="text-xl font-bold text-emerald-700 ltr-numbers">{counts.present}</p></div>
            <div className="card p-3 text-center"><p className="text-xs text-red-600">الغائبون</p><p className="text-xl font-bold text-red-700 ltr-numbers">{counts.absent}</p></div>
            <div className="card p-3 text-center"><p className="text-xs text-amber-600">المتأخرون</p><p className="text-xl font-bold text-amber-700 ltr-numbers">{counts.late}</p></div>
            <div className="card p-3 text-center"><p className="text-xs text-brand-600">بعذر</p><p className="text-xl font-bold text-brand-700 ltr-numbers">{counts.excused}</p></div>
          </div>

          <div className="card p-0">
            <div className="p-3 border-b border-sand-100 flex items-center gap-2">
              <button className="btn-secondary btn-sm" onClick={() => markAll('present')}>تعليم الكل حاضر</button>
            </div>
            <div className="divide-y divide-sand-100">
              {sectionStudents.map(s => {
                const user = getUser(s.userId);
                const current = marks[s.id] ?? 'present';
                return (
                  <div key={s.id} className="flex items-center gap-3 p-3">
                    <div className="flex-1"><p className="text-sm font-medium text-sand-800">{user?.name}</p><p className="text-xs text-sand-400 ltr-numbers">{s.studentNumber}</p></div>
                    <div className="flex items-center gap-1">
                      {(Object.keys(statusConfig) as AttendanceStatus[]).map(st => {
                        const cfg = statusConfig[st];
                        const Icon = cfg.icon;
                        return (
                          <button key={st} onClick={() => setMark(s.id, st)} className={cn('flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors', current === st ? cfg.color : 'border-sand-200 text-sand-400 hover:bg-sand-50')}>
                            <Icon size={12} /> {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {sectionStudents.length === 0 && <p className="text-sm text-sand-400 text-center py-8">لا يوجد طلاب في هذه الشعبة</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
