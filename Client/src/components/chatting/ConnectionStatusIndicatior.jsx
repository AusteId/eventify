import { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';

const ConnectionStatusIndicator = () => {
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
        }, 2000);
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
      className={`fixed bottom-4 right-4 flex items-center p-2 rounded-md bg-white shadow-md transition-opacity duration-2000 ${
        animating ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="text-xs">
        {connected ? "Connected to chat" : "Disconnected from chat"}
      </span>
    </div>
  );
};

export default ConnectionStatusIndicator;