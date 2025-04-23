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

const UserCards = () => {
  const { authFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useDarkMode();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const fetchUsers = async (page = 0, term = '') => {
    setLoading(true);
    try {
      const response = await authFetch(
        `http://localhost:8080/api/admin/users?page=${page}&excludeAdmin=true${term ? `&searchTerm=${encodeURIComponent(term)}` : ''}`,
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

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
    fetchUsers(pageNumber - 1, searchTerm);
  };

  const handleSearch = term => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchUsers(0, term);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchUsers(0);
  }, []);

  const toggleDropdown = (e, userId) => {
    e.stopPropagation();
    setOpenDropdownId(prevId => prevId === userId ? null : userId);
  };

  return (
    <>
      <div className="px-6 pt-6 pb-2">
        <Searchbar onSearch={handleSearch} initialValue={searchTerm} />
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
                <Dropdown
                  isDropdownOpen={openDropdownId === user.id}
                  setIsDropdownOpen={(isOpen) => {
                    if (!isOpen) setOpenDropdownId(null);
                  }}
                  userId={user.id}
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
                    className="rounded-full w-32 h-32 object-cover border-4 border-white dark:border-slate-700"
                  />
                </div>

                <div
                  className={`p-5 flex-1 flex flex-col gap-3 duration-750 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <span
                      className={`text-sm ${isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'} font-medium`}
                    >
                      Username:
                    </span>
                    <span
                      className={`capitalize font-semibold duration-750 truncate max-w-full ${isDarkMode && 'text-gray-200'}`}
                    >
                      {user.username}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <span
                      className={`text-sm ${isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'} font-medium`}
                    >
                      Email:
                    </span>
                    <span
                      className={`font-semibold break-all duration-750 text-sm ${isDarkMode && 'text-gray-200'}`}
                    >
                      {user.email}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <span
                      className={`text-sm ${isDarkMode ? 'text-[#f59e0b]' : 'text-gray-500'} font-medium`}
                    >
                      City:
                    </span>
                    <span
                      className={`capitalize font-semibold duration-750 ${isDarkMode && 'text-gray-200'}`}
                    >
                      {user.city || 'N/A'}
                    </span>
                  </div>
                  <div className="relative flex justify-center pt-3">
                    <Button
                      type="button"
                      hoverColor={'hover:bg-slate-600 duration-750 '}
                      textColor={'text-white'}
                      size={'large'}
                      background={`bg-slate-900`}
                      border={`border ${isDarkMode ? 'border-[#f59e0b]' : 'border-transparent'}`}
                      onClick={(e) => toggleDropdown(e, user.id)}
                    >
                      Options
                    </Button>
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