import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useAuth } from '../Auth/AuthContext';
import notificationStore from '../NotificationStore';

const LazyWebSocketProvider = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    
    console.log("LazyWebSocketProvider mounted");
    
  }, [isAuthenticated]);

  return null;
};

export default LazyWebSocketProvider;