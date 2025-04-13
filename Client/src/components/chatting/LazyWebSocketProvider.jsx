import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useAuth } from '../Auth/AuthContext';
import notificationStore from '../NotificationStore';

const LazyWebSocketProvider = () => {
  const { isAuthenticated, authFetch } = useAuth();
  const location = useLocation();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || hasInitialized) return;

    const initializeNotifications = async () => {
      try {

        const cachedCount = notificationStore.getUnreadCount();
        if (cachedCount > 0) {
          console.log("Using cached notification count:", cachedCount);
          return;
        }

        if (!location.pathname.includes('/chat')) {
          const response = await authFetch('http://localhost:8080/api/messages/unread');
          if (response && response.ok) {
            const data = await response.json();
            const totalCount = Object.values(data).reduce((sum, count) => sum + count, 0);
            
            if (totalCount > 0) {
              notificationStore.setUnreadCount(totalCount);
              console.log("Loaded notification count from API:", totalCount);
            }
          }
        }

        setHasInitialized(true);
      } catch (e) {
        console.error("Error initializing lazy notifications:", e);
      }
    };

    initializeNotifications();
  }, [isAuthenticated, location.pathname, authFetch, hasInitialized]);

  return null;
};

export default LazyWebSocketProvider;