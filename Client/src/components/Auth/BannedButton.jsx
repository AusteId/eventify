import { useState, useRef, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import Button from '../Button.jsx';

const BannedButton = ({ isAuthenticated, roles,size,message,buttonName,className,hidden }) => {
  const { isDarkMode } = useDarkMode();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  const isBanned = roles && roles.some(role => role.name === 'BANNED');

  const handleButtonClick = () => {
    if (!isBanned) {
      document.getElementById('event_creation_modal').showModal();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {isAuthenticated && (
        <div className={`${hidden} md:block lg:block relative`}>
          <div
            className="relative"
            onMouseEnter={() => isBanned && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            ref={tooltipRef}
          >
            <Button
              onClick={handleButtonClick}
              className={`transition-colors duration-750 ${className || ""} ${
                isBanned ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              background={isBanned ? (isDarkMode ? 'bg-slate-700' : 'bg-gray-300') : 'bg-[#f59e0b]'}
              textColor={isBanned ? (isDarkMode ? 'text-gray-400' : 'text-gray-500') : ''}
              hoverColor={isBanned ? '' : 'hover:bg-amber-600 duration-750'}
              border={`border ${isDarkMode ? 'border-[#f59e0b]' : 'border-transparent'}`}
              disabled={isBanned}
              size={size || "none"}
            >
              {buttonName || "Create Event"}
            </Button>

            {showTooltip && isBanned && (
              <div
                className={`absolute top-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg shadow-lg z-50 text-sm max-w-xs w-max pointer-events-none transition-opacity duration-300 ${
                  isDarkMode
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <div className="text-center whitespace-nowrap">
                  {message || "Event creation unavailable while banned"}
                </div>
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
                    isDarkMode ? 'bg-slate-800 border-b border-r border-slate-700' : 'bg-white border-b border-r border-gray-200'
                  }`}
                ></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannedButton;