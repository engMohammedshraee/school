import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { showToast, SearchInput, Pagination } from '@/components/ui';
import { useAuth } from '@/services/authContext';
import { db, studentsBySchool, getUser, documentsByStudent, getBranch, getGrade } from '@/services/db';
import { Upload, FileText, Eye } from 'lucide-react';
import type { StudentDocument, DocumentType, DocumentStatus } from '@/types';

const docLabels: Record<string, string> = { birth_certificate: 'شهادة الميلاد', personal_photo: 'الصورة الشخصية', previous_certificate: 'شهادة الصف السابق', transfer_document: 'وثيقة النقل' };
const statusMap: Record<string, { variant: 'success' | 'warning' | 'error' | 'neutral' | 'info'; label: string }> = {
  missing: { variant: 'error', label: 'مفقود' }, received: { variant: 'info', label: 'مستلم' }, under_review: { variant: 'warning', label: 'قيد المراجعة' },
  accepted: { variant: 'success', label: 'مقبول' }, rejected: { variant: 'error', label: 'مرفوض' }, needs_replacement: { variant: 'warning', label: 'يحتاج استبدال' },
};

export function DocumentsPage({ studentView }: { studentView?: boolean }) {
  const { session } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [uploadDoc, setUploadDoc] = useState<{ studentId: string; studentName: string; docType: DocumentType } | null>(null);
  const pageSize = 10;

  if (!session) return null;

  if (studentView) {
    const student = db.students.find(s => s.userId === session.userId);
    const docs = student ? documentsByStudent(student.id) : [];
    return (
      <div>
        <PageHeader title="وثائقي" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'وثائقي' }]} />
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-sand-800 mb-4">حالة الوثائق</h3>
          <div className="space-y-2">
            {docs.map(d => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border border-sand-200">
                <div className="flex items-center gap-3"><FileText size={16} className="text-sand-400" /><div><p className="text-sm text-sand-700">{docLabels[d.type]}</p>{d.notes && <p className="text-xs text-sand-400 mt-0.5">{d.notes}</p>}</div></div>
                <div className="flex items-center gap-2">{d.uploadedDate && <span className="text-xs text-sand-400 ltr-numbers">{d.uploadedDate}</span>}<StatusBadge variant={statusMap[d.status].variant}>{statusMap[d.status].label}</StatusBadge></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const allStudents = studentsBySchool(session.activeSchoolId, session.activeAcademicYearId);
  let students = allStudents.map(s => {
    const user = getUser(s.userId);
    const docs = documentsByStudent(s.id);
    const complete = docs.every(d => d.status === 'accepted' || d.status === 'received') && docs.length > 0;
    const missing = docs.filter(d => d.status === 'missing' || d.status === 'rejected' || d.status === 'needs_replacement').length;
    return { student: s, user, docs, complete, missingCount: missing };
  }).filter(s => s.user !== undefined);

  if (search) students = students.filter(s => s.user!.name.includes(search));

  const totalPages = Math.ceil(students.length / pageSize);
  const paged = students.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: 'name', header: 'الطالب', render: (s: typeof students[0]) => <span className="font-medium text-sand-800">{s.user!.name}</span> },
    { key: 'branch', header: 'الفرع', render: (s: typeof students[0]) => <span className="text-sand-600 text-sm">{getBranch(db.enrollments.find(e => e.studentId === s.student.id)?.branchId ?? '')?.name ?? '—'}</span> },
    { key: 'grade', header: 'الصف', render: (s: typeof students[0]) => <span className="text-sand-600 text-sm">{getGrade(db.enrollments.find(e => e.studentId === s.student.id)?.gradeId ?? '')?.name ?? '—'}</span> },
    { key: 'docs', header: 'الوثائق', render: (s: typeof students[0]) => <div className="flex gap-1 flex-wrap">{s.docs.map(d => <StatusBadge key={d.id} variant={statusMap[d.status].variant}>{docLabels[d.type]}</StatusBadge>)}</div> },
    { key: 'status', header: 'الحالة', render: (s: typeof students[0]) => s.complete ? <StatusBadge variant="success">مكتملة</StatusBadge> : <StatusBadge variant="warning">{s.missingCount} ناقصة</StatusBadge> },
    {
      key: 'actions', header: 'الإجراءات',
      render: (s: typeof students[0]) => (
        <div className="flex gap-1">
          {s.docs.filter(d => d.status === 'missing').slice(0, 1).map(d => (
            <button key={d.id} className="btn-secondary btn-sm" onClick={() => setUploadDoc({ studentId: s.student.id, studentName: s.user!.name, docType: d.type })}><Upload size={12} /> رفع</button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="وثائق الطلاب" breadcrumbs={[{ label: 'الرئيسية' }, { label: 'الطلاب' }, { label: 'وثائق الطلاب' }]} />
      <div className="card p-0">
        <div className="p-4 border-b border-sand-100"><div className="max-w-xs"><SearchInput value={search} onChange={setSearch} placeholder="بحث..." /></div></div>
        <DataTable columns={columns} data={paged} rowKey={(s) => s.student.id} emptyMessage="لا يوجد طلاب" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal open={!!uploadDoc} onClose={() => setUploadDoc(null)} title="رفع وثيقة"
        footer={<><button className="btn-secondary" onClick={() => setUploadDoc(null)}>إلغاء</button><button className="btn-primary" onClick={() => { showToast('تم رفع الوثيقة (محاكاة)', 'success'); setUploadDoc(null); }}>رفع</button></>}>
        <div className="space-y-4">
          <div><p className="text-sm text-sand-700">الطالب: <strong>{uploadDoc?.studentName}</strong></p><p className="text-sm text-sand-500">الوثيقة: {uploadDoc ? docLabels[uploadDoc.docType] : ''}</p></div>
          <div className="border-2 border-dashed border-sand-300 rounded-lg p-8 text-center cursor-pointer hover:border-brand-400 transition-colors">
            <Upload size={24} className="mx-auto text-sand-400 mb-2" />
            <p className="text-sm text-sand-500">اسحب الملف هنا أو اضغط للاختيار</p>
            <p className="text-xs text-sand-400 mt-1">محاكاة رفع — لا يتم تخزين ملف فعلي</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
