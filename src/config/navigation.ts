import type { Permission, RoleKey } from '@/types';

export interface NavItem {
  label: string;
  path: string;
  icon: string; // lucide icon name
  permission?: Permission;
  soon?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// Platform-level navigation (for platform_super_admin)
export const platformNav: NavGroup[] = [
  {
    label: 'الرئيسية',
    items: [
      { label: 'لوحة المنصة', path: '/platform/dashboard', icon: 'LayoutDashboard' },
    ],
  },
  {
    label: 'الإدارة',
    items: [
      { label: 'المدارس', path: '/platform/schools', icon: 'Building2', permission: 'platform.schools.view' },
      { label: 'المستخدمون', path: '/platform/users', icon: 'Users', permission: 'platform.users.view' },
      { label: 'سجل التدقيق', path: '/platform/audit-log', icon: 'ScrollText', permission: 'platform.audit.view' },
      { label: 'إعدادات المنصة', path: '/platform/settings', icon: 'Settings' },
    ],
  },
];

// School-level navigation (for school-scoped roles)
export const schoolNav: NavGroup[] = [
  {
    label: 'الرئيسية',
    items: [
      { label: 'لوحة التحكم', path: '/dashboard', icon: 'LayoutDashboard', permission: 'own.dashboard' },
    ],
  },
  {
    label: 'إدارة المدرسة',
    items: [
      { label: 'الفروع', path: '/branches', icon: 'GitBranch', permission: 'branches.view' },
      { label: 'المستخدمون', path: '/users', icon: 'Users', permission: 'users.view' },
      { label: 'الأدوار والصلاحيات', path: '/roles', icon: 'ShieldCheck', permission: 'roles.view' },
    ],
  },
  {
    label: 'الطلاب',
    items: [
      { label: 'قائمة الطلاب', path: '/students', icon: 'GraduationCap', permission: 'students.view' },
      { label: 'تسجيل طالب', path: '/students/new', icon: 'UserPlus', permission: 'students.create' },
      { label: 'أولياء الأمور', path: '/guardians', icon: 'Users', permission: 'guardians.view' },
      { label: 'وثائق الطلاب', path: '/documents', icon: 'FileText', permission: 'documents.view' },
    ],
  },
  {
    label: 'المعلمون',
    items: [
      { label: 'قائمة المعلمين', path: '/teachers', icon: 'Presentation', permission: 'teachers.view' },
      { label: 'التكليفات التدريسية', path: '/teaching-assignments', icon: 'BookOpen', permission: 'teaching_assignments.view' },
    ],
  },
  {
    label: 'الشؤون الأكاديمية',
    items: [
      { label: 'السنوات الدراسية', path: '/academic-years', icon: 'Calendar', permission: 'academic.years.view' },
      { label: 'المراحل', path: '/stages', icon: 'Layers', permission: 'stages.view' },
      { label: 'الصفوف', path: '/grades', icon: 'ListOrdered', permission: 'grades.view' },
      { label: 'الشعب', path: '/sections', icon: 'Grid3x3', permission: 'sections.view' },
      { label: 'المواد', path: '/subjects', icon: 'BookMarked', permission: 'subjects.view' },
      { label: 'الجدول الدراسي', path: '/timetable', icon: 'CalendarDays', permission: 'timetable.view' },
      { label: 'الحضور', path: '/attendance', icon: 'ClipboardCheck', permission: 'attendance.view' },
    ],
  },
  {
    label: 'التشغيل',
    items: [
      { label: 'النقل', path: '/transport', icon: 'Bus', soon: true },
      { label: 'المكتبة', path: '/library', icon: 'Library', soon: true },
      { label: 'الإشعارات', path: '/notifications', icon: 'Bell', soon: true },
    ],
  },
  {
    label: 'الإدارة',
    items: [
      { label: 'سجل التدقيق', path: '/audit-log', icon: 'ScrollText', permission: 'audit.view' },
      { label: 'الإعدادات', path: '/settings', icon: 'Settings', permission: 'settings.manage' },
    ],
  },
  {
    label: 'وحدات مستقبلية',
    items: [
      { label: 'الكنترول والاختبارات', path: '/exams', icon: 'FileCheck', soon: true },
      { label: 'النتائج', path: '/results', icon: 'Award', soon: true },
      { label: 'المالية', path: '/finance', icon: 'Wallet', permission: 'finance.view' },
      { label: 'الرواتب', path: '/payroll', icon: 'Banknote', soon: true },
      { label: 'التقارير المتقدمة', path: '/reports', icon: 'BarChart3', soon: true },
    ],
  },
];

// Teacher-specific navigation
export const teacherNav: NavGroup[] = [
  {
    label: 'الرئيسية',
    items: [
      { label: 'لوحتي', path: '/dashboard', icon: 'LayoutDashboard' },
    ],
  },
  {
    label: 'التدريس',
    items: [
      { label: 'شعبي', path: '/teacher/sections', icon: 'Grid3x3' },
      { label: 'موادي', path: '/teacher/subjects', icon: 'BookMarked' },
      { label: 'جدولي', path: '/teacher/timetable', icon: 'CalendarDays' },
      { label: 'الحضور', path: '/teacher/attendance', icon: 'ClipboardCheck' },
    ],
  },
];

// Guardian-specific navigation
export const guardianNav: NavGroup[] = [
  {
    label: 'الرئيسية',
    items: [
      { label: 'أبنائي', path: '/dashboard', icon: 'Users' },
    ],
  },
];

// Student-specific navigation
export const studentNav: NavGroup[] = [
  {
    label: 'الرئيسية',
    items: [
      { label: 'لوحتي', path: '/dashboard', icon: 'LayoutDashboard' },
      { label: 'جدولي', path: '/student/timetable', icon: 'CalendarDays' },
      { label: 'حضوري', path: '/student/attendance', icon: 'ClipboardCheck' },
      { label: 'وثائقي', path: '/student/documents', icon: 'FileText' },
    ],
  },
  {
    label: 'وحدات مستقبلية',
    items: [
      { label: 'نتائجي', path: '/student/results', icon: 'Award', soon: true },
      { label: 'الرسوم', path: '/student/fees', icon: 'Wallet', soon: true },
    ],
  },
];

export function getNavigationForRole(roleKey: RoleKey): NavGroup[] {
  switch (roleKey) {
    case 'platform_super_admin':
      return platformNav;
    case 'teacher':
      return teacherNav;
    case 'guardian':
      return guardianNav;
    case 'student':
      return studentNav;
    default:
      return schoolNav;
  }
}
