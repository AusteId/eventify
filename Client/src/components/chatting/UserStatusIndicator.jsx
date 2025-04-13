import { useState, useEffect } from "react";
import { useWebSocket } from "./WebSocketContext";
import { formatDistanceToNow } from "date-fns";
import defaultAvatar from "../../assets/default-user-image.png";

const UserStatusIndicator = ({ userId, showLastSeen = false }) => {
  const { getUserStatus } = useWebSocket();
  const userStatus = getUserStatus(userId);
  const [avatarSrc, setAvatarSrc] = useState(null);
  
  useEffect(() => {
    // Check for cached avatar first
    const cachedAvatar = localStorage.getItem(`avatar_${userId}`);
    
    if (cachedAvatar) {
      setAvatarSrc(cachedAvatar);
      return;
    }
    
    // Otherwise, prepare to fetch it
    const controller = new AbortController();
    const signal = controller.signal;
    
    async function fetchAvatar() {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}/avatar`, {
          signal
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();
          
          reader.onloadend = () => {
            const base64data = reader.result;
            setAvatarSrc(base64data);
            localStorage.setItem(`avatar_${userId}`, base64data);
          };
          
          reader.readAsDataURL(blob);
        } else {
          setAvatarSrc(defaultAvatar);
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error("Error loading avatar:", error);
          setAvatarSrc(defaultAvatar);
        }
      }
    }
    
    fetchAvatar();
    
    return () => {
      controller.abort();
    };
  }, [userId]);
  
  const getStatusColor = () => {
    switch (userStatus.status) {
      case "ONLINE":
        return "bg-green-500";
      case "AWAY":
        return "bg-yellow-500";
      case "OFFLINE":
      default:
        return "bg-gray-400";
    }
  };

  const getStatusLabel = () => {
    switch (userStatus.status) {
      case "ONLINE":
        return "Online";
      case "AWAY":
        return "Away";
      case "OFFLINE":
      default:
        return "Offline";
    }
  };

  const getLastSeenText = () => {
    if (!userStatus.lastSeen) return "Never seen";
    
    try {
      if (userStatus.status !== "OFFLINE") return null;
      
      const lastSeenDate = new Date(userStatus.lastSeen);
      return `Last seen ${formatDistanceToNow(lastSeenDate, { addSuffix: true })}`;
    } catch (error) {
      return "Last seen recently";
    }
  };

  return (
    <div className="flex items-center">
      <div className="relative">
        <img
          src={avatarSrc || defaultAvatar}
          className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
          alt="avatar"
        />
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor()} border-2 border-white`}></div>
      </div>
      
      {showLastSeen && (
        <div className="ml-2 text-xs text-gray-500">
          {userStatus.status === "OFFLINE" ? getLastSeenText() : getStatusLabel()}
        </div>
      )}
    </div>
  );
};

export default UserStatusIndicator;
