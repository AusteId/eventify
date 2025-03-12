import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

const getUserRole = () => {
  const token = localStorage.getItem('token');

  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.scope;
  } catch (error) {
    console.error('Invalid JWT:', error);
    return null;
  }
};

const ProtectedRoute = ({ element, requiredRole }) => {
  const userRole = getUserRole();

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return element;
};
export default ProtectedRoute;
