import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.token || !user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const currentTime = Date.now() / 1000;
  if (user.exp < currentTime) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = user.roles || [];

  if (allowedRoles && !allowedRoles.some(role => userRoles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
