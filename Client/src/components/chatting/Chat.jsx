import { useCallback, useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketContext";
import ChatUsersList from "./ChatUsersList";
import ChatComponent from "./ChatComponent";
import WebSocketStatusBadge from "./WebSocketStatusBadge";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { getTotalUnreadCount } = useWebSocket();
  const totalUnread = getTotalUnreadCount();

  const handleSelectUser = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  useEffect(() => {
    document.title = totalUnread > 0
      ? `(${totalUnread}) Eventify - Chat`
      : "Eventify - Chat";
  }, [totalUnread]);

  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Messages{" "}
        {totalUnread > 0 && (
          <span className="bg-red-500 text-white text-sm rounded-full px-2.5 py-1 ml-2">
            {totalUnread}
          </span>
        )}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChatUsersList onSelectUser={handleSelectUser} />
        </div>
        <div className="lg:col-span-2">
          {selectedUser ? (
            <ChatComponent
              recipientId={selectedUser.id}
              recipientUsername={selectedUser.username}
            />
          ) : (
            <div className="border rounded-xl shadow-lg h-[700px] flex items-center justify-center bg-white">
              <div className="text-center p-6">
                <div className="text-gray-400 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">Select a user to start chatting</p>
                <p className="text-gray-400 text-sm mt-2">Your conversations will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <WebSocketStatusBadge />
    </div>
  );
};

export default Chat;
