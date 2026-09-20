import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { ErpLayout } from './components/layout/ErpLayout';
import { Notifications } from './components/common/Notifications';
import { Modals } from './components/common/Modals';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentManagement } from './pages/StudentManagement';
import { AdmissionsManagement } from './pages/AdmissionsManagement';
import { PublicAdmissionsPortal } from './pages/PublicAdmissionsPortal';
import { AcademicsManagement } from './pages/AcademicsManagement';
import { TimetableManagement } from './pages/TimetableManagement';
import { HomeworkManagement } from './pages/HomeworkManagement';
import { CourseManagement } from './pages/CourseManagement';
import { AttendanceTracking } from './pages/AttendanceTracking';
import { RolePermissions } from './pages/RolePermissions';
import { StudentHub } from './pages/StudentHub';
import { PublicWebsite } from './pages/public/PublicWebsite';
import { CmsAdminDashboard } from './pages/CmsAdminDashboard';
import { EnterpriseReportsCenter } from './pages/EnterpriseReportsCenter';
import { ExecutiveAnalyticsDashboard } from './pages/ExecutiveAnalyticsDashboard';
import { AuditLogManagement } from './pages/AuditLogManagement';
import { SystemConfigCenter } from './pages/SystemConfigCenter';
import { ParentPortal } from './pages/ParentPortal';
import { StudentPortal } from './pages/StudentPortal';
import { TeacherPortal } from './pages/TeacherPortal';
import { DocumentCertificatesCenter } from './pages/DocumentCertificatesCenter';
import { FeeManagement } from './pages/FeeManagement';
import { FinancialReports } from './pages/FinancialReports';
import { PublicSiteCustomizer } from './pages/PublicSiteCustomizer';
import { SiteProfilesManager } from './pages/SiteProfilesManager';

const MainAppContent = () => {
  const { currentView } = useApp();
  const safeView = (!currentView || currentView === 'null' || currentView === 'undefined') ? 'landing' : currentView;

  if (safeView === 'login') {
    return <LoginPage />;
  }

  if (safeView === 'website' || safeView === 'landing') {
    return <PublicWebsite />;
  }

  if (safeView === 'public-admissions') {
    return <PublicAdmissionsPortal />;
  }

  return (
    <ErpLayout>
      {currentView === 'admin-dashboard' && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN', 'Super Admin', 'Admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      )}

      {currentView === 'students' && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN', 'TEACHER', 'ACCOUNTANT', 'Super Admin', 'Admin', 'Instructor', 'Teacher']}>
          <StudentManagement />
        </ProtectedRoute>
      )}

      {currentView === 'admissions' && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN', 'RECEPTIONIST', 'ACCOUNTANT', 'Super Admin', 'Admin']}>
          <AdmissionsManagement />
        </ProtectedRoute>
      )}

      {currentView === 'academics' && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN', 'TEACHER', 'Super Admin', 'Admin', 'Instructor', 'Teacher']}>
          <AcademicsManagement />
        </ProtectedRoute>
      )}

      {currentView === 'timetable' && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'Super Admin', 'Admin', 'Instructor', 'Teacher', 'Student', 'Parent']}>
          <TimetableManagement />
        </ProtectedRoute>
      )}

      {(currentView === 'homework' || currentView === 'assignments') && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'Super Admin', 'Admin', 'Instructor', 'Teacher', 'Student', 'Parent']}>
          <HomeworkManagement />
        </ProtectedRoute>
      )}

      {currentView === 'admin-courses' && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN', 'TEACHER', 'Super Admin', 'Admin', 'Instructor', 'Teacher']}>
          <CourseManagement />
        </ProtectedRoute>
      )}

      {(currentView === 'admin-attendance' || currentView === 'attendance') && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN', 'TEACHER', 'Super Admin', 'Admin', 'Instructor', 'Teacher']}>
          <AttendanceTracking />
        </ProtectedRoute>
      )}

      {(currentView === 'admin-roles' || currentView === 'system') && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'Super Admin', 'Admin']}>
          <RolePermissions />
        </ProtectedRoute>
      )}

      {(currentView === 'cms-admin' || currentView === 'cms') && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN', 'Super Admin', 'Admin']}>
          <CmsAdminDashboard />
        </ProtectedRoute>
      )}

      {(currentView === 'public-site-customizer' || currentView === 'public-site') && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'Super Admin', 'Admin']}>
          <PublicSiteCustomizer />
        </ProtectedRoute>
      )}

      {(currentView === 'site-profiles' || currentView === 'user-profiles') && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'Super Admin', 'Admin']}>
          <SiteProfilesManager />
        </ProtectedRoute>
      )}

      {currentView === 'reports' && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN', 'ACCOUNTANT', 'SUPERVISOR', 'Super Admin', 'Admin']}>
          <EnterpriseReportsCenter />
        </ProtectedRoute>
      )}

      {currentView === 'analytics' && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN', 'ACCOUNTANT', 'SUPERVISOR', 'Super Admin', 'Admin']}>
          <ExecutiveAnalyticsDashboard />
        </ProtectedRoute>
      )}

      {(currentView === 'audit-logs' || currentView === 'audit') && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'Super Admin', 'Admin']}>
          <AuditLogManagement />
        </ProtectedRoute>
      )}

      {(currentView === 'system-config' || currentView === 'settings') && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'Super Admin', 'Admin']}>
          <SystemConfigCenter />
        </ProtectedRoute>
      )}

      {(currentView === 'parent-portal' || currentView === 'parent') && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'PARENT', 'Super Admin', 'Parent']}>
          <ParentPortal />
        </ProtectedRoute>
      )}

      {(currentView === 'student-portal' || currentView === 'student' || currentView === 'student-hub') && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STUDENT', 'Super Admin', 'Student']}>
          <StudentPortal />
        </ProtectedRoute>
      )}

      {(currentView === 'teacher-portal' || currentView === 'teacher') && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'TEACHER', 'Super Admin', 'Teacher']}>
          <TeacherPortal />
        </ProtectedRoute>
      )}

      {(currentView === 'documents' || currentView === 'certificates') && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN', 'ACCOUNTANT', 'Super Admin', 'Admin']}>
          <DocumentCertificatesCenter />
        </ProtectedRoute>
      )}

      {(currentView === 'fee-management' || currentView === 'fees') && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN', 'ACCOUNTANT', 'Super Admin', 'Admin']}>
          <FeeManagement />
        </ProtectedRoute>
      )}

      {(currentView === 'financial-reports' || currentView === 'finance') && (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'CAMPUS_ADMIN', 'ACCOUNTANT', 'Super Admin', 'Admin']}>
          <FinancialReports />
        </ProtectedRoute>
      )}

      {![
        'admin-dashboard', 'students', 'admissions', 'academics', 'timetable', 'homework', 'assignments',
        'admin-courses', 'admin-attendance', 'attendance', 'admin-roles', 'system', 'cms-admin', 'cms',
        'public-site-customizer', 'public-site', 'site-profiles', 'user-profiles', 'reports', 'analytics',
        'audit-logs', 'audit', 'system-config', 'settings', 'parent-portal', 'parent', 'student-portal',
        'student', 'student-hub', 'teacher-portal', 'teacher', 'documents', 'certificates', 'fee-management',
        'fees', 'financial-reports', 'finance'
      ].includes(safeView) && (
        <AdminDashboard />
      )}

      <Notifications />
      <Modals />
    </ErpLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
