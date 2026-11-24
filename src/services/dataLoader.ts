import { supabase } from './supabaseClient';
import type {
  School, Branch, AcademicYear, Term, Period, Stage, Grade, Section, Subject,
  Student, Enrollment, Teacher, TeacherEmployment, TeacherBranchAssignment,
  TeacherQualification, TeachingAssignment, Guardian, GuardianLink,
  AttendanceRecord, StudentDocument, AuditLog, TimetableSlot,
  SchoolMembership, Role, User, SupervisorAssignment,
} from '@/types';

// Maps Supabase snake_case rows to frontend camelCase types.
// Loads everything once at app startup, then db.ts serves synchronously from memory.

export interface SupabaseData {
  users: User[];
  schools: School[];
  branches: Branch[];
  academicYears: AcademicYear[];
  terms: Term[];
  periods: Period[];
  stages: Stage[];
  grades: Grade[];
  sections: Section[];
  subjects: Subject[];
  students: Student[];
  enrollments: Enrollment[];
  teachers: Teacher[];
  teacherEmployments: TeacherEmployment[];
  teacherBranchAssignments: TeacherBranchAssignment[];
  teacherQualifications: TeacherQualification[];
  teachingAssignments: TeachingAssignment[];
  guardians: Guardian[];
  guardianLinks: GuardianLink[];
  attendanceRecords: AttendanceRecord[];
  studentDocuments: StudentDocument[];
  auditLogs: AuditLog[];
  timetableSlots: TimetableSlot[];
  memberships: SchoolMembership[];
  roles: Role[];
  supervisorAssignments: SupervisorAssignment[];
  membershipBranches: Record<string, string[]>;
  subjectStages: Record<string, string[]>;
}

export async function loadSupabaseData(): Promise<SupabaseData> {
  const [
    profiles, schools, branches, academicYears, terms, periods,
    stages, grades, sections, subjects, subjectStages,
    students, enrollments, teachers, teacherEmployments,
    teacherBranchAssignments, teacherQualifications, teachingAssignments,
    guardians, guardianLinks, attendanceRecords, studentDocuments,
    auditLogs, timetableSlots, memberships, membershipBranches,
    roles, supervisorAssignments,
  ] = await Promise.all([
    supabase.from('profiles').select('*').then(r => r.data ?? []),
    supabase.from('schools').select('*').then(r => r.data ?? []),
    supabase.from('branches').select('*').then(r => r.data ?? []),
    supabase.from('academic_years').select('*').then(r => r.data ?? []),
    supabase.from('terms').select('*').then(r => r.data ?? []),
    supabase.from('periods').select('*').then(r => r.data ?? []),
    supabase.from('stages').select('*').then(r => r.data ?? []),
    supabase.from('grades').select('*').then(r => r.data ?? []),
    supabase.from('sections').select('*').then(r => r.data ?? []),
    supabase.from('subjects').select('*').then(r => r.data ?? []),
    supabase.from('subject_stages').select('*').then(r => r.data ?? []),
    supabase.from('students').select('*').then(r => r.data ?? []),
    supabase.from('enrollments').select('*').then(r => r.data ?? []),
    supabase.from('teachers').select('*').then(r => r.data ?? []),
    supabase.from('teacher_employments').select('*').then(r => r.data ?? []),
    supabase.from('teacher_branch_assignments').select('*').then(r => r.data ?? []),
    supabase.from('teacher_qualifications').select('*').then(r => r.data ?? []),
    supabase.from('teaching_assignments').select('*').then(r => r.data ?? []),
    supabase.from('guardians').select('*').then(r => r.data ?? []),
    supabase.from('guardian_links').select('*').then(r => r.data ?? []),
    supabase.from('attendance_records').select('*').then(r => r.data ?? []),
    supabase.from('student_documents').select('*').then(r => r.data ?? []),
    supabase.from('audit_logs').select('*').then(r => r.data ?? []),
    supabase.from('timetable_slots').select('*').then(r => r.data ?? []),
    supabase.from('school_memberships').select('*').then(r => r.data ?? []),
    supabase.from('membership_branches').select('*').then(r => r.data ?? []),
    supabase.from('roles').select('*').then(r => r.data ?? []),
    supabase.from('supervisor_assignments').select('*').then(r => r.data ?? []),
  ]);

  // Build user list from profiles
  const users: User[] = (profiles as any[]).map((p) => ({
    id: p.user_id,
    nationalId: p.national_id,
    name: p.name,
    email: p.email ?? undefined,
    phone: p.phone ?? undefined,
    birthDate: p.birth_date ?? undefined,
    avatarColor: p.avatar_color,
    loginEnabled: p.login_enabled,
  }));

  // Build membership branch lookup
  const memBranchMap: Record<string, string[]> = {};
  for (const mb of membershipBranches as any[]) {
    if (!memBranchMap[mb.membership_id]) memBranchMap[mb.membership_id] = [];
    memBranchMap[mb.membership_id].push(mb.branch_id);
  }

  // Build subject stage lookup
  const subStageMap: Record<string, string[]> = {};
  for (const ss of subjectStages as any[]) {
    if (!subStageMap[ss.subject_id]) subStageMap[ss.subject_id] = [];
    subStageMap[ss.subject_id].push(ss.stage_id);
  }

  // Build supervisor history lookup
  const supBySection: Record<string, SupervisorAssignment[]> = {};
  for (const sa of supervisorAssignments as any[]) {
    const assignment: SupervisorAssignment = {
      id: sa.id,
      teacherId: sa.teacher_id,
      startDate: sa.start_date,
      endDate: sa.end_date,
    };
    if (!supBySection[sa.section_id]) supBySection[sa.section_id] = [];
    supBySection[sa.section_id].push(assignment);
  }

  return {
    users,
    schools: (schools as any[]).map(s => ({
      id: s.id, name: s.name, code: s.code, status: s.status,
      createdAt: s.created_at, logoColor: s.logo_color,
    })),
    branches: (branches as any[]).map(b => ({
      id: b.id, schoolId: b.school_id, name: b.name, code: b.code, status: b.status,
    })),
    academicYears: (academicYears as any[]).map(y => ({
      id: y.id, schoolId: y.school_id, label: y.label, status: y.status,
      startDate: y.start_date, endDate: y.end_date,
    })),
    terms: (terms as any[]).map(t => ({
      id: t.id, academicYearId: t.academic_year_id, name: t.name,
      sequence: t.sequence, startDate: t.start_date, endDate: t.end_date, status: t.status,
    })),
    periods: (periods as any[]).map(p => ({
      id: p.id, termId: p.term_id, name: p.name, sequence: p.sequence,
      startDate: p.start_date, endDate: p.end_date, status: p.status,
    })),
    stages: (stages as any[]).map(s => ({
      id: s.id, schoolId: s.school_id, name: s.name, sequence: s.sequence,
    })),
    grades: (grades as any[]).map(g => ({
      id: g.id, schoolId: g.school_id, stageId: g.stage_id, name: g.name, sequence: g.sequence,
    })),
    sections: (sections as any[]).map(s => ({
      id: s.id, schoolId: s.school_id, branchId: s.branch_id,
      academicYearId: s.academic_year_id, gradeId: s.grade_id,
      name: s.name, capacity: s.capacity, status: s.status,
      supervisorHistory: supBySection[s.id] ?? [],
    })),
    subjects: (subjects as any[]).map(s => ({
      id: s.id, schoolId: s.school_id, name: s.name, code: s.code,
      stageIds: subStageMap[s.id] ?? [], status: s.status,
    })),
    students: (students as any[]).map(s => ({
      id: s.id, userId: s.user_id, studentNumber: s.student_number,
      gender: s.gender, bloodType: s.blood_type ?? undefined, birthDate: s.birth_date ?? undefined,
    })),
    enrollments: (enrollments as any[]).map(e => ({
      id: e.id, studentId: e.student_id, schoolId: e.school_id, branchId: e.branch_id,
      academicYearId: e.academic_year_id, gradeId: e.grade_id, sectionId: e.section_id,
      status: e.status, startDate: e.start_date, endDate: e.end_date,
    })),
    teachers: (teachers as any[]).map(t => ({
      id: t.id, userId: t.user_id, employeeNumber: t.employee_number,
      specialization: t.specialization, status: t.status,
    })),
    teacherEmployments: (teacherEmployments as any[]).map(te => ({
      id: te.id, teacherId: te.teacher_id, schoolId: te.school_id,
      startDate: te.start_date, endDate: te.end_date, status: te.status,
    })),
    teacherBranchAssignments: (teacherBranchAssignments as any[]).map(tba => ({
      id: tba.id, teacherId: tba.teacher_id, branchId: tba.branch_id,
      startDate: tba.start_date, endDate: tba.end_date, status: tba.status,
    })),
    teacherQualifications: (teacherQualifications as any[]).map(tq => ({
      id: tq.id, teacherId: tq.teacher_id, subjectId: tq.subject_id, stageId: tq.stage_id,
    })),
    teachingAssignments: (teachingAssignments as any[]).map(ta => ({
      id: ta.id, teacherId: ta.teacher_id, branchId: ta.branch_id,
      academicYearId: ta.academic_year_id, termId: ta.term_id,
      subjectId: ta.subject_id, gradeId: ta.grade_id, sectionId: ta.section_id,
      status: ta.status,
    })),
    guardians: (guardians as any[]).map(g => ({
      id: g.id, userId: g.user_id, phone: g.phone, occupation: g.occupation ?? undefined,
    })),
    guardianLinks: (guardianLinks as any[]).map(gl => ({
      id: gl.id, guardianId: gl.guardian_id, studentId: gl.student_id,
      relationship: gl.relationship, relationshipLabel: gl.relationship_label,
    })),
    attendanceRecords: (attendanceRecords as any[]).map(a => ({
      id: a.id, sectionId: a.section_id, studentId: a.student_id,
      date: a.date, status: a.status,
    })),
    studentDocuments: (studentDocuments as any[]).map(d => ({
      id: d.id, studentId: d.student_id, type: d.type, status: d.status,
      uploadedDate: d.uploaded_date, notes: d.notes ?? undefined,
    })),
    auditLogs: (auditLogs as any[]).map(l => ({
      id: l.id, userId: l.user_id, action: l.action,
      schoolId: l.school_id, branchId: l.branch_id,
      resource: l.resource, timestamp: l.created_at,
    })),
    timetableSlots: (timetableSlots as any[]).map(t => ({
      id: t.id, sectionId: t.section_id, day: t.day, periodIndex: t.period_index,
      subjectId: t.subject_id, teacherId: t.teacher_id,
      startTime: t.start_time, endTime: t.end_time,
    })),
    memberships: (memberships as any[]).map(m => ({
      id: m.id, userId: m.user_id, schoolId: m.school_id,
      branchIds: memBranchMap[m.id] ?? [], roleKey: m.role_key, roleId: m.role_id,
      status: m.status, startDate: m.start_date, endDate: m.end_date,
    })),
    roles: (roles as any[]).map(r => ({
      id: r.id, name: r.name, scope: r.scope, permissions: r.permissions as any[],
      userCount: 0, status: r.status,
    })),
    supervisorAssignments: (supervisorAssignments as any[]).map(sa => ({
      id: sa.id, teacherId: sa.teacher_id, startDate: sa.start_date, endDate: sa.end_date,
    })),
    membershipBranches: memBranchMap,
    subjectStages: subStageMap,
  };
}
