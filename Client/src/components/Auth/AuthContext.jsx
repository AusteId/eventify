import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router';
import { useNotification } from '../context/NotificationContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [profileImg, setProfileImg] = useState('');
  const [birthDate, setBirthDate] = useState(null);

  const { timeoutForError } = useNotification();

  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthStatus = useCallback(async () => {

    if (isAuthenticated) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/users/me', {
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setRoles(userData.roles || []);
        setUserId(userData.id || '');
        setBirthDate(userData.birthDate || null);
        sessionStorage.setItem('plsStahp', 'true');
        console.log({
          authenticated: true,
          roles: userData.roles || [],
          userId: userData.id || '',
        });
      } else {
        setIsAuthenticated(false);
        setRoles([]);
        setUserId('');
        setBirthDate(null);
        sessionStorage.removeItem('plsStahp');
      }
    } catch (error) {
      timeoutForError(error.message || 'Failed to authenticate');
      setIsAuthenticated(false);
      setRoles([]);
      setUserId('');
      setBirthDate(null);
      sessionStorage.removeItem('plsStahp');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkEventRegistration = useCallback(async (eventId) => {
    if (!isAuthenticated || !eventId) {
      return { isRegistered: false, currentParticipants: 0};
    }

    try {
      const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
        credentials: 'include',
        
      });
      if (response.ok) {
        const eventData = await response.json();
        console.log('checkEventRegistration response:', eventData);
        return {
          isRegistered: eventData.isRegistered || false,
          currentParticipants: eventData.currentParticipants || 0,
        };
      } else {
        console.error('checkEventRegistration failed with status:', response.status);
        return { isRegistered: false, currentParticipants: 0 };
      }
    } catch (error) {
      console.error('Error checking event registration:', error);
      toast.error('Failed to fetch event registration status');
      return { isRegistered: false, currentParticipants: 0 };
    }
  }, [isAuthenticated]);

  const login = async (credentials) => {
    try {
      
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email.toLowerCase(),
          password: credentials.password,
        }),
        credentials: 'include',
      });
      if (!response.ok) {
        toast.error('Incorrect email or password');
        return false;
      }
      sessionStorage.setItem('plsStahp', 'true');
      await checkAuthStatus();
      const queryParams = new URLSearchParams(location.search);
      const redirect = queryParams.get('redirect') || '/'; 
      navigate(redirect);
      return true;
    } catch (error) {
      toast.error(error.message || 'Login Failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch('http://localhost:8080/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/');
      sessionStorage.removeItem('plsStahp');
      toast.success('Logged out!');
    } catch (error) {
      timeoutForError(error.message || 'Failed to logout');
    } finally {
      setIsAuthenticated(false);
      setRoles([]);
      setUserId('');
      sessionStorage.removeItem('plsStahp');
      setIsLoading(false);
    }
  };

  const authFetch = async (url, options = {}) => {
    const fetchOptions = {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.headers || {}),
      },
    };
    setIsLoading(true);
    try {
      const response = await fetch(url, fetchOptions);
      if (response.status === 401) {
        setIsAuthenticated(false);
        setRoles([]);
        setUserId('');
        navigate('/');
        return null;
      }
      return response;
    } catch (error) {
      timeoutForError(error.message || 'Failed to authenticate');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        roles,
        userId,
        profileImg,
        birthDate,
        login,
        logout,
        authFetch,
        loading,
        checkEventRegistration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);