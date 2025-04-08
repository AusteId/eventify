import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useWebSocket } from "./WebSocketContext";
import UserStatusIndicator from "./UserStatusIndicator";
import { format } from "date-fns";
import { useNotification } from "../context/NotificationContext";
import MessageComponent from "./MessageComponent";

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
  const previousMessagesLength = useRef(0);
  const scrollPositionRef = useRef(0);
  const scrollHeightBeforeLoadRef = useRef(0);
  const scrollTopBeforeLoadRef = useRef(0);
  
  const { url } = useNotification();
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
    const wsConversation = wsMessages[conversationId] || [];
    
    if (localMessages.length === 0 && wsConversation.length > 0) {
      console.log(`Using ${wsConversation.length} WebSocket messages only`);
      return wsConversation;
    }
    
    if (wsConversation.length === 0 && localMessages.length > 0) {
      console.log(`Using ${localMessages.length} local messages only`);
      return localMessages;
    }
    
    if (localMessages.length === 0 && wsConversation.length === 0) {
      return [];
    }
    
    console.log(`Merging ${wsConversation.length} WS and ${localMessages.length} local messages`);
    
    const messageMap = new Map();

    localMessages.forEach(msg => {
      if (msg && msg.id) {
        messageMap.set(msg.id, msg);
      }
    });
    wsConversation.forEach(msg => {
      if (msg && msg.id) {
        messageMap.set(msg.id, msg);
      }
    });
    
    return Array.from(messageMap.values());
  }, [wsMessages, conversationId, localMessages]);

  const sortedMessages = useMemo(() => {
    return [...conversationMessages].sort((a, b) => {
      const timeA = new Date(a.timestamp || 0);
      const timeB = new Date(b.timestamp || 0);
      return timeA - timeB;
    });
  }, [conversationMessages]);

  const renderMessageStatus = (msg) => {
    if (msg.senderId != userId) return null;
    
    if (msg.isLocal) {
      return <span className="ml-1 text-xs text-blue-200">Sending</span>; 
    } else if (msg.read) {
      return <span className="ml-1 text-xs text-blue-200">Read</span>; 
    } else {
      return <span className="ml-1 text-xs text-blue-200">Delivered</span>;
    }
  };

  useEffect(() => {
    if (connected && conversationId) {
      setActiveConversation(conversationId);
    }
  }, [connected, conversationId, setActiveConversation]);

  const fetchMessages = useCallback(async (pageToLoad = 0) => {
    if (!userId || !recipientId) {
      console.log("Missing IDs, can't fetch messages");
      setLoading(false);
      return Promise.resolve();
    }
    
    try {
      if (pageToLoad === 0) {
        setLoading(true);
      }
      setLoadError(null);
      console.log("Fetching message history for", userId, recipientId, "page:", pageToLoad);
      
      console.log(`Fetching messages for conversation ${conversationId}, page ${pageToLoad}`);

      const response = await authFetch(
        `${url}/api/messages/${userId}/${recipientId}?page=${pageToLoad}&size=20`
      );
      
      if (!response) {
        console.error("No response from server");
        setLoadError("No response from server");
        setLoading(false);
        return;
      }
      
      console.log("Message API response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Parsed message data:", data);
        
        if (data.content) {
          console.log("Data has 'content' field with", data.content.length, "messages");

          console.log(`Response for page ${pageToLoad}:`, {
            status: response.status,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            size: data.size,
            content: data.content?.length
          });
          
          if (pageToLoad === 0) {
            setLocalMessages(data.content);
          } else {
            setLocalMessages(prev => [...data.content, ...prev]);
          }

          setHasMoreMessages(data.content.length > 0 && !data.last);
        } else if (Array.isArray(data)) {
          console.log("Data is an array with", data.length, "messages");
          
          if (pageToLoad === 0) {
            setLocalMessages(data);
          } else {
            setLocalMessages(prev => [...data, ...prev]);
          }

          setHasMoreMessages(data.length === 20);
        } else {
          console.error("Unexpected data structure:", data);
          setLoadError("Unexpected data format from server");
        }
      } else {
        console.error("API error:", response.status);
        setLoadError(`Server error: ${response.status}`);
      }

      setHasLoadedMessages(true);
      setPage(pageToLoad);
      return Promise.resolve();
    } catch (err) {
      console.error("Exception in fetchMessages:", err);
      setLoadError(err.message || "Error loading messages");
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  }, [userId, recipientId, authFetch, url, conversationId]);

  const loadMoreMessages = useCallback(() => {
    if (!hasMoreMessages || loading) return;
  
    const scrollContainer = chatContainerRef.current;
    if (!scrollContainer) return;
    
    scrollHeightBeforeLoadRef.current = scrollContainer.scrollHeight;
    scrollTopBeforeLoadRef.current = scrollContainer.scrollTop;
    
    setIsLoadingOlder(true);
    setIsLoadingMore(true);
    
    fetchMessages(page + 1);
  }, [fetchMessages, hasMoreMessages, loading, page]);

  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    if (container.scrollTop < 100 && !loading && hasMoreMessages) {
      loadMoreMessages();
    }

    scrollPositionRef.current = container.scrollTop;
  }, [loadMoreMessages, loading, hasMoreMessages]);

  useEffect(() => {
    if (!userId || !recipientId) return;
  
    if (previousRecipientId.current !== recipientId) {
      console.log("Recipient changed, resetting messages");
      setLocalMessages([]);
      setHasLoadedMessages(false);
      setPage(0);
      setHasMoreMessages(true);
      setIsLoadingOlder(false); 
      initialScrollDoneRef.current = false;
      previousRecipientId.current = recipientId;

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
  }, [userId, recipientId, fetchMessages, hasLoadedMessages, conversationId, setMessages]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    
    const messageCount = sortedMessages.length;
    const container = chatContainerRef.current;
    
    if (isLoadingOlder && messageCount > previousMessagesLength.current) {
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        const heightDifference = newScrollHeight - scrollHeightBeforeLoadRef.current;
        
        container.scrollTop = scrollTopBeforeLoadRef.current + heightDifference;
        
        setIsLoadingOlder(false);
        setIsLoadingMore(false);
      }, 50);
    } 
    else if (!isLoadingMore && messageCount > previousMessagesLength.current) {
      const { scrollHeight, clientHeight, scrollTop } = container;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      
      if (isNearBottom && messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
    
    previousMessagesLength.current = messageCount;
    
    if (isLoadingMore && !isLoadingOlder) {
      setIsLoadingMore(false);
    }
  }, [sortedMessages, isLoadingMore, isLoadingOlder]);

  useEffect(() => {
    if (
      conversationId && 
      sortedMessages.length > 0 && 
      messageEndRef.current &&
      !initialScrollDoneRef.current &&
      !isLoadingOlder
    ) {
      messageEndRef.current.scrollIntoView();
      initialScrollDoneRef.current = true;
    }
  }, [conversationId, sortedMessages, isLoadingOlder]);

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
      console.log("Cannot send message:", { 
        hasMessage: Boolean(message.trim()), 
        connected, 
        recipientId 
      });
      return;
    }

    console.log("Sending message to:", recipientId);
    const success = sendMessage(recipientId, message.trim());
    
    if (success) {
      setMessage("");
      setIsTyping(false);
      updateTypingStatus(conversationId, false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const unreadMessages = conversationMessages.filter(
      msg => msg.senderId === recipientId && !msg.read
    );
    
    if (unreadMessages.length > 0 && recipientId && connected) {
      console.log(`Marking ${unreadMessages.length} messages as read from:`, recipientId);
      markMessagesAsRead(recipientId);
      
      fetchUnreadMessageCounts && fetchUnreadMessageCounts();
    }
  }, [conversationMessages, markMessagesAsRead, recipientId, connected, fetchUnreadMessageCounts]);

  useEffect(() => {
    if (connected && recipientId && fetchUnreadMessageCounts) {
      if (previousRecipientId.current !== recipientId) {
        fetchUnreadMessageCounts();
      }
    }
  }, [connected, recipientId, fetchUnreadMessageCounts]);
  
  useEffect(() => {
    const unreadMessages = conversationMessages.filter(
      msg => msg.senderId === recipientId && !msg.read
    );
    
    if (unreadMessages.length > 0 && recipientId && connected) {
      console.log(`Marking ${unreadMessages.length} messages as read from:`, recipientId);
      markMessagesAsRead(recipientId);
      
      if (fetchUnreadMessageCounts) {
        fetchUnreadMessageCounts();
      }
    }
  }, [conversationMessages, markMessagesAsRead, recipientId, connected, fetchUnreadMessageCounts]);

  useEffect(() => {
    if (!connected || !conversationId) return;
    
    console.log("Setting up typing subscription for:", conversationId);

    if (typingSubscriptionRef.current) {
      typingSubscriptionRef.current();
      typingSubscriptionRef.current = null;
    }

    typingSubscriptionRef.current = subscribeToTypingIndicator(conversationId);
    
    return () => {
      console.log("Cleaning up typing subscription");
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

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      return format(new Date(timestamp), "HH:mm");
    } catch (e) {
      console.error("Error formatting time:", e);
      return "";
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg shadow-lg">
      <div className="p-3 border-b flex items-center justify-between bg-gray-50">
  <div className="flex items-center flex-col sm:flex-row">
    <div className="flex items-center">
      <UserStatusIndicator userId={recipientId} />
      <span className="ml-2 font-semibold">{recipientUsername}</span>
      {isUserTyping(recipientId, conversationId) && (
        <span className="ml-2 text-gray-500 text-sm italic animate-pulse">typing...</span>
      )}
    </div>
    <div className="ml-0 sm:ml-2 text-xs text-gray-500">
      <UserStatusIndicator userId={recipientId} showLastSeen={true} />
    </div>
  </div>
  {!connected && (
    <span className="text-red-500 text-xs">Disconnected</span>
  )}
</div>
      <div 
        ref={chatContainerRef} 
        className="flex-1 p-3 overflow-y-auto"
        onScroll={handleScroll}
      >
        {hasMoreMessages && !loading && (
          <div className="flex justify-center my-2">
            <button 
              onClick={loadMoreMessages}
              className="text-blue-500 text-sm hover:underline"
            >
              Load earlier messages
            </button>
          </div>
        )}
        
        {loading && page === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : loadError && page === 0 ? (
          <div className="flex flex-col justify-center items-center h-full">
            <p className="text-red-500 mb-2">{loadError}</p>
            <button 
              onClick={() => fetchMessages(0)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No messages yet. Say hello!</p>
          </div>
        ) : (
          <>
            {loading && page > 0 && (
              <div className="flex justify-center my-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {sortedMessages.map((msg) => (
  <MessageComponent
    key={msg.id || `temp-${msg.timestamp}`}
    message={msg}
    userId={userId}
  />
))}
          </>
        )}

        {isUserTyping(recipientId, conversationId) && (
          <div className="mb-3 flex justify-start">
            <div className="max-w-[70%] rounded-lg px-3 py-2 bg-gray-200 text-gray-800 rounded-bl-none">
              <div className="flex space-x-1 h-6 items-center">
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>
      <div className="p-3 border-t">
        <div className="flex items-center">
          <textarea
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder={connected ? "Type a message..." : "Reconnecting..."}
            rows="2"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={!connected}
          />
          <button
            className="ml-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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