import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({children}) => {
    const {isAuthenticated, userId} = useAuth();
    const {url, timeoutForError} = useNotification();
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [userStatuses, setUserStatuses] = useState({});
    const [messages, setMessages] = useState({});
    const [typingUsers, setTypingUsers] = useState({});
    const [unreadMessages, setUnreadMessages] = useState({});
    const [reconnectAttempt, setReconnectAttempt] = useState(0);
    const [typingSubscriptions, setTypingSubscriptions] = useState({});
    const loadingHistoryRef = useRef(new Set());
    
    const clientRef = useRef(null);
    const connectedRef = useRef(false);
    const statusUpdateTimeoutRef = useRef(null);
    const subscriptionsRef = useRef({});
    
    const lastStatusUpdateRef = useRef(Date.now());
    const recentTypingUpdates = useRef(new Map());

    const cleanupWebSocket = useCallback(() => {
        console.log("Cleaning up WebSocket connection");
        
        try {
            if (clientRef.current && connectedRef.current) {
                try {
                    clientRef.current.publish({
                        destination: "/app/status/update",
                        body: "OFFLINE"
                    });
                } catch (e) {
                    console.error("Error sending offline status during cleanup:", e);
                }
                
                clientRef.current.deactivate();
            }
        } catch (error) {
            console.error("Error during WebSocket cleanup:", error);
        } finally {
            setConnected(false);
            connectedRef.current = false;
            clientRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !userId) return cleanupWebSocket();

        console.log("Attempting to connect to WebSocket");

        const getJwtTokenFromCookie = () => {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith('jwt_token=')) {
                    return cookie.substring('jwt_token='.length, cookie.length);
                }
                if (cookie.startsWith('jwt_token_swagger=')) {
                    return cookie.substring('jwt_token_swagger='.length, cookie.length);
                }
            }
            return null;
        };

        const jwtToken = getJwtTokenFromCookie();
        
        if (!jwtToken) {
            console.warn("No JWT token found in cookies");
            return cleanupWebSocket();
        }
        cleanupWebSocket();

        const client = new Client({
            webSocketFactory: () => {
                console.log(`Creating SockJS connection to ${url}/ws`);
                return new SockJS(`${url}/ws`);
            },
            connectHeaders: {
                Authorization: `Bearer ${jwtToken}`
            },
            debug: (str) => {
                if (str.includes("ERROR") || str.includes("CONNECT") || str.includes("DISCONNECT")) {
                    console.log("STOMP DEBUG", str);
                }
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = (frame) => {
            console.log("WebSocket connected successfully");
            setConnected(true);
            connectedRef.current = true;
            setReconnectAttempt(0);
            
            subscriptionsRef.current = {};
            
            try {
                const messagesSub = client.subscribe(`/user/queue/messages`, handleNewMessage);
                subscriptionsRef.current["messages"] = messagesSub;
                
                const readSub = client.subscribe(`/user/queue/read-receipts`, handleReadReceipt);
                subscriptionsRef.current["readReceipts"] = readSub;
                
                const statusSub = client.subscribe(`/topic/status`, handleStatusUpdate);
                subscriptionsRef.current["status"] = statusSub;
                
                console.log("Successfully subscribed to base topics");
                
                setTimeout(() => {
                    try {
                        if (connectedRef.current) {
                            updateOnlineStatus("ONLINE");
                        }
                    } catch (e) {
                        console.error("Error sending initial online status:", e);
                    }
                }, 1000);
            } catch (error) {
                console.error("Error subscribing to topics:", error);
            }
        };

        client.onStompError = (frame) => {
            console.error("STOMP error:", frame.headers.message);
            timeoutForError("Lost connection to chat server");
            setConnected(false);
            connectedRef.current = false;
            setReconnectAttempt(prev => prev + 1);
        };
        
        client.onWebSocketClose = () => {
            console.log("WebSocket connection closed");
            setConnected(false);
            connectedRef.current = false;
            
            if (connectedRef.current) {
                setReconnectAttempt(prev => prev + 1);
            }
        };
        
        client.onWebSocketError = (event) => {
            console.error("WebSocket error:", event);
            setConnected(false);
            connectedRef.current = false;
        };

        try {
            client.activate();
            setStompClient(client);
            clientRef.current = client;
        } catch (error) {
            console.error("Error activating STOMP client:", error);
            timeoutForError("Failed to connect to chat server");
            setConnected(false);
            connectedRef.current = false;
        }

        return cleanupWebSocket;
    }, [isAuthenticated, userId, url, timeoutForError, reconnectAttempt, cleanupWebSocket]);

    const handleNewMessage = useCallback((message) => {
      try {
          const messageData = JSON.parse(message.body);
          const messageId = messageData.id;
          const conversationId = messageData.conversationId;
          
          setMessages(prevMessages => {
              const currentConversation = prevMessages[conversationId] || [];

              if (currentConversation.some(msg => msg.id === messageId)) {
                  return prevMessages;
              }

              const updatedConversation = [...currentConversation, messageData].sort(
                  (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
              );

              return {
                  ...prevMessages,
                  [conversationId]: updatedConversation
              };
          });
 
          if (messageData.senderId !== userId && !messageData.read) {
              setUnreadMessages(prev => {
                  const senderId = messageData.senderId;
                  const currentCount = prev[senderId] || 0;

                  return {
                      ...prev,
                      [senderId]: currentCount + 1
                  };
              });
          }
      } catch (error) {
          console.error("Error processing new message:", error);
      }
  }, [userId]);

    const handleReadReceipt = useCallback((message) => {
        try {
            const messageData = JSON.parse(message.body);

            setMessages((prevMessages) => {
                const conversationId = messageData.conversationId;
                const conversation = prevMessages[conversationId] || [];

                const updatedConversation = conversation.map(msg => 
                    msg.id === messageData.id ? { ...msg, read: true} : msg
                );

                return {
                    ...prevMessages,
                    [conversationId]: updatedConversation
                };
            });
        } catch (error) {
            console.error("Error processing read receipt:", error);
        }
    }, []);

    const lastStatusMap = useRef(new Map());
    
    const handleStatusUpdate = useCallback((message) => {
        try {
            const statusData = JSON.parse(message.body);
            
            const userId = statusData.userId;
            const now = Date.now();
            const lastUpdate = lastStatusMap.current.get(userId) || 0;
            
            if (now - lastUpdate > 2000) {
                lastStatusMap.current.set(userId, now);
                
                setUserStatuses((prev) => ({
                    ...prev,
                    [statusData.userId]: statusData
                }));
            }
        } catch (error) {
            console.error("Error processing status update:", error);
        }
    }, []);

    const subscribeToTypingIndicator = useCallback((conversationId) => {
      if (!clientRef.current || !connectedRef.current) {
          console.warn("Can't subscribe to typing indicators: not connected");
          return null;
      }

      if (typingSubscriptions[conversationId]) {
          console.log(`Already subscribed to typing indicators for: ${conversationId}`);
          return () => {}; 
      }
      
      console.log(`Subscribing to typing indicator for conversation: ${conversationId}`);
      
      try {
          const subscription = clientRef.current.subscribe(`/topic/typing/${conversationId}`, (message) => {
              try {
                  console.log(`Received typing update for ${conversationId}:`, message.body);
                  const statusData = JSON.parse(message.body);
                  console.log("Parsed typing status data:", statusData);
  
                  const isTyping = statusData.typing !== undefined ? 
                      statusData.typing : 
                      (statusData.isTyping !== undefined ? statusData.isTyping : false);
                  
                  const userId = statusData.userId;
                  
                  if (userId) {
                      console.log(`Setting typing state for user ${userId} to ${isTyping}`);
                      

                      setTypingUsers(prev => {
                          const newState = {...prev};
                          
                          if (isTyping) {
                              newState[userId] = {
                                  userId,
                                  typing: true,
                                  typingInConversation: statusData.typingInConversation || conversationId
                              };
                          } else {
                              delete newState[userId];
                          }
                          
                          console.log("Updated typing users state:", newState);
                          return newState;
                      });
                  } else {
                      console.warn("Received typing status with missing userId:", statusData);
                  }
              } catch (error) {
                  console.error("Error processing typing indicator:", error);
              }
          });
          
          console.log(`Successfully subscribed to typing topic: /topic/typing/${conversationId}`);

          setTypingSubscriptions(prev => {
              const newState = {...prev};
              newState[conversationId] = subscription;
              return newState;
          });

          return () => {
              try {
                  if (subscription && connectedRef.current) {
                      console.log(`Unsubscribing from typing indicators for: ${conversationId}`);
                      subscription.unsubscribe();
                  }
                  
                  setTypingSubscriptions(prev => {
                      const newState = {...prev};
                      delete newState[conversationId];
                      return newState;
                  });
              } catch (error) {
                  console.error(`Error unsubscribing from typing indicators for ${conversationId}:`, error);
              }
          };
      } catch (error) {
          console.error(`Error subscribing to typing indicators for ${conversationId}:`, error);
          return null;
      }
  }, [typingSubscriptions]);
  
  const hasTypingSubscription = useCallback((conversationId) => {
      return Boolean(typingSubscriptions[conversationId]);
  }, [typingSubscriptions]);

    const sendMessage = useCallback((recipientId, content) => {
        if (!clientRef.current || !connectedRef.current) {
            console.warn("Can't send message: not connected");
            timeoutForError("Not connected to chat server");
            return false;
        }

        try {
            const destination = `/app/chat/${recipientId}`;
            const message = {
                recipientId,
                content
            };

            clientRef.current.publish({
                destination,
                body: JSON.stringify(message)
            });
            return true;
        } catch (error) {
            console.error("Error sending message:", error);
            timeoutForError("Failed to send message");
            return false;
        }
    }, [timeoutForError]);

    const updateTypingStatus = useCallback((conversationId, isTyping) => {
      if (!clientRef.current || !connectedRef.current) {
          console.warn("Can't update typing status: not connected");
          return;
      }
      
      const now = Date.now();
      const userId = window.currentUserId; 
      const key = `${userId}_${conversationId}_${isTyping}`;
      
      const lastUpdate = recentTypingUpdates.current.get(key) || 0;
      if (now - lastUpdate < 2000) {
          console.log(`Skipping duplicate typing=${isTyping} update (throttled)`);
          return;
      }
      
      console.log(`Sending typing status: conversationId=${conversationId}, isTyping=${isTyping}`);
      recentTypingUpdates.current.set(key, now);
      
      try {
          const destination = "/app/status/typing";
          const message = {
              conversationId,
              isTyping
          };

          if (isTyping) {
              setTypingUsers(prev => ({
                  ...prev,
                  [userId]: {
                      userId,
                      typing: true,
                      typingInConversation: conversationId
                  }
              }));
          } else {
              if (typingUsers[userId]?.typing) {
                  setTypingUsers(prev => {
                      const newState = {...prev};
                      delete newState[userId];
                      return newState;
                  });
              }
          }

          clientRef.current.publish({
              destination,
              body: JSON.stringify(message),
              headers: {
                  'content-type': 'application/json',
                  'x-typing-update': 'direct' 
              }
          });
          
          console.log(`Typing status sent: ${isTyping ? 'typing' : 'stopped typing'} in ${conversationId}`);
          
          if (isTyping) {
              setTimeout(() => {
                  if (clientRef.current && connectedRef.current) {
                      if (typingUsers[userId]?.typing) {
                          console.log("Sending typing heartbeat");
                          updateTypingStatus(conversationId, true);
                      }
                  }
              }, 2000);
          }
      } catch (error) {
          console.error("Error updating typing status:", error);
      }
  }, [typingUsers]);

    const updateOnlineStatus = useCallback((status) => {
      if (!clientRef.current || !connectedRef.current) {
          console.warn("Can't update online status: not connected");
          return;
      }
      
      const now = Date.now();
      if (now - lastStatusUpdateRef.current < 5000) {
          console.log("Skipping status update (throttled)");
          return;
      }
      
      console.log(`Updating online status to: ${status}`);
      lastStatusUpdateRef.current = now;
      
      try {
          const destination = "/app/status/update";
          
          clientRef.current.publish({
              destination,
              body: status,
              headers: {
                  'content-type': 'text/plain'
              }
          });

          if (userId) {
              setUserStatuses(prev => ({
                  ...prev,
                  [userId]: {
                      ...prev[userId],
                      status: status,
                      lastSeen: new Date().toISOString()
                  }
              }));
          }
      } catch (error) {
          console.error("Error updating online status:", error);
      }
  }, [userId]);

    const markMessagesAsRead = useCallback((senderId) => {
        if (!clientRef.current || !connectedRef.current) {
            console.warn("Can't mark messages as read: not connected");
            return;
        }

        try {
            const destination = `/app/messages/${senderId}/read`;

            clientRef.current.publish({
                destination,
                body: JSON.stringify({})
            });

            setUnreadMessages((prev) => {
                const newState = {...prev};
                delete newState[senderId];
                return newState;
            });
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    }, []);

    const loadConversationHistory = useCallback(async (otherUserId, page = 0, size = 20) => {
      const requestKey = `${userId}_${otherUserId}_${page}`;
      if (loadingHistoryRef.current.has(requestKey)) {
          console.log(`Already loading history for: ${requestKey}`);
          return null;
      }
      
      if (!isAuthenticated || !userId) {
          console.warn("Cannot load conversation history: not authenticated");
          return null;
      }
      
      try {
          console.log(`Loading conversation history: ${userId}/${otherUserId} (page ${page})`);

          loadingHistoryRef.current.add(requestKey);
          
          const response = await fetch(`${url}/api/messages/${userId}/${otherUserId}?page=${page}&size=${size}`, {
              credentials: "include"
          });
          
          if (!response.ok) {
              throw new Error(`Failed to load conversation history: ${response.status}`);
          }
  
          const data = await response.json();
          
          const conversationId = userId < otherUserId
              ? `${userId}_${otherUserId}`
              : `${otherUserId}_${userId}`;

          if (data.content && data.content.length > 0) {
              setMessages(prevMessages => {
                  const existingMessages = prevMessages[conversationId] || [];
                  const existingIds = new Set(existingMessages.map(msg => msg.id));
                  const newMessages = data.content.filter(msg => !existingIds.has(msg.id));
                  if (newMessages.length === 0) {
                      return prevMessages;
                  }
                  const combinedMessages = [...existingMessages, ...newMessages].sort(
                      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                  );
                  return {
                      ...prevMessages,
                      [conversationId]: combinedMessages
                  };
              });
          }
          
          return data;
      } catch (error) {
          console.error("Error loading conversation history:", error);
          timeoutForError(error.message);
          return null;
      } finally {
          loadingHistoryRef.current.delete(requestKey);
      }
  }, [isAuthenticated, userId, url, timeoutForError]);

    const getUserStatus = useCallback((userId) => {
        return userStatuses[userId] || { status: "OFFLINE", typing: false, lastSeen: null };
    }, [userStatuses]);

    const isUserTyping = useCallback((checkUserId, conversationId) => {
      const debug = false;
      
      if (debug) {
          console.log(`Checking if user ${checkUserId} is typing in ${conversationId}`);
          console.log('Current typing users:', typingUsers);
      }
      const user = typingUsers[checkUserId];
      
      const result = Boolean(user && user.typing && 
                            (user.typingInConversation === conversationId || 
                             !user.typingInConversation)); 
      
      if (debug) {
          console.log(`User ${checkUserId} typing status: ${result}`);
      }
      
      return result;
  }, [typingUsers]);

    const debugTypingUsers = useCallback(() => {
      console.log("Current typing users state:", typingUsers);
      console.log("Current typing subscriptions:", typingSubscriptions);
    }, [typingUsers, typingSubscriptions]);

    const getUnreadCount = useCallback((userId) => {
        return unreadMessages[userId] || 0;
    }, [unreadMessages]);

    const getTotalUnreadCount = useCallback(() => {
        return Object.values(unreadMessages).reduce((total, count) => total + count, 0);
    }, [unreadMessages]);

    useEffect(() => {
        if (!isAuthenticated || !userId || !connected) return;
        
        const heartbeatInterval = setInterval(() => {
            try {
                const now = Date.now();
                if (now - lastStatusUpdateRef.current >= 30000) { 
                    updateOnlineStatus("ONLINE");
                }
            } catch (error) {
                console.error("Error sending heartbeat:", error);
            }
        }, 45000);
        
        return () => clearInterval(heartbeatInterval);
    }, [isAuthenticated, userId, connected, updateOnlineStatus]);

    useEffect(() => {
        if (!isAuthenticated || !userId) return;
        
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                updateOnlineStatus("AWAY");
            } else if (document.visibilityState === "visible" && connectedRef.current) {
                updateOnlineStatus("ONLINE");
            }
        };
        
        document.addEventListener("visibilitychange", handleVisibilityChange);
        
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isAuthenticated, userId, updateOnlineStatus]);

    return (
        <WebSocketContext.Provider
            value={{
                connected,
                stompClient: clientRef.current,
                sendMessage,
                updateTypingStatus,
                updateOnlineStatus,
                markMessagesAsRead,
                loadConversationHistory,
                subscribeToTypingIndicator,
                getUserStatus,
                isUserTyping,
                getUnreadCount,
                getTotalUnreadCount,
                messages
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketContext;