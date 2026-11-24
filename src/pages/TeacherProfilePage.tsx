import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { UserAvatar, Tabs } from '@/components/ui';
import { db, getTeacher, getUser, getSchool, getBranch, getSubject, getStage, getGrade, getSection, employmentsByTeacher, branchAssignmentsByTeacher, qualificationsByTeacher, teachingAssignmentsByTeacher } from '@/services/db';
import { ArrowRight } from 'lucide-react';

export function TeacherProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const teacher = id ? getTeacher(id) : undefined;
  if (!teacher) return <div>المعلم غير موجود</div>;
  const user = getUser(teacher.userId);
  if (!user) return <div>المستخدم غير موجود</div>;

  const employments = employmentsByTeacher(teacher.id);
  const branchAssignments = branchAssignmentsByTeacher(teacher.id);
  const qualifications = qualificationsByTeacher(teacher.id);
  const assignments = teachingAssignmentsByTeacher(teacher.id);

  return (
    <div>
      <PageHeader
        title={user.name}
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'المعلمون' }, { label: user.name }]}
        actions={<button className="btn-secondary btn-sm" onClick={() => navigate('/teachers')}><ArrowRight size={14} /> رجوع</button>}
      />

      <div className="card p-5 mb-6">
        <div className="flex items-center gap-4">
          <UserAvatar name={user.name} color={user.avatarColor} size={64} />
          <div>
            <h2 className="text-lg font-bold text-sand-900">{user.name}</h2>
            <p className="text-sm text-sand-500">{teacher.specialization} · <span className="ltr-numbers">{teacher.employeeNumber}</span></p>
            {teacher.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : <StatusBadge variant="neutral">غير نشط</StatusBadge>}
          </div>
        </div>
      </div>

      <Tabs
        tabs={[
          { key: 'overview', label: 'نظرة عامة' },
          { key: 'employment', label: 'التوظيف' },
          { key: 'branches', label: 'الفروع' },
          { key: 'qualifications', label: 'المؤهلات' },
          { key: 'assignments', label: 'التكليفات التدريسية' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-4">
        {activeTab === 'overview' && (
          <div className="card p-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-sand-400 mb-1">الاسم</p><p className="text-sand-700">{user.name}</p></div>
              <div><p className="text-xs text-sand-400 mb-1">الرقم الوظيفي</p><p className="ltr-numbers text-sand-700">{teacher.employeeNumber}</p></div>
              <div><p className="text-xs text-sand-400 mb-1">التخصص</p><p className="text-sand-700">{teacher.specialization}</p></div>
              <div><p className="text-xs text-sand-400 mb-1">الهاتف</p><p className="ltr-numbers text-sand-700">{user.phone ?? '—'}</p></div>
            </div>
          </div>
        )}

        {activeTab === 'employment' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-4">سجل التوظيف</h3>
            <div className="space-y-3">
              {employments.map(emp => {
                const school = getSchool(emp.schoolId);
                return (
                  <div key={emp.id} className="flex items-center gap-3 p-3 rounded-lg border border-sand-200">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: school?.logoColor ?? '#78716c' }}>{school?.name[0]}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-sand-800">{school?.name}</p>
                      <p className="text-xs text-sand-400 ltr-numbers">{emp.startDate} → {emp.endDate ?? 'حتى الآن'}</p>
                    </div>
                    {emp.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : <StatusBadge variant="neutral">منتهي</StatusBadge>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'branches' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-4">تكليفات الفروع</h3>
            <div className="space-y-3">
              {branchAssignments.map(ba => {
                const branch = getBranch(ba.branchId);
                return (
                  <div key={ba.id} className="flex items-center gap-3 p-3 rounded-lg border border-sand-200">
                    <div className="w-10 h-10 rounded-lg bg-sand-100 flex items-center justify-center text-sand-600 font-bold">{branch?.name[0]}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-sand-800">{branch?.name}</p>
                      <p className="text-xs text-sand-400 ltr-numbers">{ba.startDate} → {ba.endDate ?? 'حتى الآن'}</p>
                    </div>
                    {ba.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : <StatusBadge variant="neutral">منتهي</StatusBadge>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'qualifications' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-2">المؤهلات</h3>
            <p className="text-xs text-sand-400 mb-4">ماذا يمكن للمعلم تدريسه — يختلف عن التكليف الفعلي</p>
            <div className="space-y-2">
              {qualifications.map(q => {
                const subject = getSubject(q.subjectId);
                const stage = getStage(q.stageId);
                return (
                  <div key={q.id} className="flex items-center gap-3 p-3 rounded-lg border border-sand-200">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-sm">{subject?.name[0]}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-sand-800">{subject?.name}</p>
                      <p className="text-xs text-sand-400">{stage?.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-sand-800 mb-2">التكليفات التدريسية</h3>
            <p className="text-xs text-sand-400 mb-4">ماذا تم تكليف المعلم بتدريسه فعليًا</p>
            <div className="space-y-2">
              {assignments.map(a => {
                const subject = getSubject(a.subjectId);
                const grade = getGrade(a.gradeId);
                const section = getSection(a.sectionId);
                const branch = getBranch(a.branchId);
                return (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border border-sand-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-sand-800">{subject?.name} · {grade?.name} · شعبة {section?.name}</p>
                      <p className="text-xs text-sand-400">{branch?.name}</p>
                    </div>
                    {a.status === 'active' ? <StatusBadge variant="success">نشط</StatusBadge> : <StatusBadge variant="neutral">منتهي</StatusBadge>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
