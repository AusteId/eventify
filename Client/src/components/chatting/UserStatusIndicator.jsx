import { format } from 'date-fns';
import { useWebSocket } from './WebSocketContext';

const UserStatusIndicator = ({userId, showLastSeen = false}) => {
    const {getUserStatus} = useWebSocket();
    const userStatus = getUserStatus(userId);

    const getStatusColor = () => {
        switch (userStatus.status) {
            case "ONLINE":
                return "bg-green-500";
                case "AWAY":
                    return "bg-yellow-500"
                    case "OFFLINE":
                        default:
                            return "bg-gray-400"
        }
    }

    const formatLastSeen = () => {
        if (!userStatus.lastSeen) return "Never";
        const lastSeen = new Date(userStatus.lastSeen)
        const now = new Date();
        const diffInMinutes = Math.floor((now - lastSeen) / (1000*60))

        if ( diffInMinutes < 1) {
            return "Just now";
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
        } else if (diffInMinutes < 24 * 60) {
            const hours = Math.floor(diffInMinutes / 60);
            return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
        }else {
            return format(lastSeen, "MMM d, yyyy HH:mm")
        }
    }
    return (
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
          {showLastSeen && userStatus.status === 'OFFLINE' && (
            <span className="ml-2 text-xs text-gray-500">
              Last seen: {formatLastSeen()}
            </span>
          )}
        </div>
      );
}
 
export default UserStatusIndicator;