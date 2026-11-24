import type {
  School, Branch, AcademicYear, Term, Period, Stage, Grade, Section, Subject,
  Student, Enrollment, Teacher, TeacherEmployment, TeacherBranchAssignment,
  TeacherQualification, TeachingAssignment, Guardian, GuardianLink,
  AttendanceRecord, StudentDocument, AuditLog, TimetableSlot, User,
  SchoolMembership, Role,
} from '@/types';
import { loadSupabaseData, type SupabaseData } from './dataLoader';

// Central data store backed by Supabase.
// Data is loaded once at startup via initDataStore(), then all lookups are synchronous.

let data: SupabaseData = {
  users: [], schools: [], branches: [], academicYears: [], terms: [], periods: [],
  stages: [], grades: [], sections: [], subjects: [], students: [], enrollments: [],
  teachers: [], teacherEmployments: [], teacherBranchAssignments: [],
  teacherQualifications: [], teachingAssignments: [], guardians: [], guardianLinks: [],
  attendanceRecords: [], studentDocuments: [], auditLogs: [], timetableSlots: [],
  memberships: [], roles: [], supervisorAssignments: [], membershipBranches: {},
  subjectStages: {},
};

let loaded = false;
let loadPromise: Promise<void> | null = null;

export async function initDataStore(): Promise<void> {
  if (loaded) return;
  if (loadPromise) return loadPromise;
  loadPromise = loadSupabaseData().then((d) => {
    data = d;
    loaded = true;
  });
  return loadPromise;
}

export function isDataLoaded(): boolean {
  return loaded;
}

export const db = {
  get users() { return data.users; },
  get schools() { return data.schools; },
  get branches() { return data.branches; },
  get academicYears() { return data.academicYears; },
  get terms() { return data.terms; },
  get periods() { return data.periods; },
  get stages() { return data.stages; },
  get grades() { return data.grades; },
  get sections() { return data.sections; },
  get subjects() { return data.subjects; },
  get students() { return data.students; },
  get enrollments() { return data.enrollments; },
  get teachers() { return data.teachers; },
  get teacherEmployments() { return data.teacherEmployments; },
  get teacherBranchAssignments() { return data.teacherBranchAssignments; },
  get teacherQualifications() { return data.teacherQualifications; },
  get teachingAssignments() { return data.teachingAssignments; },
  get guardians() { return data.guardians; },
  get guardianLinks() { return data.guardianLinks; },
  get attendanceRecords() { return data.attendanceRecords; },
  get studentDocuments() { return data.studentDocuments; },
  get auditLogs() { return data.auditLogs; },
  get timetableSlots() { return data.timetableSlots; },
  get memberships() { return data.memberships; },
  get roles() { return data.roles; },
};

export type DB = typeof db;

// --- Lookup helpers ---
export function getSchool(id: string): School | undefined { return db.schools.find(s => s.id === id); }
export function getBranch(id: string): Branch | undefined { return db.branches.find(b => b.id === id); }
export function getAcademicYear(id: string): AcademicYear | undefined { return db.academicYears.find(y => y.id === id); }
export function getTerm(id: string): Term | undefined { return db.terms.find(t => t.id === id); }
export function getPeriod(id: string): Period | undefined { return db.periods.find(p => p.id === id); }
export function getStage(id: string): Stage | undefined { return db.stages.find(s => s.id === id); }
export function getGrade(id: string): Grade | undefined { return db.grades.find(g => g.id === id); }
export function getSection(id: string): Section | undefined { return db.sections.find(s => s.id === id); }
export function getSubject(id: string): Subject | undefined { return db.subjects.find(s => s.id === id); }
export function getStudent(id: string): Student | undefined { return db.students.find(s => s.id === id); }
export function getTeacher(id: string): Teacher | undefined { return db.teachers.find(t => t.id === id); }
export function getGuardian(id: string): Guardian | undefined { return db.guardians.find(g => g.id === id); }
export function getUser(id: string): User | undefined { return db.users.find(u => u.id === id); }
export function getRole(id: string): Role | undefined { return db.roles.find(r => r.id === id); }
export function getMembership(id: string): SchoolMembership | undefined { return db.memberships.find(m => m.id === id); }

// --- Scoped queries ---
export function branchesBySchool(schoolId: string): Branch[] {
  return db.branches.filter(b => b.schoolId === schoolId);
}
export function academicYearsBySchool(schoolId: string): AcademicYear[] {
  return db.academicYears.filter(y => y.schoolId === schoolId);
}
export function stagesBySchool(schoolId: string): Stage[] {
  return db.stages.filter(s => s.schoolId === schoolId);
}
export function gradesBySchool(schoolId: string): Grade[] {
  return db.grades.filter(g => g.schoolId === schoolId);
}
export function gradesByStage(stageId: string): Grade[] {
  return db.grades.filter(g => g.stageId === stageId);
}
export function subjectsBySchool(schoolId: string): Subject[] {
  return db.subjects.filter(s => s.schoolId === schoolId);
}
export function sectionsBySchool(schoolId: string): Section[] {
  return db.sections.filter(s => s.schoolId === schoolId);
}
export function termsByYear(yearId: string): Term[] {
  return db.terms.filter(t => t.academicYearId === yearId);
}
export function periodsByTerm(termId: string): Period[] {
  return db.periods.filter(p => p.termId === termId);
}
export function enrollmentsByStudent(studentId: string): Enrollment[] {
  return db.enrollments.filter(e => e.studentId === studentId);
}
export function activeEnrollment(studentId: string, academicYearId: string): Enrollment | undefined {
  return db.enrollments.find(e => e.studentId === studentId && e.academicYearId === academicYearId && e.status === 'active');
}
export function studentsBySection(sectionId: string): Student[] {
  const studentIds = db.enrollments
    .filter(e => e.sectionId === sectionId && e.status === 'active')
    .map(e => e.studentId);
  return db.students.filter(s => studentIds.includes(s.id));
}
export function studentsByBranch(branchId: string, academicYearId: string): Student[] {
  const studentIds = db.enrollments
    .filter(e => e.branchId === branchId && e.academicYearId === academicYearId && e.status === 'active')
    .map(e => e.studentId);
  return db.students.filter(s => studentIds.includes(s.id));
}
export function studentsBySchool(schoolId: string, academicYearId: string): Student[] {
  const studentIds = db.enrollments
    .filter(e => e.schoolId === schoolId && e.academicYearId === academicYearId && e.status === 'active')
    .map(e => e.studentId);
  return db.students.filter(s => studentIds.includes(s.id));
}
export function teachersBySchool(schoolId: string): Teacher[] {
  const teacherIds = db.teacherEmployments
    .filter(te => te.schoolId === schoolId && te.status === 'active')
    .map(te => te.teacherId);
  return db.teachers.filter(t => teacherIds.includes(t.id));
}
export function teachersByBranch(branchId: string): Teacher[] {
  const teacherIds = db.teacherBranchAssignments
    .filter(tba => tba.branchId === branchId && tba.status === 'active')
    .map(tba => tba.teacherId);
  return db.teachers.filter(t => teacherIds.includes(t.id));
}
export function teachingAssignmentsByTeacher(teacherId: string): TeachingAssignment[] {
  return db.teachingAssignments.filter(ta => ta.teacherId === teacherId);
}
export function teachingAssignmentsBySection(sectionId: string): TeachingAssignment[] {
  return db.teachingAssignments.filter(ta => ta.sectionId === sectionId);
}
export function employmentsByTeacher(teacherId: string): TeacherEmployment[] {
  return db.teacherEmployments.filter(te => te.teacherId === teacherId);
}
export function branchAssignmentsByTeacher(teacherId: string): TeacherBranchAssignment[] {
  return db.teacherBranchAssignments.filter(tba => tba.teacherId === teacherId);
}
export function qualificationsByTeacher(teacherId: string): TeacherQualification[] {
  return db.teacherQualifications.filter(tq => tq.teacherId === teacherId);
}
export function guardianLinksByGuardian(guardianId: string): GuardianLink[] {
  return db.guardianLinks.filter(gl => gl.guardianId === guardianId);
}
export function guardianLinksByStudent(studentId: string): GuardianLink[] {
  return db.guardianLinks.filter(gl => gl.studentId === studentId);
}
export function documentsByStudent(studentId: string): StudentDocument[] {
  return db.studentDocuments.filter(d => d.studentId === studentId);
}
export function attendanceBySection(sectionId: string, date: string): AttendanceRecord[] {
  return db.attendanceRecords.filter(a => a.sectionId === sectionId && a.date === date);
}
export function attendanceByStudent(studentId: string): AttendanceRecord[] {
  return db.attendanceRecords.filter(a => a.studentId === studentId);
}
export function timetableBySection(sectionId: string): TimetableSlot[] {
  return db.timetableSlots.filter(t => t.sectionId === sectionId);
}
export function timetableByTeacher(teacherId: string): TimetableSlot[] {
  return db.timetableSlots.filter(t => t.teacherId === teacherId);
}
export function membershipsByUser(userId: string): SchoolMembership[] {
  return db.memberships.filter(m => m.userId === userId);
}
export function membershipsBySchool(schoolId: string): SchoolMembership[] {
  return db.memberships.filter(m => m.schoolId === schoolId);
}
export function auditLogsBySchool(schoolId: string): AuditLog[] {
  return db.auditLogs.filter(l => l.schoolId === schoolId);
}
