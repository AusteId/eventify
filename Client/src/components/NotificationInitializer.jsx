import { useEffect } from 'react';

import notificationStore from './NotificationStore';
import { useAuth } from './Auth/AuthContext';


const NotificationInitializer = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    
    console.log("NotificationInitializer mounted");
    
  }, [isAuthenticated]);

  return null;
};

export default NotificationInitializer;