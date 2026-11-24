import type { User, Role, SchoolMembership } from '@/types';

export const users: User[] = [
  // Platform Super Admin
  {
    id: 'usr-1', nationalId: '1000000001', name: 'م محمد الشراعي  ',
    email: 'k.alotaibi@masar.sa', phone: '0501234567',
    avatarColor: '#0f766e', loginEnabled: true,
  },
  // School Manager — belongs to 2 schools (multi-school demo)
  {
    id: 'usr-2', nationalId: '1000000002', name: 'د.  نجيب القادري',
    email: 'a.alqahtani@riyadh.edu', phone: '0502345678',
    avatarColor: '#0369a1', loginEnabled: true,
  },
  // Student Affairs
  {
    id: 'usr-3', nationalId: '1000000003', name: 'أ. نورة بنت سعد الدوسري',
    email: 'n.aldosari@riyadh.edu', phone: '0503456789',
    avatarColor: '#7c3aed', loginEnabled: true,
  },
  // Teacher
  {
    id: 'usr-4', nationalId: '1000000004', name: 'أ. أحمد بن علي الشهري',
    email: 'a.alshehri@riyadh.edu', phone: '0504567890',
    avatarColor: '#be185d', loginEnabled: true,
  },
  // Guardian — has children in 2 schools
  {
    id: 'usr-5', nationalId: '1000000005', name: 'سعد بن عبدالله الحربي',
    email: 's.alharbi@gmail.com', phone: '0505678901',
    avatarColor: '#ea580c', loginEnabled: true,
  },
  // Student
  {
    id: 'usr-6', nationalId: '1000000006', name: 'محمد سعد الحربي',
    email: 'm.alharbi@student.riyadh.edu',
    avatarColor: '#0284c7', loginEnabled: true,
  },
  // Accountant
  {
    id: 'usr-7', nationalId: '1000000007', name: 'أ. فاطمة بنت حسن الزهراني',
    email: 'f.alzahrani@riyadh.edu', phone: '0506789012',
    avatarColor: '#4f46e5', loginEnabled: true,
  },
  // Administrative Staff
  {
    id: 'usr-8', nationalId: '1000000008', name: 'أ. عمر بن يوسف الغامدي',
    email: 'o.alghamdi@riyadh.edu', phone: '0507890123',
    avatarColor: '#15803d', loginEnabled: true,
  },
  // Additional users for lists
  {
    id: 'usr-9', nationalId: '1000000009', name: 'أ. هند بنت خالد المطيري',
    email: 'h.almutairi@riyadh.edu', phone: '0508901234',
    avatarColor: '#a21caf', loginEnabled: true,
  },
  {
    id: 'usr-10', nationalId: '1000000010', name: 'أ. ماجد بن فهد العنزي',
    email: 'm.alenezi@future.edu', phone: '0509012345',
    avatarColor: '#c2410c', loginEnabled: true,
  },
  {
    id: 'usr-11', nationalId: '1000000011', name: 'أ. ريم بنت ناصر السبيعي',
    email: 'r.alsubaie@riyadh.edu', phone: '0510123456',
    avatarColor: '#0891b2', loginEnabled: true,
  },
  {
    id: 'usr-12', nationalId: '1000000012', name: 'أ. طارق بن إبراهيم البقمي',
    email: 't.albaqmi@future.edu', phone: '0511234567',
    avatarColor: '#65a30d', loginEnabled: false,
  },
];

export const roles: Role[] = [
  {
    id: 'role-1', name: 'مدير المنصة', scope: 'platform',
    permissions: ['platform.schools.view', 'platform.schools.manage', 'platform.users.view', 'platform.audit.view'],
    userCount: 1, status: 'active',
  },
  {
    id: 'role-2', name: 'مدير المدرسة', scope: 'school',
    permissions: [
      'branches.view', 'branches.manage', 'users.view', 'users.manage',
      'roles.view', 'students.view', 'students.create', 'students.edit', 'students.transfer',
      'guardians.view', 'guardians.manage', 'teachers.view', 'teachers.manage',
      'academic.years.view', 'academic.years.manage', 'academic.terms.view', 'academic.terms.manage',
      'academic.periods.view', 'academic.periods.manage', 'stages.view', 'stages.manage',
      'grades.view', 'grades.manage', 'sections.view', 'sections.manage',
      'subjects.view', 'subjects.manage', 'teaching_assignments.view', 'teaching_assignments.manage',
      'timetable.view', 'timetable.manage', 'attendance.view', 'attendance.manage',
      'documents.view', 'documents.manage', 'audit.view', 'settings.manage',
    ],
    userCount: 2, status: 'active',
  },
  {
    id: 'role-3', name: 'شؤون الطلاب', scope: 'school',
    permissions: [
      'students.view', 'students.create', 'students.edit',
      'guardians.view', 'guardians.manage', 'documents.view', 'documents.manage',
      'attendance.view',
    ],
    userCount: 3, status: 'active',
  },
  {
    id: 'role-4', name: 'معلم', scope: 'branch',
    permissions: ['own.dashboard', 'attendance.view', 'attendance.manage', 'students.view', 'timetable.view'],
    userCount: 8, status: 'active',
  },
  {
    id: 'role-5', name: 'ولي أمر', scope: 'school',
    permissions: ['own.dashboard'],
    userCount: 10, status: 'active',
  },
  {
    id: 'role-6', name: 'طالب', scope: 'school',
    permissions: ['own.dashboard'],
    userCount: 20, status: 'active',
  },
  {
    id: 'role-7', name: 'محاسب', scope: 'school',
    permissions: ['finance.view', 'students.view'],
    userCount: 2, status: 'active',
  },
  {
    id: 'role-8', name: 'موظف إداري', scope: 'branch',
    permissions: ['students.view', 'guardians.view', 'attendance.view', 'documents.view'],
    userCount: 4, status: 'active',
  },
];

export const memberships: SchoolMembership[] = [
  // Platform admin — no school membership (platform level)
  {
    id: 'mem-1', userId: 'usr-1', schoolId: 'sch-1', branchIds: [], roleKey: 'platform_super_admin', roleId: 'role-1',
    status: 'active', startDate: '2023-08-15', endDate: null,
  },
  // School manager — belongs to 2 schools
  {
    id: 'mem-2', userId: 'usr-2', schoolId: 'sch-1', branchIds: [], roleKey: 'school_manager', roleId: 'role-2',
    status: 'active', startDate: '2023-09-01', endDate: null,
  },
  {
    id: 'mem-3', userId: 'usr-2', schoolId: 'sch-2', branchIds: [], roleKey: 'school_manager', roleId: 'role-2',
    status: 'active', startDate: '2024-01-15', endDate: null,
  },
  // Student affairs
  {
    id: 'mem-4', userId: 'usr-3', schoolId: 'sch-1', branchIds: ['br-1', 'br-2'], roleKey: 'student_affairs', roleId: 'role-3',
    status: 'active', startDate: '2023-09-01', endDate: null,
  },
  // Teacher — branch scoped (br-1, br-2 but NOT br-3)
  {
    id: 'mem-5', userId: 'usr-4', schoolId: 'sch-1', branchIds: ['br-1', 'br-2'], roleKey: 'teacher', roleId: 'role-4',
    status: 'active', startDate: '2024-09-01', endDate: null,
  },
  // Guardian — children in 2 schools
  {
    id: 'mem-6', userId: 'usr-5', schoolId: 'sch-1', branchIds: [], roleKey: 'guardian', roleId: 'role-5',
    status: 'active', startDate: '2024-09-01', endDate: null,
  },
  {
    id: 'mem-7', userId: 'usr-5', schoolId: 'sch-2', branchIds: [], roleKey: 'guardian', roleId: 'role-5',
    status: 'active', startDate: '2025-09-01', endDate: null,
  },
  // Student
  {
    id: 'mem-8', userId: 'usr-6', schoolId: 'sch-1', branchIds: ['br-1'], roleKey: 'student', roleId: 'role-6',
    status: 'active', startDate: '2024-09-01', endDate: null,
  },
  // Accountant
  {
    id: 'mem-9', userId: 'usr-7', schoolId: 'sch-1', branchIds: [], roleKey: 'accountant', roleId: 'role-7',
    status: 'active', startDate: '2023-10-01', endDate: null,
  },
  // Admin staff — branch scoped to br-1, br-2 (NOT br-3)
  {
    id: 'mem-10', userId: 'usr-8', schoolId: 'sch-1', branchIds: ['br-1', 'br-2'], roleKey: 'admin_staff', roleId: 'role-8',
    status: 'active', startDate: '2024-02-01', endDate: null,
  },
  // Additional memberships for lists
  {
    id: 'mem-11', userId: 'usr-9', schoolId: 'sch-1', branchIds: ['br-1'], roleKey: 'student_affairs', roleId: 'role-3',
    status: 'active', startDate: '2024-09-01', endDate: null,
  },
  {
    id: 'mem-12', userId: 'usr-10', schoolId: 'sch-2', branchIds: [], roleKey: 'school_manager', roleId: 'role-2',
    status: 'active', startDate: '2023-09-01', endDate: null,
  },
  {
    id: 'mem-13', userId: 'usr-11', schoolId: 'sch-1', branchIds: ['br-2'], roleKey: 'teacher', roleId: 'role-4',
    status: 'active', startDate: '2023-09-01', endDate: null,
  },
  {
    id: 'mem-14', userId: 'usr-12', schoolId: 'sch-2', branchIds: ['br-4'], roleKey: 'teacher', roleId: 'role-4',
    status: 'suspended', startDate: '2022-01-01', endDate: null,
  },
];

export const demoAccounts = [
  { roleKey: 'platform_super_admin' as const, userId: '00000000-0000-0000-0000-000000000001', label: 'مدير المنصة' },
  { roleKey: 'school_manager' as const, userId: '00000000-0000-0000-0000-000000000002', label: 'مدير المدرسة' },
  { roleKey: 'student_affairs' as const, userId: '00000000-0000-0000-0000-000000000003', label: 'مسؤول شؤون الطلاب' },
  { roleKey: 'teacher' as const, userId: '00000000-0000-0000-0000-000000000004', label: 'معلم' },
  { roleKey: 'guardian' as const, userId: '00000000-0000-0000-0000-000000000005', label: 'ولي أمر' },
  { roleKey: 'student' as const, userId: '00000000-0000-0000-0000-000000000006', label: 'طالب' },
  { roleKey: 'accountant' as const, userId: '00000000-0000-0000-0000-000000000007', label: 'محاسب' },
  { roleKey: 'admin_staff' as const, userId: '00000000-0000-0000-0000-000000000008', label: 'موظف إداري' },
];
