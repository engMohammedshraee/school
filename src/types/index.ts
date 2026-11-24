// Domain types for MASAR prototype
// These are frontend mock types — NOT the production Laravel database schema.

export type ID = string;

export type RoleKey =
  | 'platform_super_admin'
  | 'school_manager'
  | 'student_affairs'
  | 'teacher'
  | 'guardian'
  | 'student'
  | 'accountant'
  | 'admin_staff';

export type Permission =
  | 'platform.schools.view'
  | 'platform.schools.manage'
  | 'platform.users.view'
  | 'platform.audit.view'
  | 'branches.view'
  | 'branches.manage'
  | 'users.view'
  | 'users.manage'
  | 'roles.view'
  | 'roles.manage'
  | 'students.view'
  | 'students.create'
  | 'students.edit'
  | 'students.delete'
  | 'students.transfer'
  | 'guardians.view'
  | 'guardians.manage'
  | 'teachers.view'
  | 'teachers.manage'
  | 'academic.years.view'
  | 'academic.years.manage'
  | 'academic.terms.view'
  | 'academic.terms.manage'
  | 'academic.periods.view'
  | 'academic.periods.manage'
  | 'stages.view'
  | 'stages.manage'
  | 'grades.view'
  | 'grades.manage'
  | 'sections.view'
  | 'sections.manage'
  | 'subjects.view'
  | 'subjects.manage'
  | 'teaching_assignments.view'
  | 'teaching_assignments.manage'
  | 'timetable.view'
  | 'timetable.manage'
  | 'attendance.view'
  | 'attendance.manage'
  | 'documents.view'
  | 'documents.manage'
  | 'audit.view'
  | 'settings.manage'
  | 'finance.view'
  | 'own.dashboard';

export interface User {
  id: ID;
  nationalId: string;
  name: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  avatarColor: string;
  loginEnabled: boolean;
}

export interface School {
  id: ID;
  name: string;
  code: string;
  status: 'active' | 'suspended';
  createdAt: string;
  logoColor: string;
}

export interface Branch {
  id: ID;
  schoolId: ID;
  name: string;
  code: string;
  status: 'active' | 'inactive' | 'closed';
}

export interface AcademicYear {
  id: ID;
  schoolId: ID;
  label: string; // "2026 / 2027"
  status: 'active' | 'closed' | 'preparing';
  startDate: string;
  endDate: string;
}

export interface Term {
  id: ID;
  academicYearId: ID;
  name: string;
  sequence: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'closed' | 'preparing';
}

export interface Period {
  id: ID;
  termId: ID;
  name: string;
  sequence: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'closed';
}

export interface Stage {
  id: ID;
  schoolId: ID;
  name: string;
  sequence: number;
}

export interface Grade {
  id: ID;
  schoolId: ID;
  stageId: ID;
  name: string;
  sequence: number;
}

export interface Section {
  id: ID;
  schoolId: ID;
  branchId: ID;
  academicYearId: ID;
  gradeId: ID;
  name: string; // "أ"
  capacity: number;
  status: 'active' | 'inactive';
  supervisorHistory: SupervisorAssignment[];
}

export interface SupervisorAssignment {
  id: ID;
  teacherId: ID;
  startDate: string;
  endDate: string | null; // null = current
}

export interface Subject {
  id: ID;
  schoolId: ID;
  name: string;
  code: string;
  stageIds: ID[];
  status: 'active' | 'inactive';
}

export interface Role {
  id: ID;
  name: string;
  scope: 'school' | 'branch' | 'platform';
  permissions: Permission[];
  userCount: number;
  status: 'active' | 'inactive';
}

export interface SchoolMembership {
  id: ID;
  userId: ID;
  schoolId: ID;
  branchIds: ID[]; // empty = all branches in school
  roleKey: RoleKey;
  roleId: ID;
  status: 'active' | 'suspended' | 'ended';
  startDate: string;
  endDate: string | null;
}

export interface Guardian {
  id: ID;
  userId: ID;
  phone: string;
  occupation?: string;
}

export interface GuardianLink {
  id: ID;
  guardianId: ID;
  studentId: ID;
  relationship: 'father' | 'mother' | 'brother' | 'uncle' | 'guardian' | 'other';
  relationshipLabel: string;
}

export interface Student {
  id: ID;
  userId: ID;
  studentNumber: string;
  gender: 'male' | 'female';
  bloodType?: string;
  birthDate?: string;
}

export interface Enrollment {
  id: ID;
  studentId: ID;
  schoolId: ID;
  branchId: ID;
  academicYearId: ID;
  gradeId: ID;
  sectionId: ID | null;
  status: 'active' | 'completed' | 'transferred' | 'ended';
  startDate: string;
  endDate: string | null;
}

export interface Teacher {
  id: ID;
  userId: ID;
  employeeNumber: string;
  specialization: string;
  status: 'active' | 'inactive';
}

export interface TeacherEmployment {
  id: ID;
  teacherId: ID;
  schoolId: ID;
  startDate: string;
  endDate: string | null;
  status: 'active' | 'ended';
}

export interface TeacherBranchAssignment {
  id: ID;
  teacherId: ID;
  branchId: ID;
  startDate: string;
  endDate: string | null;
  status: 'active' | 'ended';
}

export interface TeacherQualification {
  id: ID;
  teacherId: ID;
  subjectId: ID;
  stageId: ID;
}

export interface TeachingAssignment {
  id: ID;
  teacherId: ID;
  branchId: ID;
  academicYearId: ID;
  termId: ID;
  subjectId: ID;
  gradeId: ID;
  sectionId: ID;
  status: 'active' | 'ended';
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: ID;
  sectionId: ID;
  studentId: ID;
  date: string;
  status: AttendanceStatus;
}

export type DocumentStatus =
  | 'missing'
  | 'received'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'needs_replacement';

export type DocumentType =
  | 'birth_certificate'
  | 'personal_photo'
  | 'previous_certificate'
  | 'transfer_document';

export interface StudentDocument {
  id: ID;
  studentId: ID;
  type: DocumentType;
  status: DocumentStatus;
  uploadedDate: string | null;
  notes?: string;
}

export interface AuditLog {
  id: ID;
  userId: ID;
  action: string;
  schoolId: ID | null;
  branchId: ID | null;
  resource: string;
  timestamp: string;
}

export interface TimetableSlot {
  id: ID;
  sectionId: ID;
  day: number; // 0=Sat .. 4=Wed (Thu/Fri off in many Arabic calendars)
  periodIndex: number;
  subjectId: ID;
  teacherId: ID;
  startTime: string;
  endTime: string;
}

export interface AuthSession {
  userId: ID;
  activeMembershipId: ID;
  activeSchoolId: ID;
  activeBranchId: ID | null; // null = all branches
  activeAcademicYearId: ID;
}
