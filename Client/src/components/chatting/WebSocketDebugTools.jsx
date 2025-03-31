import { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';



const WebSocketDebugTools = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [logs, setLogs] = useState([]);
  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');
  const [debugResponse, setDebugResponse] = useState(null);
  
  const { 
    connected, 
    stompClient,
    sendMessage,
    updateTypingStatus,
    updateOnlineStatus,
    getUserStatus,
    isUserTyping 
  } = useWebSocket;
  
  useEffect(() => {
    if (stompClient && connected) {
      stompClient.subscribe('/user/queue/debug', (response) => {
        const data = JSON.parse(response.body);
        setDebugResponse(data);
        addLog(`DEBUG PING RESPONSE: ${JSON.stringify(data)}`);
      });
      
      stompClient.subscribe('/user/queue/debug/auth', (response) => {
        const data = JSON.parse(response.body);
        setDebugResponse(data);
        addLog(`AUTH CHECK RESPONSE: ${JSON.stringify(data)}`);
      });
      
      stompClient.subscribe('/topic/debug/echo', (response) => {
        const data = JSON.parse(response.body);
        addLog(`ECHO RESPONSE: ${JSON.stringify(data)}`);
      });
    }
    
    return () => {
    };
  }, [stompClient, connected]);
  
  const addLog = (log) => {
    setLogs(prevLogs => [
      { id: Date.now(), time: new Date().toISOString(), content: log },
      ...prevLogs.slice(0, 19) 
    ]);
  };

  const testConnection = () => {
    addLog(`Connection status: ${connected ? 'Connected' : 'Disconnected'}`);
    
    if (stompClient && connected) {
      stompClient.publish({
        destination: '/app/debug/ping',
        body: JSON.stringify({
          clientTimestamp: new Date().toISOString()
        })
      });
      addLog('Sent debug ping');
    } else {
      addLog('Not connected, cannot send ping');
    }
  };
  
  const testAuthentication = () => {
    if (stompClient && connected) {
      stompClient.publish({
        destination: '/app/debug/auth',
        body: JSON.stringify({})
      });
      addLog('Sent auth check');
    } else {
      addLog('Not connected, cannot check auth');
    }
  };

  const testSendMessage = () => {
    if (!recipientId) {
      addLog('Error: Enter a recipient ID first');
      return;
    }
    
    const result = sendMessage(Number(recipientId), message || 'Test message');
    addLog(`Send message to ${recipientId}: ${result ? 'Success' : 'Failed'}`);
  };

  const testTypingIndicator = () => {
    if (!recipientId) {
      addLog('Error: Enter a recipient ID first');
      return;
    }
    
    const conversationId = `1_${recipientId}`;
    updateTypingStatus(conversationId, true);
    addLog(`Sent typing=true for conversation: ${conversationId}`);
    
    setTimeout(() => {
      updateTypingStatus(conversationId, false);
      addLog(`Sent typing=false for conversation: ${conversationId}`);
    }, 5000);
  };

  const testEcho = () => {
    if (stompClient && connected) {
      stompClient.publish({
        destination: '/app/debug/echo',
        body: JSON.stringify({
          message: message || 'Echo test',
          timestamp: new Date().toISOString()
        })
      });
      addLog('Sent echo test');
    } else {
      addLog('Not connected, cannot send echo');
    }
  };

  const testStatusUpdate = (status) => {
    updateOnlineStatus(status);
    addLog(`Updated status to: ${status}`);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button 
        onClick={() => setShowDebug(!showDebug)}
        className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
      >
        {showDebug ? 'Hide Debug' : 'Show Debug'}
      </button>
      
      {showDebug && (
        <div className="bg-white border shadow-lg p-4 mt-2 w-96 max-h-96 overflow-auto">
          <h3 className="font-bold mb-2">WebSocket Debug</h3>
          
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
          
          <div className="mb-4 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Recipient ID"
              value={recipientId}
              onChange={e => setRecipientId(e.target.value)}
              className="border p-1 rounded"
            />
            <input
              type="text"
              placeholder="Message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="border p-1 rounded"
            />
            <div className="flex gap-2">
              <button 
                onClick={testConnection}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
              >
                Test Connection
              </button>
              <button 
                onClick={testAuthentication}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
              >
                Test Auth
              </button>
              <button 
                onClick={testEcho}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
              >
                Echo Test
              </button>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={testSendMessage}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
              >
                Send Message
              </button>
              <button 
                onClick={testTypingIndicator}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
              >
                Test Typing
              </button>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => testStatusUpdate('ONLINE')}
                className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
              >
                Set Online
              </button>
              <button 
                onClick={() => testStatusUpdate('AWAY')}
                className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
              >
                Set Away
              </button>
              <button 
                onClick={() => testStatusUpdate('OFFLINE')}
                className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
              >
                Set Offline
              </button>
            </div>
          </div>
          
          {debugResponse && (
            <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
              <h4 className="font-bold mb-1">Last Response:</h4>
              <pre>{JSON.stringify(debugResponse, null, 2)}</pre>
            </div>
          )}
          
          <div className="border-t pt-2">
            <h4 className="font-bold text-sm mb-1">Logs:</h4>
            <div className="max-h-32 overflow-y-auto text-xs">
              {logs.map(log => (
                <div key={log.id} className="mb-1">
                  <span className="text-gray-500">{log.time.split('T')[1].split('.')[0]}</span>: {log.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebSocketDebugTools;