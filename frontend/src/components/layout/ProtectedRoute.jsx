/**
 * Protected route wrapper - redirects unauthenticated users
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute({ children, requireAdmin = false, requireUser = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner size="lg" />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireUser && user.role !== 'user') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
