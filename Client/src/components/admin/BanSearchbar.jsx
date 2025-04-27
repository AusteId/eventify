import { useState, useEffect, useRef } from 'react';
import { useDarkMode } from '../context/DarkModeContext.jsx';

const BanSearchbar = ({ onSearch, initialFilters = {} }) => {
  const { isDarkMode } = useDarkMode();
  const timerRef = useRef(null);

  const [filters, setFilters] = useState({
    username: initialFilters.username || '',
    userId: initialFilters.userId || '',
    adminName: initialFilters.adminName || '',
    adminId: initialFilters.adminId || '',
    active: initialFilters.active || '',
    startDateAfter: initialFilters.startDateAfter || '',
    startDateBefore: initialFilters.startDateBefore || '',
    endDateAfter: initialFilters.endDateAfter || '',
    endDateBefore: initialFilters.endDateBefore || '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const lastSearchRef = useRef(filters);


  useEffect(() => {
    const hasChanged = JSON.stringify(filters) !== JSON.stringify(lastSearchRef.current);

    if (!hasChanged) return;

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      onSearch(filters);
      lastSearchRef.current = { ...filters };
    }, 750);

    return () => clearTimeout(timerRef.current);
  }, [filters, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearTimeout(timerRef.current);
    onSearch(filters);
    lastSearchRef.current = { ...filters };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: checked ? true : '' }));
  };

  const resetFilters = () => {
    setFilters({
      username: '',
      userId: '',
      adminName: '',
      adminId: '',
      active: '',
      startDateAfter: '',
      startDateBefore: '',
      endDateAfter: '',
      endDateBefore: '',
    });
    onSearch({});
  };

  const baseInputClass = `px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-750
    ${isDarkMode
    ? 'bg-slate-800 text-gray-200 border border-slate-700 focus:ring-[#f59e0b] placeholder-gray-400'
    : 'bg-white text-gray-800 border border-gray-200 focus:ring-[#DFA238] placeholder-gray-500'}`;

  const buttonClass = `px-4 py-2 border rounded-md transition-all duration-750 cursor-pointer
    ${isDarkMode
    ? 'bg-slate-900 border-[#f59e0b] text-[#f59e0b] hover:bg-slate-600'
    : 'bg-[#F3E3C7] border-transparent text-gray-800 hover:bg-[#DFA238] shadow-sm shadow-gray-300'}`;

  return (
    <div className="relative w-full mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Basic search fields */}
          <div className="relative flex-grow">
            <input
              type="text"
              name="username"
              placeholder="Search by username"
              value={filters.username}
              onChange={handleInputChange}
              className={`w-full pl-10 ${baseInputClass}`}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className={buttonClass}>
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={buttonClass}
            >
              {showAdvanced ? 'Basic' : 'Advanced'}
            </button>
          </div>
        </div>

        {/* Advanced filters */}
        <div className={` grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all rounded-2xl duration-750  border p-5 ${isDarkMode ? "border-[#f59e0b] bg-slate-900" : "bg-white border-transparent shadow-sm shadow-gray-300"} ${showAdvanced ? 'max-h-[1000px] opacity-100' : 'max-h-0  opacity-0 border-none overflow-hidden'}`}>
          <div>
            <label className={`block mb-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              User ID
            </label>
            <input
              type="number"
              name="userId"
              value={filters.userId}
              onChange={handleInputChange}
              className={baseInputClass}
              placeholder="User ID"
            />
          </div>

          <div>
            <label className={`block mb-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Admin Name
            </label>
            <input
              type="text"
              name="adminName"
              value={filters.adminName}
              onChange={handleInputChange}
              className={baseInputClass}
              placeholder="Admin username"
            />
          </div>

          <div>
            <label className={`block mb-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Admin ID
            </label>
            <input
              type="number"
              name="adminId"
              value={filters.adminId}
              onChange={handleInputChange}
              className={baseInputClass}
              placeholder="Admin ID"
            />
          </div>

          <div>
            <label className={`block mb-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ban Status
            </label>
            <div className="flex items-center mt-2">
              <div className="relative inline-block">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={filters.active === true}
                  onChange={handleCheckboxChange}
                  className="sr-only"
                />
                <label
                  htmlFor="active"
                  className={`flex items-center cursor-pointer transition-all duration-750`}
                >
                  <div className={`relative w-5 h-5 mr-2 rounded border ${
                    isDarkMode
                      ? filters.active === true ? 'border-[#f59e0b] bg-slate-700' : 'border-gray-500 bg-slate-800'
                      : filters.active === true ? 'border-[#DFA238] bg-white' : 'border-gray-300 bg-white'
                  } transition-all duration-750`}>
                    {filters.active === true && (
                      <svg
                        className={`absolute inset-0 w-full h-full ${isDarkMode ? 'text-[#f59e0b]' : 'text-[#DFA238]'}`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Active Bans Only
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className={`block mb-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ban Start (From)
            </label>
            <input
              type="datetime-local"
              name="startDateAfter"
              value={filters.startDateAfter}
              onChange={handleInputChange}
              className={`${baseInputClass} cursor-pointer`}
            />
          </div>

          <div>
            <label className={`block mb-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ban Start (To)
            </label>
            <input
              type="datetime-local"
              name="startDateBefore"
              value={filters.startDateBefore}
              onChange={handleInputChange}
              className={`${baseInputClass} cursor-pointer`}
            />
          </div>

          <div>
            <label className={`block mb-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ban End (From)
            </label>
            <input
              type="datetime-local"
              name="endDateAfter"
              value={filters.endDateAfter}
              onChange={handleInputChange}
              className={`${baseInputClass} cursor-pointer`}
            />
          </div>

          <div>
            <label className={`block mb-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ban End (To)
            </label>
            <input
              type="datetime-local"
              name="endDateBefore"
              value={filters.endDateBefore}
              onChange={handleInputChange}
              className={`${baseInputClass} cursor-pointer`}
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={resetFilters}
              className={`${buttonClass}`}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BanSearchbar;