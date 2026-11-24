import type { School, Branch, AcademicYear, Term, Period, Stage, Grade, Subject } from '@/types';

export const schools: School[] = [
  {
    id: 'sch-1',
    name: 'مدارس الريادة',
    code: 'RYD',
    status: 'active',
    createdAt: '2023-08-15',
    logoColor: '#0d9488',
  },
  {
    id: 'sch-2',
    name: 'مدارس المستقبل',
    code: 'FUT',
    status: 'active',
    createdAt: '2022-09-01',
    logoColor: '#0369a1',
  },
];

export const branches: Branch[] = [
  // School 1 branches
  { id: 'br-1', schoolId: 'sch-1', name: 'الفرع الرئيسي', code: 'RYD-MAIN', status: 'active' },
  { id: 'br-2', schoolId: 'sch-1', name: 'فرع البنات', code: 'RYD-GIRL', status: 'active' },
  { id: 'br-3', schoolId: 'sch-1', name: 'فرع الشمال', code: 'RYD-NORTH', status: 'active' },
  // School 2 branches
  { id: 'br-4', schoolId: 'sch-2', name: 'الفرع الرئيسي', code: 'FUT-MAIN', status: 'active' },
  { id: 'br-5', schoolId: 'sch-2', name: 'فرع الواحة', code: 'FUT-OASIS', status: 'inactive' },
];

export const academicYears: AcademicYear[] = [
  { id: 'ay-1', schoolId: 'sch-1', label: '2025 / 2026', status: 'closed', startDate: '2025-09-01', endDate: '2026-06-30' },
  { id: 'ay-2', schoolId: 'sch-1', label: '2026 / 2027', status: 'active', startDate: '2026-08-25', endDate: '2027-06-30' },
  { id: 'ay-3', schoolId: 'sch-1', label: '2027 / 2028', status: 'preparing', startDate: '2027-08-25', endDate: '2028-06-30' },
  { id: 'ay-4', schoolId: 'sch-2', label: '2025 / 2026', status: 'closed', startDate: '2025-09-01', endDate: '2026-06-30' },
  { id: 'ay-5', schoolId: 'sch-2', label: '2026 / 2027', status: 'active', startDate: '2026-08-25', endDate: '2027-06-30' },
];

export const terms: Term[] = [
  { id: 'term-1', academicYearId: 'ay-2', name: 'الفصل الدراسي الأول', sequence: 1, startDate: '2026-08-25', endDate: '2026-12-20', status: 'active' },
  { id: 'term-2', academicYearId: 'ay-2', name: 'الفصل الدراسي الثاني', sequence: 2, startDate: '2027-01-10', endDate: '2027-06-30', status: 'preparing' },
  { id: 'term-3', academicYearId: 'ay-1', name: 'الفصل الدراسي الأول', sequence: 1, startDate: '2025-09-01', endDate: '2025-12-20', status: 'closed' },
  { id: 'term-4', academicYearId: 'ay-1', name: 'الفصل الدراسي الثاني', sequence: 2, startDate: '2026-01-10', endDate: '2026-06-30', status: 'closed' },
  { id: 'term-5', academicYearId: 'ay-5', name: 'الفصل الدراسي الأول', sequence: 1, startDate: '2026-08-25', endDate: '2026-12-20', status: 'active' },
  { id: 'term-6', academicYearId: 'ay-5', name: 'الفصل الدراسي الثاني', sequence: 2, startDate: '2027-01-10', endDate: '2027-06-30', status: 'preparing' },
];

export const periods: Period[] = [
  { id: 'per-1', termId: 'term-1', name: 'الفترة الأولى', sequence: 1, startDate: '2026-08-25', endDate: '2026-10-15', status: 'active' },
  { id: 'per-2', termId: 'term-1', name: 'الفترة الثانية', sequence: 2, startDate: '2026-10-18', endDate: '2026-12-20', status: 'closed' },
  { id: 'per-3', termId: 'term-2', name: 'الفترة الأولى', sequence: 1, startDate: '2027-01-10', endDate: '2027-03-15', status: 'closed' },
  { id: 'per-4', termId: 'term-2', name: 'الفترة الثانية', sequence: 2, startDate: '2027-03-20', endDate: '2027-06-30', status: 'closed' },
];

export const stages: Stage[] = [
  { id: 'stg-1', schoolId: 'sch-1', name: 'المرحلة الأساسية', sequence: 1 },
  { id: 'stg-2', schoolId: 'sch-1', name: 'المرحلة الثانوية', sequence: 2 },
  { id: 'stg-3', schoolId: 'sch-2', name: 'المرحلة الأساسية', sequence: 1 },
  { id: 'stg-4', schoolId: 'sch-2', name: 'المرحلة الثانوية', sequence: 2 },
];

export const grades: Grade[] = [
  { id: 'gr-1', schoolId: 'sch-1', stageId: 'stg-1', name: 'الصف الأول', sequence: 1 },
  { id: 'gr-2', schoolId: 'sch-1', stageId: 'stg-1', name: 'الصف الثاني', sequence: 2 },
  { id: 'gr-3', schoolId: 'sch-1', stageId: 'stg-1', name: 'الصف الثالث', sequence: 3 },
  { id: 'gr-4', schoolId: 'sch-1', stageId: 'stg-1', name: 'الصف الرابع', sequence: 4 },
  { id: 'gr-5', schoolId: 'sch-1', stageId: 'stg-1', name: 'الصف الخامس', sequence: 5 },
  { id: 'gr-6', schoolId: 'sch-1', stageId: 'stg-1', name: 'الصف السادس', sequence: 6 },
  { id: 'gr-7', schoolId: 'sch-1', stageId: 'stg-2', name: 'الصف الأول الثانوي', sequence: 7 },
  { id: 'gr-8', schoolId: 'sch-1', stageId: 'stg-2', name: 'الصف الثاني الثانوي', sequence: 8 },
  { id: 'gr-9', schoolId: 'sch-1', stageId: 'stg-2', name: 'الصف الثالث الثانوي', sequence: 9 },
  { id: 'gr-10', schoolId: 'sch-2', stageId: 'stg-3', name: 'الصف الأول', sequence: 1 },
  { id: 'gr-11', schoolId: 'sch-2', stageId: 'stg-3', name: 'الصف الخامس', sequence: 5 },
  { id: 'gr-12', schoolId: 'sch-2', stageId: 'stg-4', name: 'الصف الأول الثانوي', sequence: 7 },
];

export const subjects: Subject[] = [
  { id: 'sub-1', schoolId: 'sch-1', name: 'الرياضيات', code: 'MATH', stageIds: ['stg-1', 'stg-2'], status: 'active' },
  { id: 'sub-2', schoolId: 'sch-1', name: 'اللغة العربية', code: 'ARB', stageIds: ['stg-1', 'stg-2'], status: 'active' },
  { id: 'sub-3', schoolId: 'sch-1', name: 'العلوم', code: 'SCI', stageIds: ['stg-1'], status: 'active' },
  { id: 'sub-4', schoolId: 'sch-1', name: 'القرآن الكريم', code: 'QUR', stageIds: ['stg-1', 'stg-2'], status: 'active' },
  { id: 'sub-5', schoolId: 'sch-1', name: 'اللغة الإنجليزية', code: 'ENG', stageIds: ['stg-1', 'stg-2'], status: 'active' },
  { id: 'sub-6', schoolId: 'sch-1', name: 'الدراسات الاجتماعية', code: 'SOC', stageIds: ['stg-1'], status: 'active' },
  { id: 'sub-7', schoolId: 'sch-1', name: 'التربية الرياضية', code: 'PE', stageIds: ['stg-1', 'stg-2'], status: 'active' },
  { id: 'sub-8', schoolId: 'sch-2', name: 'الرياضيات', code: 'MATH', stageIds: ['stg-3', 'stg-4'], status: 'active' },
  { id: 'sub-9', schoolId: 'sch-2', name: 'اللغة العربية', code: 'ARB', stageIds: ['stg-3', 'stg-4'], status: 'active' },
];
