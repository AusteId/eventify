import { useEffect, useState, useRef } from 'react';
import defaultAvatar from '../../assets/profile-picture.webp';
import { useAuth } from '../Auth/AuthContext';

const HeaderProfilePicture = () => {
  const { avatar, isAuthenticated, roles } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const prevAuthState = useRef(false);

  useEffect(() => {
    const updateCountFromStorage = () => {
      try {
        const count = parseInt(localStorage.getItem('eventify_unread_count') || '0', 10);
        setUnreadCount(count);
      } catch (e) {
        console.error("Error reading notification count:", e);
      }
    };

    updateCountFromStorage();

    const handleStorageChange = (event) => {
      if (event.key === 'eventify_unread_count') {
        updateCountFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (prevAuthState.current === isAuthenticated && isAuthenticated === false) {
      return;
    }

    prevAuthState.current = isAuthenticated;

    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    if (isAuthenticated) {

        const intervalId = setInterval(() => {
          const count = parseInt(localStorage.getItem('eventify_unread_count') || '0', 10);
          setUnreadCount(count);
        }, 5000);

        return () => clearInterval(intervalId);
      }
  }, [isAuthenticated]);

  return (
    <div className="avatar relative">
      <div className="bg-neutral text-neutral-content w-12 rounded-full">
        <img
          src={avatar || defaultAvatar}
          alt="Profile"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultAvatar;
          }}
        />
      </div>

      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full text-center w-5 h-5 flex items-center justify-center font-bold border-2 border-amber-600">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </div>
  );
};

export default HeaderProfilePicture;