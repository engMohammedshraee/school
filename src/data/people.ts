import type { Student, Guardian, GuardianLink, Enrollment, Teacher, TeacherEmployment, TeacherBranchAssignment, TeacherQualification, TeachingAssignment, Section, SupervisorAssignment } from '@/types';

export const students: Student[] = [
  { id: 'stu-1', userId: 'usr-6', studentNumber: 'RYD2024001', gender: 'male', bloodType: 'O+', birthDate: '2014-03-15' },
  { id: 'stu-2', userId: 'usr-13', studentNumber: 'RYD2024002', gender: 'female', birthDate: '2014-05-20' },
  { id: 'stu-3', userId: 'usr-14', studentNumber: 'RYD2024003', gender: 'male', birthDate: '2013-01-10' },
  { id: 'stu-4', userId: 'usr-15', studentNumber: 'RYD2024004', gender: 'female', birthDate: '2014-11-05' },
  { id: 'stu-5', userId: 'usr-16', studentNumber: 'RYD2024005', gender: 'male', birthDate: '2015-02-14' },
  { id: 'stu-6', userId: 'usr-17', studentNumber: 'RYD2024006', gender: 'male', birthDate: '2013-07-22' },
  { id: 'stu-7', userId: 'usr-18', studentNumber: 'RYD2024007', gender: 'female', birthDate: '2014-09-30' },
  { id: 'stu-8', userId: 'usr-19', studentNumber: 'RYD2024008', gender: 'male', birthDate: '2015-04-12' },
  { id: 'stu-9', userId: 'usr-20', studentNumber: 'RYD2024009', gender: 'female', birthDate: '2014-12-01' },
  { id: 'stu-10', userId: 'usr-21', studentNumber: 'RYD2024010', gender: 'male', birthDate: '2013-03-18' },
  { id: 'stu-11', userId: 'usr-22', studentNumber: 'RYD2024011', gender: 'female', birthDate: '2015-06-25' },
  { id: 'stu-12', userId: 'usr-23', studentNumber: 'RYD2024012', gender: 'male', birthDate: '2014-08-08' },
  { id: 'stu-13', userId: 'usr-24', studentNumber: 'RYD2024013', gender: 'female', birthDate: '2013-11-14' },
  { id: 'stu-14', userId: 'usr-25', studentNumber: 'RYD2024014', gender: 'male', birthDate: '2015-01-30' },
  { id: 'stu-15', userId: 'usr-26', studentNumber: 'RYD2024015', gender: 'female', birthDate: '2014-04-17' },
  { id: 'stu-16', userId: 'usr-27', studentNumber: 'RYD2024016', gender: 'male', birthDate: '2013-10-05' },
  { id: 'stu-17', userId: 'usr-28', studentNumber: 'RYD2024017', gender: 'female', birthDate: '2015-07-19' },
  { id: 'stu-18', userId: 'usr-29', studentNumber: 'RYD2024018', gender: 'male', birthDate: '2014-02-22' },
  { id: 'stu-19', userId: 'usr-30', studentNumber: 'RYD2024019', gender: 'female', birthDate: '2013-05-11' },
  { id: 'stu-20', userId: 'usr-31', studentNumber: 'RYD2024020', gender: 'male', birthDate: '2015-03-28' },
  { id: 'stu-21', userId: 'usr-32', studentNumber: 'FUT2024001', gender: 'male', birthDate: '2014-06-15' },
  { id: 'stu-22', userId: 'usr-33', studentNumber: 'FUT2024002', gender: 'female', birthDate: '2015-01-20' },
];

export const guardians: Guardian[] = [
  { id: 'gd-1', userId: 'usr-5', phone: '0505678901', occupation: 'مهندس' },
  { id: 'gd-2', userId: 'usr-34', phone: '0551112222', occupation: 'طبيب' },
  { id: 'gd-3', userId: 'usr-35', phone: '0563334444', occupation: 'معلمة' },
  { id: 'gd-4', userId: 'usr-36', phone: '0545556666', occupation: 'محامي' },
  { id: 'gd-5', userId: 'usr-37', phone: '0537778888', occupation: 'رجل أعمال' },
  { id: 'gd-6', userId: 'usr-38', phone: '0529990000', occupation: 'صيدلي' },
  { id: 'gd-7', userId: 'usr-39', phone: '0501113333', occupation: 'ممرض' },
  { id: 'gd-8', userId: 'usr-40', phone: '0512224444', occupation: 'محاسب' },
  { id: 'gd-9', userId: 'usr-41', phone: '0563335555', occupation: 'مهندس' },
  { id: 'gd-10', userId: 'usr-42', phone: '0554446666', occupation: 'مدير' },
];

export const guardianLinks: GuardianLink[] = [
  { id: 'gl-1', guardianId: 'gd-1', studentId: 'stu-1', relationship: 'father', relationshipLabel: 'أب' },
  { id: 'gl-2', guardianId: 'gd-1', studentId: 'stu-21', relationship: 'father', relationshipLabel: 'أب' }, // different school
  { id: 'gl-3', guardianId: 'gd-2', studentId: 'stu-2', relationship: 'father', relationshipLabel: 'أب' },
  { id: 'gl-4', guardianId: 'gd-3', studentId: 'stu-2', relationship: 'mother', relationshipLabel: 'أم' },
  { id: 'gl-5', guardianId: 'gd-3', studentId: 'stu-3', relationship: 'mother', relationshipLabel: 'أم' },
  { id: 'gl-6', guardianId: 'gd-4', studentId: 'stu-4', relationship: 'father', relationshipLabel: 'أب' },
  { id: 'gl-7', guardianId: 'gd-5', studentId: 'stu-5', relationship: 'father', relationshipLabel: 'أب' },
  { id: 'gl-8', guardianId: 'gd-6', studentId: 'stu-6', relationship: 'father', relationshipLabel: 'أب' },
  { id: 'gl-9', guardianId: 'gd-7', studentId: 'stu-7', relationship: 'mother', relationshipLabel: 'أم' },
  { id: 'gl-10', guardianId: 'gd-8', studentId: 'stu-8', relationship: 'father', relationshipLabel: 'أب' },
  { id: 'gl-11', guardianId: 'gd-9', studentId: 'stu-9', relationship: 'father', relationshipLabel: 'أب' },
  { id: 'gl-12', guardianId: 'gd-10', studentId: 'stu-10', relationship: 'father', relationshipLabel: 'أب' },
  { id: 'gl-13', guardianId: 'gd-2', studentId: 'stu-11', relationship: 'uncle', relationshipLabel: 'عم' },
  { id: 'gl-14', guardianId: 'gd-5', studentId: 'stu-12', relationship: 'father', relationshipLabel: 'أب' },
  { id: 'gl-15', guardianId: 'gd-4', studentId: 'stu-13', relationship: 'father', relationshipLabel: 'أب' },
  { id: 'gl-16', guardianId: 'gd-6', studentId: 'stu-14', relationship: 'father', relationshipLabel: 'أب' },
  { id: 'gl-17', guardianId: 'gd-7', studentId: 'stu-15', relationship: 'mother', relationshipLabel: 'أم' },
  { id: 'gl-18', guardianId: 'gd-8', studentId: 'stu-16', relationship: 'father', relationshipLabel: 'أب' },
  { id: 'gl-19', guardianId: 'gd-9', studentId: 'stu-17', relationship: 'father', relationshipLabel: 'أب' },
  { id: 'gl-20', guardianId: 'gd-10', studentId: 'stu-18', relationship: 'father', relationshipLabel: 'أب' },
  { id: 'gl-21', guardianId: 'gd-3', studentId: 'stu-19', relationship: 'mother', relationshipLabel: 'أم' },
  { id: 'gl-22', guardianId: 'gd-1', studentId: 'stu-22', relationship: 'father', relationshipLabel: 'أب' },
];

// Enrollments — demonstrate historical placement
export const enrollments: Enrollment[] = [
  // stu-1: historical enrollment showing progression
  { id: 'enr-1', studentId: 'stu-1', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-1', gradeId: 'gr-4', sectionId: 'sec-1', status: 'completed', startDate: '2024-09-01', endDate: '2026-06-30' },
  { id: 'enr-2', studentId: 'stu-1', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-5', sectionId: 'sec-3', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-2
  { id: 'enr-3', studentId: 'stu-2', schoolId: 'sch-1', branchId: 'br-2', academicYearId: 'ay-2', gradeId: 'gr-5', sectionId: 'sec-5', status: 'active', startDate: '2026-08-25', endDate: null },
  { id: 'enr-4', studentId: 'stu-2', schoolId: 'sch-1', branchId: 'br-2', academicYearId: 'ay-1', gradeId: 'gr-4', sectionId: 'sec-4', status: 'completed', startDate: '2024-09-01', endDate: '2026-06-30' },
  // stu-3
  { id: 'enr-5', studentId: 'stu-3', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-6', sectionId: 'sec-7', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-4
  { id: 'enr-6', studentId: 'stu-4', schoolId: 'sch-1', branchId: 'br-2', academicYearId: 'ay-2', gradeId: 'gr-5', sectionId: 'sec-5', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-5
  { id: 'enr-7', studentId: 'stu-5', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-4', sectionId: 'sec-1', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-6
  { id: 'enr-8', studentId: 'stu-6', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-6', sectionId: 'sec-7', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-7
  { id: 'enr-9', studentId: 'stu-7', schoolId: 'sch-1', branchId: 'br-2', academicYearId: 'ay-2', gradeId: 'gr-5', sectionId: 'sec-5', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-8
  { id: 'enr-10', studentId: 'stu-8', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-4', sectionId: 'sec-2', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-9
  { id: 'enr-11', studentId: 'stu-9', schoolId: 'sch-1', branchId: 'br-2', academicYearId: 'ay-2', gradeId: 'gr-5', sectionId: 'sec-6', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-10
  { id: 'enr-12', studentId: 'stu-10', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-6', sectionId: 'sec-8', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-11
  { id: 'enr-13', studentId: 'stu-11', schoolId: 'sch-1', branchId: 'br-2', academicYearId: 'ay-2', gradeId: 'gr-4', sectionId: 'sec-5', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-12
  { id: 'enr-14', studentId: 'stu-12', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-5', sectionId: 'sec-3', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-13
  { id: 'enr-15', studentId: 'stu-13', schoolId: 'sch-1', branchId: 'br-2', academicYearId: 'ay-2', gradeId: 'gr-6', sectionId: 'sec-6', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-14
  { id: 'enr-16', studentId: 'stu-14', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-4', sectionId: 'sec-2', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-15
  { id: 'enr-17', studentId: 'stu-15', schoolId: 'sch-1', branchId: 'br-2', academicYearId: 'ay-2', gradeId: 'gr-5', sectionId: 'sec-6', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-16
  { id: 'enr-18', studentId: 'stu-16', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-6', sectionId: 'sec-8', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-17
  { id: 'enr-19', studentId: 'stu-17', schoolId: 'sch-1', branchId: 'br-2', academicYearId: 'ay-2', gradeId: 'gr-4', sectionId: 'sec-5', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-18
  { id: 'enr-20', studentId: 'stu-18', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-5', sectionId: 'sec-3', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-19
  { id: 'enr-21', studentId: 'stu-19', schoolId: 'sch-1', branchId: 'br-2', academicYearId: 'ay-2', gradeId: 'gr-6', sectionId: 'sec-6', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-20
  { id: 'enr-22', studentId: 'stu-20', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-4', sectionId: 'sec-2', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-21 — school 2
  { id: 'enr-23', studentId: 'stu-21', schoolId: 'sch-2', branchId: 'br-4', academicYearId: 'ay-5', gradeId: 'gr-11', sectionId: 'sec-10', status: 'active', startDate: '2026-08-25', endDate: null },
  // stu-22 — school 2
  { id: 'enr-24', studentId: 'stu-22', schoolId: 'sch-2', branchId: 'br-4', academicYearId: 'ay-5', gradeId: 'gr-10', sectionId: 'sec-9', status: 'active', startDate: '2026-08-25', endDate: null },
];

export const teachers: Teacher[] = [
  { id: 'tch-1', userId: 'usr-4', employeeNumber: 'RYD-T001', specialization: 'الرياضيات', status: 'active' },
  { id: 'tch-2', userId: 'usr-11', employeeNumber: 'RYD-T002', specialization: 'اللغة العربية', status: 'active' },
  { id: 'tch-3', userId: 'usr-43', employeeNumber: 'RYD-T003', specialization: 'العلوم', status: 'active' },
  { id: 'tch-4', userId: 'usr-44', employeeNumber: 'RYD-T004', specialization: 'القرآن الكريم', status: 'active' },
  { id: 'tch-5', userId: 'usr-45', employeeNumber: 'RYD-T005', specialization: 'اللغة الإنجليزية', status: 'active' },
  { id: 'tch-6', userId: 'usr-46', employeeNumber: 'RYD-T006', specialization: 'الدراسات الاجتماعية', status: 'active' },
  { id: 'tch-7', userId: 'usr-47', employeeNumber: 'RYD-T007', specialization: 'التربية الرياضية', status: 'active' },
  { id: 'tch-8', userId: 'usr-48', employeeNumber: 'RYD-T008', specialization: 'الرياضيات', status: 'active' },
];

export const teacherEmployments: TeacherEmployment[] = [
  { id: 'te-1', teacherId: 'tch-1', schoolId: 'sch-1', startDate: '2024-09-01', endDate: null, status: 'active' },
  { id: 'te-2', teacherId: 'tch-1', schoolId: 'sch-2', startDate: '2022-01-01', endDate: '2024-06-30', status: 'ended' },
  { id: 'te-3', teacherId: 'tch-2', schoolId: 'sch-1', startDate: '2023-09-01', endDate: null, status: 'active' },
  { id: 'te-4', teacherId: 'tch-3', schoolId: 'sch-1', startDate: '2023-09-01', endDate: null, status: 'active' },
  { id: 'te-5', teacherId: 'tch-4', schoolId: 'sch-1', startDate: '2024-02-01', endDate: null, status: 'active' },
  { id: 'te-6', teacherId: 'tch-5', schoolId: 'sch-1', startDate: '2023-09-01', endDate: null, status: 'active' },
  { id: 'te-7', teacherId: 'tch-6', schoolId: 'sch-1', startDate: '2024-09-01', endDate: null, status: 'active' },
  { id: 'te-8', teacherId: 'tch-7', schoolId: 'sch-1', startDate: '2025-01-01', endDate: null, status: 'active' },
  { id: 'te-9', teacherId: 'tch-8', schoolId: 'sch-1', startDate: '2024-09-01', endDate: null, status: 'active' },
];

export const teacherBranchAssignments: TeacherBranchAssignment[] = [
  { id: 'tba-1', teacherId: 'tch-1', branchId: 'br-1', startDate: '2024-09-01', endDate: null, status: 'active' },
  { id: 'tba-2', teacherId: 'tch-1', branchId: 'br-2', startDate: '2024-09-01', endDate: null, status: 'active' },
  { id: 'tba-3', teacherId: 'tch-1', branchId: 'br-3', startDate: '2024-09-01', endDate: '2025-06-15', status: 'ended' },
  { id: 'tba-4', teacherId: 'tch-2', branchId: 'br-2', startDate: '2023-09-01', endDate: null, status: 'active' },
  { id: 'tba-5', teacherId: 'tch-3', branchId: 'br-1', startDate: '2023-09-01', endDate: null, status: 'active' },
  { id: 'tba-6', teacherId: 'tch-4', branchId: 'br-1', startDate: '2024-02-01', endDate: null, status: 'active' },
  { id: 'tba-7', teacherId: 'tch-4', branchId: 'br-2', startDate: '2024-02-01', endDate: null, status: 'active' },
  { id: 'tba-8', teacherId: 'tch-5', branchId: 'br-1', startDate: '2023-09-01', endDate: null, status: 'active' },
  { id: 'tba-9', teacherId: 'tch-6', branchId: 'br-1', startDate: '2024-09-01', endDate: null, status: 'active' },
  { id: 'tba-10', teacherId: 'tch-7', branchId: 'br-1', startDate: '2025-01-01', endDate: null, status: 'active' },
  { id: 'tba-11', teacherId: 'tch-8', branchId: 'br-2', startDate: '2024-09-01', endDate: null, status: 'active' },
];

export const teacherQualifications: TeacherQualification[] = [
  { id: 'tq-1', teacherId: 'tch-1', subjectId: 'sub-1', stageId: 'stg-1' },
  { id: 'tq-2', teacherId: 'tch-1', subjectId: 'sub-3', stageId: 'stg-1' },
  { id: 'tq-3', teacherId: 'tch-2', subjectId: 'sub-2', stageId: 'stg-1' },
  { id: 'tq-4', teacherId: 'tch-2', subjectId: 'sub-2', stageId: 'stg-2' },
  { id: 'tq-5', teacherId: 'tch-3', subjectId: 'sub-3', stageId: 'stg-1' },
  { id: 'tq-6', teacherId: 'tch-4', subjectId: 'sub-4', stageId: 'stg-1' },
  { id: 'tq-7', teacherId: 'tch-5', subjectId: 'sub-5', stageId: 'stg-1' },
  { id: 'tq-8', teacherId: 'tch-6', subjectId: 'sub-6', stageId: 'stg-1' },
  { id: 'tq-9', teacherId: 'tch-7', subjectId: 'sub-7', stageId: 'stg-1' },
  { id: 'tq-10', teacherId: 'tch-8', subjectId: 'sub-1', stageId: 'stg-1' },
];

export const teachingAssignments: TeachingAssignment[] = [
  { id: 'ta-1', teacherId: 'tch-1', branchId: 'br-1', academicYearId: 'ay-2', termId: 'term-1', subjectId: 'sub-1', gradeId: 'gr-5', sectionId: 'sec-3', status: 'active' },
  { id: 'ta-2', teacherId: 'tch-1', branchId: 'br-1', academicYearId: 'ay-2', termId: 'term-1', subjectId: 'sub-1', gradeId: 'gr-4', sectionId: 'sec-1', status: 'active' },
  { id: 'ta-3', teacherId: 'tch-1', branchId: 'br-2', academicYearId: 'ay-2', termId: 'term-1', subjectId: 'sub-1', gradeId: 'gr-5', sectionId: 'sec-5', status: 'active' },
  { id: 'ta-4', teacherId: 'tch-2', branchId: 'br-2', academicYearId: 'ay-2', termId: 'term-1', subjectId: 'sub-2', gradeId: 'gr-5', sectionId: 'sec-5', status: 'active' },
  { id: 'ta-5', teacherId: 'tch-2', branchId: 'br-2', academicYearId: 'ay-2', termId: 'term-1', subjectId: 'sub-2', gradeId: 'gr-4', sectionId: 'sec-5', status: 'active' },
  { id: 'ta-6', teacherId: 'tch-3', branchId: 'br-1', academicYearId: 'ay-2', termId: 'term-1', subjectId: 'sub-3', gradeId: 'gr-6', sectionId: 'sec-7', status: 'active' },
  { id: 'ta-7', teacherId: 'tch-4', branchId: 'br-1', academicYearId: 'ay-2', termId: 'term-1', subjectId: 'sub-4', gradeId: 'gr-5', sectionId: 'sec-3', status: 'active' },
  { id: 'ta-8', teacherId: 'tch-5', branchId: 'br-1', academicYearId: 'ay-2', termId: 'term-1', subjectId: 'sub-5', gradeId: 'gr-5', sectionId: 'sec-3', status: 'active' },
  { id: 'ta-9', teacherId: 'tch-6', branchId: 'br-1', academicYearId: 'ay-2', termId: 'term-1', subjectId: 'sub-6', gradeId: 'gr-6', sectionId: 'sec-7', status: 'active' },
  { id: 'ta-10', teacherId: 'tch-7', branchId: 'br-1', academicYearId: 'ay-2', termId: 'term-1', subjectId: 'sub-7', gradeId: 'gr-5', sectionId: 'sec-3', status: 'active' },
  { id: 'ta-11', teacherId: 'tch-8', branchId: 'br-2', academicYearId: 'ay-2', termId: 'term-1', subjectId: 'sub-1', gradeId: 'gr-5', sectionId: 'sec-6', status: 'active' },
];

export const supervisorAssignments: SupervisorAssignment[] = [
  { id: 'sup-1', teacherId: 'tch-1', startDate: '2026-08-20', endDate: null },
  { id: 'sup-2', teacherId: 'tch-3', startDate: '2026-01-01', endDate: '2026-06-15' },
  { id: 'sup-3', teacherId: 'tch-2', startDate: '2026-08-20', endDate: null },
  { id: 'sup-4', teacherId: 'tch-5', startDate: '2026-01-01', endDate: '2026-06-15' },
];

export const sections: Section[] = [
  // School 1, Year 2026/2027
  { id: 'sec-1', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-4', name: 'أ', capacity: 30, status: 'active', supervisorHistory: [{ id: 'sup-1', teacherId: 'tch-1', startDate: '2026-08-20', endDate: null }] },
  { id: 'sec-2', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-4', name: 'ب', capacity: 30, status: 'active', supervisorHistory: [] },
  { id: 'sec-3', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-5', name: 'أ', capacity: 28, status: 'active', supervisorHistory: [{ id: 'sup-2', teacherId: 'tch-3', startDate: '2026-01-01', endDate: '2026-06-15' }] },
  { id: 'sec-4', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-1', gradeId: 'gr-4', name: 'أ', capacity: 30, status: 'active', supervisorHistory: [] },
  { id: 'sec-5', schoolId: 'sch-1', branchId: 'br-2', academicYearId: 'ay-2', gradeId: 'gr-5', name: 'أ', capacity: 25, status: 'active', supervisorHistory: [{ id: 'sup-3', teacherId: 'tch-2', startDate: '2026-08-20', endDate: null }] },
  { id: 'sec-6', schoolId: 'sch-1', branchId: 'br-2', academicYearId: 'ay-2', gradeId: 'gr-5', name: 'ب', capacity: 25, status: 'active', supervisorHistory: [] },
  { id: 'sec-7', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-6', name: 'أ', capacity: 30, status: 'active', supervisorHistory: [] },
  { id: 'sec-8', schoolId: 'sch-1', branchId: 'br-1', academicYearId: 'ay-2', gradeId: 'gr-6', name: 'ب', capacity: 30, status: 'active', supervisorHistory: [] },
  // School 2, Year 2026/2027
  { id: 'sec-9', schoolId: 'sch-2', branchId: 'br-4', academicYearId: 'ay-5', gradeId: 'gr-10', name: 'أ', capacity: 25, status: 'active', supervisorHistory: [] },
  { id: 'sec-10', schoolId: 'sch-2', branchId: 'br-4', academicYearId: 'ay-5', gradeId: 'gr-11', name: 'أ', capacity: 25, status: 'active', supervisorHistory: [] },
];
