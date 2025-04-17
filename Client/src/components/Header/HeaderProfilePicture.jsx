import { useEffect, useState } from 'react';
import defaultAvatar from '../../assets/profile-picture.webp';
import { useAuth } from '../Auth/AuthContext';

const HeaderProfilePicture = () => {
  const { avatar,isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    try {
      const count = parseInt(localStorage.getItem('eventify_unread_count') || '0', 10);
      setUnreadCount(count);
    } catch (e) {
      console.error("Error reading notification count:", e);
    }

    const handleStorageChange = (event) => {
      if (event.key === 'eventify_unread_count') {
        try {
          const count = parseInt(event.newValue || '0', 10);
          setUnreadCount(count);
        } catch (e) {
          console.error("Error reading updated notification count:", e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isAuthenticated) {
        setUnreadCount(parseInt(localStorage.getItem('eventify_unread_count') || '0'));
      }
    }, 2000);

    return () => clearInterval(intervalId);
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