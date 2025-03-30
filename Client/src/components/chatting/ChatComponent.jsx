import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useWebSocket } from "./WebSocketContext";
import { useNotification } from "../context/NotificationContext";
import { format } from 'date-fns';
import UserStatusIndicator from "./UserStatusIndicator";
import TypingDebugPanel from "./TypingDebugPanel";

const ChatComponent = ({recipientId, recipientUsername}) => {
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [typingSetupComplete, setTypingSetupComplete] = useState(false);
    const [messagesLoadingComplete, setMessagesLoadingComplete] = useState(false);
    const [debouncedTyping, setDebouncedTyping] = useState(false);
    const typingDebounceTimer = useRef(null);
    const {timeoutForError} = useNotification();
    const {userId} = useAuth();
    const {
        connected,
        sendMessage,
        updateTypingStatus,
        markMessagesAsRead,
        loadConversationHistory,
        subscribeToTypingIndicator,
        isUserTyping,
        messages,
        typingUsers
    } = useWebSocket();

    const messageEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const unsubscribeTypingRef = useRef(null);
    const loadedConversationRef = useRef(false);

    const conversationIdRef = useRef("");
    useEffect(() => {
        conversationIdRef.current = userId < recipientId
            ? `${userId}_${recipientId}`
            : `${recipientId}_${userId}`;
    }, [recipientId, userId]);

    const conversationMessages = messages[conversationIdRef.current] || [];

    useEffect(() => {
      loadedConversationRef.current = false;
      setPage(0);
      setHasMoreMessages(true);
      setIsSubscribed(false);
      setTypingSetupComplete(false);
      setMessagesLoadingComplete(false);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }

        if (isTyping) {
            updateTypingStatus(conversationIdRef.current, false);
            setIsTyping(false);
        }

        if (unsubscribeTypingRef.current) {
            unsubscribeTypingRef.current();
            unsubscribeTypingRef.current = null;
        }
    }, [recipientId, userId, isTyping, updateTypingStatus]);

    const setupTypingIndicator = useCallback(() => {
      if (!connected || isSubscribed || typingSetupComplete) return;
      
      try {
          console.log(`Setting up typing indicator for conversation with ${recipientUsername}`);
          
          const unsub = subscribeToTypingIndicator(conversationIdRef.current);
          if (unsub) {
              unsubscribeTypingRef.current = unsub;
              setIsSubscribed(true);
              setTypingSetupComplete(true);
          }
      } catch (error) {
          console.error("Error setting up typing indicator:", error);
      }
  }, [connected, isSubscribed, typingSetupComplete, recipientUsername, subscribeToTypingIndicator]);

  const loadMessages = useCallback(async () => {
    if (loadedConversationRef.current || !connected || messagesLoadingComplete) return;
    
    setIsLoadingHistory(true);
    try {
        console.log(`Loading initial messages for conversation with ${recipientUsername}`);
        const result = await loadConversationHistory(recipientId, 0, 20);
        
        if (result) {
            setHasMoreMessages(result.totalElements > 20);
            loadedConversationRef.current = true;
            setMessagesLoadingComplete(true);
        }
    } catch (error) {
        console.error("Error loading conversation history:", error);
    } finally {
        setIsLoadingHistory(false);
    }
}, [connected, messagesLoadingComplete, loadConversationHistory, recipientId, recipientUsername]);

    useEffect(() => {
        if (!recipientId || !connected) return;

        if (!isSubscribed) {
            setupTypingIndicator();
        }

        if (!loadedConversationRef.current) {
            loadMessages();
        }

        return () => {
        };
    }, [
        recipientId, 
        connected, 
        isSubscribed,
        setupTypingIndicator,
        loadMessages
    ]);

    useEffect(() => {
        if (conversationMessages.length > 0 && recipientId && connected) {
            markMessagesAsRead(recipientId);
        }
    }, [conversationMessages.length, markMessagesAsRead, recipientId, connected]);

    useEffect(() => {
        if (messageEndRef.current && !isLoadingHistory) {
            messageEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [conversationMessages, isLoadingHistory]);

    const handleScroll = useCallback(async () => {
        if (!chatContainerRef.current) return;
        
        const {scrollTop} = chatContainerRef.current;
        if (scrollTop === 0 && hasMoreMessages && !isLoadingHistory && connected) {
            const nextPage = page + 1;
            setIsLoadingHistory(true);

            const scrollHeight = chatContainerRef.current.scrollHeight;

            try {
                const result = await loadConversationHistory(recipientId, nextPage, 20);

                if (result) {
                    setPage(nextPage);
                    setHasMoreMessages(result.totalElements > (nextPage + 1) * 20);

                    setTimeout(() => {
                        if (chatContainerRef.current) {
                            chatContainerRef.current.scrollTop = 
                                chatContainerRef.current.scrollHeight - scrollHeight;
                        }
                    }, 100);
                }
            } catch (error) {
                console.error("Error loading more messages:", error);
            } finally {
                setIsLoadingHistory(false);
            }
        }
    }, [connected, hasMoreMessages, isLoadingHistory, loadConversationHistory, page, recipientId]);

    const handleInputChange = useCallback((e) => {
      const newMessage = e.target.value;
      setMessage(newMessage);

      if (!connected) return;
      
      if (newMessage.trim().length > 0) {
          console.log("User is typing - sending typing=true");
          updateTypingStatus(conversationIdRef.current, true);
          setIsTyping(true);
      } else {
          console.log("User cleared message - sending typing=false");
          updateTypingStatus(conversationIdRef.current, false);
          setIsTyping(false);
      }
      if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
          if (isTyping && connected) {
              console.log("Typing timeout - sending typing=false");
              setIsTyping(false);
              updateTypingStatus(conversationIdRef.current, false);
          }
      }, 3000);
  }, [connected, isTyping, updateTypingStatus]);

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (unsubscribeTypingRef.current) {
                unsubscribeTypingRef.current();
            }
        };
    }, []);

    useEffect(() => {
      return () => {
          if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
          }
          if (typingDebounceTimer.current) {
              clearTimeout(typingDebounceTimer.current);
          }
          if (unsubscribeTypingRef.current) {
              unsubscribeTypingRef.current();
          }
      };
  }, []);

    const handleSendMessage = useCallback(() => {
        if (!message.trim()) return;

        if (!connected) {
            timeoutForError("Not connected to chat server");
            return;
        }

        const success = sendMessage(recipientId, message.trim());
        if (success) {
            setMessage("");

            if (isTyping) {
                setIsTyping(false);
                updateTypingStatus(conversationIdRef.current, false);

                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
            }
        }
    }, [connected, isTyping, message, recipientId, sendMessage, timeoutForError, updateTypingStatus]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const formatMessageTime = useCallback((timestamp) => {
        if (!timestamp) return "";

        const date = new Date(timestamp);
        return format(date, "HH:mm");
    }, []);

    const checkUserTyping = useCallback(() => {
        return isUserTyping(recipientId, conversationIdRef.current);
    }, [isUserTyping, recipientId]);

    const checkTypingState = useCallback(() => {
      console.log("Current typing users:", typingUsers);
      console.log(`Is ${recipientUsername} (${recipientId}) typing:`, checkUserTyping());
    }, [typingUsers, recipientId, recipientUsername, checkUserTyping]);

    return (
      
        <div className="flex flex-col h-full border rounded-lg shadow-lg">
          <TypingDebugPanel recipientId={recipientId} conversationId={conversationIdRef.current} />
            <div className="p-3 border-b flex items-center justify-between bg-gray-50">
                <div className="flex items-center">
                    <UserStatusIndicator userId={recipientId} />
                    <span className="ml-2 font-semibold">{recipientUsername}</span>
                    {checkUserTyping() && (
                        <span className="ml-2 text-gray-500 text-sm italic">typing...</span>
                    )}
                </div>
                
                {!connected && (
                    <span className="text-red-500 text-xs">Disconnected</span>
                )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
  Debug: {checkUserTyping() ? 'User is typing' : 'User is not typing'}
</div>
            <div 
                ref={chatContainerRef}
                className="flex-1 p-3 overflow-y-auto"
                onScroll={handleScroll}
            >
                {isLoadingHistory && page > 0 && (
                    <div className="text-center py-2 text-gray-500">Loading older messages...</div>
                )}
                
                {conversationMessages.length === 0 && !isLoadingHistory && (
                    <div className="text-center py-2 text-gray-500">No messages yet. Start the conversation!</div>
                )}
                
                {conversationMessages.map((msg) => (
                    <div 
                        key={msg.id}
                        className={`mb-3 flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                    >
                        <div 
                            className={`max-w-[70%] rounded-lg px-3 py-2 ${
                                msg.senderId === userId 
                                    ? 'bg-blue-500 text-white rounded-br-none' 
                                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                            }`}
                        >
                            <div>{msg.content}</div>
                            <div 
                                className={`text-xs ${
                                    msg.senderId === userId ? 'text-blue-100' : 'text-gray-500'
                                } text-right mt-1 flex items-center justify-end`}
                            >
                                {formatMessageTime(msg.timestamp)}
                                {msg.senderId === userId && (
                                    <span className="ml-1">
                                        {msg.read ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 6L7 17L2 12" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 20h9" />
                                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                            </svg>
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                
                <div ref={messageEndRef} />
            </div>

            <div className="p-2 bg-gray-100 border-b flex items-center">
  <div className="text-sm">
    <span className="font-medium">Status: </span>
    {checkUserTyping() ? (
      <span className="text-green-600 font-medium">
        {recipientUsername} is typing... 
        <span className="inline-block animate-bounce">...</span>
      </span>
    ) : (
      <span className="text-gray-500">Idle</span>
    )}
  </div>
  
  <div className="ml-auto text-xs text-gray-500">
    <button 
      onClick={() => {
        console.log("Typing state check:", typingUsers);
        console.log("Is user typing:", checkUserTyping());
      }}
      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
    >
      Debug Typing
    </button>
  </div>
</div>
            
            <div className="p-3 border-t">
                <div className="flex items-center">
                    <textarea
                        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder={connected ? "Type a message..." : "Reconnecting..."}
                        rows="2"
                        value={message}
                        onChange={handleInputChange}
                        onKeyUp={handleKeyPress}
                        disabled={!connected}
                    />
                    <button
                        className="ml-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        onClick={handleSendMessage}
                        disabled={!connected || !message.trim()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 2L11 13" />
                            <path d="M22 2L15 22L11 13L2 9L22 2z" />
                        </svg>
                    </button>
                </div>
                {!connected && (
                    <div className="text-center text-red-500 text-sm mt-1">
                        You are currently offline. Messages will be sent when you reconnect.
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default ChatComponent;