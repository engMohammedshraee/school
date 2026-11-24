import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { showToast } from '@/components/ui';
import { useAuth } from '@/services/authContext';
import { db, getStudent, getUser, getSchool, getBranch, getGrade, getSection, getAcademicYear, enrollmentsByStudent } from '@/services/db';
import { ArrowRight, ArrowLeftRight } from 'lucide-react';

export function StudentTransferPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [destSchool, setDestSchool] = useState('');
  const [destBranch, setDestBranch] = useState('');
  const [destGrade, setDestGrade] = useState('');
  const [destSection, setDestSection] = useState('');

  const student = id ? getStudent(id) : undefined;
  if (!student) return <div>الطالب غير موجود</div>;
  const user = getUser(student.userId);
  if (!user || !session) return <div>المستخدم غير موجود</div>;

  const currentEnrollment = enrollmentsByStudent(student.id).find(e => e.status === 'active');
  const currentSchool = currentEnrollment ? getSchool(currentEnrollment.schoolId) : null;
  const currentBranch = currentEnrollment ? getBranch(currentEnrollment.branchId) : null;
  const currentGrade = currentEnrollment ? getGrade(currentEnrollment.gradeId) : null;
  const currentSection = currentEnrollment?.sectionId ? getSection(currentEnrollment.sectionId) : null;
  const currentYear = currentEnrollment ? getAcademicYear(currentEnrollment.academicYearId) : null;

  const destBranches = destSchool ? db.branches.filter(b => b.schoolId === destSchool) : [];
  const destGrades = destSchool ? db.grades.filter(g => g.schoolId === destSchool) : [];
  const destSections = destGrade && session ? db.sections.filter(s => s.gradeId === destGrade && s.academicYearId === session.activeAcademicYearId) : [];

  function handleTransfer() {
    if (!destSchool || !destBranch || !destGrade) { showToast('يرجى ملء جميع الحقول المطلوبة', 'error'); return; }
    showToast('تم تحويل الطالب بنجاح (محاكاة) — تم حفظ التسجيل السابق في السجل التاريخي', 'success');
    navigate(`/students/${student!.id}`);
  }

  return (
    <div>
      <PageHeader
        title={`تحويل الطالب: ${user.name}`}
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الطلاب' }, { label: user.name }, { label: 'تحويل' }]}
        actions={<button className="btn-secondary btn-sm" onClick={() => navigate(`/students/${student.id}`)}><ArrowRight size={14} /> رجوع</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current enrollment */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4">التسجيل الحالي</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-sand-500">المدرسة:</span><span className="font-medium text-sand-800">{currentSchool?.name ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-sand-500">الفرع:</span><span className="font-medium text-sand-800">{currentBranch?.name ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-sand-500">الصف:</span><span className="font-medium text-sand-800">{currentGrade?.name ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-sand-500">الشعبة:</span><span className="font-medium text-sand-800">{currentSection?.name ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-sand-500">السنة الدراسية:</span><span className="font-medium text-sand-800 ltr-numbers">{currentYear?.label ?? '—'}</span></div>
            <div className="pt-2"><StatusBadge variant="success">نشط</StatusBadge></div>
          </div>
        </div>

        {/* Transfer destination */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4 flex items-center gap-2"><ArrowLeftRight size={16} className="text-brand-600" /> وجهة التحويل</h3>
          <div className="space-y-4">
            <div><label className="label">المدرسة</label><select className="select" value={destSchool} onChange={(e) => { setDestSchool(e.target.value); setDestBranch(''); setDestGrade(''); setDestSection(''); }}><option value="">اختر المدرسة</option>{db.schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            <div><label className="label">الفرع</label><select className="select" value={destBranch} onChange={(e) => setDestBranch(e.target.value)}><option value="">اختر الفرع</option>{destBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
            <div><label className="label">الصف</label><select className="select" value={destGrade} onChange={(e) => { setDestGrade(e.target.value); setDestSection(''); }}><option value="">اختر الصف</option>{destGrades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
            <div><label className="label">الشعبة</label><select className="select" value={destSection} onChange={(e) => setDestSection(e.target.value)}><option value="">اختر الشعبة</option>{destSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-brand-50/30 border border-brand-200">
            <p className="text-xs text-sand-600">سيتم إنهاء التسجيل الحالي وحفظه في السجل التاريخي، وإنشاء تسجيل جديد في الوجهة المحددة. لن يتم الكتابة فوق التسجيل السابق.</p>
          </div>
          <button className="btn-primary w-full mt-4" onClick={handleTransfer}><ArrowLeftRight size={14} /> تأكيد التحويل</button>
        </div>
      </div>
    </div>
  );
}
