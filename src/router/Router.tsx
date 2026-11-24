import { useApp } from '@/context/AppContext';
import { EmptyState } from '@/components/ui';
import { Construction } from 'lucide-react';

// Transport Manager
import { TransportManagerDashboard, LiveTrackingCenter, ActiveTrips, OfflineBuses } from '@/pages/transport-manager/Dashboard';
import { FleetMonitor, DailySchedule, StudentPickupList, AbsenceMonitor, DriverAssignments, SupervisorAssignments, GpsHistory, EmergencyOps } from '@/pages/transport-manager/Operations';

// School Admin
import { SchoolAdminDashboard, FleetManagement, DriverManagement, StudentTransport, TransportReports } from '@/pages/school-admin/SchoolAdmin';
import { SupervisorManagement, TransportSubscriptions, RoutesManagement, TripHistory, EmergencyManagement, TransportSettings, TransportOverview } from '@/pages/school-admin/MorePages';

// Superadmin
import { SuperadminDashboard, SchoolsManagement, BranchManagement, SubscriptionPlans, PlatformSubscriptions, UsageStats, GlobalAnalytics, SystemNotifications, PlatformSettings } from '@/pages/superadmin/Superadmin';

// Driver & Supervisor (mobile)
import {
  DriverDashboard, DriverTrip, DriverPickup, DriverDropoff, DriverAttendance,
  DriverBus, DriverSchedule, DriverSync, DriverNotifications, DriverProfile,
  SupervisorDashboard, SupervisorStudents, SupervisorPickup, SupervisorDropoff,
  SupervisorAbsence, SupervisorTrip, SupervisorProgress, MobileProfile, MobileNotifications,
} from '@/pages/mobile/Driver';

// Parent (mobile)
import {
  ParentDashboard, ParentChildren, ParentTracking, ParentLocation,
  ParentAbsence, ParentHistory, ParentSubscription, ParentProfile, ParentNotifications,
} from '@/pages/mobile/Parent';

// Accountant
import {
  AccountantDashboard, TransportFees, StudentAccounts, Invoices,
  Installments, PaymentStatus, SuspendedStudents, FinancialReports, SettlementRecords,
} from '@/pages/accountant/Accountant';

const pageMap: Record<string, React.ComponentType> = {
  // Transport Manager
  'tm-dashboard': TransportManagerDashboard,
  'tm-live': LiveTrackingCenter,
  'tm-active-trips': ActiveTrips,
  'tm-fleet-monitor': FleetMonitor,
  'tm-schedule': DailySchedule,
  'tm-driver-assign': DriverAssignments,
  'tm-supervisor-assign': SupervisorAssignments,
  'tm-pickup-list': StudentPickupList,
  'tm-dropoff-list': StudentPickupList,
  'tm-absence': AbsenceMonitor,
  'tm-offline-buses': OfflineBuses,
  'tm-emergency': EmergencyOps,
  'tm-gps-history': GpsHistory,

  // School Admin
  'sa-dashboard': SchoolAdminDashboard,
  'sa-overview': TransportOverview,
  'sa-fleet': FleetManagement,
  'sa-drivers': DriverManagement,
  'sa-supervisors': SupervisorManagement,
  'sa-students': StudentTransport,
  'sa-subscriptions': TransportSubscriptions,
  'sa-routes': RoutesManagement,
  'sa-live': LiveTrackingCenter,
  'sa-history': TripHistory,
  'sa-reports': TransportReports,
  'sa-emergency': EmergencyManagement,
  'sa-settings': TransportSettings,

  // Superadmin
  'super-dashboard': SuperadminDashboard,
  'super-usage': UsageStats,
  'super-schools': SchoolsManagement,
  'super-branches': BranchManagement,
  'super-plans': SubscriptionPlans,
  'super-subscriptions': PlatformSubscriptions,
  'super-analytics': GlobalAnalytics,
  'super-notifications': SystemNotifications,
  'super-settings': PlatformSettings,

  // Driver
  'driver-dashboard': DriverDashboard,
  'driver-bus': DriverBus,
  'driver-schedule': DriverSchedule,
  'driver-trip': DriverTrip,
  'driver-pickup': DriverPickup,
  'driver-dropoff': DriverDropoff,
  'driver-attendance': DriverAttendance,
  'driver-sync': DriverSync,
  'driver-notifications': DriverNotifications,
  'driver-profile': DriverProfile,

  // Supervisor
  'sup-dashboard': SupervisorDashboard,
  'sup-trip': SupervisorTrip,
  'sup-students': SupervisorStudents,
  'sup-pickup': SupervisorPickup,
  'sup-dropoff': SupervisorDropoff,
  'sup-absence': SupervisorAbsence,
  'sup-progress': SupervisorProgress,
  'sup-notifications': MobileNotifications,
  'sup-profile': MobileProfile,

  // Parent
  'parent-dashboard': ParentDashboard,
  'parent-children': ParentChildren,
  'parent-tracking': ParentTracking,
  'parent-location': ParentLocation,
  'parent-absence': ParentAbsence,
  'parent-history': ParentHistory,
  'parent-subscription': ParentSubscription,
  'parent-notifications': ParentNotifications,
  'parent-profile': ParentProfile,

  // Accountant
  'acc-dashboard': AccountantDashboard,
  'acc-fees': TransportFees,
  'acc-accounts': StudentAccounts,
  'acc-invoices': Invoices,
  'acc-installments': Installments,
  'acc-payments': PaymentStatus,
  'acc-suspended': SuspendedStudents,
  'acc-reports': FinancialReports,
  'acc-settlements': SettlementRecords,
};

const rolePageMap: Record<string, Record<string, string>> = {
  superadmin: {
    dashboard: 'super-dashboard', usage: 'super-usage', schools: 'super-schools', branches: 'super-branches',
    plans: 'super-plans', subscriptions: 'super-subscriptions', analytics: 'super-analytics',
    'sys-notifications': 'super-notifications', settings: 'super-settings',
  },
  school_admin: {
    dashboard: 'sa-dashboard', overview: 'sa-overview', fleet: 'sa-fleet', drivers: 'sa-drivers',
    supervisors: 'sa-supervisors', students: 'sa-students', subscriptions: 'sa-subscriptions',
    routes: 'sa-routes', live: 'sa-live', history: 'sa-history', reports: 'sa-reports',
    emergency: 'sa-emergency', settings: 'sa-settings',
  },
  transport_manager: {
    dashboard: 'tm-dashboard', live: 'tm-live', 'active-trips': 'tm-active-trips',
    'fleet-monitor': 'tm-fleet-monitor', schedule: 'tm-schedule', 'driver-assign': 'tm-driver-assign',
    'supervisor-assign': 'tm-supervisor-assign', 'pickup-list': 'tm-pickup-list',
    'dropoff-list': 'tm-dropoff-list', absence: 'tm-absence', 'offline-buses': 'tm-offline-buses',
    emergency: 'tm-emergency', 'gps-history': 'tm-gps-history',
  },
  driver: {
    dashboard: 'driver-dashboard', bus: 'driver-bus', schedule: 'driver-schedule',
    trip: 'driver-trip', pickup: 'driver-pickup', dropoff: 'driver-dropoff',
    attendance: 'driver-attendance', sync: 'driver-sync', notifications: 'driver-notifications',
    profile: 'driver-profile',
  },
  supervisor: {
    dashboard: 'sup-dashboard', trip: 'sup-trip', students: 'sup-students',
    pickup: 'sup-pickup', dropoff: 'sup-dropoff', absence: 'sup-absence',
    progress: 'sup-progress', notifications: 'sup-notifications', profile: 'sup-profile',
  },
  parent: {
    dashboard: 'parent-dashboard', children: 'parent-children', tracking: 'parent-tracking',
    location: 'parent-location', absence: 'parent-absence', history: 'parent-history',
    subscription: 'parent-subscription', notifications: 'parent-notifications', profile: 'parent-profile',
  },
  accountant: {
    dashboard: 'acc-dashboard', fees: 'acc-fees', accounts: 'acc-accounts',
    invoices: 'acc-invoices', installments: 'acc-installments', payments: 'acc-payments',
    suspended: 'acc-suspended', reports: 'acc-reports', settlements: 'acc-settlements',
  },
};

export function Router() {
  const { role, currentPage } = useApp();
  const pageKey = rolePageMap[role]?.[currentPage];
  const PageComponent = pageKey ? pageMap[pageKey] : null;

  if (!PageComponent) {
    return (
      <EmptyState
        icon={<Construction size={28} />}
        title="الصفحة قيد التطوير"
        description="هذه الصفحة لم تُبنَ بعد في النموذج الأولي"
      />
    );
  }

  return <PageComponent />;
}
