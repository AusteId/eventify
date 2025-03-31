import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketContext";
import { Helmet } from "react-helmet";
import ChatUsersList from "./ChatUsersList";
import ChatComponent from "./ChatComponent";
import WebSocketStatusBadge from "./WebSocketStatusBadge";

const Chat = () => {

    const [selectedUser, setSelectedUser] = useState(null)
    const {getTotalUnreadCount, updateOnlineStatus,connected} = useWebSocket();
    const totalUnread = getTotalUnreadCount;

    useEffect(() => {
      if (connected) {
          updateOnlineStatus("ONLINE");
          
          const handleVisibilityChange = () => {
              if (document.visibilityState === "hidden") {
                  updateOnlineStatus("AWAY");
              } else {
                  updateOnlineStatus("ONLINE");
              }
          };
  
          document.addEventListener("visibilitychange", handleVisibilityChange);
  
          return () => {
              document.removeEventListener("visibilitychange", handleVisibilityChange);
              updateOnlineStatus("OFFLINE");
          };
      }
  }, [connected, updateOnlineStatus]);

    const handleSelectUser = (user) => {
        setSelectedUser(user)
    }

    useEffect(() => {
        if (totalUnread > 0) {
            document.title = `(${totalUnread}) Eventify - Chat`
        } else {
            document.title = "Eventify - Chat"
        }
    }, [totalUnread])

    return (
        <div className="container mx-auto mt-8 px-4">
          <Helmet>
            <title>{totalUnread > 0 ? `(${totalUnread}) Eventify - Chat` : 'Eventify - Chat'}</title>
          </Helmet>
          <h1 className="text-2xl font-bold mb-4">Messages {totalUnread > 0 && 
            <span className="bg-red-500 text-white text-sm rounded-full px-2 py-1 ml-2">
              {totalUnread}
            </span>
          }</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <ChatUsersList onSelectUser={handleSelectUser} />
            </div>
            <div className="md:col-span-2">
              {selectedUser ? (
                <ChatComponent
                  recipientId={selectedUser.id}
                  recipientUsername={selectedUser.username}
                />
              ) : (
                <div className="border rounded-lg shadow-lg h-96 flex items-center justify-center">
                  <p className="text-gray-500">Select a user to start chatting</p>
                </div>
              )}
            </div>
          </div>
          <WebSocketStatusBadge />
        </div>
      );
}
 
export default Chat;