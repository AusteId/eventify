import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useWebSocket } from './WebSocketContext';
import UserStatusIndicator from './UserStatusIndicator';
import { formatDistanceToNow } from 'date-fns';
import { debounce } from 'lodash';
import defaultAvatar from '../../assets/default-user-image.png';
import '../../assets/scrollbar.css';

const ChatUsersList = ({ onSelectUser }) => {
  const [contacts, setContacts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { authFetch, userId: currentUserId, avatar } = useAuth();
  const { url, timeoutForError } = useNotifications();
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
            `${url}/api/chat/users/contacts?limit=20`,
          );

          if (response && response.ok) {
            const data = await response.json();
            setContacts(data);
            contactsLoadedRef.current = true;
          } else {
            timeoutForError('Failed to load chat contacts');
          }
        } catch (e) {
          timeoutForError('Failed to load chat contacts: ' + e.message);
        } finally {
          setLoading(false);
        }
      };

      fetchContacts();
    }
  }, [authFetch, url, timeoutForError]);

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
          `${url}/api/chat/users/search?query=${encodeURIComponent(query)}&limit=5`,
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
    <div className="border rounded-xl shadow-lg flex flex-col h-[700px] bg-white overflow-hidden">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <h3 className="font-semibold mb-3 text-gray-800">Contacts</h3>
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search users..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
            <div className="p-2 bg-gray-100 border-b">
              <h4 className="text-xs font-semibold text-gray-500">
                SEARCH RESULTS
              </h4>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchQuery.length < 2
                  ? 'Type at least 2 characters'
                  : 'No users found'}
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {searchResults.map(user => (
                  <li
                    key={`search-${user.id}`}
                    className="p-3 hover:bg-gray-50 cursor-pointer"
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
          <div className="p-4 text-center text-gray-500">
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Search for users to start chatting</p>
          </div>
        ) : (
          <div>
            <div className="p-2 bg-gray-100 border-b">
              <h4 className="text-xs font-semibold text-gray-500">
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
                    className={`p-4 hover:bg-amber-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-50' : ''
                    }`}
                    onClick={() => handleContactClick(contact)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <UserStatusIndicator userId={contact.id} />
                        <span className="ml-2 font-medium text-gray-800 truncate max-w-[150px]">
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