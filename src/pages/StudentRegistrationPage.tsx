import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { showToast, UserAvatar } from '@/components/ui';
import { useAuth } from '@/services/authContext';
import { db, getSchool, getBranch, getGrade, getStage } from '@/services/db';
import { getUserByNationalId as lookupUser } from '@/services/userService';
import { Check, ChevronLeft, UserPlus, Search, FileText } from 'lucide-react';
import { cn } from '@/utils/cn';

const steps = ['التحقق من الهوية', 'بيانات الطالب', 'التسجيل الدراسي', 'ولي الأمر', 'الوثائق', 'المراجعة'];

export function StudentRegistrationPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [nationalId, setNationalId] = useState('');
  const [foundUser, setFoundUser] = useState<ReturnType<typeof lookupUser> | null>(null);
  const [searched, setSearched] = useState(false);
  const [studentData, setStudentData] = useState({ name: '', birthDate: '', gender: 'male', bloodType: '' });
  const [enrollment, setEnrollment] = useState({ gradeId: '', sectionId: '' });
  const [guardianSearch, setGuardianSearch] = useState('');
  const [guardianFound, setGuardianFound] = useState<ReturnType<typeof lookupUser> | null>(null);
  const [guardianSearched, setGuardianSearched] = useState(false);
  const [newGuardian, setNewGuardian] = useState({ name: '', nationalId: '', phone: '', relationship: 'father' });
  const [linkedGuardian, setLinkedGuardian] = useState(false);
  const [docs, setDocs] = useState<Record<string, string>>({
    birth_certificate: 'missing', personal_photo: 'missing', previous_certificate: 'missing', transfer_document: 'missing',
  });

  if (!session) return null;
  const school = getSchool(session.activeSchoolId);
  const grades = db.grades.filter(g => g.schoolId === session.activeSchoolId);

  function handleIdentitySearch() {
    const user = lookupUser(nationalId);
    setFoundUser(user ?? null);
    setSearched(true);
  }

  function handleGuardianSearch() {
    const user = lookupUser(guardianSearch);
    setGuardianFound(user ?? null);
    setGuardianSearched(true);
  }

  function nextStep() { setStep(s => Math.min(s + 1, steps.length - 1)); }
  function prevStep() { setStep(s => Math.max(s - 1, 0)); }

  function confirmRegistration() {
    showToast('تم تسجيل الطالب بنجاح (محاكاة)', 'success');
    navigate('/students');
  }

  const docLabels: Record<string, string> = {
    birth_certificate: 'شهادة الميلاد', personal_photo: 'الصورة الشخصية',
    previous_certificate: 'شهادة الصف السابق', transfer_document: 'وثيقة النقل',
  };
  const docStatuses: Record<string, { variant: 'success' | 'warning' | 'error' | 'neutral' | 'info'; label: string }> = {
    missing: { variant: 'error', label: 'مفقود' }, received: { variant: 'info', label: 'مستلم' },
    under_review: { variant: 'warning', label: 'قيد المراجعة' }, accepted: { variant: 'success', label: 'مقبول' },
  };

  return (
    <div>
      <PageHeader title="تسجيل طالب جديد" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الطلاب' }, { label: 'تسجيل طالب' }]} />

      {/* Stepper */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between overflow-x-auto">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                i < step ? 'bg-brand-600 text-white' : i === step ? 'bg-brand-100 text-brand-700 border-2 border-brand-600' : 'bg-sand-100 text-sand-400')}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={cn('text-xs hidden sm:block', i === step ? 'text-sand-800 font-medium' : 'text-sand-400')}>{s}</span>
              {i < steps.length - 1 && <div className={cn('w-8 h-px mx-1', i < step ? 'bg-brand-600' : 'bg-sand-200')} />}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        {/* Step 0: Identity Check */}
        {step === 0 && (
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-semibold text-sand-800 mb-4">التحقق من الهوية</h3>
            <label className="label">رقم الهوية الوطنية</label>
            <div className="flex gap-2">
              <input className="input ltr-numbers" dir="ltr" value={nationalId} onChange={(e) => setNationalId(e.target.value)} placeholder="1000000001" />
              <button className="btn-secondary" onClick={handleIdentitySearch}><Search size={16} /> بحث</button>
            </div>
            {searched && (
              <div className="mt-4">
                {foundUser ? (
                  <div className="p-4 rounded-lg border border-brand-200 bg-brand-50/30">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={foundUser.name} color={foundUser.avatarColor} size={40} />
                      <div><p className="text-sm font-medium text-sand-800">{foundUser.name}</p><p className="text-xs text-sand-400">المستخدم موجود — سيتم ربط التسجيل به</p></div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/30">
                    <p className="text-sm text-amber-700">المستخدم غير موجود — سيتم إنشاء هوية جديدة</p>
                  </div>
                )}
                <button className="btn-primary w-full mt-4" onClick={nextStep}>متابعة</button>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Student Data */}
        {step === 1 && (
          <div className="max-w-lg mx-auto space-y-4">
            <h3 className="text-base font-semibold text-sand-800">بيانات الطالب</h3>
            <div><label className="label">الاسم الكامل</label><input className="input" value={studentData.name} onChange={(e) => setStudentData({ ...studentData, name: e.target.value })} placeholder="اسم الطالب" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">تاريخ الميلاد</label><input type="date" className="input ltr-numbers" value={studentData.birthDate} onChange={(e) => setStudentData({ ...studentData, birthDate: e.target.value })} /></div>
              <div><label className="label">الجنس</label><select className="select" value={studentData.gender} onChange={(e) => setStudentData({ ...studentData, gender: e.target.value })}><option value="male">ذكر</option><option value="female">أنثى</option></select></div>
            </div>
            <div><label className="label">فصيلة الدم (اختياري)</label><input className="input" value={studentData.bloodType} onChange={(e) => setStudentData({ ...studentData, bloodType: e.target.value })} placeholder="O+" /></div>
            <div className="flex justify-between"><button className="btn-secondary" onClick={prevStep}>السابق</button><button className="btn-primary" onClick={nextStep}>التالي</button></div>
          </div>
        )}

        {/* Step 2: Enrollment */}
        {step === 2 && (
          <div className="max-w-lg mx-auto space-y-4">
            <h3 className="text-base font-semibold text-sand-800">التسجيل الدراسي</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">المدرسة</label><input className="input" value={school?.name ?? ''} disabled /></div>
              <div><label className="label">الفرع</label><input className="input" value={getBranch(session.activeBranchId ?? '')?.name ?? 'كل الفروع'} disabled /></div>
              <div><label className="label">المرحلة</label><select className="select" onChange={(e) => setEnrollment({ ...enrollment, gradeId: '', sectionId: '' })}>{db.stages.filter(s => s.schoolId === session.activeSchoolId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
              <div><label className="label">الصف</label><select className="select" value={enrollment.gradeId} onChange={(e) => setEnrollment({ ...enrollment, gradeId: e.target.value })}><option value="">اختر الصف</option>{grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
              <div><label className="label">الشعبة (اختياري)</label><select className="select" value={enrollment.sectionId} onChange={(e) => setEnrollment({ ...enrollment, sectionId: e.target.value })}><option value="">بدون شعبة</option>{db.sections.filter(s => s.gradeId === enrollment.gradeId && s.academicYearId === session.activeAcademicYearId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            </div>
            <div className="flex justify-between"><button className="btn-secondary" onClick={prevStep}>السابق</button><button className="btn-primary" onClick={nextStep}>التالي</button></div>
          </div>
        )}

        {/* Step 3: Guardian */}
        {step === 3 && (
          <div className="max-w-lg mx-auto space-y-4">
            <h3 className="text-base font-semibold text-sand-800">ولي الأمر</h3>
            <label className="label">البحث عن ولي أمر موجود برقم الهوية</label>
            <div className="flex gap-2">
              <input className="input ltr-numbers" dir="ltr" value={guardianSearch} onChange={(e) => setGuardianSearch(e.target.value)} placeholder="رقم الهوية" />
              <button className="btn-secondary" onClick={handleGuardianSearch}><Search size={16} /> بحث</button>
            </div>
            {guardianSearched && guardianFound && (
              <div className="p-4 rounded-lg border border-brand-200 bg-brand-50/30">
                <div className="flex items-center gap-3">
                  <UserAvatar name={guardianFound.name} color={guardianFound.avatarColor} size={40} />
                  <div className="flex-1"><p className="text-sm font-medium text-sand-800">{guardianFound.name}</p><p className="text-xs text-sand-400">ولي أمر موجود</p></div>
                  {!linkedGuardian && <button className="btn-primary btn-sm" onClick={() => { setLinkedGuardian(true); showToast('تم ربط ولي الأمر (محاكاة)', 'success'); }}>ربط</button>}
                  {linkedGuardian && <StatusBadge variant="success">مرتبط</StatusBadge>}
                </div>
              </div>
            )}
            {guardianSearched && !guardianFound && (
              <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/30">
                <p className="text-sm text-amber-700 mb-3">ولي الأمر غير موجود — أنشئ ولي أمر جديد</p>
                <div className="space-y-3">
                  <input className="input" placeholder="الاسم الكامل" value={newGuardian.name} onChange={(e) => setNewGuardian({ ...newGuardian, name: e.target.value })} />
                  <input className="input ltr-numbers" dir="ltr" placeholder="رقم الهوية" value={newGuardian.nationalId} onChange={(e) => setNewGuardian({ ...newGuardian, nationalId: e.target.value })} />
                  <input className="input ltr-numbers" placeholder="رقم الهاتف" value={newGuardian.phone} onChange={(e) => setNewGuardian({ ...newGuardian, phone: e.target.value })} />
                  <select className="select" value={newGuardian.relationship} onChange={(e) => setNewGuardian({ ...newGuardian, relationship: e.target.value })}>
                    <option value="father">أب</option><option value="mother">أم</option><option value="brother">أخ</option>
                    <option value="uncle">عم</option><option value="guardian">وصي</option><option value="other">أخرى</option>
                  </select>
                </div>
              </div>
            )}
            <div className="flex justify-between"><button className="btn-secondary" onClick={prevStep}>السابق</button><button className="btn-primary" onClick={nextStep}>التالي</button></div>
          </div>
        )}

        {/* Step 4: Documents */}
        {step === 4 && (
          <div className="max-w-lg mx-auto space-y-4">
            <h3 className="text-base font-semibold text-sand-800">الوثائق</h3>
            <p className="text-xs text-sand-400">الوثائق الناقصة لا تمنع التسجيل الأولي — يمكن إكمالها لاحقًا</p>
            <div className="space-y-3">
              {Object.entries(docLabels).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-sand-200">
                  <div className="flex items-center gap-3"><FileText size={16} className="text-sand-400" /><span className="text-sm text-sand-700">{label}</span></div>
                  <select className="select max-w-[140px]" value={docs[key]} onChange={(e) => setDocs({ ...docs, [key]: e.target.value })}>
                    <option value="missing">مفقود</option><option value="received">مستلم</option><option value="under_review">قيد المراجعة</option><option value="accepted">مقبول</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="flex justify-between"><button className="btn-secondary" onClick={prevStep}>السابق</button><button className="btn-primary" onClick={nextStep}>التالي</button></div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="max-w-lg mx-auto space-y-4">
            <h3 className="text-base font-semibold text-sand-800">مراجعة التسجيل</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-sand-200">
                <p className="text-xs text-sand-400 mb-1">الطالب</p>
                <p className="text-sm font-medium text-sand-800">{studentData.name || '—'}</p>
                <p className="text-xs text-sand-500">{studentData.gender === 'male' ? 'ذكر' : 'أنثى'} · {studentData.birthDate || '—'}</p>
              </div>
              <div className="p-4 rounded-lg border border-sand-200">
                <p className="text-xs text-sand-400 mb-1">التسجيل</p>
                <p className="text-sm font-medium text-sand-800">{school?.name}</p>
                <p className="text-xs text-sand-500">{grades.find(g => g.id === enrollment.gradeId)?.name ?? '—'} · شعبة {db.sections.find(s => s.id === enrollment.sectionId)?.name ?? '—'}</p>
              </div>
              <div className="p-4 rounded-lg border border-sand-200">
                <p className="text-xs text-sand-400 mb-1">الوثائق</p>
                <div className="flex gap-2 flex-wrap mt-1">
                  {Object.entries(docLabels).map(([key, label]) => <StatusBadge key={key} variant={docStatuses[docs[key]].variant}>{label}: {docStatuses[docs[key]].label}</StatusBadge>)}
                </div>
              </div>
            </div>
            <div className="bg-brand-50/30 border border-brand-200 rounded-lg p-3">
              <p className="text-xs text-sand-600">حالة التسجيل: <strong>نشط</strong> · حالة الوثائق: <strong>{Object.values(docs).every(d => d === 'accepted') ? 'مكتملة' : 'غير مكتملة'}</strong></p>
            </div>
            <div className="flex justify-between"><button className="btn-secondary" onClick={prevStep}>السابق</button><button className="btn-primary" onClick={confirmRegistration}><Check size={14} /> تأكيد التسجيل</button></div>
          </div>
        )}
      </div>
    </div>
  );
}
