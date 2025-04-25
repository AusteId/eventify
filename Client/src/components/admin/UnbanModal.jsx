import { useDarkMode } from '../context/DarkModeContext.jsx';
import DefaultImage from '../../assets/no-image.png';
import Button from '../Button.jsx';

const UnbanModal = ({
                      closeUnbanModal,
                      isUnbanModalOpen,
                      id,
                      username,
                      banEndTime,
                      reason,
                      adminName,
                      formatDate,
                      banId,
                      unban,
                      userId,
                      unbanUserDirectly
                    }) => {
  const { isDarkMode } = useDarkMode();

  const handleUnban = () => {
    if (typeof unban === 'function') {
      unban(banId);
    } else if (typeof unbanUserDirectly === 'function') {
      unbanUserDirectly(id || userId);
    }
    closeUnbanModal();
  };

  if (!isUnbanModalOpen) return null;

  return (
    <div
      onClick={closeUnbanModal}
      className="fixed z-50 inset-0 flex justify-center items-center overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative max-w-3xl w-full mx-4 rounded-2xl shadow-xl border overflow-hidden transition-all duration-750 ${
          isDarkMode ? 'bg-slate-900 border-[#f59e0b]' : 'bg-white border-transparent'
        }`}
      >
        <div className={`py-5 px-6 transition-colors duration-750 ${
          isDarkMode ? 'bg-red-800' : 'bg-red-600'
        }`}>
          <h2 className="text-xl font-bold text-white">
            Confirm User Unban
          </h2>
          <p className="text-red-100 mt-1">
            You are about to remove a ban from this user
          </p>
        </div>

        <div className="p-6 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center pb-6 border-b transition-colors duration-750 space-y-4 sm:space-y-0 sm:space-x-6 mb-6 overflow-hidden
            ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}">
            <div className="flex-shrink-0">
              <img
                className="h-32 w-32 rounded-full object-cover border-4 transition-colors duration-750 ${
                  isDarkMode ? 'border-red-700' : 'border-red-100'
                }"
                src={`http://localhost:8080/api/users/${id || userId}/avatar`}
                alt={`${username}'s avatar`}
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = DefaultImage;
                }}
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className={`text-2xl font-bold mb-1 capitalize transition-colors duration-750 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {username}
              </div>
              <div className={`mb-1 transition-colors duration-750 ${
                isDarkMode ? 'text-red-300' : 'text-red-600'
              }`}>
                Currently Banned
              </div>
              <div className={`text-sm transition-colors duration-750 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                User ID: <span className="font-mono">{id || userId}</span>
              </div>
            </div>
          </div>

          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-750 ${
            isDarkMode ? 'text-[#f59e0b]' : 'text-gray-800'
          }`}>
            Current Ban Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <div>
              <div className={`text-sm font-medium mb-1 transition-colors duration-750 ${
                isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'
              }`}>
                Banned by
              </div>
              <div className={`font-semibold break-all transition-colors duration-750 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {adminName}
              </div>
            </div>

            <div>
              <div className={`text-sm font-medium mb-1 transition-colors duration-750 ${
                isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'
              }`}>
                Ban Duration
              </div>
              <div className={`font-semibold transition-colors duration-750 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {banEndTime ? (
                  <span>Until {formatDate(banEndTime)}</span>
                ) : (
                  <span className={isDarkMode ? 'text-red-300' : 'text-red-600'}>
                    Permanent Ban
                  </span>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className={`text-sm font-medium mb-1 transition-colors duration-750 ${
                isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'
              }`}>
                Reason for Ban
              </div>
              <div className={`p-3 rounded-lg break-all transition-colors duration-750 ${
                isDarkMode ? 'bg-slate-800 text-gray-200' : 'bg-gray-50 text-gray-800'
              }`}>
                {reason || 'No reason provided'}
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg mb-6 transition-colors duration-750 ${
            isDarkMode ? 'bg-amber-900/30 text-amber-200' : 'bg-amber-50 text-amber-800'
          }`}>
            <div className="flex items-start">
              <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>
                <span className="font-medium">Warning:</span> Unbanning this user will restore their access to the platform immediately.
              </span>
            </div>
          </div>


          <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4 space-y-4 space-y-reverse sm:space-y-0">
            <Button
              type="button"
              onClick={closeUnbanModal}
              hoverColor={'hover:bg-slate-700 duration-750'}
              textColor={'text-white'}
              size={'large'}
              background={isDarkMode ? 'bg-slate-800' : 'bg-slate-700'}
              border={`border ${isDarkMode ? 'border-slate-700' : 'border-transparent'}`}
              className="w-full sm:w-auto justify-center"
            >
              Cancel
            </Button>

            <Button
              onClick={handleUnban}
              hoverColor={'hover:bg-[#e58d00] duration-750'}
              textColor={'text-white'}
              size={'large'}
              background={'bg-[#f59e0b]'}
              border={'border border-transparent'}
              className="w-full sm:w-auto justify-center"
            >
              Confirm Unban
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnbanModal;