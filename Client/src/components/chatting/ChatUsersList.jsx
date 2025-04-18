import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useWebSocket } from './WebSocketContext';
import UserStatusIndicator from './UserStatusIndicator';
import { formatDistanceToNow } from 'date-fns';
import { debounce } from 'lodash';
import '../../assets/scrollbar.css';
import toast from 'react-hot-toast';
import { useDarkMode } from '../context/DarkModeContext.jsx';

const ChatUsersList = ({ onSelectUser }) => {
  const [contacts, setContacts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const {isDarkMode} = useDarkMode();

  const { authFetch, userId: currentUserId, avatar } = useAuth();
  const { getUnreadCount, getUserStatus } = useWebSocket();

  const listRef = useRef(null);
  const searchInputRef = useRef(null);
  const contactsLoadedRef = useRef(false);

  useEffect(() => {
    if (!contactsLoadedRef.current) {
      const fetchContacts = async () => {
        try {
          setLoading(true);
          const response = await authFetch(
            `http://localhost:8080/api/chat/users/contacts?limit=20`,
          );

          if (response && response.ok) {
            const data = await response.json();
            setContacts(data);
            contactsLoadedRef.current = true;
          } else {
            toast.error('Failed to load chat contacts');
          }
        } catch (e) {
          toast.error('Failed to load chat contacts: ' + e.message);
        } finally {
          setLoading(false);
        }
      };

      fetchContacts();
    }
  }, [authFetch]);

  useEffect(() => {
    return () => {
      contactsLoadedRef.current = false;
    };
  }, []);

  const debouncedSearch = useRef(
    debounce(async query => {
      if (!query || query.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await authFetch(
          `http://localhost:8080/api/chat/users/search?query=${encodeURIComponent(query)}&limit=5`,
        );

        if (response && response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (e) {
        console.error('Search error:', e.message);
      }
    }, 300),
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchInputChange = e => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(query.trim().length > 0);
    debouncedSearch(query);
  };

  const handleSearchResultClick = user => {
    setSelectedUserId(user.id);
    onSelectUser(user);
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);

    if (!contacts.some(contact => contact.id === user.id)) {
      setContacts(prev => [
        {
          id: user.id,
          username: user.username,
          lastInteraction: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const handleContactClick = contact => {
    setSelectedUserId(contact.id);
    onSelectUser(contact);
  };

  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      const unreadA = getUnreadCount(a.id) || 0;
      const unreadB = getUnreadCount(b.id) || 0;

      if (unreadA !== unreadB) {
        return unreadB - unreadA;
      }

      const statusA = getUserStatus(a.id)?.status || 'OFFLINE';
      const statusB = getUserStatus(b.id)?.status || 'OFFLINE';

      const getPriority = status => {
        switch (status) {
          case 'ONLINE':
            return 2;
          case 'AWAY':
            return 1;
          case 'OFFLINE':
          default:
            return 0;
        }
      };

      const priorityDiff = getPriority(statusB) - getPriority(statusA);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return new Date(b.lastInteraction) - new Date(a.lastInteraction);
    });
  }, [contacts, getUnreadCount, getUserStatus]);

  const getLastSeenText = useCallback(
    userId => {
      const status = getUserStatus(userId);
      if (status.status !== 'OFFLINE' || !status.lastSeen) return null;

      try {
        const lastSeenDate = new Date(status.lastSeen);
        return formatDistanceToNow(lastSeenDate, { addSuffix: true });
      } catch (error) {
        return 'recently';
      }
    },
    [getUserStatus],
  );
  
  return (
    <div className={`border rounded-xl shadow-lg flex flex-col h-[700px] duration-750 overflow-hidden ${isDarkMode ? 'bg-slate-900 border-[#f59e0b]' : 'bg-white'}`}>
      <div className={`p-4 border-b  sticky top-0 z-10 duration-750 ${isDarkMode ? 'bg-slate-900  border-l-[#f59e0b] border-r-[#f59e0b] border-b-gray-200 ' : 'bg-white'}`}>
        <h3 className={`font-semibold mb-3 duration-750 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Contacts</h3>
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search users..."
            className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all ${isDarkMode ? "text-gray-200 placeholder:text-gray-400" : "text-gray-800"}`}
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          {searchQuery && (
            <button
              className={`cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 duration-750 ${isDarkMode ? 'text-[#f59e0b] hover:text-amber-700' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
                setSearchResults([]);
                searchInputRef.current?.focus();
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 h-[550px] custom-scrollbar scrollbar-hover" ref={listRef}>
        {isSearching ? (
          <div>
            <div className={`p-2  border-b duration-750 ${isDarkMode ? "bg-slate-900 border-gray-200" : "bg-gray-100"}`}>
              <h4 className={`text-xs font-semibold duration-750 ${isDarkMode ? 'text-gray-200' : 'text-gray-500 '}`}>
                SEARCH RESULTS
              </h4>
            </div>

            {searchResults.length === 0 ? (
              <div className={`p-4 text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>
                {searchQuery.length < 2
                  ? 'Type at least 2 characters'
                  : 'No users found'}
              </div>
            ) : (
              <ul className={`divide-y divide-gray-100 ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>
                {searchResults.map(user => (
                  <li
                    key={`search-${user.id}`}
                    className={`p-3 cursor-pointer duration-750 ${isDarkMode ? "hover:bg-slate-600" : "hover:bg-gray-50"}`}
                    onClick={() => handleSearchResultClick(user)}
                  >
                    <div className="flex items-center">
                      <UserStatusIndicator userId={user.id} />
                      <span className="ml-2">{user.username}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : loading ? (
          <div className="p-4 text-center text-gray-500 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
          </div>
        ) : sortedContacts.length === 0 ? (
          <div className={`p-4 text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Search for users to start chatting</p>
          </div>
        ) : (
          <div>
            <div className={`p-2  border-b duration-750 ${isDarkMode ? "bg-slate-900 border-gray-200" : "bg-gray-100"}`}>
              <h4 className={`text-xs font-semibold duration-750 ${isDarkMode ? 'text-gray-200' : 'text-gray-500 '}`}>
                RECENT CONVERSATIONS
              </h4>
            </div>
            <ul className="divide-y divide-gray-100">
              {sortedContacts.map(contact => {
                const unreadCount = getUnreadCount(contact.id) || 0;
                const isSelected = selectedUserId === contact.id;

                return (
                  <li
                    key={`contact-${contact.id}`}
                    className={`p-4 cursor-pointer duration-750 ${isDarkMode && isSelected ? "bg-slate-600" : isDarkMode ? "hover:bg-slate-600" : isSelected ? "bg-gray-50 hover:bg-gray-50" : "hover:bg-gray-200"} cursor-pointer transition-colors`}
                    onClick={() => handleContactClick(contact)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <UserStatusIndicator userId={contact.id} />
                        <span className={`ml-2 font-medium duration-750  truncate max-w-[150px] ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {contact.username}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {getUserStatus(contact.id).status === 'OFFLINE' && getLastSeenText(contact.id) && (
                          <span className="text-xs text-gray-500 mr-2">
                            {getLastSeenText(contact.id)}
                          </span>
                        )}
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium shadow-sm">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUsersList;