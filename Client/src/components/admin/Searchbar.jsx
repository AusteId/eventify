import { useState, useEffect, useRef } from 'react';
import { useDarkMode } from '../context/DarkModeContext.jsx';

const Searchbar = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const { isDarkMode } = useDarkMode();
  const inputRef = useRef(null);

  const lastSearchRef = useRef(searchTerm);

  useEffect(() => {
    if (searchTerm === lastSearchRef.current) return;

    const timer = setTimeout(() => {
      onSearch(searchTerm);
      lastSearchRef.current = searchTerm;
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search users by username..."
          value={searchTerm}
          onChange={handleChange}
          className={`w-full px-4 py-3 pl-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-300
            ${isDarkMode
            ? 'bg-slate-800 text-gray-200 border border-slate-700 focus:ring-[#f59e0b] placeholder-gray-400'
            : 'bg-white text-gray-800 border border-gray-200 focus:ring-[#DFA238] placeholder-gray-500'}`}
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
        <button
          type="submit"
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-md transition-all duration-300
            ${isDarkMode
            ? 'bg-slate-700 text-[#f59e0b] hover:bg-slate-600'
            : 'bg-[#F3E3C7] text-gray-800 hover:bg-[#DFA238]'}`}
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Searchbar;