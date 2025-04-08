import { useEffect, useRef, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useWebSocket } from "./WebSocketContext";
import UserStatusIndicator from "./UserStatusIndicator";
import { formatDistanceToNow } from "date-fns";

const ChatUsersList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authFetch, userId: currentUserId } = useAuth();
  const { url, timeoutForError } = useNotification();
  const { getUnreadCount, getUserStatus } = useWebSocket();
  const listRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authFetch(`${url}/api/users/all`);
        if (response && response.ok) {
          const data = await response.json();
          const filtered = data.filter((user) => user.id !== currentUserId);
          setUsers(filtered);
          console.log("✅ Loaded users:", filtered);
        } else {
          console.error(`❗️ Failed to load users: ${response.status}`);
          timeoutForError("Failed to load users");
        }
      } catch (e) {
        console.error("❗️ Fetch users error:", e.message);
        timeoutForError("Failed to load users: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authFetch, url, timeoutForError, currentUserId]);

  const sortedUsers = [...users].sort((a, b) => {
    const statusA = getUserStatus(a.id).status;
    const statusB = getUserStatus(b.id).status;

    const getPriority = (status) => {
      switch (status) {
        case "ONLINE": return 2;
        case "AWAY": return 1;
        case "OFFLINE": 
        default: return 0;
      }
    };
    
    return getPriority(statusB) - getPriority(statusA);
  });

  const getLastSeenText = (userId) => {
    const status = getUserStatus(userId);
    if (status.status !== "OFFLINE" || !status.lastSeen) return null;
    
    try {
      const lastSeenDate = new Date(status.lastSeen);
      return formatDistanceToNow(lastSeenDate, { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  return (
    <div className="border rounded-lg shadow-lg">
      <div className="p-3 border-b bg-gray-50">
        <h3 className="font-semibold">Contacts</h3>
      </div>
      <div className="overflow-y-auto max-h-[500px]" ref={listRef}>
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading users...</div>
        ) : sortedUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No users found</div>
        ) : (
          <ul className="divide-y">
            {sortedUsers.map((user) => {
              const unreadCount = getUnreadCount(user.id) || 0;
              const status = getUserStatus(user.id);
              const lastSeen = getLastSeenText(user.id);
              
              return (
                <li
                  key={user.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <UserStatusIndicator userId={user.id} />
                        <span className="ml-2 font-semibold">{user.username}</span>
                      </div>
                      {status.status === "OFFLINE" && lastSeen && (
                        <span className="text-xs text-gray-500 ml-5">Last seen {lastSeen}</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatUsersList;