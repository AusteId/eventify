import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import LoadingScreen from '../message/LoadingScreen.jsx';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, roles, loading } = useAuth();
  const location = useLocation();

  console.log('Protected route check:', {
    isAuthenticated,
    roles: roles.map(r => r.name),
    requiredRoles,
    loading,
    path: location.pathname
  });

  if (loading) {
    console.log("Auth is still loading, showing loading screen");
    return <LoadingScreen />;
  }

  // if (!isAuthenticated) {
  //   console.log("Not authenticated, redirecting to login");
  //   toast.error("Please log in to access this page");
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  if (requiredRoles.length > 0) {
    const userRoleNames = roles.map(role => role.name);

    const hasRequiredRole = requiredRoles.some(role => userRoleNames.includes(role));

    if (!hasRequiredRole) {
      toast.error("Unauthorized", {
        id: "unauthorized-toast"
      });
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;