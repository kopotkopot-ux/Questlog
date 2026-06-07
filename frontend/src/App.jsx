/**
 * Main application router
 */
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Spinner from './components/ui/Spinner';

// Lazy-loaded pages for performance optimization
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const UserManagementPage = lazy(() => import('./pages/UserManagementPage'));
const ActivityLogsPage = lazy(() => import('./pages/ActivityLogsPage'));
const AdminNotificationsPage = lazy(() => import('./pages/AdminNotificationsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/** Redirect authenticated users away from guest pages */
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner size="lg" />;
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

        {/* User routes - admins redirected to /admin */}
        <Route path="/dashboard" element={<ProtectedRoute requireUser><DashboardPage /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute requireUser><TasksPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute requireUser><NotificationsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute requireUser><ProfilePage /></ProtectedRoute>} />

        {/* Shared settings */}
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Admin routes - users redirected to /dashboard */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UserManagementPage /></ProtectedRoute>} />
        <Route path="/admin/activity-logs" element={<ProtectedRoute requireAdmin><ActivityLogsPage /></ProtectedRoute>} />
        <Route path="/admin/notifications" element={<ProtectedRoute requireAdmin><AdminNotificationsPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
