import { Outlet, useLocation } from 'react-router';
import Header from './Header/Header';
import { useAuth } from './Auth/AuthContext';
import { useEffect, useRef } from 'react';
import { useNotifications } from './context/NotificationContext';

const AuthenticatedLayout = ({ currentStep }) => {
  const location = useLocation();
  const { loading, isAuthenticated } = useAuth();
  const { fetchUnreadCount } = useNotifications();
  const previousPathRef = useRef(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const currentBasePath = location.pathname.split('/')[1];
    const previousBasePath = previousPathRef.current?.split('/')[1];
    
    if (currentBasePath !== previousBasePath && previousPathRef.current !== null && !hasFetchedRef.current) {
      console.log(`Major route change from ${previousPathRef.current} to ${location.pathname}`);
      
      hasFetchedRef.current = true;
      
      setTimeout(() => {
        fetchUnreadCount(true);
        
        setTimeout(() => {
          hasFetchedRef.current = false;
        }, 3000);
      }, 100);
    }
    
    previousPathRef.current = location.pathname;
  }, [isAuthenticated, location.pathname, fetchUnreadCount]);

  return (
    <div className="min-h-full flex flex-col">
      <Header currentStep={currentStep} loading={loading} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;