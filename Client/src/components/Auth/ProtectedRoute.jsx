import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingScreen from '../message/LoadingScreen';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated,roles,loading} = useAuth();

  if (loading) {
    return <div><LoadingScreen/></div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  if (allowedRoles && !allowedRoles.some(role => roles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
