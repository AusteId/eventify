import { useWebSocket } from "./WebSocketContext";

const ChatNotificationBadge = () => {
  const { getTotalUnreadCount } = useWebSocket();
  const totalUnread = getTotalUnreadCount();

  if (totalUnread === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {totalUnread > 99 ? '99+' : totalUnread}
    </span>
  );
};

export default ChatNotificationBadge;
