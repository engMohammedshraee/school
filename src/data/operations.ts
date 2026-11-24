import type { AttendanceRecord, StudentDocument, AuditLog, TimetableSlot, DocumentType } from '@/types';

// Attendance for section sec-3 (grade 5, section A, branch 1) on 2026-08-25
// Students in sec-3: stu-1, stu-12, stu-18
export const attendanceRecords: AttendanceRecord[] = [
  { id: 'att-1', sectionId: 'sec-3', studentId: 'stu-1', date: '2026-08-25', status: 'present' },
  { id: 'att-2', sectionId: 'sec-3', studentId: 'stu-12', date: '2026-08-25', status: 'present' },
  { id: 'att-3', sectionId: 'sec-3', studentId: 'stu-18', date: '2026-08-25', status: 'late' },
  // sec-1 students: stu-5, stu-8, stu-14, stu-20
  { id: 'att-4', sectionId: 'sec-1', studentId: 'stu-5', date: '2026-08-25', status: 'present' },
  { id: 'att-5', sectionId: 'sec-1', studentId: 'stu-8', date: '2026-08-25', status: 'absent' },
  { id: 'att-6', sectionId: 'sec-1', studentId: 'stu-14', date: '2026-08-25', status: 'present' },
  { id: 'att-7', sectionId: 'sec-1', studentId: 'stu-20', date: '2026-08-25', status: 'excused' },
  // sec-5 students: stu-2, stu-4, stu-7, stu-9, stu-11, stu-13, stu-15, stu-17, stu-19
  { id: 'att-8', sectionId: 'sec-5', studentId: 'stu-2', date: '2026-08-25', status: 'present' },
  { id: 'att-9', sectionId: 'sec-5', studentId: 'stu-4', date: '2026-08-25', status: 'present' },
  { id: 'att-10', sectionId: 'sec-5', studentId: 'stu-7', date: '2026-08-25', status: 'present' },
  { id: 'att-11', sectionId: 'sec-5', studentId: 'stu-9', date: '2026-08-25', status: 'late' },
  { id: 'att-12', sectionId: 'sec-5', studentId: 'stu-11', date: '2026-08-25', status: 'present' },
  { id: 'att-13', sectionId: 'sec-5', studentId: 'stu-13', date: '2026-08-25', status: 'absent' },
  { id: 'att-14', sectionId: 'sec-5', studentId: 'stu-15', date: '2026-08-25', status: 'present' },
  { id: 'att-15', sectionId: 'sec-5', studentId: 'stu-17', date: '2026-08-25', status: 'present' },
  { id: 'att-16', sectionId: 'sec-5', studentId: 'stu-19', date: '2026-08-25', status: 'present' },
];

const docTypes: DocumentType[] = ['birth_certificate', 'personal_photo', 'previous_certificate', 'transfer_document'];

function generateDocuments() {
  const docs: StudentDocument[] = [];
  const studentIds = ['stu-1','stu-2','stu-3','stu-4','stu-5','stu-6','stu-7','stu-8','stu-9','stu-10',
    'stu-11','stu-12','stu-13','stu-14','stu-15','stu-16','stu-17','stu-18','stu-19','stu-20','stu-21','stu-22'];
  let idCounter = 1;

  for (const studentId of studentIds) {
    for (const type of docTypes) {
      const seed = (idCounter * 7 + studentId.charCodeAt(4)) % 10;
      let status: StudentDocument['status'];
      if (seed < 3) status = 'missing';
      else if (seed < 5) status = 'received';
      else if (seed < 7) status = 'accepted';
      else if (seed < 8) status = 'under_review';
      else if (seed < 9) status = 'rejected';
      else status = 'needs_replacement';

      docs.push({
        id: `doc-${idCounter++}`,
        studentId,
        type,
        status,
        uploadedDate: status === 'missing' ? null : '2026-08-20',
        notes: status === 'rejected' ? 'الصورة غير واضحة، يرجى إعادة رفعها' : undefined,
      });
    }
  }
  return docs;
}

export const studentDocuments: StudentDocument[] = generateDocuments();

export const auditLogs: AuditLog[] = [
  { id: 'log-1', userId: 'usr-2', action: 'تسجيل طالب جديد', schoolId: 'sch-1', branchId: 'br-1', resource: 'students/stu-1', timestamp: '2026-08-25T08:30:00' },
  { id: 'log-2', userId: 'usr-3', action: 'تعديل تسجيل طالب', schoolId: 'sch-1', branchId: 'br-2', resource: 'enrollments/enr-3', timestamp: '2026-08-24T14:15:00' },
  { id: 'log-3', userId: 'usr-2', action: 'إضافة عضو للمدرسة', schoolId: 'sch-1', branchId: null, resource: 'memberships/mem-11', timestamp: '2026-08-23T10:00:00' },
  { id: 'log-4', userId: 'usr-2', action: 'منح دور', schoolId: 'sch-1', branchId: null, resource: 'memberships/mem-11', timestamp: '2026-08-23T10:05:00' },
  { id: 'log-5', userId: 'usr-1', action: 'تغيير مدير المدرسة', schoolId: 'sch-2', branchId: null, resource: 'memberships/mem-12', timestamp: '2026-08-22T09:00:00' },
  { id: 'log-6', userId: 'usr-2', action: 'إغلاق فرع', schoolId: 'sch-2', branchId: 'br-5', resource: 'branches/br-5', timestamp: '2026-08-21T16:30:00' },
  { id: 'log-7', userId: 'usr-3', action: 'تحويل طالب', schoolId: 'sch-1', branchId: 'br-3', resource: 'enrollments/enr-2', timestamp: '2026-08-20T11:20:00' },
  { id: 'log-8', userId: 'usr-2', action: 'إنهاء دور', schoolId: 'sch-1', branchId: null, resource: 'memberships/mem-14', timestamp: '2026-08-19T13:00:00' },
  { id: 'log-9', userId: 'usr-4', action: 'تسجيل الحضور', schoolId: 'sch-1', branchId: 'br-1', resource: 'attendance/sec-3', timestamp: '2026-08-25T07:45:00' },
  { id: 'log-10', userId: 'usr-2', action: 'إنشاء شعبة جديدة', schoolId: 'sch-1', branchId: 'br-1', resource: 'sections/sec-8', timestamp: '2026-08-18T09:30:00' },
  { id: 'log-11', userId: 'usr-1', action: 'تفعيل مدرسة', schoolId: 'sch-2', branchId: null, resource: 'schools/sch-2', timestamp: '2026-08-15T08:00:00' },
  { id: 'log-12', userId: 'usr-3', action: 'استلام وثيقة طالب', schoolId: 'sch-1', branchId: 'br-1', resource: 'documents/doc-5', timestamp: '2026-08-20T10:00:00' },
];

// Timetable for sec-3 (grade 5, section A) — days: Sat=0, Sun=1, Mon=2, Tue=3, Wed=4
export const timetableSlots: TimetableSlot[] = [
  { id: 'tt-1', sectionId: 'sec-3', day: 0, periodIndex: 0, subjectId: 'sub-1', teacherId: 'tch-1', startTime: '07:00', endTime: '07:45' },
  { id: 'tt-2', sectionId: 'sec-3', day: 0, periodIndex: 1, subjectId: 'sub-2', teacherId: 'tch-2', startTime: '07:50', endTime: '08:35' },
  { id: 'tt-3', sectionId: 'sec-3', day: 0, periodIndex: 2, subjectId: 'sub-3', teacherId: 'tch-3', startTime: '08:40', endTime: '09:25' },
  { id: 'tt-4', sectionId: 'sec-3', day: 0, periodIndex: 3, subjectId: 'sub-5', teacherId: 'tch-5', startTime: '09:40', endTime: '10:25' },
  { id: 'tt-5', sectionId: 'sec-3', day: 0, periodIndex: 4, subjectId: 'sub-4', teacherId: 'tch-4', startTime: '10:30', endTime: '11:15' },

  { id: 'tt-6', sectionId: 'sec-3', day: 1, periodIndex: 0, subjectId: 'sub-2', teacherId: 'tch-2', startTime: '07:00', endTime: '07:45' },
  { id: 'tt-7', sectionId: 'sec-3', day: 1, periodIndex: 1, subjectId: 'sub-1', teacherId: 'tch-1', startTime: '07:50', endTime: '08:35' },
  { id: 'tt-8', sectionId: 'sec-3', day: 1, periodIndex: 2, subjectId: 'sub-6', teacherId: 'tch-6', startTime: '08:40', endTime: '09:25' },
  { id: 'tt-9', sectionId: 'sec-3', day: 1, periodIndex: 3, subjectId: 'sub-7', teacherId: 'tch-7', startTime: '09:40', endTime: '10:25' },

  { id: 'tt-10', sectionId: 'sec-3', day: 2, periodIndex: 0, subjectId: 'sub-3', teacherId: 'tch-3', startTime: '07:00', endTime: '07:45' },
  { id: 'tt-11', sectionId: 'sec-3', day: 2, periodIndex: 1, subjectId: 'sub-4', teacherId: 'tch-4', startTime: '07:50', endTime: '08:35' },
  { id: 'tt-12', sectionId: 'sec-3', day: 2, periodIndex: 2, subjectId: 'sub-1', teacherId: 'tch-1', startTime: '08:40', endTime: '09:25' },
  { id: 'tt-13', sectionId: 'sec-3', day: 2, periodIndex: 3, subjectId: 'sub-5', teacherId: 'tch-5', startTime: '09:40', endTime: '10:25' },
  { id: 'tt-14', sectionId: 'sec-3', day: 2, periodIndex: 4, subjectId: 'sub-2', teacherId: 'tch-2', startTime: '10:30', endTime: '11:15' },

  { id: 'tt-15', sectionId: 'sec-3', day: 3, periodIndex: 0, subjectId: 'sub-5', teacherId: 'tch-5', startTime: '07:00', endTime: '07:45' },
  { id: 'tt-16', sectionId: 'sec-3', day: 3, periodIndex: 1, subjectId: 'sub-3', teacherId: 'tch-3', startTime: '07:50', endTime: '08:35' },
  { id: 'tt-17', sectionId: 'sec-3', day: 3, periodIndex: 2, subjectId: 'sub-4', teacherId: 'tch-4', startTime: '08:40', endTime: '09:25' },
  { id: 'tt-18', sectionId: 'sec-3', day: 3, periodIndex: 3, subjectId: 'sub-1', teacherId: 'tch-1', startTime: '09:40', endTime: '10:25' },

  { id: 'tt-19', sectionId: 'sec-3', day: 4, periodIndex: 0, subjectId: 'sub-2', teacherId: 'tch-2', startTime: '07:00', endTime: '07:45' },
  { id: 'tt-20', sectionId: 'sec-3', day: 4, periodIndex: 1, subjectId: 'sub-6', teacherId: 'tch-6', startTime: '07:50', endTime: '08:35' },
  { id: 'tt-21', sectionId: 'sec-3', day: 4, periodIndex: 2, subjectId: 'sub-1', teacherId: 'tch-1', startTime: '08:40', endTime: '09:25' },
  { id: 'tt-22', sectionId: 'sec-3', day: 4, periodIndex: 3, subjectId: 'sub-7', teacherId: 'tch-7', startTime: '09:40', endTime: '10:25' },

  // Some slots for sec-1 (grade 4, section A)
  { id: 'tt-23', sectionId: 'sec-1', day: 0, periodIndex: 0, subjectId: 'sub-1', teacherId: 'tch-1', startTime: '07:00', endTime: '07:45' },
  { id: 'tt-24', sectionId: 'sec-1', day: 0, periodIndex: 1, subjectId: 'sub-2', teacherId: 'tch-2', startTime: '07:50', endTime: '08:35' },
  { id: 'tt-25', sectionId: 'sec-1', day: 2, periodIndex: 0, subjectId: 'sub-1', teacherId: 'tch-1', startTime: '07:00', endTime: '07:45' },
];
