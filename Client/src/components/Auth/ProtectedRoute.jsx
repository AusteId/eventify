import { Navigate } from 'react-router';
import { useAuth } from './AuthContext';
import LoadingScreen from '../message/LoadingScreen';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, roles, loading } = useAuth();
  
  if (loading) {
    console.log('Protected Route: Loading...');
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Protected Route: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }


  if (!Array.isArray(roles)) {
    return <Navigate to="/" replace />;
  }


  const isAllowed = roles.some(role => {

    if (typeof role === 'object' && role !== null && 'name' in role) {
      const hasRole = allowedRoles.includes(role.name);
      return hasRole;
    } 
    else if (typeof role === 'string') {
      const hasRole = allowedRoles.includes(role);
      return hasRole;
    }
    return false;
  });

  
  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;