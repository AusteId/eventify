import { useEffect } from 'react';

import notificationStore from './NotificationStore';
import { useAuth } from './Auth/AuthContext';

const NotificationInitializer = () => {
  const { isAuthenticated, authFetch } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchNotifications = async () => {
      try {

        if (notificationStore.getUnreadCount() === 0) {
          const response = await authFetch(`http://localhost:8080/api/messages/unread`);
          
          if (response && response.ok) {
            const data = await response.json();
            const totalCount = Object.values(data).reduce((sum, count) => sum + count, 0);
            
            if (totalCount > 0) {
              notificationStore.setUnreadCount(totalCount);
              console.log("Loaded notification count from API:", totalCount);
            }
          }
        } else {
          console.log("Using cached notification count:", notificationStore.getUnreadCount());
        }
      } catch (e) {
        console.error("Error initializing notifications:", e);
      }
    };

    try {
      const savedUnread = localStorage.getItem('eventify_unread');
      if (savedUnread) {
        const unreadData = JSON.parse(savedUnread);
        const totalUnread = Object.values(unreadData).reduce((sum, count) => sum + count, 0);
        
        if (totalUnread > 0) {
          notificationStore.setUnreadCount(totalUnread);
          console.log("Loaded notification count from localStorage:", totalUnread);
        }
      }
    } catch (e) {
      console.error("Error loading unread counts from localStorage:", e);
    }

    fetchNotifications();
  }, [isAuthenticated, authFetch]);

  return null;
};

export default NotificationInitializer;