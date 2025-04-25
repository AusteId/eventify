import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState('');
  const [loading, setIsLoading] = useState(true);
  const [profileImg, setProfileImg] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [avatar, setAvatar] = useState();

  const navigate = useNavigate();
  const location = useLocation();

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const shortenContent = (message, number) => {
    if (message.length <= number) {
      return message;
    }
    return message.substring(0, number) + "...";
  };

  const getUserAvatar = async () => {
    try {
      const cached = localStorage.getItem('userAvatar');
      if (cached) {
        setAvatar(cached);
        return;
      }

      const response = await authFetch('http://localhost:8080/api/users/avatar');
      if (response && response.ok) {
        const blob = await response.blob();
        const base64 = await blobToBase64(blob);

        localStorage.setItem('userAvatar', base64);
        setAvatar(base64);
      }
    } catch (error) {
      console.error('Avatar fetch error:', error);
      toast(error.message || 'Failed to load avatar');
    }
  };

  useEffect(() => {
    const checkAuthOnMount = async () => {
      setIsLoading(true);
      console.log("Running initial auth check");

      const hasRememberMe = localStorage.getItem("rememberMe") === "true";
      const hasSession = sessionStorage.getItem("plsStahp") === "true";

      if (!hasRememberMe && !hasSession) {
        console.log("No session or remember me found");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/users/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("Auth check success:", userData);

          setIsAuthenticated(true);
          setRoles(userData.roles || []);
          setUserId(userData.id || '');
          setBirthDate(userData.birthDate || null);

          if (!hasRememberMe) {
            sessionStorage.setItem('plsStahp', 'true');
          }

          getUserAvatar();
        } else {
          console.log("Auth check failed with status:", response.status);
          clearAuthData();
        }
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error(error.message || 'Failed to authenticate');
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthOnMount();
  }, []);

  const clearAuthData = () => {
    setIsAuthenticated(false);
    setRoles([]);
    setUserId('');
    setBirthDate(null);
    setAvatar(null);
    sessionStorage.removeItem('plsStahp');
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("userAvatar");
  };

  const login = async credentials => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email.toLowerCase(),
          password: credentials.password,
          rememberMe: credentials.rememberMe || false
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        toast.error('Incorrect email or password');
        setIsLoading(false);
        return false;
      }

      if (credentials.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        sessionStorage.setItem('plsStahp', 'true');
        localStorage.removeItem("rememberMe");
      }

      const userResponse = await fetch('http://localhost:8080/api/users/me', {
        credentials: 'include',
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setIsAuthenticated(true);
        setRoles(userData.roles || []);
        setUserId(userData.id || '');
        setBirthDate(userData.birthDate || null);
      }

      window.dispatchEvent(new Event('login_success'));
      await getUserAvatar();

      const queryParams = new URLSearchParams(location.search);
      const redirect = queryParams.get('redirect') || '/';
      navigate(redirect);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || 'Login Failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    navigate('/');
    try {
      await fetch('http://localhost:8080/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
      clearAuthData();
      localStorage.removeItem("eventify_unread_count");

      window.dispatchEvent(new Event('logout'));
      toast.success('Logged out!');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.message || 'Failed to logout');
      clearAuthData();
    } finally {
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

    try {
      const response = await fetch(url, fetchOptions);
      if (response.status === 401) {
        clearAuthData();
        navigate('/');
        return null;
      }
      return response;
    } catch (error) {
      console.error("Auth fetch error:", error);
      toast.error(error.message || 'Failed to fetch');
      return null;
    }
  };

  const contextValue = {
    isAuthenticated,
    roles,
    userId,
    profileImg,
    birthDate,
    login,
    logout,
    authFetch,
    loading,
    avatar,
    shortenContent,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);