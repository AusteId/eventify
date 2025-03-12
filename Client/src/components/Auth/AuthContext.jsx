import { createContext, useContext, useState, useEffect } from 'react';
import { postLogin } from '../../helpers/user/postLogin';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          return;
        }

        setUser({
          iat: decodedToken.iat,
          exp: decodedToken.exp,
          token,
          sub: decodedToken.sub,
          roles: decodedToken.scope ? decodedToken.scope.split(' ') : [],
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async data => {
    try {
      const response = await postLogin(data);
      const token = response.token;
      localStorage.setItem('token', token);
      const decodedToken = jwtDecode(token);

      setUser({
        iat: decodedToken.iat,
        exp: decodedToken.exp,
        token,
        sub: decodedToken.sub,
        roles: decodedToken.scope ? decodedToken.scope.split(' ') : [],
        isAuthenticated: true,
      });
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error(error.message);
      throw new Error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Successfully logged out!');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
