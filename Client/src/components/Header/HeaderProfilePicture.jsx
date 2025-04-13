import defaultAvatar from '../../assets/profile-picture.webp';
import { useAuth } from '../Auth/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useEffect, useRef } from 'react';

const HeaderProfilePicture = () => {
  const { avatar } = useAuth();
  const { unreadCount, fetchUnreadCount } = useNotifications();
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    
    hasInitializedRef.current = true;
    
    try {
      const storedCount = localStorage.getItem('eventify_unread_count');
      if (!storedCount) {
        fetchUnreadCount(true);
      }
    } catch (e) {
      console.error("Error in HeaderProfilePicture:", e);
    }
    
  }, [fetchUnreadCount]);

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