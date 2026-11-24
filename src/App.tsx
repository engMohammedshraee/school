import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/services/authContext';
import { initDataStore } from '@/services/db';
import { AppLayout } from '@/layouts/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ChangePasswordPage } from '@/pages/ChangePasswordPage';
import { SchoolManagerDashboard } from '@/pages/dashboards/SchoolManagerDashboard';
import { PlatformDashboard } from '@/pages/dashboards/PlatformDashboard';
import { StudentAffairsDashboard } from '@/pages/dashboards/StudentAffairsDashboard';
import { TeacherDashboard } from '@/pages/dashboards/TeacherDashboard';
import { GuardianDashboard } from '@/pages/dashboards/GuardianDashboard';
import { StudentDashboard } from '@/pages/dashboards/StudentDashboard';
import { AccountantDashboard } from '@/pages/dashboards/AccountantDashboard';
import { AdminStaffDashboard } from '@/pages/dashboards/AdminStaffDashboard';
import { BranchesPage } from '@/pages/BranchesPage';
import { UsersPage } from '@/pages/UsersPage';
import { UserDetailPage } from '@/pages/UserDetailPage';
import { RolesPage } from '@/pages/RolesPage';
import { RoleDetailPage } from '@/pages/RoleDetailPage';
import { StudentsPage } from '@/pages/StudentsPage';
import { StudentRegistrationPage } from '@/pages/StudentRegistrationPage';
import { StudentProfilePage } from '@/pages/StudentProfilePage';
import { StudentTransferPage } from '@/pages/StudentTransferPage';
import { GuardiansPage } from '@/pages/GuardiansPage';
import { GuardianProfilePage } from '@/pages/GuardianProfilePage';
import { TeachersPage } from '@/pages/TeachersPage';
import { TeacherProfilePage } from '@/pages/TeacherProfilePage';
import { AcademicYearsPage } from '@/pages/AcademicYearsPage';
import { AcademicYearDetailPage } from '@/pages/AcademicYearDetailPage';
import { StagesPage } from '@/pages/StagesPage';
import { GradesPage } from '@/pages/GradesPage';
import { SectionsPage } from '@/pages/SectionsPage';
import { SectionDetailPage } from '@/pages/SectionDetailPage';
import { SubjectsPage } from '@/pages/SubjectsPage';
import { TeachingAssignmentsPage } from '@/pages/TeachingAssignmentsPage';
import { TimetablePage } from '@/pages/TimetablePage';
import { AttendancePage } from '@/pages/AttendancePage';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { AuditLogPage } from '@/pages/AuditLogPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { PlatformSchoolsPage } from '@/pages/platform/PlatformSchoolsPage';
import { PlatformUsersPage } from '@/pages/platform/PlatformUsersPage';
import { PlatformAuditLogPage } from '@/pages/platform/PlatformAuditLogPage';
import { PlatformSettingsPage } from '@/pages/platform/PlatformSettingsPage';
import { ComingSoonPage } from '@/pages/ComingSoonPage';
import { GraduationCap } from 'lucide-react';
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function DashboardRouter() {
  const { membership } = useAuth();
  if (!membership) return <Navigate to="/login" replace />;
  switch (membership.roleKey) {
    case 'platform_super_admin': return <PlatformDashboard />;
    case 'school_manager': return <SchoolManagerDashboard />;
    case 'student_affairs': return <StudentAffairsDashboard />;
    case 'teacher': return <TeacherDashboard />;
    case 'guardian': return <GuardianDashboard />;
    case 'student': return <StudentDashboard />;
    case 'accountant': return <AccountantDashboard />;
    case 'admin_staff': return <AdminStaffDashboard />;
    default: return <SchoolManagerDashboard />;
  }
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center text-white animate-pulse">
          <GraduationCap size={36} />
        </div>
        <p className="text-sand-500 text-sm">جارٍ تحميل النظام...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    initDataStore().then(() => setDataReady(true)).catch(() => setDataReady(true));
  }, []);

  if (!dataReady) return <LoadingScreen />;

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          {/* Protected app routes */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardRouter />} />

            {/* Platform routes */}
            <Route path="/platform/dashboard" element={<PlatformDashboard />} />
            <Route path="/platform/schools" element={<PlatformSchoolsPage />} />
            <Route path="/platform/users" element={<PlatformUsersPage />} />
            <Route path="/platform/audit-log" element={<PlatformAuditLogPage />} />
            <Route path="/platform/settings" element={<PlatformSettingsPage />} />

            {/* School management */}
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/roles/:id" element={<RoleDetailPage />} />

            {/* Students */}
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/students/new" element={<StudentRegistrationPage />} />
            <Route path="/students/:id" element={<StudentProfilePage />} />
            <Route path="/students/:id/transfer" element={<StudentTransferPage />} />

            {/* Guardians */}
            <Route path="/guardians" element={<GuardiansPage />} />
            <Route path="/guardians/:id" element={<GuardianProfilePage />} />

            {/* Teachers */}
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/teachers/:id" element={<TeacherProfilePage />} />

            {/* Academic */}
            <Route path="/academic-years" element={<AcademicYearsPage />} />
            <Route path="/academic-years/:id" element={<AcademicYearDetailPage />} />
            <Route path="/stages" element={<StagesPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/sections" element={<SectionsPage />} />
            <Route path="/sections/:id" element={<SectionDetailPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/teaching-assignments" element={<TeachingAssignmentsPage />} />
            <Route path="/timetable" element={<TimetablePage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/documents" element={<DocumentsPage />} />

            {/* Admin */}
            <Route path="/audit-log" element={<AuditLogPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Teacher routes */}
            <Route path="/teacher/sections" element={<ComingSoonPage title="شعبي" />} />
            <Route path="/teacher/subjects" element={<ComingSoonPage title="موادي" />} />
            <Route path="/teacher/timetable" element={<TimetablePage teacherView />} />
            <Route path="/teacher/attendance" element={<AttendancePage teacherView />} />

            {/* Student routes */}
            <Route path="/student/timetable" element={<TimetablePage studentView />} />
            <Route path="/student/attendance" element={<AttendancePage studentView />} />
            <Route path="/student/documents" element={<DocumentsPage studentView />} />
            <Route path="/student/results" element={<ComingSoonPage title="نتائجي" />} />
            <Route path="/student/fees" element={<ComingSoonPage title="الرسوم" />} />

            {/* Future modules */}
            <Route path="/exams" element={<ComingSoonPage title="الكنترول والاختبارات" />} />
            <Route path="/results" element={<ComingSoonPage title="النتائج" />} />
            <Route path="/finance" element={<ComingSoonPage title="المالية" />} />
            <Route path="/payroll" element={<ComingSoonPage title="الرواتب" />} />
            <Route path="/transport" element={<ComingSoonPage title="النقل" />} />
            <Route path="/library" element={<ComingSoonPage title="المكتبة" />} />
            <Route path="/notifications" element={<ComingSoonPage title="الإشعارات" />} />
            <Route path="/reports" element={<ComingSoonPage title="التقارير المتقدمة" />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
