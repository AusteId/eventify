import { createContext, useContext, useState, useEffect } from 'react';
import { postLogin } from '../../helpers/user/postLogin';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = async data => {
    try {
      const response = await postLogin(data);
      localStorage.setItem('token', response.token);
      setUser({ token: response.token });
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Invalid credentials');
      throw new Error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
