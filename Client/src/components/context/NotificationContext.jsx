import { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useAuth } from '../Auth/AuthContext';

window.EVENTIFY_LAST_FETCH_TIME = window.EVENTIFY_LAST_FETCH_TIME || 0;
window.EVENTIFY_IS_FETCHING = window.EVENTIFY_IS_FETCHING || false;

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  

  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated;
  const authFetch = auth?.authFetch;
  
  const url = 'http://localhost:8080';
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isMounted = useRef(true);
  const FETCH_DEBOUNCE_MS = 2000; 

  useEffect(() => {
    return () => {
      window.EVENTIFY_IS_FETCHING = false;
    };
  }, []);

  const timeoutForError = message => {
    const errorMessage = typeof message === 'string' ? message : 'An error occurred';
    setError(errorMessage);
    setTimeout(() => { setError(''); }, 3000);
  };

  const timeoutForSuccess = message => {
    setSuccess(message);
    setTimeout(() => { setSuccess(''); }, 1500);
  };
  
  useEffect(() => {
    isMounted.current = true;
    
    try {
      const storedCount = localStorage.getItem('eventify_unread_count');
      if (storedCount) {
        const count = parseInt(storedCount, 10) || 0;
        console.log("Loaded notification count from localStorage:", count);
        setUnreadCount(count);
      }
    } catch (e) {
      console.error("Error loading notification count from localStorage:", e);
    }
    
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    try {
      localStorage.setItem('eventify_unread_count', unreadCount.toString());
    } catch (e) {
      console.error("Error saving notification count to localStorage:", e);
    }
  }, [unreadCount]);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount(true);
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated]);
  
  const fetchUnreadCount = useCallback(async (force = false) => {
    if (!isAuthenticated || !authFetch) {
      return;
    }
    
    const now = Date.now();
    if (!force && now - window.EVENTIFY_LAST_FETCH_TIME < FETCH_DEBOUNCE_MS) {
      return;
    }
  
    if (window.EVENTIFY_IS_FETCHING && !force) {
      return;
    }
    
    try {
      window.EVENTIFY_IS_FETCHING = true;
      window.EVENTIFY_LAST_FETCH_TIME = now;
      setIsLoading(true);
      
      console.log("Fetching unread message counts...");
      const response = await authFetch(`${url}/api/messages/unread`);
      
      if (!isMounted.current) return;
      
      if (response && response.ok) {
        const data = await response.json();
        const totalCount = Object.values(data).reduce((sum, count) => sum + count, 0);
        
        console.log("Fetched unread count:", totalCount);
        setUnreadCount(totalCount);
      }
    } catch (e) {
      console.error("Error fetching unread count:", e);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
      window.EVENTIFY_IS_FETCHING = false;
    }
  }, [isAuthenticated, authFetch, url]);
  
  const updateUnreadCount = useCallback((count) => {
    setUnreadCount(count);
  }, []);
  
  useEffect(() => {
    if (!isAuthenticated || !authFetch) return;
    
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 60000); 
    
    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated, authFetch, fetchUnreadCount]);
  
  const contextValue = useMemo(() => ({
    unreadCount,
    updateUnreadCount,
    fetchUnreadCount,
    isLoading
  }), [unreadCount, updateUnreadCount, fetchUnreadCount, isLoading]);
  
  return (
    <NotificationContext.Provider value={{...contextValue, url, error, success, timeoutForError, timeoutForSuccess}}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;