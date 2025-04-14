import { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';

const WebSocketStatusBadge = () => {
  const { connected } = useWebSocket();
  const [visible, setVisible] = useState(true);
  const [animating, setAnimating] = useState(false);
  
  useEffect(() => {
    let timeout;
    
    if (connected) {
      timeout = setTimeout(() => {
        setAnimating(true);

        setTimeout(() => {
          setVisible(false);
          setAnimating(false);
        }, 1000);
      }, 3000);
    } else {
      setVisible(true);
      setAnimating(false);
    }
    
    return () => {
      clearTimeout(timeout);
    };
  }, [connected]);

  if (!visible && !animating && connected) {
    return null;
  }
  
  return (
    <div 
      className={`fixed bottom-6 right-6 flex items-center p-3 rounded-xl bg-white shadow-md transition-all duration-1000 ${
        animating ? 'opacity-0' : 'opacity-100'
      } z-50`}
    >
      <div className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="text-xs font-medium text-gray-700">
        {connected ? "Connected to chat" : "Disconnected from chat"}
      </span>
    </div>
  );
};


export default WebSocketStatusBadge;
