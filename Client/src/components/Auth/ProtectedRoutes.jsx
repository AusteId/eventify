
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import LoadingScreen from '../message/LoadingScreen.jsx';


const ProtectedRoute = ({ children, requiredRoles = [] }) => {
//   const { isAuthenticated, roles,loading } = useAuth();
//   const location = useLocation();
//
//   console.log('Protected route check:', {
//     isAuthenticated,
//     roles,
//     requiredRoles,
//     path: location.pathname
//   });
//
//   if (!isAuthenticated) {
//     toast.error("Please log in to access this page");
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }
// if (loading) {
//   return <LoadingScreen />;
// }
//
//   if (requiredRoles.length > 0) {
//     const userRoles = roles.map(role => role.name);
//     const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
//
//     if (!hasRequiredRole) {
//       toast.error("Unauthorized");
//       return <Navigate to="/" replace />;
//     }
//   }
//
  return children;
};

export default ProtectedRoute;