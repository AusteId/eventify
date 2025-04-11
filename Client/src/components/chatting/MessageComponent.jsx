import { useState } from "react";
import { format } from "date-fns";
import { useWebSocket } from "./WebSocketContext";

const MessageComponent = ({ message, userId }) => {
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showOptions, setShowOptions] = useState(false);
  const { updateMessage, deleteMessage } = useWebSocket();

  const isOwnMessage = message.senderId == userId;
  
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      return format(new Date(timestamp), "HH:mm");
    } catch (e) {
      console.error("Error formatting time:", e);
      return "";
    }
  };

  const renderMessageStatus = () => {
    if (!isOwnMessage) return null;
    
    if (message.isLocal) {
      return <span className="ml-1 text-xs text-blue-200">Sending</span>; 
    } else if (message.read) {
      return <span className="ml-1 text-xs text-blue-200">Seen</span>; 
    } else {
      return <span className="ml-1 text-xs text-blue-200">Delivered</span>;
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setShowOptions(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessage(message.id);
      setShowOptions(false);
    }
  };

  const handleSaveEdit = () => {
    if (editContent.trim() !== "" && editContent !== message.content) {
      updateMessage(message.id, editContent.trim());
    }
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setEditMode(false);
  };

  const renderMessageContent = () => {
    if (message.deleted) {
      return (
        <div className="italic text-gray-400">
          <i className="fas fa-ban mr-1"></i> This message was deleted
        </div>
      );
    }

    if (editMode) {
      return (
        <div className="w-full">
          <textarea
            className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
              onClick={handleSaveEdit}
            >
              Save
            </button>
          </div>
        </div>
      );
    }

    return (
      <div>
        {message.content}
        {message.edited && (
          <span className="ml-1 text-xs italic text-gray-400">(edited)</span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`mb-3 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => isOwnMessage && !message.deleted && setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div
        className={`max-w-[70%] rounded-lg px-3 py-2 relative ${
          isOwnMessage
            ? `bg-blue-500 text-white rounded-br-none ${message.isLocal ? "opacity-70" : ""}`
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        {showOptions && !editMode && (
          <div className="absolute top-[-20px] right-0 bg-white rounded-md shadow-md flex">
            <button
              className="p-1 hover:bg-gray-100 text-gray-600"
              onClick={handleEdit}
              title="Edit message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15.172M17.828 3.586a2 2 0 00-2.828 0 1.414 1.414 0 000 2l9.9 9.9-4.243 4.242" />
              </svg>
            </button>
            <button
              className="p-1 hover:bg-gray-100 text-red-600"
              onClick={handleDelete}
              title="Delete message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m5-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
        
        {renderMessageContent()}
        
        <div
          className={`text-xs ${
            isOwnMessage ? "text-blue-100" : "text-gray-500"
          } text-right mt-1 flex items-center justify-end`}
        >
          {formatMessageTime(message.timestamp)}
          {renderMessageStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;