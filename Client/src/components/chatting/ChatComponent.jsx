import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useWebSocket } from "./WebSocketContext";
import UserStatusIndicator from "./UserStatusIndicator";
import { useNotification } from "../context/NotificationContext";
import MessageComponent from "./MessageComponent";
import defaultAvatar from "../../assets/default-user-image.png";
import { formatDistanceToNow, format } from "date-fns";
import "../../assets/scrollbar.css";

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
  const [recipientAvatar, setRecipientAvatar] = useState(null);
  const previousMessagesLength = useRef(0);
  const scrollPositionRef = useRef(0);
  const scrollHeightBeforeLoadRef = useRef(0);
  const scrollTopBeforeLoadRef = useRef(0);
  const lastMarkTimeRef = useRef({});
  const isRunningRef = useRef(false);
  
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

  // Merge and deduplicate messages from WebSocket and local state
  const conversationMessages = useMemo(() => {
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
    
    // Create a map to deduplicate messages - use a more reliable unique identifier
    const messageMap = new Map();
  
    // Process local messages first, then let WebSocket messages override
    localMessages.forEach(msg => {
      if (msg) {
        // Generate a more reliable key that includes multiple fields to better identify messages
        const key = msg.id || `${msg.senderId}_${msg.timestamp}_${msg.content?.substring(0, 20)}`;
        messageMap.set(key, {...msg, _source: 'local'});
      }
    });
    
    wsConversation.forEach(msg => {
      if (msg) {
        // Use the same key pattern for consistency
        const key = msg.id || `${msg.senderId}_${msg.timestamp}_${msg.content?.substring(0, 20)}`;
        const existing = messageMap.get(key);
        
        // WebSocket message overrides local, but preserve read status
        if (existing && existing._source === 'local' && existing.read && !msg.read) {
          messageMap.set(key, {...msg, read: true, _source: 'ws'});
        } else {
          messageMap.set(key, {...msg, _source: 'ws'});
        }
      }
    });
    
    // Convert back to array and filter out any undefined messages
    return Array.from(messageMap.values()).filter(Boolean);
  }, [wsMessages, conversationId, localMessages]);

  // Sort messages by timestamp
  const sortedMessages = useMemo(() => {
    return [...conversationMessages].sort((a, b) => {
      const timeA = new Date(a.timestamp || 0);
      const timeB = new Date(b.timestamp || 0);
      return timeA - timeB;
    });
  }, [conversationMessages]);

  // Function to fetch and cache recipient avatar
  const fetchRecipientAvatar = useCallback(async () => {
    if (!recipientId) return;
    
    try {
      // Check if we have it cached in localStorage
      const cachedAvatar = localStorage.getItem(`avatar_${recipientId}`);
      
      if (cachedAvatar) {
        setRecipientAvatar(cachedAvatar);
        return;
      }
      
      // Otherwise fetch it
      const avatarUrl = `http://localhost:8080/api/users/${recipientId}/avatar`;
      const response = await fetch(avatarUrl);
      
      if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const base64data = reader.result;
          setRecipientAvatar(base64data);
          // Cache it
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

  // Set active conversation when connected
  useEffect(() => {
    if (connected && conversationId) {
      setActiveConversation(conversationId);
    }
  }, [connected, conversationId, setActiveConversation]);

  // Fetch messages from the server
// Replace the fetchMessages function in ChatComponent.jsx
const fetchMessages = useCallback(async (pageToLoad = 0) => {
  if (!userId || !recipientId) {
    setLoading(false);
    setIsLoadingMore(false);
    setIsLoadingOlder(false);
    return Promise.resolve();
  }
  
  // Only prevent requests for the exact same page if we're already loading
  // Don't block different page requests
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
      `${url}/api/messages/${userId}/${recipientId}?page=${pageToLoad}&size=20`
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
      
      // IMPORTANT: Always update the page number after a successful fetch
      // This was missing before and could cause the same page to be loaded repeatedly
      setPage(pageToLoad);
      
      if (data.content) {
        // Handle paginated response
        const newMessages = data.content;
        
        // Only update hasMoreMessages if we have clarity (data.last is defined)
        if (typeof data.last === 'boolean') {
          const moreAvailable = newMessages.length > 0 && !data.last;
          console.log(`Setting hasMoreMessages=${moreAvailable} based on data.last=${data.last}`);
          setHasMoreMessages(moreAvailable);
        } else {
          // Fallback logic based on message count
          const moreAvailable = newMessages.length === 20;
          console.log(`Setting hasMoreMessages=${moreAvailable} based on message count`);
          setHasMoreMessages(moreAvailable);
        }
        
        if (pageToLoad === 0) {
          setLocalMessages(newMessages);
        } else {
          // Add a marker to distinguish these newly loaded messages
          const markedMessages = newMessages.map(msg => ({
            ...msg,
            _page: pageToLoad
          }));
          
          setLocalMessages(prev => {
            // Deduplicate by ID when merging
            const existingIds = new Set(prev.map(m => m.id));
            const uniqueNewMessages = markedMessages.filter(m => !existingIds.has(m.id));
            
            console.log(`Adding ${uniqueNewMessages.length} new unique messages from page ${pageToLoad}`);
            return [...uniqueNewMessages, ...prev];
          });
        }
      } else if (Array.isArray(data)) {
        // Handle non-paginated array response
        console.log(`Received ${data.length} messages for page ${pageToLoad}`);
        
        // Determine if more messages are available
        const moreAvailable = data.length === 20;
        console.log(`Setting hasMoreMessages=${moreAvailable} based on message count`);
        setHasMoreMessages(moreAvailable);
        
        if (pageToLoad === 0) {
          setLocalMessages(data);
        } else {
          // Add page marker
          const markedMessages = data.map(msg => ({
            ...msg,
            _page: pageToLoad
          }));
          
          setLocalMessages(prev => {
            // Deduplicate by ID when merging
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
    // ALWAYS reset loading states, regardless of success or failure
    setLoading(false);
    setIsLoadingMore(false);
    setIsLoadingOlder(false);
  }
}, [userId, recipientId, authFetch, url, loading, page]);

  // Load more messages when scrolling to top
  const loadMoreMessages = useCallback(() => {
    if (!hasMoreMessages || isLoadingMore || isLoadingOlder) return;
  
    const scrollContainer = chatContainerRef.current;
    if (!scrollContainer) return;
    
    // CRITICAL: Make sure we're capturing the CURRENT scroll position
    const currentScrollHeight = scrollContainer.scrollHeight;
    const currentScrollTop = scrollContainer.scrollTop;
    
    console.log("LOAD MORE: Capturing scroll position:", currentScrollTop);
    
    // Store these values in refs for later use
    scrollHeightBeforeLoadRef.current = currentScrollHeight;
    scrollTopBeforeLoadRef.current = currentScrollTop;
    
    // Set loading states
    setIsLoadingOlder(true);
    setIsLoadingMore(true);
    
    // IMPORTANT CHANGE: We need to load the next page relative to what we have
    // If initial load was page 0, then next should be page 1
    // React state updates aren't immediate, so use the current page value + 1
    const nextPageToLoad = page + 1;
    
    console.log("LOAD MORE: Will load page:", nextPageToLoad);
    
    // Make the request
    const endpoint = `${url}/api/messages/${userId}/${recipientId}?page=${nextPageToLoad}&size=20`;
    
    authFetch(endpoint)
      .then(response => {
        if (!response || !response.ok) {
          throw new Error(`Server error: ${response ? response.status : 'No response'}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(`LOAD MORE: Success! Got data for page ${nextPageToLoad}`);
        
        // Check if we got new messages or just the same ones we already have
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
        
        // The key change: Check if the messages are actually new
        if (newMessages.length > 0) {
          // Update page state ONLY after confirming we have new messages
          setPage(nextPageToLoad);
          
          // Update hasMoreMessages
          const hasMore = data.content 
            ? (newMessages.length > 0 && !data.last)
            : (newMessages.length === 20);
          
          setHasMoreMessages(hasMore);
          
          // Add new messages to state
          const markedMessages = newMessages.map(msg => ({
            ...msg,
            _page: nextPageToLoad
          }));
          
          setLocalMessages(prev => {
            // Check if these are actually new messages
            const existingIds = new Set(prev.map(m => m.id));
            const uniqueNewMessages = markedMessages.filter(m => !existingIds.has(m.id));
            
            console.log(`Adding ${uniqueNewMessages.length} new unique messages from page ${nextPageToLoad}`);
            
            if (uniqueNewMessages.length === 0) {
              // If we didn't get any new messages, try loading the next page automatically
              console.log("No new unique messages found, trying next page");
              setTimeout(() => {
                setIsLoadingOlder(false);
                setIsLoadingMore(false);
                loadMoreMessages(); // Recursively try the next page
              }, 100);
              return prev;
            }
            
            return [...uniqueNewMessages, ...prev];
          });
        }
        
        // Handle scroll position
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
          
          // Reset loading states
          setIsLoadingOlder(false);
          setIsLoadingMore(false);
        }, 100);
      })
      .catch(error => {
        console.error("LOAD MORE: Error loading messages:", error);
        setIsLoadingOlder(false);
        setIsLoadingMore(false);
      });
  }, [authFetch, url, userId, recipientId, page, hasMoreMessages, isLoadingMore, isLoadingOlder]);


  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    scrollPositionRef.current = container.scrollTop;
  }, []);  

  // Reset when recipient changes
  useEffect(() => {
    if (!userId || !recipientId) return;
  
    if (previousRecipientId.current !== recipientId) {
      setLocalMessages([]);
      setHasLoadedMessages(false);
      setPage(0); // Keep this as 0 for the initial load
      setHasMoreMessages(true);
      setIsLoadingOlder(false); 
      initialScrollDoneRef.current = false;
      previousRecipientId.current = recipientId;
      
      // Fetch recipient avatar when recipient changes
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

  // Add scroll event listener
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Scroll to bottom after sending a message
useEffect(() => {
  const scrollToBottom = () => {
    // Check our global flag - don't scroll if disabled
    if (window._disableAutoScroll) {
      console.log("AUTO SCROLL: Prevented by _disableAutoScroll flag");
      return;
    }
    
    if (messageEndRef.current && chatContainerRef.current) {
      console.log("AUTO SCROLL: Scrolling to bottom for new message");
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Only auto-scroll if the new message is from the current user
  // and we're not loading older messages
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

  // Initial scroll to bottom when opening a chat
  useEffect(() => {
    const scrollToBottom = () => {
      // Check our global flag - don't scroll if disabled
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
  

  // Maintain scroll position when loading older messages
  useEffect(() => {
    if (!chatContainerRef.current) return;
    
    const messageCount = sortedMessages.length;
    const container = chatContainerRef.current;
    
    if (isLoadingOlder && messageCount > previousMessagesLength.current) {
      // Prevent initial scroll-to-bottom effect from firing
      initialScrollDoneRef.current = true;
      
      // Capture this in a local variable to ensure it's preserved in the callback
      const currentScrollHeightBefore = scrollHeightBeforeLoadRef.current;
      const currentScrollTopBefore = scrollTopBeforeLoadRef.current;
      
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        // Wrap in setTimeout to ensure DOM is fully updated
        setTimeout(() => {
          if (!container) return;
          
          const newScrollHeight = container.scrollHeight;
          const heightDifference = newScrollHeight - currentScrollHeightBefore;
          
          // Calculate the new scroll position
          const newScrollPosition = currentScrollTopBefore + heightDifference;
          
          console.log(`Maintaining scroll position after loading more messages:
            - Previous height: ${currentScrollHeightBefore}
            - New height: ${newScrollHeight}
            - Height difference: ${heightDifference}
            - Previous position: ${currentScrollTopBefore}
            - New position: ${newScrollPosition}`);
          
          // Set the scroll position and prevent any other scroll effects
          container.scrollTop = newScrollPosition;
          
          // Add a flag to prevent other scroll effects from overriding this
          const preventScrollOverride = true;
          container._preventScrollOverride = preventScrollOverride;
          
          // Create a timeout to remove the prevention flag after a short delay
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

  // Format last seen time
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

  // Get user status
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
  
  // Handle typing status updates
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

  // Handle input changes and trigger typing indicator
  const handleInputChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    if (connected) handleTyping(newMessage);
  };

  // Send message
  const handleSendMessage = () => {
    if (!message.trim() || !connected || !recipientId) {
      return;
    }

    const success = sendMessage(recipientId, message.trim());
    
    if (success) {
      setMessage("");
      setIsTyping(false);
      updateTypingStatus(conversationId, false);
      
      // Ensure scroll to bottom after sending
      setTimeout(() => {
        if (messageEndRef.current) {
          messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Handle keypress for sending with Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Scroll to bottom when receiving new messages
  useEffect(() => {
    const handleNewMessage = () => {
      // Check our global flag - don't scroll if disabled
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

  // Mark messages as read
  useEffect(() => {
    // Create a ref to track if the effect is already running
    
    const markAsRead = () => {
      if (isRunningRef.current) return; // Prevent concurrent execution
      
      const unreadMessages = conversationMessages.filter(
        msg => msg.senderId === recipientId && !msg.read
      );
      
      if (unreadMessages.length > 0 && recipientId && connected && !isRunningRef.current) {
        // Set flag to prevent concurrent execution
        isRunningRef.current = true;
        
        // Create a unique key for this conversation
        const conversationKey = userId < recipientId 
          ? `${userId}_${recipientId}` 
          : `${recipientId}_${userId}`;
        
        // Store this in component state so we don't rely on window
        const lastMarkTime = lastMarkTimeRef.current[conversationKey] || 0;
        const now = Date.now();
        
        // Throttle to prevent rapid consecutive calls
        if (now - lastMarkTime > 3000) {
          // Update the timestamp
          lastMarkTimeRef.current[conversationKey] = now;
          
          // Optimistically update the local state
          setLocalMessages(prev => {
            return prev.map(msg => 
              (msg.senderId === recipientId && !msg.read) 
                ? { ...msg, read: true } 
                : msg
            );
          });
          
          // Call the API to mark as read
          markMessagesAsRead(recipientId);
          
          // If we have a way to update unread counts, do it directly
          if (fetchUnreadMessageCounts) {
            setTimeout(fetchUnreadMessageCounts, 1000);
          }
        }
        
        // Reset flag after a delay
        setTimeout(() => {
          isRunningRef.current = false;
        }, 1000);
      }
    };
    
    // Initialize the ref if needed
    if (!lastMarkTimeRef.current) {
      lastMarkTimeRef.current = {};
    }
    
    // Call once when the component mounts or recipientId changes
    if (recipientId && connected) {
      markAsRead();
    }
    
    // Set up an interval to check occasionally (useful for real-time updates)
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

  // Setup typing subscription
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
      // Add a check to prevent repeated calls
      const conversationKey = `${userId}_${recipientId}`;
      const now = Date.now();
      const lastMarkReadTime = window.lastMarkReadTimes?.[conversationKey] || 0;
      
      // Only mark as read if it's been more than 2 seconds since last time
      if (now - lastMarkReadTime > 2000) {
        // Track when we last marked this conversation as read
        if (!window.lastMarkReadTimes) window.lastMarkReadTimes = {};
        window.lastMarkReadTimes[conversationKey] = now;
        
        markMessagesAsRead(recipientId);
      }
    }
  }, [sortedMessages, markMessagesAsRead, recipientId, connected, userId]);

  return (
    <div className="flex flex-col h-[700px] border rounded-xl shadow-lg bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex flex-col">
          <div className="flex items-center">
            <UserStatusIndicator userId={recipientId} />
            <div className="ml-2">
              <span className="font-semibold text-gray-800">{recipientUsername}</span>
              <div className="text-xs text-gray-500">
                {isUserTyping(recipientId, conversationId) ? (
                  <span className="text-gray-500 italic animate-pulse">typing...</span>
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
          <span className="text-red-500 text-xs py-1 px-2 bg-red-50 rounded-full">Disconnected</span>
        )}
      </div>
      
      {/* Chat area */}
      <div 
  ref={chatContainerRef} 
  className="flex-1 p-4 overflow-y-auto bg-gray-50 h-[500px] custom-scrollbar scrollbar-hover"
  onScroll={handleScroll}
>
  {/* Load More Messages Button or Loading Indicator */}
  {hasMoreMessages && (
    <div className="flex justify-center my-2">
      {isLoadingMore ? (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500"></div>
          <span className="ml-2 text-amber-500 text-sm">Loading...</span>
        </div>
      ) : (
        <button 
          onClick={loadMoreMessages}
          disabled={loading || isLoadingMore || isLoadingOlder}
          className={`text-amber-500 text-sm hover:underline bg-white py-1 px-3 rounded-full shadow-sm transition-all hover:shadow-md ${
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
      <p className="text-gray-500">No messages yet. Say hello!</p>
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
          <div className="max-w-[70%] rounded-2xl px-3 py-2 bg-gray-100 text-gray-800 shadow-sm">
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
    </>
  )}

  <div ref={messageEndRef} />
</div>
      
      {/* Message input */}
      <div className="p-4 border-t bg-white">
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
            className="ml-3 bg-amber-500 text-white rounded-full p-3 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 shadow-sm transition-colors"
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