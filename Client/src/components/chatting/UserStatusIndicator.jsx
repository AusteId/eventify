import { useWebSocket } from "./WebSocketContext";
import { formatDistanceToNow } from "date-fns";
import defaultAvatar from "../../assets/default-user-image.png"

const UserStatusIndicator = ({ userId, showLastSeen = false }) => {
  const { getUserStatus } = useWebSocket();
  const userStatus = getUserStatus(userId);
  
  const getStatusColor = () => {
    switch (userStatus.status) {
      case "ONLINE":
        return "bg-green-500";
      case "AWAY":
        return "bg-yellow-500";
      case "OFFLINE":
      default:
        return "bg-gray-500";
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
      console.error("Error formatting last seen date:", error);
      return "Last seen recently";
    }
  };

  return (
    <div className="flex items-center">
      <div className={`relative w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                              <img
                              src={`http://localhost:8080/api/users/${userId}/avatar`}
                              onError={e => {
                                e.target.onerror = null;
                                e.target.src =
                                  defaultAvatar;
                              }}
                              className='w-[40px] rounded-full'
                              alt="user avatar"
                            />
      {showLastSeen && (
        <div className="ml-2 text-xs text-gray-500">
          {userStatus.status === "OFFLINE" ? getLastSeenText() : getStatusLabel()}
        </div>
      )}
    </div>
  );
};

export default UserStatusIndicator;