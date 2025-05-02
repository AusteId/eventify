import { useDarkMode } from '../context/DarkModeContext.jsx';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import BanModal from './BanModal.jsx';
import BanUserSVG from '../../assets/BanUserSVG.jsx';
import BanHistorySVG from '../../assets/BanHistorySVG.jsx';
import CommentsSVG from '../../assets/CommentsSVG.jsx';
import EventsSVG from '../../assets/EventsSVG.jsx';

const Dropdown = ({ isDropdownOpen, setIsDropdownOpen, userId, username, closeDropdown, setRefresh, bannedUser }) => {
  const { isDarkMode } = useDarkMode();
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {isBanModalOpen && <BanModal setRefresh={setRefresh} closeModal={() => setIsBanModalOpen(false)} userBanId={userId} username={username} />}
      {isDropdownOpen && (
        <>
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl z-40 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(false);
            }}
          >
            <ul
              className={`w-4/5 bg-base-100 rounded-box p-3 shadow-lg z-50 transform transition-all duration-300 ${isDarkMode
                  ? 'bg-slate-800 text-gray-200 border-[#f59e0b] border'
                  : 'bg-white border border-gray-300'
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              <li
                className={`relative flex justify-center py-2.5 cursor-pointer rounded-md ${isDarkMode
                    ? 'hover:bg-slate-700 duration-300'
                    : 'hover:bg-gray-100 duration-150'
                  }`}
                onClick={() => {
                  navigate(`/admin/user-events/${userId}`);
                  setIsDropdownOpen(false);
                }}
              >
                <div className="absolute left-[15%]">
                  <EventsSVG />
                </div>
                <a className="font-medium">Events</a>
              </li>
              <li
                className={`relative flex justify-center py-2.5 cursor-pointer rounded-md ${isDarkMode
                    ? 'hover:bg-slate-700 duration-300'
                    : 'hover:bg-gray-100 duration-150'
                  }`}
                onClick={() => {
                  navigate(`/admin/user-comments/${userId}`);
                  setIsDropdownOpen(false);
                }}
              >
                <div className="absolute left-[15%]">
                  <CommentsSVG />
                </div>
                <a className="font-medium">Comments</a>
              </li>
              <li
                className={`relative flex justify-center py-2.5 cursor-pointer rounded-md ${isDarkMode
                    ? 'hover:bg-slate-700 duration-300'
                    : 'hover:bg-gray-100 duration-150'
                  }`}
                onClick={() => {
                  navigate(`/admin/ban-history/${userId}`);
                  setIsDropdownOpen(false);
                }}
              >
                <div className="absolute left-[15%]">
                  <BanHistorySVG />
                </div>
                <a className="font-medium">Ban History</a>
              </li>
              {!bannedUser && <li
                className={`relative flex justify-center py-2.5 cursor-pointer rounded-md ${isDarkMode
                    ? 'hover:bg-slate-700 duration-300'
                    : 'hover:bg-gray-100 duration-150'
                  }`}
                onClick={() => {
                  setIsBanModalOpen(true);
                  closeDropdown()
                }}
              >
                <div className="absolute left-[15%]">
                  <BanUserSVG />
                </div>
                <a className="font-medium">Ban User</a>
              </li>}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Dropdown;