import { useState } from "react";
import { format } from "date-fns";
import { useWebSocket } from "./WebSocketContext";
import { useAuth } from "../Auth/AuthContext";
import defaultAvatar from "../../assets/default-user-image.png";
import DeleteMessageModal from "./DeleteMessageModal";

const MessageComponent = ({ message, userId, recipientAvatar }) => {
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { updateMessage, deleteMessage } = useWebSocket();
  const { avatar: currentUserAvatar } = useAuth();

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
      return <span className="text-xs text-gray-400">Sending</span>; 
    } else if (message.read) {
      return (
        <div className="flex items-center">
          {recipientAvatar && (
            <img 
              src={recipientAvatar} 
              alt="Avatar" 
              className="w-5 h-5 rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
          )}
        </div>
      ); 
    } else {
      return <span className="text-xs text-gray-600">Delivered</span>;
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setShowOptions(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
    setShowOptions(false);
  };
  
  const confirmDelete = () => {
    deleteMessage(message.id);
    setShowDeleteModal(false);
  };
  
  const cancelDelete = () => {
    setShowDeleteModal(false);
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
        <div className="italic text-gray-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Message was deleted
        </div>
      );
    }

    if (editMode) {
      return (
        <div className="w-full">
          <textarea
            className="w-full p-3 border border-amber-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none bg-amber-50 text-gray-800"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            autoFocus
            rows="3"
            placeholder="Edit your message..."
          />
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition-colors"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button
              className="px-4 py-1.5 bg-amber-500 text-white rounded-md text-sm hover:bg-amber-600 transition-colors"
              onClick={handleSaveEdit}
            >
              Save
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="break-words">
        {message.content}
        {message.edited && (
          <span className="ml-1 text-xs italic text-gray-400">(edited)</span>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={`mb-4 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
        onMouseEnter={() => isOwnMessage && !message.deleted && setShowOptions(true)}
        onMouseLeave={() => setShowOptions(false)}
      >
        {!isOwnMessage && (
          <img 
            src={recipientAvatar || `http://localhost:8080/api/users/${message.senderId}/avatar`}
            className="h-9 w-9 rounded-full mr-1 mt-1 self-start"
            alt="User"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
            }}
          />
        )}
        
        <div className="max-w-[80%] relative">
          {showOptions && !editMode && !message.deleted && (
            <div className="absolute top-[-30px] right-0 bg-white rounded-lg shadow-lg flex p-1 z-10 border border-gray-100">
              <button
                className="p-1.5 hover:bg-amber-50 text-gray-600 rounded-md transition-colors"
                onClick={handleEdit}
                title="Edit message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15.172M17.828 3.586a2 2 0 00-2.828 0 1.414 1.414 0 000 2l9.9 9.9-4.243 4.242" />
                </svg>
              </button>
              <button
                className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors"
                onClick={handleDelete}
                title="Delete message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m5-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
          
          <div
            className={`rounded-2xl px-4 py-2.5 shadow-sm ${
              isOwnMessage 
                ? `bg-amber-500 text-white ${message.isLocal ? "opacity-70" : ""}`
                : "bg-gray-100 text-gray-800"
            } ${message.deleted ? "bg-opacity-70" : ""}`}
          >
            {renderMessageContent()}
            
            {!message.deleted && (
              <div className="text-xs text-right mt-1 flex items-center justify-end gap-1">
                {formatMessageTime(message.timestamp)}
                {renderMessageStatus()}
              </div>
            )}
          </div>
          
          {isOwnMessage && !message.deleted && (
            <div className="text-right text-xs text-gray-500 mt-1">
              {message.isLocal ? "Sending..." : ""}
            </div>
          )}
        </div>
      </div>
      
      <DeleteMessageModal 
        isOpen={showDeleteModal} 
        onCancel={cancelDelete} 
        onConfirm={confirmDelete}
        message={message}
      />
    </>
  );
};

export default MessageComponent;