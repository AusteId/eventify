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
  const [loading, setIsLoading] = useState(true);
  const [profileImg, setProfileImg] = useState('');
  const [birthDate, setBirthDate] = useState(null);

  const { timeoutForError } = useNotification();

  const navigate = useNavigate();
  const location = useLocation();

  const [avatar, setAvatar] = useState()

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); 
      reader.onerror = reject;
      reader.readAsDataURL(blob); 
    });
  };

  const getUserAvatar = async () => {
    try {
      const cached = localStorage.getItem('userAvatar');
      if (cached) {
        setAvatar(cached); 
        return;
      }
  
      const response = await authFetch('http://localhost:8080/api/users/avatar');
      if (response.ok) {
        const blob = await response.blob();
        const base64 = await blobToBase64(blob);
  
        localStorage.setItem('userAvatar', base64);
        setAvatar(base64); 
      }
    } catch (error) {
      timeoutForError(error.message || 'Failed to load avatar');
    }
  };
  

  useEffect(() => {
    getUserAvatar();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    //Constant agony of 401's if not logged in, so need to store in session to prevent it from checking the cookie
    // const alreadyChecked =
    //   isAuthenticated || sessionStorage.getItem('plsStahp') === 'true';
    // if (!alreadyChecked) {
    //   return;
    // }

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
    if (!isAuthenticated) {
      localStorage.removeItem("userAvatar")
    }
    checkAuthStatus();
  }, []);

  const login = async credentials => {
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
      await getUserAvatar();
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
      localStorage.removeItem("userAvatar")
      setAvatar(null)
      toast.success('Logged out!');
    } catch (error) {
      timeoutForError(error.message || 'Failed to logout');
    } finally {
      setIsAuthenticated(false);
      setRoles([]);
      setUserId('');
      sessionStorage.removeItem('plsStahp');
      localStorage.removeItem("userAvatar")
      setAvatar(null)
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
        avatar
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
