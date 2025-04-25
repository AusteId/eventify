import { useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

const MessageNavItem = ({ isDarkMode, setIsDropdownOpen, isBanned, MessageSVG }) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const itemRef = useRef(null);

  const handleClick = () => {
    if (!isBanned) {
      navigate('/chat');
      setIsDropdownOpen(false);
    }
  };

  return (
    <li
      ref={itemRef}
      className={`relative flex justify-center py-1 ${
        isBanned
          ? 'cursor-not-allowed '
          : 'cursor-pointer'
      } ${
        isDarkMode
          ? `hover:bg-slate-600 duration-750 ${isBanned ? 'text-gray-400' : ''}`
          : `hover:bg-gray-100 duration-750 ${isBanned ? 'text-gray-400' : ''}`
      }`}
      onClick={handleClick}
      onMouseEnter={() => isBanned && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className={`absolute left-[15%] ${isBanned ? (isDarkMode ? 'text-gray-400' : 'text-gray-400') : ''}`}>
        <MessageSVG />
      </div>
      <a>Messages</a>

      {showTooltip && isBanned && (
        <div
          className={`absolute left-[-10]  bottom-[-250%]  -translate-y-full mr-2 px-3 py-2 rounded-lg shadow-lg z-50 text-sm max-w-xs w-max pointer-events-none transition-opacity duration-300 ${
            isDarkMode
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'bg-white text-gray-800 border border-gray-200'
          }`}
        >
          <div className="text-center whitespace-nowrap">
            Messages unavailable while banned
          </div>
          <div
            className={`absolute top-[-0.75rem] right-1/2 translate-y-1/2 rotate-225 w-2 h-2 ${
              isDarkMode ? 'bg-slate-800 border-r border-b border-slate-700' : 'bg-white border-r border-b border-gray-200'
            }`}
          ></div>
        </div>
      )}
    </li>
  );
};

export default MessageNavItem;