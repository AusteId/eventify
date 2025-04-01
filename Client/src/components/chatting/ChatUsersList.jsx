import { useEffect, useRef, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useWebSocket } from "./WebSocketContext";
import UserStatusIndicator from "./UserStatusIndicator";

const ChatUsersList = ({onSelectUser}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { authFetch, userId: currentUserId } = useAuth();
    const { url, timeoutForError } = useNotification();
    const { getUnreadCount } = useWebSocket();
    const listRef = useRef(null);

    const scrollPositionRef = useRef(0)
  

    useEffect(() => {
      const fetchUsers = async () => {

        if(loading) return;

        setLoading(true);
        try {
            if (listRef.current) {
                scrollPositionRef.current = listRef.current.scrollTop;
              }
          const response = await authFetch(`${url}/api/users/all`);
          if (response && response.ok) {
            const data = await response.json();
            const filteredUsers = data.filter(user => user.id !== currentUserId)
            setUsers(filteredUsers);
          } else {
            timeoutForError('Failed to load users: ' + (response ? response.status : 'unknown error'));
          }
        } catch (error) {
          timeoutForError('Failed to load users: ' + error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsers();
      const intervalId = setInterval(fetchUsers,30000);

      return () => clearInterval(intervalId)
    }, [authFetch, url, timeoutForError,currentUserId]);
  
    const sortedUsers = [...users].sort((a, b) => {

      const unreadA = getUnreadCount(a.id);
      const unreadB = getUnreadCount(b.id);
      
      if (unreadA > 0 && unreadB === 0) return -1;
      if (unreadB > 0 && unreadA === 0) return 1;

      const statusA = a.status || 'OFFLINE';
      const statusB = b.status || 'OFFLINE';
      
      if (statusA === 'ONLINE' && statusB !== 'ONLINE') return -1;
      if (statusB === 'ONLINE' && statusA !== 'ONLINE') return 1;
      return a.username.localeCompare(b.username);
    });
  
    return (
      <div className="border rounded-lg shadow-lg">
        <div className="p-3 border-b bg-gray-50">
          <h3 className="font-semibold">Contacts</h3>
        </div>
        
        <div className="overflow-y-auto max-h-[500px]">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading users...</div>
          ) : sortedUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No users found</div>
          ) : (
            <ul className="divide-y">
              {sortedUsers.map((user) => {
                const unreadCount = getUnreadCount(user.id);
                
                return (
                  <li 
                    key={user.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    onClick={() => onSelectUser(user)}
                  >
                    <div className="flex items-center">
                      <UserStatusIndicator userId={user.id} />
                      <span className="ml-2">{user.username}</span>
                    </div>
                    
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
}
 
export default ChatUsersList;