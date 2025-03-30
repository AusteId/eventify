import { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';

const TypingStatusTester = ({ userId, conversationId }) => {
  const [typingState, setTypingState] = useState(false);
  const { connected, stompClient } = useWebSocket();
  
  useEffect(() => {
    if (!connected || !stompClient || !conversationId) return;
    
    console.log(`Subscribing to typing test for: ${conversationId}`);
    
    const subscription = stompClient.subscribe(`/topic/typing/${conversationId}`, (message) => {
      try {
        console.log(`[TEST] Received typing update:`, message.body);
        const data = JSON.parse(message.body);

        const isTyping = data.typing !== undefined ? data.typing : data.isTyping;
        const messageUserId = data.userId;
        
        if (messageUserId === userId) {
          console.log(`[TEST] User ${userId} typing status: ${isTyping}`);
          setTypingState(!!isTyping);
        }
      } catch (error) {
        console.error("[TEST] Error processing typing update:", error);
      }
    });
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [connected, stompClient, conversationId, userId]);
  
  return (
    <div className="fixed top-4 right-4 bg-white p-2 rounded-md shadow-md z-50">
      <div className="text-sm font-bold">Typing Status Test</div>
      <div className="flex items-center mt-1">
        <div 
          className={`w-3 h-3 rounded-full mr-2 ${
            typingState ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></div>
        <span className="text-xs">
          User {userId} is {typingState ? 'typing' : 'not typing'}
        </span>
      </div>
    </div>
  );
};

export default TypingStatusTester;