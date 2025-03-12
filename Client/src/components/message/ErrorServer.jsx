import { useEffect, useState } from "react";
import { useNotification } from "../context/NotificationContext";

const ErrorServer = () => {
    const { error, setError } = useNotification();
    const [isVisible, setIsVisible] = useState(false);
   
  
    useEffect(() => {
      let hideTimeout;
      
      if (error) {
        setIsVisible(false);
        
        const showTimeout = setTimeout(() => {
          setIsVisible(true);
          
          hideTimeout = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
              setError("");
            }, 500);
          }, 2500);
        }, 50);
  
        return () => {
          clearTimeout(showTimeout);
          clearTimeout(hideTimeout);
        };
      }
    }, [error, setError]);
  
    if (!error) return null;
  
    return (
      <div className="relative">
        <div
          className={`z-[100] fixed top-[12%] left-[1%] bg-gradient-to-r from-orange-500 to-yellow-500 border-l-4 border-r-4 border-red-500 text-white p-6 rounded-3xl shadow-lg shadow-yellow-500 transition-all duration-500 ease-out ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }`}
        >
          <p className="text-[1.1rem]">{error}</p>
        </div>
      </div>
    );
  };
  
  export default ErrorServer;