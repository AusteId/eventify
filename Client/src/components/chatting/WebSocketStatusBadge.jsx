import { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';

const WebSocketStatusBadge = () => {
  const { connected } = useWebSocket();
  const [showDetails, setShowDetails] = useState(false);
  const [fadeTimer, setFadeTimer] = useState(null);

  useEffect(() => {
    setShowDetails(true);

    if (fadeTimer) {
      clearTimeout(fadeTimer);
    }

    const timer = setTimeout(() => {
      setShowDetails(false);
    }, 5000);
    
    setFadeTimer(timer);
    
    return () => {
      if (fadeTimer) {
        clearTimeout(fadeTimer);
      }
    };
  }, [connected]);
  
  return (
    <div 
      className="fixed bottom-4 right-4 flex items-center p-2 rounded-md bg-white shadow-md z-50 cursor-pointer"
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      
      {(showDetails || !connected) && (
        <span className={`text-xs transition-opacity duration-500 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
          {connected ? 'Connected to chat' : 'Disconnected from chat'}
        </span>
      )}
    </div>
  );
};

export default WebSocketStatusBadge;