import { Navigate } from 'react-router';
import { useAuth } from './AuthContext';
import LoadingScreen from '../message/LoadingScreen';
import toast from 'react-hot-toast';
import { useRef, useState } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, roles, loading } = useAuth();
  const [shownToast,setShownToast] = useState(false)
  
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
    if (!shownToast) {
      toast("Unauthorized")
      setShownToast(true)
    }
    setTimeout(() => {
      setShownToast(false)
    },50)
    return <Navigate to="/login" replace />;
  }


  return children;
};

export default ProtectedRoute;