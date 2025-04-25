import { useAuth } from '../Auth/AuthContext.jsx';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingScreen from '../message/LoadingScreen.jsx';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import defaultImage from '../../assets/default-user-image.png';
import Pagination from '../Pagination.jsx';
import Searchbar from './Searchbar.jsx';
import Button from '../Button.jsx';
import Dropdown from './Dropdown.jsx';
import DeleteModal from '../DeleteModal.jsx';
import UnbanModal from './UnbanModal.jsx';
import { useNavigate } from 'react-router';

const UserCards = () => {
  const { authFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useDarkMode();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [unbanUserId, setUnbanUserId] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const navigate = useNavigate();

  const placeholderTerm = 'Search users by username or email';

  // FetchUsers does what it says, fetches user data to display for the cards and basic ban information
  const fetchUsers = async (page = 0, term = '') => {
    setLoading(true);
    try {
      const response = await authFetch(
        `http://localhost:8080/api/admin/users?page=${page}&size=12&excludeAdmin=true${term ? `&searchTerm=${encodeURIComponent(term)}` : ''}`,
        { method: 'GET' },
      );
      if (response.status === 401) {
        toast.error('Unauthorized');
        return;
      }
      const data = await response.json();
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error.message || 'Server side error');
    } finally {
      setLoading(false);
    }
  };

  // Pagination functions that call the next page and one for the search that adds a search term
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
    fetchUsers(pageNumber - 1, searchTerm);
  };

  const handleSearch = term => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchUsers(0, term);
  };

  // This useeffect is for closing a dropdown by clicking anywhere else than it's container
  useEffect(() => {
    const handleClickOutside = e => {
      if (!e.target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Initial fetch as the component first mounts and to refresh everytime user is banned or unbanned
  useEffect(() => {
    const pageIndex = currentPage > 0 ? currentPage - 1 : 0;
    fetchUsers(pageIndex, searchTerm);
  }, [refresh, currentPage, searchTerm]);

  // toggling dropdown with users id so that all the modals would not open at the same time
  const toggleDropdown = (e, userId) => {
    e.stopPropagation();
    setOpenDropdownId(prevId => (prevId === userId ? null : userId));
  };

  // Same as above but only for delete modal
  const toggleUnbanModal = (e, userId) => {
    e.stopPropagation();
    setUnbanUserId(prevId => (prevId === userId ? null : userId));
  };

  // Format date for display
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Directly unban user using this function, takes users ID as a parameter

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
    <>
      <div className="relative px-6 pt-6 pb-2">
        <Searchbar
          onSearch={handleSearch}
          initialValue={searchTerm}
          placeholder={placeholderTerm}
        />
      </div>
      <div className="px-6 py-4">
        {loading && (
          <div className="flex justify-center py-8">
            <LoadingScreen />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {!loading && users.length === 0 ? (
            <div className="col-span-full text-center py-12 text-lg">
              No users found
            </div>
          ) : (
            users.map(user => (
              <div
                key={user.id}
                className={`dropdown-container flex relative flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-750 ${
                  isDarkMode
                    ? 'bg-slate-900 border border-[#f59e0b]'
                    : 'bg-white'
                }`}
              >
                {user.banned && (
                  <div
                    className={`absolute top-0 right-0 m-2 px-2 py-1 rounded-md text-xs font-medium z-10 ${
                      isDarkMode
                        ? 'bg-red-900 text-white'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Banned
                  </div>
                )}

                <Dropdown
                  setRefresh={setRefresh}
                  closeDropdown={() => setOpenDropdownId(null)}
                  isDropdownOpen={openDropdownId === user.id}
                  username={user.username}
                  setIsDropdownOpen={isOpen => {
                    if (!isOpen) setOpenDropdownId(null);
                  }}
                  userId={user.id}
                  isBanned={user.banned}
                />

               <UnbanModal
                 unban={unbanUserDirectly}
                 {...user}
                 formatDate={formatDate}
               closeUnbanModal={(e) => {setUnbanUserId(null)
               e.stopPropagation()}}
               isUnbanModalOpen={unbanUserId === user.id}
               setUnbanUserId={isOpen => {
                 if (!isOpen) {setUnbanUserId(null)}
               }}
               />

                <div
                  className={`p-4 flex justify-center duration-750 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}
                >
                  <img
                    alt={`${user.username} avatar`}
                    src={`http://localhost:8080/api/users/${user.id}/avatar`}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = defaultImage;
                    }}
                    className={`rounded-full w-32 h-32 object-cover border-4 ${
                      user.banned
                        ? isDarkMode
                          ? 'border-red-600'
                          : 'border-red-500'
                        : 'border-white dark:border-slate-700'
                    }`}
                  />
                </div>

                <div
                  className={`p-5 flex-1 flex flex-col gap-2 duration-750 min-h-[200px] ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
                >
                  <table className="w-full mb-1">
                    <tbody>
                      <tr>
                        <td
                          className={`text-sm ${isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'} font-medium py-1`}
                        >
                          Username:
                        </td>
                        <td
                          className={`text-right capitalize font-semibold duration-750 truncate ${isDarkMode && 'text-gray-200'}`}
                        >
                          {user.username}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className={`text-sm ${isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'} font-medium py-1`}
                        >
                          Email:
                        </td>
                        <td
                          className={`text-right font-semibold break-all duration-750 text-sm ${isDarkMode && 'text-gray-200'}`}
                        >
                          {user.email}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className={`text-sm ${isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'} font-medium py-1`}
                        >
                          City:
                        </td>
                        <td
                          className={`text-right capitalize font-semibold duration-750 ${isDarkMode && 'text-gray-200'}`}
                        >
                          {user.city || 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className={`text-sm ${
                            user.banned
                              ? isDarkMode
                                ? 'text-red-300'
                                : 'text-red-600'
                              : isDarkMode
                                ? 'text-gray-400'
                                : 'text-gray-400'
                          } font-medium py-1`}
                        >
                          Status:
                        </td>
                        <td
                          className={`text-right font-semibold ${
                            user.banned
                              ? isDarkMode
                                ? 'text-red-300'
                                : 'text-red-600'
                              : isDarkMode
                                ? 'text-green-400'
                                : 'text-green-600'
                          }`}
                        >
                          {user.banned ? 'Banned' : 'Active'}
                        </td>
                      </tr>
                      {user.banned && (
                        <tr>
                          <td
                            className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-600'} font-medium py-1`}
                          >
                            Until:
                          </td>
                          <td
                            className={`text-right font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}
                          >
                            {user.banEndTime
                              ? formatDate(user.banEndTime)
                              : 'Permanent'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className={`mt-auto pt-3 flex ${user.banned ? "justify-between" : "justify-center"}`}>
                    <Button
                      type="button"
                      hoverColor={'hover:bg-slate-600 duration-750 '}
                      textColor={'text-white'}
                      size={'large'}
                      background={`bg-slate-900`}
                      border={`border ${isDarkMode ? 'border-[#f59e0b]' : 'border-transparent'}`}
                      onClick={e => toggleDropdown(e, user.id)}
                    >
                      Options
                    </Button>
                    {user.banned && (
                      <Button
                        type="button"
                        hoverColor={'hover:bg-amber-600 duration-750 '}
                        textColor={'text-white'}
                        size={'large'}
                        background={`bg-[#f59e0b]`}
                        border={`border ${isDarkMode ? 'border-gray-200' : 'border-transparent'}`}
                        onClick={e => toggleUnbanModal(e, user.id)}
                      >
                        Unban
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          paginate={handlePageChange}
        />
      )}
    </>
  );
};

export default UserCards;
