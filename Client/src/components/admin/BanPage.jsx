import BanSearchbar from './BanSearchbar.jsx';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import { useEffect, useState } from 'react';
import { useAuth } from '../Auth/AuthContext.jsx';
import toast from 'react-hot-toast';
import LoadingScreen from '../message/LoadingScreen.jsx';
import Pagination from '../Pagination.jsx';
import { Link } from 'react-router-dom';
import UnbanModal from './UnbanModal.jsx';

const BanPage = () => {
  const { isDarkMode } = useDarkMode();
  const [bans, setBans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentFilters, setCurrentFilters] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [unbanUserId, setUnbanUserId] = useState(null);
  const { authFetch } = useAuth();

  const fetchBans = async (page = 0, filters = {}, size = 15) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      params.append('page', page);
      params.append('size', size);

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (key.includes('Date') && value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, value);
          }
        }
      });

      const response = await authFetch(`http://localhost:8080/api/admin/bans?${params.toString()}`, {
        method: 'GET',
      });

      if (response.status === 401 || response.status === 403) {
        toast.error("Unauthorized");
        return;
      }

      if (response.status === 200) {
        const banData = await response.json();
        setBans(banData.content);
        setTotalPages(banData.totalPages);
      }
    } catch (error) {
      console.error(error.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pageIndex = currentPage > 0 ? currentPage - 1 : 0;
    fetchBans(pageIndex, currentFilters);
  }, [refresh, currentPage, currentFilters]);

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
    fetchBans(pageNumber - 1, currentFilters);
  };

  const handleSearch = filters => {
    setCurrentFilters(filters);
    setCurrentPage(1);
    fetchBans(0, filters);
  };

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

  const calculateRemainingTime = (endDate) => {
    if (!endDate) return null;

    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;

    if (diffTime <= 0) return null;

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  const toggleUnbanModal = (e, userId) => {
    e.stopPropagation();
    setUnbanUserId(prevId => (prevId === userId ? null : userId));
  };

  const unbanUserDirectly = banId => {
    setLoading(true);
    try {
      const response = authFetch(
        `http://localhost:8080/api/admin/unban/${banId}`,
        {
          method: 'PATCH',
        },
      );
      if (response.status === 401 || response.status === 403) {
        toast.error('Unauthorized');
      }
      setUnbanUserId(null);
      setRefresh(prev => prev + 1);
      toast.success("User unbanned successfully!");
    } catch (error) {
      console.error(error.message || 'Server side error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen px-4 py-6 transition-colors duration-750`}>
      <div className="max-w-7xl mx-auto">
        {/* header at the top*/}
        <div className={`mb-6 p-5 rounded-xl border shadow-md transition-colors duration-750 ${
          isDarkMode ? 'bg-slate-900 border-[#f59e0b]' : 'bg-white border-transparent'
        }`}>
          <h1 className={`text-2xl font-bold mb-2 transition-colors duration-750 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            User Ban Management
          </h1>
          <p className={`mb-4 transition-colors duration-750 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            View and manage all active and historical user bans across the platform. To access history click on "HISTORY" pill, to unban click on "ACTIVE"
          </p>

          <div className="mt-4">
            <BanSearchbar onSearch={handleSearch} />
          </div>



          {/* boxes for counting bans */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3 rounded-lg text-center transition-colors duration-750 ${
              isDarkMode ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="text-lg font-bold">{bans.filter(ban => ban.isActive).length}</div>
              <div className="text-xs uppercase">Active Bans</div>
            </div>
            <div className={`p-3 rounded-lg text-center transition-colors duration-750 ${
              isDarkMode ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="text-lg font-bold">{bans.filter(ban => !ban.isActive).length}</div>
              <div className="text-xs uppercase">Expired Bans</div>
            </div>
            <div className={`p-3 rounded-lg text-center transition-colors duration-750 ${
              isDarkMode ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="text-lg font-bold">{bans.filter(ban => !ban.end).length}</div>
              <div className="text-xs uppercase">Permanent Bans</div>
            </div>
            <div className={`p-3 rounded-lg text-center transition-colors duration-750 ${
              isDarkMode ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="text-lg font-bold">{bans.length}</div>
              <div className="text-xs uppercase">Total Records</div>
            </div>
          </div>
        </div>

        {/* Ban cards */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingScreen />
          </div>
        ) : bans.length === 0 ? (
          <div className={`p-12 text-center rounded-xl border shadow-md transition-colors duration-750 ${
            isDarkMode ? 'bg-slate-900  border-[#f59e0b] text-gray-200' : 'bg-white border-transparent text-gray-600 shadow-md'
          }`}>
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-semibold mb-2">No Bans Found</h2>
            <p className="max-w-md mx-auto">
              There are no bans matching your search criteria. Try adjusting your filters or check back later.
            </p>
          </div>

        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bans.map((ban) => (
              <div
                key={ban.banId}
                className={`rounded-xl shadow-md border overflow-hidden border transition-all duration-750 ${
                  isDarkMode && ban.isActive ? 'border-red-500 bg-slate-900' : isDarkMode ? "border-[#f59e0b]"
                    : ban.isActive ? `border-transparent bg-white`
                    : 'bg-white border-transparent'
                }`}
              >
                <UnbanModal
                  userId={ban.userId}
                  unban={unbanUserDirectly}
                  {...ban}
                  formatDate={formatDate}
                  closeUnbanModal={(e) => {setUnbanUserId(null)
                    e.stopPropagation()}}
                  isUnbanModalOpen={unbanUserId === ban.userId}
                  setUnbanUserId={isOpen => {
                    if (!isOpen) {setUnbanUserId(null)}
                  }}
                />
                <div className="grid grid-cols-1 md:grid-cols-12 h-full">
                  {/* Left sidebar with status */}
                  <div className={`md:col-span-2 p-4 flex flex-row md:flex-col justify-between items-center transition-colors duration-750 ${
                    isDarkMode
                      ? ban.isActive ? 'bg-red-900/30' : 'bg-slate-800'
                      : ban.isActive ? 'bg-red-50' : 'bg-gray-50'
                  }`}>
                    <div className="text-center mb-0 md:mb-4">
                      <div className={`inline-block rounded-full w-3 h-3 mb-1 ${
                        ban.isActive
                          ? 'bg-red-500 animate-pulse'
                          : isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                      }`}></div>
                      <div
                        onClick={e => {
                          if(ban.isActive) {
                            toggleUnbanModal(e, ban.userId)}
                        }}
                        className={`text-sm cursor-pointer font-medium transition-colors duration-750 ${
                        ban.isActive
                          ? isDarkMode ? 'text-red-300' : 'text-red-600'
                          : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {ban.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </div>
                    </div>

                    <div className="text-center">
                      <Link
                        to={`/admin/ban-history/${ban.userId}`}
                        className={`text-xs uppercase font-medium px-3 py-1 rounded-full transition-colors duration-750 ${
                          isDarkMode
                            ? 'bg-slate-800 text-[#f59e0b] hover:bg-slate-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        History
                      </Link>
                    </div>
                  </div>

                  <div className="md:col-span-10 p-5">
                    <div className="flex flex-wrap justify-between items-start">
                      {/* User info */}
                      <div className="w-full sm:w-auto mb-4 sm:mb-0 capitalize break-all ">
                        <h3 className={`text-lg font-bold mb-1 transition-colors duration-750 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {ban.username || 'Unknown User'}
                        </h3>
                        <div className={`text-sm mb-1 transition-colors duration-750 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          User ID: <span className="font-mono">{ban.userId}</span>
                        </div>
                      </div>

                      {/* Admin info */}
                      <div className="w-full sm:w-auto text-left sm:text-right">
                        <div className={`text-xs uppercase font-medium mb-1 transition-colors duration-750 ${
                          isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'
                        }`}>
                          Banned by
                        </div>
                        <div className={`font-medium transition-colors capitalize duration-750 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {ban.adminName}
                        </div>
                        <div className={`text-xs transition-colors duration-750 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          Admin ID: {ban.adminId}
                        </div>
                      </div>
                    </div>

                    {/* reason */}
                    <div className="my-4">
                      <div className={`text-xs uppercase font-medium mb-1 transition-colors break-all duration-750 ${
                        isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'
                      }`}>
                        Reason for Ban
                      </div>
                      <div className={`p-3 rounded-lg transition-colors duration-750 ${
                        isDarkMode ? 'bg-slate-800 text-gray-200' : 'bg-gray-50 text-gray-800'
                      }`}>
                        {ban.reason || 'No reason provided'}
                      </div>
                    </div>

                    {/* Duration of the ban */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className={`text-xs uppercase font-medium mb-1 transition-colors duration-750 ${
                          isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'
                        }`}>
                          Ban Start
                        </div>
                        <div className={`font-medium transition-colors duration-750 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {formatDate(ban.start)}
                        </div>
                        <div className={`text-xs transition-colors duration-750 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {formatTime(ban.start)}
                        </div>
                      </div>

                      <div>
                        <div className={`text-xs uppercase font-medium mb-1 transition-colors duration-750 ${
                          isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'
                        }`}>
                          Ban End
                        </div>
                        {ban.end ? (
                          <div>
                            <div className={`font-medium transition-colors duration-750 ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {formatDate(ban.end)}
                            </div>
                            <div className={`text-xs transition-colors duration-750 ${
                              isDarkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {formatTime(ban.end)}
                            </div>
                          </div>
                        ) : (
                          <div className={`font-medium transition-colors duration-750 ${
                            isDarkMode ? 'text-red-300' : 'text-red-600'
                          }`}>
                            Permanent Ban
                          </div>
                        )}
                      </div>

                      {/* Status pills */}
                      <div>
                        <div className={`text-xs uppercase font-medium mb-1 transition-colors duration-750 ${
                          isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'
                        }`}>
                          Status
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ban.isActive && ban.end && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-750 ${
                              isDarkMode ? 'bg-amber-900/50 text-amber-200' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {calculateRemainingTime(ban.end)}
                            </span>
                          )}

                          {ban.isActive && !ban.end && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-750 ${
                              isDarkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-800'
                            }`}>
                              Indefinite
                            </span>
                          )}

                          {!ban.isActive && !ban.end && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-750 ${
                              isDarkMode ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800'
                            }`}>
                              Manually Unbanned
                            </span>
                          )}

                          {!ban.isActive && ban.end && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-750 ${
                              isDarkMode ? 'bg-green-900/50 text-green-200' : 'bg-green-100 text-green-800'
                            }`}>
                              Expired
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {(!ban.isActive && !ban.end) && (
                      <div className={`mt-4 pt-3 border-t text-sm italic transition-colors duration-750 ${
                        isDarkMode ? 'border-slate-700 text-gray-400' : 'border-gray-200 text-gray-500'
                      }`}>
                        Note: This was a permanent ban that was manually lifted by an administrator.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
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

export default BanPage;