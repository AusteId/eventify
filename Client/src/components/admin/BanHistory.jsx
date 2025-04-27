import { useDarkMode } from '../context/DarkModeContext.jsx';
import { useEffect, useState } from 'react';
import { useAuth } from '../Auth/AuthContext.jsx';
import { useParams } from 'react-router';
import toast from 'react-hot-toast';
import Pagination from '../Pagination.jsx';
import LoadingScreen from '../message/LoadingScreen.jsx';
import defaultImage from '../../assets/default-user-image.png';

const BanHistory = () => {
  const { isDarkMode } = useDarkMode();
  const { userId } = useParams();
  const { authFetch } = useAuth();
  const [banHistory, setBanHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [username, setUsername] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);

  const fetchBanHistory = async (page = 0) => {
    setLoading(true);
    try {
      const response = await authFetch(
        `http://localhost:8080/api/admin/bans/history/${userId}?page=${page}`,
      );
      if (response.status === 401 || response.status === 403) {
        toast.error('Unauthorized');
        return;
      }
      if (response.status === 200) {
        const banHistory = await response.json();
        setBanHistory(banHistory.content);
        setTotalPages(banHistory.totalPages);
      }
    } catch (error) {
      console.error(error.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
    fetchBanHistory(pageNumber - 1);
  };

  useEffect(() => {
    fetchBanHistory();
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await authFetch(
          `http://localhost:8080/api/admin/${userId}/username`,
          {
            method: 'GET',
          },
        );
        if (response.status === 401 || response.status === 403) {
          toast.error('Unauthorized');
        }
        const username = await response.text();
        setUsername(username);
      } catch (error) {
        console.error(error.message || 'Server Error');
      }
    };
    fetchUsername();
  }, []);

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = dateString => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`px-4 py-6 min-h-screen`}>
      <div className="max-w-5xl mx-auto">
        <div className={`mb-6 p-6 rounded-2xl shadow-md border duration-750 flex flex-col md:flex-row items-center ${
          isDarkMode ? 'bg-slate-900  border-[#f59e0b]' : 'bg-white border-transparent'
        }`}>
          <div className="mb-4 md:mb-0 md:mr-6">
            <div className="relative">
              <img
                alt={`${username}'s avatar`}
                src={`http://localhost:8080/api/users/${userId}/avatar`}
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
                className={`rounded-full duration-750 w-32 h-32 object-cover border-4 ${
                  isDarkMode ? 'border-slate-700' : 'border-white shadow-md'
                }`}
              />
              {banHistory.some(ban => ban.isActive) && (
                <div className={`absolute top-0 right-0 m-1 p-1 rounded-full ${
                  isDarkMode ? 'bg-red-700' : 'bg-red-500'
                } w-6 h-6 flex items-center justify-center shadow-md`}>
                  <span className="text-white text-xs">!</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className={`text-2xl font-bold mb-2 break-all ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {username || 'Loading username...'}
            </h1>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              User ID: <span className="font-mono">{userId}</span>
            </div>
            <div className={`mt-2 ${
              banHistory.some(ban => ban.isActive)
                ? isDarkMode ? 'text-red-300' : 'text-red-600'
                : isDarkMode ? 'text-green-400' : 'text-green-600'
            } font-medium`}>
              {banHistory.some(ban => ban.isActive)
                ? 'Currently Banned'
                : banHistory.length > 0
                  ? 'Previously Banned'
                  : 'No Ban History'}
            </div>
          </div>

          <div className={`mt-4 md:mt-0 py-2 px-4 rounded-lg ${
            isDarkMode
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'bg-gray-100 text-gray-800'
          }`}>
            <div className="text-center">
              <div className="text-3xl font-bold">{banHistory.length}</div>
              <div className="text-xs uppercase">
                {banHistory.length === 1 ? 'Ban Record' : 'Ban Records'}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingScreen />
          </div>
        ) : banHistory.length === 0 ? (
          <div className={`text-center py-12 duration-750 border rounded-2xl shadow-md ${
            isDarkMode ? 'bg-slate-900 border border-[#f59e0b] text-gray-200' : 'bg-white text-gray-600 border-transparent'
          }`}>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-semibold mb-2">No Ban History</h2>
            <p>This user has never been banned from the platform.</p>
          </div>
        ) : (
          <div>
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Ban History Timeline
            </h2>

            <div className="space-y-4">
              {banHistory.map((ban) => (
                <div
                  key={ban.banId}
                  className={`p-5 rounded-2xl shadow-md relative ${
                    isDarkMode
                      ? `bg-slate-900 duration-750 border ${ban.isActive ? 'border-red-500' : 'border-[#f59e0b]'}`
                      : `bg-white ${ban.isActive ? 'border-l-4 border-red-500' : ''}`
                  }`}
                >
                  {ban.isActive && (
                    <div className={`absolute top-4 right-4 px-2 py-1 duration-750 rounded-md text-xs font-medium ${
                      isDarkMode ? 'bg-red-700 text-white' : 'bg-red-100 text-red-800'
                    }`}>
                      Active Ban
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className={`text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'
                      }`}>
                        Banned by Admin
                      </div>
                      <div className={`font-semibold break-all ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {ban.adminName}
                      </div>
                    </div>

                    <div>
                      <div className={`text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'
                      }`}>
                        Ban Status
                      </div>
                      <div className={`font-medium ${
                        ban.isActive
                          ? isDarkMode ? 'text-red-300' : 'text-red-600'
                          : isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {ban.isActive
                          ? 'Active'
                          : !ban.end ? 'Manually Removed' : 'Expired'}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className={`text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'
                      }`}>
                        Reason for Ban
                      </div>
                      <div className={`p-3 duration-750 rounded-lg break-all ${
                        isDarkMode ? 'bg-slate-800 text-gray-200' : 'bg-gray-50 text-gray-800'
                      }`}>
                        {ban.reason || 'No reason provided'}
                      </div>
                    </div>

                    <div>
                      <div className={`text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'
                      }`}>
                        Start Time
                      </div>
                      <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        <div className="font-medium">{formatDate(ban.start)}</div>
                        <div className="text-sm">{formatTime(ban.start)}</div>
                      </div>
                    </div>

                    <div>
                      <div className={`text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'
                      }`}>
                        End Time
                      </div>
                      <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {ban.end ? (
                          <>
                            <div className="font-medium">{formatDate(ban.end)}</div>
                            <div className="text-sm">{formatTime(ban.end)}</div>
                          </>
                        ) : ban.isActive ? (
                          <span className={`font-medium ${
                            isDarkMode ? 'text-red-300' : 'text-red-600'
                          }`}>Permanent Ban</span>
                        ) : (
                          <span className="font-medium">Manually Unbanned</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {(!ban.isActive && !ban.end) && (
                    <div className={`mt-4 pt-3 border-t ${
                      isDarkMode ? 'border-slate-700 text-gray-400' : 'border-gray-200 text-gray-500'
                    } text-sm italic`}>
                      Note: This user was permanently banned but later unbanned by an administrator.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              paginate={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BanHistory;