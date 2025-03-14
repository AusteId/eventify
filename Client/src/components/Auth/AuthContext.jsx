import { createContext, useCallback, useContext, useEffect, useState, } from 'react';
import { useNavigate } from 'react-router';
import { useNotification } from '../context/NotificationContext';
import LoadingScreen from '../message/LoadingScreen';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated,setIsAuthenticated] = useState(false);
  const [roles,setRoles] = useState([]);
  const [userId,setUserId] = useState("")
  const [loading,setIsLoading] = useState(false)

  const {timeoutForError} = useNotification();


  const navigate = useNavigate();

  const checkAuthStatus = useCallback(async () => {
    //Constant agony of 401's if not logged in, so need to store shit in session to prevent it from checking the cookie
    const stupidFuckingCheck = isAuthenticated || sessionStorage.getItem("plsStahp") === "true";
    if (!stupidFuckingCheck) {
      return;
    }
    setIsLoading(true)
    try {
    const response = await fetch("http://localhost:8080/api/users/me", {
      credentials: "include"
    });
    if (response.ok) {
      const userData = await response.json();
      setIsAuthenticated(true);
      setRoles(userData.roles || []);
      setUserId(userData.id || "");
      sessionStorage.setItem("plsStahp","true")
      console.log( {
        authenticated: true,
        roles: userData.roles || [],
        userId: userData.id || ""
      });
    } else {
      setIsAuthenticated(false);
      setRoles([])
      setUserId("");
      sessionStorage.removeItem("plsStahp")
    }
  } catch (error) {
    timeoutForError(error.message || "Failed to authenticate")
    setIsAuthenticated(false);
    setRoles([])
    setUserId("");
    sessionStorage.removeItem("plsStahp")
  } finally {
    setIsLoading(false)
  }
  },[])

  useEffect(() => {
    checkAuthStatus();
  },[checkAuthStatus])

  const login = async(credentials) => {
    setIsLoading(true);
    try{
      const response = await fetch("http://localhost:8080/api/users/login", {
        method:"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: credentials.email.toLowerCase(),
          password: credentials.password
        }),
        credentials: "include"
      })
      if (!response.ok) {
        timeoutForError("Login Failed")
        return false;
      }
      sessionStorage.setItem("plsStahp","true")
      await checkAuthStatus();
      return true;
    } catch (error) {
      timeoutForError(error.message || "Failed to login")
      return false;
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
    await fetch("http://localhost:8080/api/users/logout", {
      method: "POST",
      credentials: "include"
    });
    sessionStorage.removeItem("plsStahp")
  } catch(error) {
    timeoutForError(error.message || "Failed to logout")
  } finally {
    setIsAuthenticated(false);
    setRoles([])
    setUserId("");
    sessionStorage.removeItem("plsStahp")
    navigate("/login")
    setIsLoading(false)
  }
  }

  const authFetch = async (url, options = {}) => {
    const fetchOptions = {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {})
      }
    };
    setIsLoading(true)
    try {
      const response = await fetch(url,fetchOptions)
    if (response.status === 401) {
      setIsAuthenticated(false);
      setRoles([])
      setUserId("");
      navigate("/")
      return null;
    }
    return response;
  } catch (error) {
    timeoutForError(error.message || "Failed to authenticate")
    return null;
  } finally {
    setIsLoading(false)
  }
  }

 

  return (
    <AuthContext.Provider value={{isAuthenticated,roles,userId,login,logout,authFetch,loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
