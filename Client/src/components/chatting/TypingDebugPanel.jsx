import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketContext";

const TypingDebugPanel = ({ recipientId, conversationId }) => {
    const [debugLogs, setDebugLogs] = useState([]);
    const { connected, stompClient } = useWebSocket();
    
    const addLog = (message) => {
      const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
      setDebugLogs(prev => [{ id: Date.now(), time: timestamp, text: message }, ...prev.slice(0, 19)]);
    };
    
    const sendTypingStatus = (isTyping) => {
      if (!connected || !stompClient) {
        addLog("Not connected - can't send typing status");
        return;
      }
      
      try {
        const destination = "/app/status/typing";
        const message = {
          conversationId,
          isTyping
        };
        
        stompClient.publish({
          destination,
          body: JSON.stringify(message),
          headers: {
            'content-type': 'application/json'
          }
        });
        
        addLog(`Sent typing=${isTyping} directly`);
      } catch (error) {
        addLog(`Error sending typing status: ${error.message}`);
      }
    };
    

    useEffect(() => {
      if (!connected || !stompClient || !conversationId) return;
      
      addLog(`Subscribing to typing updates for ${conversationId}`);
      
      const subscription = stompClient.subscribe(`/topic/typing/${conversationId}`, (message) => {
        try {
          const data = JSON.parse(message.body);
          addLog(`Typing update: ${JSON.stringify(data)}`);
        } catch (error) {
          addLog(`Error parsing message: ${error.message}`);
        }
      });
      
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }, [connected, stompClient, conversationId]);
    
    return (
      <div className="fixed bottom-4 right-4 bg-white p-3 rounded-md shadow-lg z-50 max-w-sm">
        <h3 className="font-bold mb-2">Typing Debug</h3>
        
        <div className="mb-2 flex space-x-2">
          <button 
            onClick={() => sendTypingStatus(true)}
            className="bg-green-500 text-white text-xs px-3 py-1 rounded"
          >
            Send Typing=true
          </button>
          <button 
            onClick={() => sendTypingStatus(false)}
            className="bg-red-500 text-white text-xs px-3 py-1 rounded"
          >
            Send Typing=false
          </button>
        </div>
        
        <div className="max-h-40 overflow-y-auto border rounded p-2">
          {debugLogs.map(log => (
            <div key={log.id} className="text-xs mb-1">
              <span className="text-gray-500">{log.time}</span> {log.text}
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default TypingDebugPanel;