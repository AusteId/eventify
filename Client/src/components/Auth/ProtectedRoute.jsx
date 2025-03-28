import { Navigate } from 'react-router';
import { useAuth } from './AuthContext';
import LoadingScreen from '../message/LoadingScreen';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, roles, loading } = useAuth();
  console.log('ROLES:', roles);

  if (loading) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAllowed = roles.some(role => {
    return allowedRoles.includes(role.name);
  });
  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
