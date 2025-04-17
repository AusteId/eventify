import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import toast from 'react-hot-toast';


const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const { isAuthenticated, userId,authFetch } = useAuth();
  const { updateUnreadCount } = useNotifications();
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadMessages, setUnreadMessages] = useState({});
  const [userStatuses, setUserStatuses] = useState({});
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const clientRef = useRef(null);
  const statusSubscriptionRef = useRef(null);
  const allStatusesSubscriptionRef = useRef(null);
  const typingSubscriptions = useRef({});
  const lastActivityRef = useRef(Date.now());
  const statusTimeoutRef = useRef(null);
  const lastStatusUpdateRef = useRef(Date.now());
  const messageSubscriptionRef = useRef(null)
  const readReceiptSubscriptionRef = useRef(null);
  const ackSubscriptionRef = useRef(null);
  const conversationSubscriptions = useRef({});
  const STATUS_UPDATE_INTERVAL_MS = 60000;
  const lastUnreadFetchTimeRef = useRef(0);
  const FETCH_THROTTLE_MS = 1000;

  const cleanupWebSocket = useCallback(() => {
    console.log("Deactivating STOMP client...");
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }
    setConnected(false);
  }, []);

  const updateOnlineStatus = useCallback((status) => {
    if (!clientRef.current || !connected) return;
  
    try {
      console.log("Updating online status to:", status);
      clientRef.current.publish({
        destination: "/app/status/update",
        body: JSON.stringify(status),
        headers: { "content-type": "application/json" },
      });
    } catch (e) {
      console.error("Status update error:", e);
    }
  }, [connected]);

  const handleActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;

    if (connected && (now - lastStatusUpdateRef.current) > STATUS_UPDATE_INTERVAL_MS) {
      console.log("Sending status update (rate limited)");
      updateOnlineStatus("ONLINE");
      lastStatusUpdateRef.current = now;
    }
    
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
  
    statusTimeoutRef.current = setTimeout(() => {
      if (Date.now() - lastActivityRef.current >= 60000) {
        updateOnlineStatus("AWAY");
      }
    }, 60000);
  }, [connected, updateOnlineStatus]);


  const fetchUnreadMessageCounts = useCallback(async () => {
    if (!isAuthenticated) return;
    
    const now = Date.now();

    if (now - lastUnreadFetchTimeRef.current < 1000) {
      return;
    }
    
    lastUnreadFetchTimeRef.current = now;
    
    try {
      console.log("WS: Fetching unread message counts");
      const response = await authFetch(`http://localhost:8080/api/messages/unread`);
      
      if (!response || !response.ok) {
        console.error("Failed to fetch unread message counts");
        return;
      }
      
      const data = await response.json();
      
      const formattedCounts = {};
      Object.keys(data).forEach(senderId => {
        formattedCounts[parseInt(senderId)] = data[senderId];
      });

      setUnreadMessages(formattedCounts);

      const totalCount = Object.values(formattedCounts).reduce((total, count) => total + count, 0);
      console.log("WS: Total unread count:", totalCount);

      updateUnreadCount(totalCount);

      try {
        localStorage.setItem('eventify_unread_count', totalCount.toString());
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
      
    } catch (e) {
      console.error("Error fetching unread message counts:", e);
    }
  }, [isAuthenticated, authFetch, updateUnreadCount]);
 
  useEffect(() => {
  if (isAuthenticated) {

    fetchUnreadMessageCounts();
  }
  
  const intervalId = setInterval(() => {
    if (isAuthenticated && connected) {
      fetchUnreadMessageCounts();
    }
  }, 60000); 
  
  return () => clearInterval(intervalId);
}, [isAuthenticated, connected, fetchUnreadMessageCounts]);



  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      const savedMessages = localStorage.getItem('eventify_messages');
      const savedUnread = localStorage.getItem('eventify_unread');
      
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      
      if (savedUnread) {
        const unreadData = JSON.parse(savedUnread);
        setUnreadMessages(unreadData);

        const totalUnread = Object.values(unreadData).reduce((sum, count) => sum + count, 0);
      }
    } catch (e) {
      console.error("Error loading messages from localStorage:", e);
    }
  }, [isAuthenticated]);

 const playNotificationSound = useCallback(() => {
  try {
    const audio = new Audio("/assets/messages/notification.wav");
    audio.volume = 0.5;
    console.log("Playing notification sound");
    
    audio.addEventListener('canplaythrough', () => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Audio playback prevented:", error.message);
        });
      }
    });
    audio.addEventListener('error', (e) => {
      console.error("Audio error:", e);
    });
  } catch (error) {
    console.log("Unable to play notification sound:", error.message);
  }
}, []);
  const handleReadReceipt = useCallback((message) => {
    try {
      console.log("Received read receipt:", message.body);
      const conversationId = message.body;
      
      setMessages((prev) => {
        const existingMessages = prev[conversationId] || [];
        
        const updatedMessages = existingMessages.map(msg => ({
          ...msg,
          read: true
        }));
        
        return {
          ...prev,
          [conversationId]: updatedMessages
        };
      });
    } catch (e) {
      console.error("Read receipt error:", e);
    }
  }, []);

  const handleStatusUpdate = useCallback((message) => {
    try {
      const statusData = JSON.parse(message.body);
      console.log("Received status update for user:", statusData.userId, statusData.status);
      
      setUserStatuses((prev) => ({
        ...prev,
        [statusData.userId]: statusData,
      }));
    } catch (e) {
      console.error("Status update error:", e);
    }
  }, []);

  

  const subscribeToTypingIndicator = useCallback((conversationId) => {
    if (!clientRef.current || !connected || !conversationId) return null;
  
    console.log("Subscribing to typing indicators for:", conversationId);
    
    if (typingSubscriptions.current[conversationId]) {
      typingSubscriptions.current[conversationId].unsubscribe();
    }
    
    const sub = clientRef.current.subscribe(`/topic/typing/${conversationId}`, (msg) => {
      try {
        console.log("Typing update received:", msg.body);
        const data = JSON.parse(msg.body);
        
        setTypingUsers((prev) => {
          const newState = { ...prev };
          const userList = newState[conversationId] || [];
          
          if (data.typing) {
            if (!userList.includes(data.userId)) {
              newState[conversationId] = [...userList, data.userId];
            }
          } else {
            newState[conversationId] = userList.filter(id => id !== data.userId);

            if (newState[conversationId].length === 0) {
              delete newState[conversationId];
            }
          }
          
          return newState;
        });
      } catch (e) {
        console.error("Typing indicator error:", e);
      }
    });
  
    typingSubscriptions.current[conversationId] = sub;
    
    return () => {
      if (typingSubscriptions.current[conversationId]) {
        typingSubscriptions.current[conversationId].unsubscribe();
        delete typingSubscriptions.current[conversationId];
      }
    };
  }, [connected]);

  const updateTypingStatus = useCallback((conversationId, isTyping) => {
    if (!clientRef.current || !connected || !conversationId) return;
  
    try {
      console.log("Updating typing status:", { conversationId, isTyping });
      clientRef.current.publish({
        destination: "/app/status/typing",
        body: JSON.stringify({ 
          conversationId, 
          isTyping
        }),
        headers: { "content-type": "application/json" },
      });
    } catch (e) {
      console.error("Typing update error:", e);
    }
  }, [connected]);

  const messageHandler = useCallback((message) => {
    try {
      console.log("Processing raw message:", message.body);
      const data = JSON.parse(message.body);
      return data;
    } catch (e) {
      console.error("Error parsing message:", e);
      return null;
    }
  }, []);

  const subscribeToConversation = useCallback((conversationId) => {
    if (!clientRef.current || !connected) return null;
    
    console.log("Subscribing to conversation:", conversationId);
    
    const conversationSubscription = clientRef.current.subscribe(
      `/topic/conversations/${conversationId}`, 
      (message) => {
        const data = messageHandler(message);
        if (data && data.conversationId) {
          processIncomingMessage(data);
        }
      }
    );
    
    const readReceiptSubscription = clientRef.current.subscribe(
      `/topic/conversations/${conversationId}/read`,
      (message) => {
        try {
          const userId = parseInt(message.body);
          console.log(`User ${userId} read messages in conversation ${conversationId}`);

          setMessages(prev => {
            const conversationMessages = prev[conversationId] || [];

            if (conversationMessages.length === 0) return prev;

            const updatedMessages = conversationMessages.map(msg => {
              if (msg.recipientId === userId) {
                return { ...msg, read: true };
              }
              return msg;
            });
            
            return {
              ...prev,
              [conversationId]: updatedMessages
            };
          });
        } catch (e) {
          console.error("Error handling read status update", e);
        }
      }
    );
    
    if (!conversationSubscriptions.current) {
      conversationSubscriptions.current = {};
    }
    
    conversationSubscriptions.current[conversationId] = {
      conversation: conversationSubscription,
      readReceipt: readReceiptSubscription
    };
    
    return () => {
      if (conversationSubscriptions.current?.[conversationId]) {
        conversationSubscriptions.current[conversationId].conversation.unsubscribe();
        conversationSubscriptions.current[conversationId].readReceipt.unsubscribe();
        delete conversationSubscriptions.current[conversationId];
      }
    };
  }, [connected,messageHandler]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isAuthenticated && !connected && clientRef.current) {
        console.log("Connection appears lost, attempting to reconnect...");
        try {
          clientRef.current.activate();
        } catch (e) {
          console.error("Reconnection attempt failed:", e);
        }
      }
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated, connected]);


  const sendMessage = useCallback((recipientId, content) => {
    if (!clientRef.current || !connected || !recipientId || !content.trim()) {
      console.error("Cannot send message, invalid state:", { 
        connected, 
        hasClient: Boolean(clientRef.current),
        hasRecipient: Boolean(recipientId),
        hasContent: Boolean(content.trim())
      });
      return false;
    }
  
    try {
      console.log("Sending message to:", recipientId);
      const conversationId = userId < recipientId 
        ? `${userId}_${recipientId}` 
        : `${recipientId}_${userId}`;
      
      const tempId = "temp-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
      const placeholderMsg = {
        id: tempId,
        tempId: tempId,  
        senderId: userId,
        recipientId: recipientId,
        content: content.trim(),
        timestamp: new Date().toISOString(),
        conversationId: conversationId,
        read: false,
        senderName: "You", 
        isLocal: true,
        status: "sending"
      };
  
      if (!conversationSubscriptions.current?.[conversationId]) {
        console.log("Subscribing to conversation for sending message:", conversationId);
        subscribeToConversation(conversationId);
      }

      console.log("Adding local message with tempId:", tempId);
      setMessages(prev => {
        const existing = prev[conversationId] || [];
        return {
          ...prev,
          [conversationId]: [...existing, placeholderMsg]
        };
      });

      setTimeout(() => {
        if (clientRef.current && connected) {
          console.log("Publishing message to server with tempId:", tempId);
          clientRef.current.publish({
            destination: `/app/chat/${recipientId}`,
            body: JSON.stringify({ 
              recipientId, 
              content: content.trim(),
              tempId,
              conversationId  
            }),
            headers: { "content-type": "application/json" },
          });
        } else {
          console.error("Client disconnected before message could be sent");
        }
      }, 50);
      
      return true;
    } catch (e) {
      console.error("Send message error:", e);
      toast.error("Failed to send message. Please try again.");
      return false;
    }
  }, [connected, userId, subscribeToConversation]);

  const setActiveConversation = useCallback((conversationId) => {
    setSelectedConversationId(conversationId);

    if (connected && conversationId && !conversationSubscriptions.current?.[conversationId]) {
      subscribeToConversation(conversationId);
    }
  }, [connected, subscribeToConversation]);

  const updateTotalUnreadCount = useCallback((unreadMessagesObj) => {
    const totalCount = Object.values(unreadMessagesObj || unreadMessages).reduce(
      (total, count) => total + count, 0
    );

    updateUnreadCount(totalCount);
  }, [unreadMessages, updateUnreadCount]);
  

  const markMessagesAsRead = useCallback((senderId) => {
    if (!clientRef.current || !connected || !senderId) return;
  
    const processingKey = `processing_read_${senderId}`;
    if (clientRef.current[processingKey]) {
      return; 
    }
    
    try {
      clientRef.current[processingKey] = true;
      console.log("Marking messages as read from sender:", senderId);
      
      setUnreadMessages(prev => {
        if (!prev[senderId]) return prev;
        
        const newState = { ...prev };
        delete newState[senderId];
        
        // Update total count
        updateTotalUnreadCount(newState);
        
        return newState;
      });
      
      clientRef.current.publish({
        destination: `/app/messages/${senderId}/read`,
        body: JSON.stringify({}),
        headers: { "content-type": "application/json" },
      });

    if (userId) {
      const conversationId = userId < senderId 
        ? `${userId}_${senderId}` 
        : `${senderId}_${userId}`;
        
      setMessages(prev => {
        const conversationMessages = prev[conversationId] || [];
        
        const hasUnreadMessages = conversationMessages.some(
          msg => msg.senderId === senderId && !msg.read
        );
        
        if (!hasUnreadMessages) return prev;
        
        const updatedMessages = conversationMessages.map(msg => {
          if (msg.senderId === senderId && !msg.read) {
            return { ...msg, read: true };
          }
          return msg;
        });
        
        return {
          ...prev,
          [conversationId]: updatedMessages
        };
      });
    }
    
    setTimeout(() => {
      if (clientRef.current) {
        delete clientRef.current[processingKey];
      }
    }, 2000);
  } catch (e) {
    console.error("Read receipt error:", e);

    if (clientRef.current) {
      delete clientRef.current[processingKey];
    }
  }
}, [connected, userId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    try {
      localStorage.setItem('eventify_messages', JSON.stringify(messages));
      localStorage.setItem('eventify_unread', JSON.stringify(unreadMessages));
    } catch (e) {
      console.error("Error saving messages to localStorage:", e);
    }
  }, [isAuthenticated, messages, unreadMessages]);

  const isUserTyping = useCallback((userId, conversationId) => {
    if (!userId || !conversationId) return false;

    return typingUsers[conversationId]?.includes(userId);
  }, [typingUsers]);



  const getUnreadCount = useCallback((senderId) => {
    return unreadMessages[senderId] || 0;
  }, [unreadMessages]);

  const getTotalUnreadCount = useCallback(() => {
    const totalCount = Object.values(unreadMessages).reduce(
      (total, count) => total + count, 0
    );
      
    return totalCount;
  }, [unreadMessages, updateTotalUnreadCount]);

  const getUserStatus = useCallback((userId) => {
    const status = userStatuses[userId] || { 
      status: "OFFLINE", 
      lastSeen: null,
      isTyping: false 
    };
    
    return status;
  }, [userStatuses]);

  const fetchAllUserStatuses = useCallback(async () => {

    if (!isAuthenticated || connected) return;
    
    try {
      console.log("Fetching user statuses via REST (fallback)");
    } catch (err) {
      console.error("Failed to load statuses", err);
    }
  }, [isAuthenticated,connected]);

  useEffect(() => {
    if (isAuthenticated && !connected) {
      fetchAllUserStatuses();
    }
  }, [isAuthenticated, connected, fetchAllUserStatuses]);

 

  const processIncomingMessage = useCallback((data) => {
    if (!data) {
      console.error("Received empty message data");
      return;
    }
    
    const conversationId = data.conversationId;
    
    if (!conversationId) {
      console.error("Message missing conversationId:", data);
      return;
    }
  
    console.log("Processing incoming message for conversation:", conversationId, data);

    if (!conversationSubscriptions.current?.[conversationId]) {
      console.log("Subscribing to conversation on message receive:", conversationId);
      subscribeToConversation(conversationId);
    }

    if (data.recipientId === userId && !data.read) {
      const isChatActive = window.location.pathname.includes('/chat');
      const isCurrentConversation = selectedConversationId === conversationId;
      
      if (data.senderId !== userId) {
        console.log("Playing notification sound for new message");
        playNotificationSound();
      }
      
      if (!isChatActive || !isCurrentConversation) {
        console.log("Incrementing unread count for sender:", data.senderId);
  
        setUnreadMessages((prev) => {
          const newUnreadMessages = {
            ...prev,
            [data.senderId]: (prev[data.senderId] || 0) + 1,
          };
  
          const newTotal = Object.values(newUnreadMessages).reduce((sum, count) => sum + count, 0);
          console.log("New total unread count:", newTotal);
          updateUnreadCount(newTotal);
  
          try {
            localStorage.setItem('eventify_unread_count', newTotal.toString());
          } catch (e) {
            console.error("Error saving to localStorage:", e);
          }
          
          return newUnreadMessages;
        });
      } else if (isCurrentConversation) {
        console.log("Marking messages as read because conversation is active:", conversationId);
        markMessagesAsRead(data.senderId);
      }
    }

    setMessages((prev) => {
      const existingMessages = prev[conversationId] || [];

      const isDuplicate = existingMessages.some(msg => 
        msg.id === data.id || 
        (msg.senderId === data.senderId && 
         msg.content === data.content && 
         Math.abs(new Date(msg.timestamp || 0) - new Date(data.timestamp || 0)) < 5000)
      );
      
      if (isDuplicate) {
        console.log("Duplicate message detected, updating existing message");
        return {
          ...prev,
          [conversationId]: existingMessages.map(msg => 
            (msg.id === data.id || 
            (msg.isLocal && msg.senderId === data.senderId && 
             msg.content === data.content)) 
              ? { ...data, id: data.id || msg.id, read: msg.read || data.read } 
              : msg
          )
        };
      }
      
      console.log("Adding new message to conversation:", conversationId);
      return {
        ...prev,
        [conversationId]: [...existingMessages, data],
      };
    });
  }, [userId, selectedConversationId, subscribeToConversation, playNotificationSound, updateUnreadCount, markMessagesAsRead]);

  const handleNewMessage = useCallback((message) => {
    try {
      console.log("Received message from WebSocket:", message.body);
      let data;
      
      try {
        data = JSON.parse(message.body);
      } catch (parseError) {
        console.error("Failed to parse message JSON:", parseError);
        return;
      }
      
      if (!data) {
        console.error("Empty data after parsing message");
        return;
      }
      
      const conversationId = data.conversationId;
      
      if (!conversationId) {
        console.error("Message missing conversationId:", data);
        return;
      }
  
      console.log("Processing WebSocket message for conversation:", conversationId);

      if (!conversationSubscriptions.current?.[conversationId]) {
        console.log("Subscribing to conversation on message receive:", conversationId);
        subscribeToConversation(conversationId);
      }
      
      setMessages((prev) => {
        const existingMessages = prev[conversationId] || [];

        const existingMessage = existingMessages.find(m => {

          if (m.id === data.id && data.id) return true;
 
          if (m.isLocal && data.tempId && m.id === data.tempId) return true;

          if (m.senderId === data.senderId && 
              m.content === data.content && 
              m.recipientId === data.recipientId) {
            const msgTime = new Date(m.timestamp || 0).getTime();
            const dataTime = new Date(data.timestamp || 0).getTime();
            return Math.abs(msgTime - dataTime) < 5000; 
          }
          
          return false;
        });
        
        if (existingMessage) {
          console.log("Message already exists, updating:", data.id);
          
          return {
            ...prev,
            [conversationId]: existingMessages.map(msg => {
              if (msg.id === data.id || 
                  (msg.isLocal && data.tempId && msg.id === data.tempId) ||
                  (msg.senderId === data.senderId && 
                   msg.content === data.content && 
                   msg.recipientId === data.recipientId &&
                   Math.abs(new Date(msg.timestamp || 0) - new Date(data.timestamp || 0)) < 5000)) {
                return { 
                  ...data, 
                  id: data.id || msg.id,
                  read: msg.read || data.read,
                  isLocal: false
                };
              }
              return msg;
            })
          };
        }
  
        console.log("Adding new message to conversation:", conversationId);
        return {
          ...prev,
          [conversationId]: [...existingMessages, data],
        };
      });

      processIncomingMessage(data);
      
    } catch (e) {
      console.error("Error handling new message:", e);
    }
  }, [subscribeToConversation, processIncomingMessage]);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      console.log("Not authenticated, cleaning up WebSocket");
      return cleanupWebSocket();
    }

    const wsUrl = `http://localhost:8080/ws`;
    console.log("Attempting to connect to WebSocket at:", wsUrl);
    
    const socket = new SockJS(wsUrl);
    
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {}, 
      debug: function(str) {
        if (str.includes('Web Socket Opened') || 
            str.includes('Connected') || 
            str.includes('Error') || 
            str.includes('Closed')) {
          console.log("STOMP: " + str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000
    });
    
    let isComponentMounted = true;
  
    client.onConnect = (frame) => {
      if (!isComponentMounted) return;
      
      console.log("WebSocket Connected!", frame);
      setConnected(true);

      const statusSubscription = client.subscribe('/topic/status', (message) => {
        try {
          const statusData = JSON.parse(message.body);
          console.log("Received status update for user:", statusData.userId, statusData.status);
          
          setUserStatuses((prev) => ({
            ...prev,
            [statusData.userId]: statusData,
          }));
        } catch (e) {
          console.error("Status update error:", e);
        }
      });

      const allStatusesSubscription = client.subscribe('/topic/status/all', (message) => {
        try {
          const statusList = JSON.parse(message.body);
          console.log("Received all statuses:", statusList.length);
          
          const newStatuses = {};
          statusList.forEach((status) => {
            newStatuses[status.userId] = status;
          });
          
          setUserStatuses(prev => ({
            ...prev,
            ...newStatuses
          }));
        } catch (e) {
          console.error("Error processing status list:", e);
        }
      });

      
      messageSubscriptionRef.current = client.subscribe(`/user/queue/messages`, (message) => {
        try {
          handleNewMessage(message);
        } catch (e) {
          console.error("Error handling message", e);
        }
      });


      readReceiptSubscriptionRef.current = client.subscribe(`/user/queue/read-receipts`, (message) => {
        try {
          handleReadReceipt(message);
        } catch (e) {
          console.error("Error handling read receipt", e);
        }
      });



ackSubscriptionRef.current = client.subscribe(`/user/queue/ack`, (ack) => {
  try {
    const data = JSON.parse(ack.body);
    console.log("Message acknowledgment received:", data);
    
    if (!data.messageId || (!data.tempId && !data.conversationId)) {
      console.error("Incomplete ack data:", data);
      return;
    }

    setTimeout(() => {
      console.log("Processing ack for message:", data.messageId, "tempId:", data.tempId);
      
      setMessages((prev) => {
        const updatedMessages = { ...prev };
        let foundConversation = null;
        let foundMessage = false;

        if (data.tempId) {
          Object.keys(updatedMessages).forEach(conversationId => {
            if (foundMessage) return;
            
            const conversationMessages = updatedMessages[conversationId];
            const messageIndex = conversationMessages.findIndex(msg => 
              msg.isLocal && (msg.id === data.tempId || msg.tempId === data.tempId)
            );
            
            if (messageIndex >= 0) {
              foundConversation = conversationId;
              foundMessage = true;

              conversationMessages[messageIndex] = {
                ...conversationMessages[messageIndex],
                id: data.messageId,
                isLocal: false,
                status: "delivered",
                timestamp: data.timestamp || conversationMessages[messageIndex].timestamp
              };
            }
          });
        }
        
        if (!foundMessage && data.conversationId) {
          const conversationId = data.conversationId;
          if (updatedMessages[conversationId]) {

            const recentMessages = updatedMessages[conversationId]
              .filter(msg => msg.isLocal && !msg.id.includes('-'))
              .slice(-5); 
              
            if (recentMessages.length > 0) {
              foundConversation = conversationId;

              const mostRecentLocal = recentMessages[recentMessages.length - 1];
              const msgIndex = updatedMessages[conversationId].findIndex(m => m.id === mostRecentLocal.id);
              
              if (msgIndex >= 0) {
                updatedMessages[conversationId][msgIndex] = {
                  ...updatedMessages[conversationId][msgIndex],
                  id: data.messageId,
                  isLocal: false,
                  status: "delivered",
                  timestamp: data.timestamp || updatedMessages[conversationId][msgIndex].timestamp
                };
                foundMessage = true;
              }
            }
          }
        }
        
        if (!foundMessage) {
          console.warn("Could not find local message to update for ack:", data);
        } else {
          console.log("Updated message in conversation:", foundConversation);
        }
        
        return updatedMessages;
      });
    }, 50);
  } catch (e) {
    console.error("Error handling acknowledgment", e);
  }
});

      Object.keys(messages).forEach(conversationId => {
        subscribeToConversation(conversationId);
      });
      
      client.publish({
        destination: "/app/status/get-all",
        body: JSON.stringify({}),
        headers: { "content-type": "application/json" }
      });
      
      updateOnlineStatus("ONLINE");
    };

    console.log("Activating STOMP client...");
    client.activate();
    clientRef.current = client;

    return () => {
      console.log("Component unmounting, cleaning up WebSocket");

      if (conversationSubscriptions.current) {
        Object.keys(conversationSubscriptions.current).forEach(conversationId => {
          const subs = conversationSubscriptions.current[conversationId];
          if (subs.conversation) subs.conversation.unsubscribe();
          if (subs.readReceipt) subs.readReceipt.unsubscribe();
        });
        conversationSubscriptions.current = {};
      }

      if (messageSubscriptionRef.current) {
        messageSubscriptionRef.current.unsubscribe();
        messageSubscriptionRef.current = null;
      }
      
      if (readReceiptSubscriptionRef.current) {
        readReceiptSubscriptionRef.current.unsubscribe();
        readReceiptSubscriptionRef.current = null;
      }
      
      if (ackSubscriptionRef.current) {
        ackSubscriptionRef.current.unsubscribe();
        ackSubscriptionRef.current = null;
      }
      
      if (statusSubscriptionRef.current) {
        statusSubscriptionRef.current.unsubscribe();
        statusSubscriptionRef.current = null;
      }
      
      if (allStatusesSubscriptionRef.current) {
        allStatusesSubscriptionRef.current.unsubscribe();
        allStatusesSubscriptionRef.current = null;
      }
      
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      
      setConnected(false);
    };
  }, [isAuthenticated, userId,cleanupWebSocket]);


  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        console.log("Fetching user statuses");
        const response = await fetch(`http://localhost:8080/api/users/status/all`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          const statusMap = {};
          data.forEach((s) => (statusMap[s.userId] = s));
          setUserStatuses(statusMap);
          console.log("User statuses loaded:", Object.keys(statusMap).length);
        } else {
          console.error("Failed to load statuses:", response.status);
        }
      } catch (err) {
        console.error("Failed to load statuses", err);
      }
    };
    
    if (isAuthenticated) fetchStatuses();
  }, [isAuthenticated]);

  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        updateOnlineStatus("AWAY");
      } else {
        handleActivity();
      }
    });
    
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      document.removeEventListener("visibilitychange", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    };
  }, [handleActivity, updateOnlineStatus]);

  const updateMessage = useCallback((messageId, content) => {
    if (!clientRef.current || !connected) {
      console.error("Cannot update message: WebSocket not connected");
      return false;
    }
    
    try {
      console.log("Updating message:", messageId);
      clientRef.current.publish({
        destination: "/app/message/update",
        body: JSON.stringify({ messageId, content }),
        headers: { "content-type": "application/json" },
      });
      return true;
    } catch (e) {
      console.error("Message update error:", e);
      toast.error("Failed to update message. Please try again.");
      return false;
    }
  }, [connected]);

  const deleteMessage = useCallback((messageId) => {
    if (!clientRef.current || !connected) {
      console.error("Cannot delete message: WebSocket not connected");
      return false;
    }
    
    try {
      console.log("Deleting message:", messageId);
      clientRef.current.publish({
        destination: "/app/message/delete",
        body: JSON.stringify({ messageId }),
        headers: { "content-type": "application/json" },
      });
      return true;
    } catch (e) {
      console.error("Message deletion error:", e);
      toast.error("Failed to delete message. Please try again.");
      return false;
    }
  }, [connected]);

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        sendMessage,
        updateTypingStatus,
        markMessagesAsRead,
        subscribeToTypingIndicator,
        isUserTyping,
        getUnreadCount,
        getTotalUnreadCount,
        getUserStatus,
        messages,
        setActiveConversation,
        setMessages,
        fetchUnreadMessageCounts,
        updateMessage,
        deleteMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;