import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useWebSocket } from "./WebSocketContext";
import UserStatusIndicator from "./UserStatusIndicator";
import MessageComponent from "./MessageComponent";
import defaultAvatar from "../../assets/default-user-image.png";
import { formatDistanceToNow } from "date-fns";
import "../../assets/scrollbar.css";
import { useDarkMode } from '../context/DarkModeContext.jsx';

const ChatComponent = ({ recipientId, recipientUsername }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [hasLoadedMessages, setHasLoadedMessages] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const {isDarkMode} = useDarkMode();
  const [recipientAvatar, setRecipientAvatar] = useState(null);
  const previousMessagesLength = useRef(0);
  const scrollPositionRef = useRef(0);
  const scrollHeightBeforeLoadRef = useRef(0);
  const scrollTopBeforeLoadRef = useRef(0);
  const lastMarkTimeRef = useRef({});
  const isRunningRef = useRef(false);

  const { userId: authUserId, authFetch } = useAuth();
  const {
    connected,
    sendMessage,
    updateTypingStatus,
    markMessagesAsRead,
    subscribeToTypingIndicator,
    isUserTyping,
    messages: wsMessages,
    setActiveConversation,
    setMessages,
    getUserStatus,
    fetchUnreadMessageCounts
  } = useWebSocket();

  const chatContainerRef = useRef(null);
  const messageEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingSubscriptionRef = useRef(null);
  const previousRecipientId = useRef(null);
  const initialScrollDoneRef = useRef(false);

  const userId = authUserId;

  const conversationId = useMemo(() => {
    if (!userId || !recipientId) return null;
    return userId < recipientId
      ? `${userId}_${recipientId}`
      : `${recipientId}_${userId}`;
  }, [userId, recipientId]);

  const conversationMessages = useMemo(() => {
    if (!conversationId) return [];

    const wsConversation = wsMessages[conversationId] || [];

    if (localMessages.length === 0 && wsConversation.length > 0) {
      return wsConversation;
    }

    if (wsConversation.length === 0 && localMessages.length > 0) {
      return localMessages;
    }

    if (localMessages.length === 0 && wsConversation.length === 0) {
      return [];
    }

    const messageMap = new Map();

    localMessages.forEach(msg => {
      if (msg) {

        const key = msg.id ||
                   (msg.tempId ? `temp_${msg.tempId}` :
                   `${msg.senderId}_${msg.timestamp}_${msg.content?.substring(0, 20)}`);

        messageMap.set(key, {...msg, _source: 'local'});
      }
    });


    wsConversation.forEach(msg => {
      if (msg) {
        let key = msg.id;

        if (!key || key.startsWith('temp-')) {

          const potentialLocalKeys = Array.from(messageMap.keys()).filter(k =>
            k.includes(`${msg.senderId}_`) && k.includes(`_${msg.content?.substring(0, 20)}`)
          );

          if (potentialLocalKeys.length > 0) {
            key = potentialLocalKeys[0];
          } else {
            key = msg.id || `${msg.senderId}_${msg.timestamp}_${msg.content?.substring(0, 20)}`;
          }
        }

        const existing = messageMap.get(key);

        if (existing && existing._source === 'local') {
          if (existing.read && !msg.read) {
            messageMap.set(key, {...msg, read: true, _source: 'ws'});
          } else if (existing.isLocal && !msg.isLocal) {
            messageMap.set(key, {...msg, _source: 'ws'});
          } else {
            messageMap.set(key, {
              ...msg,
              _source: 'ws',
              read: existing.read || msg.read
            });
          }
        } else {
          messageMap.set(key, {...msg, _source: 'ws'});
        }
      }
    });

    return Array.from(messageMap.values()).filter(Boolean);
  }, [wsMessages, conversationId, localMessages]);

  const sortedMessages = useMemo(() => {
    return [...conversationMessages].sort((a, b) => {
      const timeA = new Date(a.timestamp || 0);
      const timeB = new Date(b.timestamp || 0);
      return timeA - timeB;
    });
  }, [conversationMessages]);

  const fetchRecipientAvatar = useCallback(async () => {
    if (!recipientId) return;

    try {
      const cachedAvatar = localStorage.getItem(`avatar_${recipientId}`);

      if (cachedAvatar) {
        setRecipientAvatar(cachedAvatar);
        return;
      }

      const avatarUrl = `http://localhost:8080/api/users/${recipientId}/avatar`;
      const response = await fetch(avatarUrl);

      if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64data = reader.result;
          setRecipientAvatar(base64data);
          localStorage.setItem(`avatar_${recipientId}`, base64data);
        };

        reader.readAsDataURL(blob);
      } else {
        setRecipientAvatar(defaultAvatar);
      }
    } catch (error) {
      console.error("Error loading recipient avatar:", error);
      setRecipientAvatar(defaultAvatar);
    }
  }, [recipientId]);

  useEffect(() => {
    if (connected && conversationId) {
      setActiveConversation(conversationId);
    }
  }, [connected, conversationId, setActiveConversation]);

const fetchMessages = useCallback(async (pageToLoad = 0) => {
  if (!userId || !recipientId) {
    setLoading(false);
    setIsLoadingMore(false);
    setIsLoadingOlder(false);
    return Promise.resolve();
  }

  if (loading && pageToLoad === page && pageToLoad !== page + 1) {
    console.log(`Already loading page ${pageToLoad}, skipping redundant fetch`);
    return Promise.resolve();
  }

  try {
    if (pageToLoad === 0) {
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    setLoadError(null);

    console.log(`Fetching messages for conversation ${userId}_${recipientId}, page ${pageToLoad}`);
    const response = await authFetch(
      `http://localhost:8080/api/messages/${userId}/${recipientId}?page=${pageToLoad}&size=20`
    );

    if (!response) {
      console.error("No response from server when fetching messages");
      setLoadError("No response from server");
      setLoading(false);
      setIsLoadingMore(false);
      setIsLoadingOlder(false);
      return Promise.reject(new Error("No response from server"));
    }

    if (response.ok) {
      const data = await response.json();
      console.log(`Received response for page ${pageToLoad}:`,
        data.content ? `Paginated response with ${data.content.length} messages` :
        Array.isArray(data) ? `Array response with ${data.length} messages` :
        'Unexpected data format');

      setPage(pageToLoad);

      if (data.content) {
        const newMessages = data.content;

        if (typeof data.last === 'boolean') {
          const moreAvailable = newMessages.length > 0 && !data.last;
          console.log(`Setting hasMoreMessages=${moreAvailable} based on data.last=${data.last}`);
          setHasMoreMessages(moreAvailable);
        } else {
          const moreAvailable = newMessages.length === 20;
          console.log(`Setting hasMoreMessages=${moreAvailable} based on message count`);
          setHasMoreMessages(moreAvailable);
        }

        if (pageToLoad === 0) {
          setLocalMessages(newMessages);
        } else {
          const markedMessages = newMessages.map(msg => ({
            ...msg,
            _page: pageToLoad
          }));

          setLocalMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const uniqueNewMessages = markedMessages.filter(m => !existingIds.has(m.id));

            console.log(`Adding ${uniqueNewMessages.length} new unique messages from page ${pageToLoad}`);
            return [...uniqueNewMessages, ...prev];
          });
        }
      } else if (Array.isArray(data)) {
        console.log(`Received ${data.length} messages for page ${pageToLoad}`);

        const moreAvailable = data.length === 20;
        console.log(`Setting hasMoreMessages=${moreAvailable} based on message count`);
        setHasMoreMessages(moreAvailable);

        if (pageToLoad === 0) {
          setLocalMessages(data);
        } else {
          const markedMessages = data.map(msg => ({
            ...msg,
            _page: pageToLoad
          }));

          setLocalMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const uniqueNewMessages = markedMessages.filter(m => !existingIds.has(m.id));

            console.log(`Adding ${uniqueNewMessages.length} new unique messages from page ${pageToLoad}`);
            return [...uniqueNewMessages, ...prev];
          });
        }
      } else {
        console.error("Unexpected data format from server:", data);
        setLoadError("Unexpected data format from server");
        setHasMoreMessages(false);
      }

      setHasLoadedMessages(true);
      return Promise.resolve();
    } else {
      console.error(`Server error when fetching messages: ${response.status}`);
      setLoadError(`Server error: ${response.status}`);
      return Promise.reject(new Error(`Server error: ${response.status}`));
    }
  } catch (err) {
    console.error("Error loading messages:", err);
    setLoadError(err.message || "Error loading messages");
    return Promise.reject(err);
  } finally {
    setLoading(false);
    setIsLoadingMore(false);
    setIsLoadingOlder(false);
  }
}, [userId, recipientId, authFetch, loading, page]);

  const loadMoreMessages = useCallback(() => {
    if (!hasMoreMessages || isLoadingMore || isLoadingOlder) return;

    const scrollContainer = chatContainerRef.current;
    if (!scrollContainer) return;

    const currentScrollHeight = scrollContainer.scrollHeight;
    const currentScrollTop = scrollContainer.scrollTop;

    console.log("LOAD MORE: Capturing scroll position:", currentScrollTop);

    scrollHeightBeforeLoadRef.current = currentScrollHeight;
    scrollTopBeforeLoadRef.current = currentScrollTop;

    setIsLoadingOlder(true);
    setIsLoadingMore(true);

    const nextPageToLoad = page + 1;

    console.log("LOAD MORE: Will load page:", nextPageToLoad);

    const endpoint = `http://localhost:8080/api/messages/${userId}/${recipientId}?page=${nextPageToLoad}&size=20`;

    authFetch(endpoint)
      .then(response => {
        if (!response || !response.ok) {
          throw new Error(`Server error: ${response ? response.status : 'No response'}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(`LOAD MORE: Success! Got data for page ${nextPageToLoad}`);

        let newMessages = [];

        if (data.content) {
          newMessages = data.content;
        } else if (Array.isArray(data)) {
          newMessages = data;
        }

        if (newMessages.length === 0) {
          console.log("No new messages received, marking as no more messages");
          setHasMoreMessages(false);
          return;
        }

        if (newMessages.length > 0) {
          setPage(nextPageToLoad);

          const hasMore = data.content
            ? (newMessages.length > 0 && !data.last)
            : (newMessages.length === 20);

          setHasMoreMessages(hasMore);

          const markedMessages = newMessages.map(msg => ({
            ...msg,
            _page: nextPageToLoad
          }));

          setLocalMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const uniqueNewMessages = markedMessages.filter(m => !existingIds.has(m.id));

            console.log(`Adding ${uniqueNewMessages.length} new unique messages from page ${nextPageToLoad}`);

            if (uniqueNewMessages.length === 0) {
              console.log("No new unique messages found, trying next page");
              setTimeout(() => {
                setIsLoadingOlder(false);
                setIsLoadingMore(false);
                loadMoreMessages();
              }, 100);
              return prev;
            }

            return [...uniqueNewMessages, ...prev];
          });
        }

        setTimeout(() => {
          if (scrollContainer) {
            const newScrollHeight = scrollContainer.scrollHeight;
            const heightDifference = newScrollHeight - scrollHeightBeforeLoadRef.current;

            scrollContainer.scrollTop = scrollTopBeforeLoadRef.current + heightDifference;

            window._disableAutoScroll = true;
            setTimeout(() => {
              window._disableAutoScroll = false;
            }, 500);
          }

          setIsLoadingOlder(false);
          setIsLoadingMore(false);
        }, 100);
      })
      .catch(error => {
        console.error("LOAD MORE: Error loading messages:", error);
        setIsLoadingOlder(false);
        setIsLoadingMore(false);
      });
  }, [authFetch, userId, recipientId, page, hasMoreMessages, isLoadingMore, isLoadingOlder]);


  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    scrollPositionRef.current = container.scrollTop;
  }, []);

  useEffect(() => {
    if (!userId || !recipientId) return;

    if (previousRecipientId.current !== recipientId) {
      setLocalMessages([]);
      setHasLoadedMessages(false);
      setPage(0);
      setHasMoreMessages(true);
      setIsLoadingOlder(false);
      initialScrollDoneRef.current = false;
      previousRecipientId.current = recipientId;

      fetchRecipientAvatar();

      setMessages(prev => {
        if (conversationId) {
          return { [conversationId]: prev[conversationId] || [] };
        }
        return {};
      });
    }

    if (!hasLoadedMessages) {
      fetchMessages(0);
    }
  }, [userId, recipientId, fetchMessages, hasLoadedMessages, conversationId, setMessages, fetchRecipientAvatar]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

useEffect(() => {
  const scrollToBottom = () => {

    if (window._disableAutoScroll) {
      console.log("AUTO SCROLL: Prevented by _disableAutoScroll flag");
      return;
    }

    if (messageEndRef.current && chatContainerRef.current) {
      console.log("AUTO SCROLL: Scrolling to bottom for new message");
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (
    previousMessagesLength.current < sortedMessages.length &&
    sortedMessages.length > 0 &&
    sortedMessages[sortedMessages.length - 1].senderId === userId &&
    !isLoadingOlder &&
    !window._disableAutoScroll
  ) {
    scrollToBottom();
  }

  previousMessagesLength.current = sortedMessages.length;
}, [sortedMessages, userId, isLoadingOlder]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (window._disableAutoScroll) {
        console.log("INITIAL SCROLL: Prevented by _disableAutoScroll flag");
        return;
      }

      if (messageEndRef.current && chatContainerRef.current) {
        console.log("INITIAL SCROLL: Scrolling to bottom on initial load");
        messageEndRef.current.scrollIntoView();
      }
    };

    if (
      conversationId &&
      sortedMessages.length > 0 &&
      !isLoadingOlder &&
      !initialScrollDoneRef.current &&
      !window._disableAutoScroll
    ) {
      setTimeout(() => {
        scrollToBottom();
        initialScrollDoneRef.current = true;
      }, 100);
    }
  }, [conversationId, recipientId, sortedMessages.length, isLoadingOlder]);



  useEffect(() => {
    if (!chatContainerRef.current) return;

    const messageCount = sortedMessages.length;
    const container = chatContainerRef.current;

    if (isLoadingOlder && messageCount > previousMessagesLength.current) {

      initialScrollDoneRef.current = true;

      const currentScrollHeightBefore = scrollHeightBeforeLoadRef.current;
      const currentScrollTopBefore = scrollTopBeforeLoadRef.current;

      requestAnimationFrame(() => {

        setTimeout(() => {
          if (!container) return;

          const newScrollHeight = container.scrollHeight;
          const heightDifference = newScrollHeight - currentScrollHeightBefore;

          const newScrollPosition = currentScrollTopBefore + heightDifference;

          console.log(`Maintaining scroll position after loading more messages:
            - Previous height: ${currentScrollHeightBefore}
            - New height: ${newScrollHeight}
            - Height difference: ${heightDifference}
            - Previous position: ${currentScrollTopBefore}
            - New position: ${newScrollPosition}`);

          container.scrollTop = newScrollPosition;

          const preventScrollOverride = true;
          container._preventScrollOverride = preventScrollOverride;

          setTimeout(() => {
            if (container) container._preventScrollOverride = false;
          }, 300);

          setIsLoadingOlder(false);
          setIsLoadingMore(false);
        }, 50);
      });
    }

    if (isLoadingMore && !isLoadingOlder) {
      setIsLoadingMore(false);
    }

    previousMessagesLength.current = messageCount;
  }, [sortedMessages.length, isLoadingMore, isLoadingOlder]);


  const getLastSeenText = useCallback(() => {
    const status = getUserStatus(recipientId);
    if (!status || status.status !== "OFFLINE" || !status.lastSeen) return null;

    try {
      const lastSeenDate = new Date(status.lastSeen);
      return formatDistanceToNow(lastSeenDate, { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  }, [recipientId, getUserStatus]);

  const getUserStatusText = useCallback(() => {
    const status = getUserStatus(recipientId);
    if (!status) return "Offline";

    switch (status.status) {
      case "ONLINE":
        return "Online";
      case "AWAY":
        return "Away";
      case "OFFLINE":
        return "Offline";
      default:
        return "Offline";
    }
  }, [recipientId, getUserStatus]);

  const handleTyping = useCallback((newMessage) => {
    if (!conversationId) return;

    const shouldBeTyping = newMessage.trim().length > 0;

    if (shouldBeTyping !== isTyping) {
      setIsTyping(shouldBeTyping);
      updateTypingStatus(conversationId, shouldBeTyping);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    if (shouldBeTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        updateTypingStatus(conversationId, false);
      }, 5000);
    }
  }, [conversationId, isTyping, updateTypingStatus]);

  const handleInputChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    if (connected) handleTyping(newMessage);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !connected || !recipientId) {
      return;
    }

    const success = sendMessage(recipientId, message.trim());

    if (success) {
      setMessage("");
      setIsTyping(false);
      updateTypingStatus(conversationId, false);

      setTimeout(() => {
        if (messageEndRef.current) {
          messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const handleNewMessage = () => {
      if (window._disableAutoScroll) {
        console.log("NEW MESSAGE SCROLL: Prevented by _disableAutoScroll flag");
        return;
      }

      if (
        chatContainerRef.current &&
        sortedMessages.length > 0 &&
        !isLoadingOlder
      ) {
        const { scrollHeight, clientHeight, scrollTop } = chatContainerRef.current;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200;

        if (isNearBottom && messageEndRef.current) {
          console.log("NEW MESSAGE SCROLL: Near bottom, scrolling to new message");
          messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    handleNewMessage();
  }, [sortedMessages.length, isLoadingOlder]);

  useEffect(() => {

    const markAsRead = () => {
      if (isRunningRef.current) return;

      const unreadMessages = conversationMessages.filter(
        msg => msg.senderId === recipientId && !msg.read
      );

      if (unreadMessages.length > 0 && recipientId && connected && !isRunningRef.current) {
        isRunningRef.current = true;

        const conversationKey = userId < recipientId
          ? `${userId}_${recipientId}`
          : `${recipientId}_${userId}`;

        const lastMarkTime = lastMarkTimeRef.current[conversationKey] || 0;
        const now = Date.now();

        if (now - lastMarkTime > 3000) {
          lastMarkTimeRef.current[conversationKey] = now;

          setLocalMessages(prev => {
            return prev.map(msg =>
              (msg.senderId === recipientId && !msg.read)
                ? { ...msg, read: true }
                : msg
            );
          });

          markMessagesAsRead(recipientId);

          if (fetchUnreadMessageCounts) {
            setTimeout(fetchUnreadMessageCounts, 1000);
          }
        }

        setTimeout(() => {
          isRunningRef.current = false;
        }, 1000);
      }
    };

    if (!lastMarkTimeRef.current) {
      lastMarkTimeRef.current = {};
    }

   if (recipientId && connected) {
      markAsRead();
    }

    const intervalId = setInterval(() => {
      if (recipientId && connected) {
        markAsRead();
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
      isRunningRef.current = false;
    };
  }, [conversationMessages, markMessagesAsRead, recipientId, connected, userId, fetchUnreadMessageCounts]);

  useEffect(() => {
    if (!connected || !conversationId) return;

    if (typingSubscriptionRef.current) {
      typingSubscriptionRef.current();
      typingSubscriptionRef.current = null;
    }

    typingSubscriptionRef.current = subscribeToTypingIndicator(conversationId);

    return () => {
      setIsTyping(false);
      updateTypingStatus(conversationId, false);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (typingSubscriptionRef.current) {
        typingSubscriptionRef.current();
        typingSubscriptionRef.current = null;
      }
    };
  }, [connected, conversationId, subscribeToTypingIndicator, updateTypingStatus]);

  useEffect(() => {
    const unreadMessages = sortedMessages.filter(
      msg => msg.senderId === recipientId && !msg.read
    );

    if (unreadMessages.length > 0 && recipientId && connected) {
      const conversationKey = `${userId}_${recipientId}`;
      const now = Date.now();
      const lastMarkReadTime = window.lastMarkReadTimes?.[conversationKey] || 0;

      if (now - lastMarkReadTime > 2000) {
        if (!window.lastMarkReadTimes) window.lastMarkReadTimes = {};
        window.lastMarkReadTimes[conversationKey] = now;

        markMessagesAsRead(recipientId);
      }
    }
  }, [sortedMessages, markMessagesAsRead, recipientId, connected, userId]);

  return (
  <div className={`flex flex-col h-[700px] border rounded-xl shadow-lg overflow-hidden duration-750 ${isDarkMode ? "bg-slate-900 border-amber-500 text-white" : "bg-white text-gray-800"}`}>
    {/* Header */}
    <div className={`p-4 border-b flex items-center justify-between sticky top-0 z-10 duration-750 ${isDarkMode ? "bg-slate-900 border-slate-700 border-b-gray-200" : "bg-white"}`}>
      <div className="flex flex-col">
        <div className="flex items-center">
          <UserStatusIndicator userId={recipientId} />
          <div className="ml-2">
            <span className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{recipientUsername}</span>
            <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {isUserTyping(recipientId, conversationId) ? (
                <span className="italic animate-pulse">typing...</span>
              ) : (
                <>
                  {getUserStatusText() === "Offline" && getLastSeenText() ? (
                    <span>Last seen {getLastSeenText()}</span>
                  ) : (
                    <span>{getUserStatusText()}</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {!connected && (
        <span className={`text-red-500 text-xs py-1 px-2 rounded-full ${isDarkMode ? "bg-red-900" : "bg-red-50"}`}>Disconnected</span>
      )}
    </div>

    {/* Chat area */}
    <div
      ref={chatContainerRef}
      className={`flex-1 p-4 overflow-y-auto h-[500px] duration-750 ${isDarkMode ? "bg-slate-900 dark-scrollbar dark-scrollbar-hover " : "bg-gray-50 custom-scrollbar scrollbar-hover"}`}
      onScroll={handleScroll}
    >
      {/* Load More Messages Button or Loading Indicator */}
      {hasMoreMessages && (
        <div className="flex justify-center my-2">
          {isLoadingMore ? (
            <div className="flex items-center justify-center py-2">
              <div className={`animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500`}></div>
              <span className="ml-2 text-amber-500 text-sm">Loading...</span>
            </div>
          ) : (
            <button
              onClick={loadMoreMessages}
              disabled={loading || isLoadingMore || isLoadingOlder}
              className={`text-amber-500 text-sm hover:underline ${isDarkMode ? "bg-slate-700" : "bg-white"} py-1 px-3 rounded-full shadow-sm transition-all hover:shadow-md ${
                (loading || isLoadingMore || isLoadingOlder) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              Load earlier messages
            </button>
          )}
        </div>
      )}

      {loading && page === 0 ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      ) : loadError && page === 0 ? (
        <div className="flex flex-col justify-center items-center h-full">
          <p className="text-red-500 mb-2">{loadError}</p>
          <button
            onClick={() => fetchMessages(0)}
            className="px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : sortedMessages.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>No messages yet. Say hello!</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {sortedMessages.map((msg, index) => (
              <MessageComponent
                key={msg.id ? `msg-${msg.id}-${index}` : `temp-${msg.timestamp}-${index}`}
                message={msg}
                userId={userId}
                recipientAvatar={recipientAvatar}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>

          {isUserTyping(recipientId, conversationId) && (
            <div className="mb-3 flex justify-start">
              <img
                src={recipientAvatar || `http://localhost:8080/api/users/${recipientId}/avatar`}
                className="h-6 w-6 rounded-full mr-1 mt-1 self-start"
                alt="User"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
              />
              <div className={`max-w-[70%] rounded-2xl px-3 py-2 shadow-sm ${isDarkMode ? "bg-slate-900 text-gray-200" : "bg-gray-100 text-gray-800"}`}>
                <div className="flex space-x-1 h-6 items-center">
                  <div
                    className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-gray-400 bg-re" : "bg-gray-500"}`}
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-gray-400" : "bg-gray-500"}`}
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-gray-400" : "bg-gray-500"}`}
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div ref={messageEndRef} />
</div>

      {/* Message input */}
      <div className={`p-4 border-t duration-750  ${isDarkMode ? "bg-slate-900 border-t-gray-200" : "bg-white"}`}>
        <div className="flex items-center">
          <textarea
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
            placeholder={connected ? "Type a message..." : "Reconnecting..."}
            rows="2"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={!connected}
          />
          <button
            className="ml-3 cursor-pointer bg-amber-500 text-white rounded-full p-3 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 shadow-sm transition-colors"
            onClick={handleSendMessage}
            disabled={!connected || !message.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;