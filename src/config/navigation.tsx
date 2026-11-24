import type { Role } from '@/types';
import {
  LayoutDashboard, Building2, GitBranch, CreditCard, BarChart3, Bell, Settings,
  Bus, Users, MapPin, Route, ClipboardList, History, AlertTriangle, Wallet,
  Navigation, UserCheck, ListChecks, Radio, CalendarDays, WifiOff,
  Home, Baby, GraduationCap, FileText, Receipt, PauseCircle, BookOpen,
  Phone, User, Truck, Building,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string | number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navigation: Record<Role, NavGroup[]> = {
  superadmin: [
    {
      label: 'الرئيسية',
      items: [
        { id: 'dashboard', label: 'نظرة عامة على المنصة', icon: LayoutDashboard },
        { id: 'usage', label: 'إحصائيات الاستخدام', icon: BarChart3 },
      ],
    },
    {
      label: 'الإدارة',
      items: [
        { id: 'schools', label: 'إدارة المدارس', icon: Building2 },
        { id: 'branches', label: 'إدارة الفروع', icon: GitBranch },
        { id: 'plans', label: 'باقات الاشتراك', icon: CreditCard },
        { id: 'subscriptions', label: 'اشتراكات المنصة', icon: Wallet },
      ],
    },
    {
      label: 'التحليلات',
      items: [
        { id: 'analytics', label: 'تحليلات النقل العالمية', icon: BarChart3 },
      ],
    },
    {
      label: 'النظام',
      items: [
        { id: 'sys-notifications', label: 'إشعارات النظام', icon: Bell, badge: 3 },
        { id: 'settings', label: 'إعدادات المنصة', icon: Settings },
      ],
    },
  ],
  school_admin: [
    {
      label: 'الرئيسية',
      items: [
        { id: 'dashboard', label: 'لوحة النقل', icon: LayoutDashboard },
        { id: 'overview', label: 'نظرة عامة على النقل', icon: BarChart3 },
      ],
    },
    {
      label: 'إدارة الأسطول',
      items: [
        { id: 'fleet', label: 'إدارة الحافلات', icon: Bus },
        { id: 'drivers', label: 'إدارة السائقين', icon: Users },
        { id: 'supervisors', label: 'إدارة المشرفين', icon: UserCheck },
      ],
    },
    {
      label: 'الطلاب والاشتراكات',
      items: [
        { id: 'students', label: 'نقل الطلاب', icon: Baby },
        { id: 'subscriptions', label: 'اشتراكات النقل', icon: CreditCard },
      ],
    },
    {
      label: 'العمليات',
      items: [
        { id: 'routes', label: 'المسارات وتعيينات الرحلات', icon: Route },
        { id: 'live', label: 'مراقبة الأسطول المباشرة', icon: Radio },
        { id: 'history', label: 'سجل الرحلات', icon: History },
        { id: 'reports', label: 'تقارير النقل', icon: FileText },
        { id: 'emergency', label: 'الإدارة الطارئة', icon: AlertTriangle, badge: 1 },
      ],
    },
    {
      label: 'الإعدادات',
      items: [
        { id: 'settings', label: 'إعدادات النقل', icon: Settings },
      ],
    },
  ],
  transport_manager: [
    {
      label: 'العمليات',
      items: [
        { id: 'dashboard', label: 'لوحة العمليات', icon: LayoutDashboard },
        { id: 'live', label: 'مركز التتبع المباشر', icon: Radio },
        { id: 'active-trips', label: 'الرحلات النشطة', icon: Navigation, badge: 2 },
      ],
    },
    {
      label: 'المتابعة',
      items: [
        { id: 'fleet-monitor', label: 'مراقبة الأسطول', icon: Bus },
        { id: 'schedule', label: 'جدول الرحلات اليومي', icon: CalendarDays },
        { id: 'driver-assign', label: 'تعيينات السائقين', icon: Users },
        { id: 'supervisor-assign', label: 'تعيينات المشرفين', icon: UserCheck },
      ],
    },
    {
      label: 'الطلاب',
      items: [
        { id: 'pickup-list', label: 'قوائم استلام الطلاب', icon: ListChecks },
        { id: 'dropoff-list', label: 'قوائم توصيل الطلاب', icon: Home },
        { id: 'absence', label: 'مراقبة الغياب', icon: ClipboardList },
      ],
    },
    {
      label: 'التنبيهات',
      items: [
        { id: 'offline-buses', label: 'الحافلات غير المتصلة', icon: WifiOff, badge: 1 },
        { id: 'emergency', label: 'العمليات الطارئة', icon: AlertTriangle },
        { id: 'gps-history', label: 'سجل مسارات GPS', icon: MapPin },
      ],
    },
  ],
  driver: [
    {
      label: 'السائق',
      items: [
        { id: 'dashboard', label: 'الرئيسية', icon: Home },
        { id: 'bus', label: 'الحافلة المعينة', icon: Bus },
        { id: 'schedule', label: 'جدول الرحلات', icon: CalendarDays },
      ],
    },
    {
      label: 'الرحلة',
      items: [
        { id: 'trip', label: 'تفاصيل الرحلة', icon: Navigation },
        { id: 'pickup', label: 'قائمة الاستلام', icon: ListChecks },
        { id: 'dropoff', label: 'قائمة التوصيل', icon: Home },
        { id: 'attendance', label: 'حضور الطلاب', icon: UserCheck },
      ],
    },
    {
      label: 'النظام',
      items: [
        { id: 'sync', label: 'مركز المزامنة', icon: WifiOff },
        { id: 'notifications', label: 'الإشعارات', icon: Bell, badge: 2 },
        { id: 'profile', label: 'الملف الشخصي', icon: User },
      ],
    },
  ],
  supervisor: [
    {
      label: 'المشرفة',
      items: [
        { id: 'dashboard', label: 'الرئيسية', icon: Home },
        { id: 'trip', label: 'الرحلة المعينة', icon: Navigation },
      ],
    },
    {
      label: 'الطلاب',
      items: [
        { id: 'students', label: 'قوائم الطلاب', icon: Baby },
        { id: 'pickup', label: 'حضور الاستلام', icon: UserCheck },
        { id: 'dropoff', label: 'حضور التوصيل', icon: Home },
        { id: 'absence', label: 'قائمة الغياب', icon: ClipboardList },
      ],
    },
    {
      label: 'النظام',
      items: [
        { id: 'progress', label: 'تقدم الرحلة', icon: ListChecks },
        { id: 'notifications', label: 'الإشعارات', icon: Bell },
        { id: 'profile', label: 'الملف الشخصي', icon: User },
      ],
    },
  ],
  parent: [
    {
      label: 'ولي الأمر',
      items: [
        { id: 'dashboard', label: 'الرئيسية', icon: Home },
        { id: 'children', label: 'أبنائي', icon: Baby },
      ],
    },
    {
      label: 'النقل',
      items: [
        { id: 'tracking', label: 'تتبع الحافلة المباشر', icon: Radio },
        { id: 'location', label: 'تسجيل موقع المنزل', icon: MapPin },
        { id: 'absence', label: 'الإبلاغ عن الغياب', icon: ClipboardList },
        { id: 'history', label: 'سجل الرحلات', icon: History },
        { id: 'subscription', label: 'اشتراك النقل', icon: CreditCard },
      ],
    },
    {
      label: 'النظام',
      items: [
        { id: 'notifications', label: 'الإشعارات', icon: Bell, badge: 3 },
        { id: 'profile', label: 'الملف الشخصي', icon: User },
      ],
    },
  ],
  accountant: [
    {
      label: 'المالية',
      items: [
        { id: 'dashboard', label: 'اللوحة المالية', icon: LayoutDashboard },
        { id: 'fees', label: 'رسوم النقل', icon: Wallet },
        { id: 'accounts', label: 'حسابات نقل الطلاب', icon: Users },
      ],
    },
    {
      label: 'الفواتير',
      items: [
        { id: 'invoices', label: 'الفواتير', icon: Receipt },
        { id: 'installments', label: 'خطط الأقساط', icon: CreditCard },
        { id: 'payments', label: 'حالة السداد', icon: FileText },
      ],
    },
    {
      label: 'الإيقاف والتقارير',
      items: [
        { id: 'suspended', label: 'الطلاب الموقوفون', icon: PauseCircle, badge: 1 },
        { id: 'reports', label: 'التقارير المالية', icon: BarChart3 },
        { id: 'settlements', label: 'سجلات التسوية المالية', icon: FileText },
      ],
    },
  ],
};
