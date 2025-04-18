import { useMemo } from 'react';
import { useDarkMode } from './context/DarkModeContext.jsx';

const Pagination = ({ totalPages, currentPage, paginate }) => {
  const { isDarkMode } = useDarkMode();

  const paginationNumbers = useMemo(() => {
    const numbers = [];
    const maxVisible = 5;

    if (totalPages <= 1) {
      return [1];
    }

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      numbers.push(1);

      if (startPage - 1 >= 3) {
        numbers.push('...');
      } else if (startPage === 3) {
        numbers.push(2);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      numbers.push(i);
    }

    if (endPage < totalPages) {
      if (totalPages - endPage >= 3) {
        numbers.push('...');
      } else if (endPage === totalPages - 2) {
        numbers.push(totalPages - 1);
      }

      numbers.push(totalPages);
    }

    return numbers;
  }, [totalPages, currentPage]);

  const getNavButtonClass = (isDisabled) => {
    if (isDisabled) {
      return isDarkMode
        ? 'bg-slate-600 cursor-not-allowed text-gray-400'
        : 'opacity-50 bg-[#F3E3C7] cursor-not-allowed text-black';
    }
    
    return isDarkMode
      ? 'bg-slate-900 border border-[#f59e0b] text-[#f59e0b] cursor-pointer hover:bg-slate-800'
      : 'bg-white hover:bg-[#DFA238] cursor-pointer';
  };

  const getPageButtonClass = (page) => {
    if (page === '...') {
      return isDarkMode
        ? 'bg-slate-700 text-gray-400 cursor-default'
        : 'bg-[#f3f4f6] text-gray-400 cursor-default';
    }
    
    if (page === currentPage) {
      return isDarkMode
        ? 'bg-[#f59e0b] text-slate-900 font-bold cursor-default'
        : 'bg-[#DFA238] text-white cursor-default';
    }
    
    return isDarkMode
      ? 'bg-slate-800 text-gray-200 hover:bg-slate-700 hover:text-[#f59e0b] cursor-pointer'
      : 'bg-[#F3E3C7] text-black hover:bg-[#DFA238] cursor-pointer';
  };

  return (
    <div className={`flex justify-center mt-6 bg-transparent duration-750`}>
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-6 py-3 rounded-full mr-2 transition-all duration-300 transform hover:scale-105 shadow-md ${getNavButtonClass(currentPage === 1)}`}
      >
        &lt;&lt;
      </button>

      {paginationNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => page !== '...' && paginate(page)}
          disabled={page === '...' || page === currentPage}
          className={`px-4 py-2 transition-all duration-300 transform shadow-md rounded-md mx-1 ${getPageButtonClass(page)} ${page !== '...' && page !== currentPage ? 'hover:scale-105' : ''}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-6 py-3 rounded-full ml-2 transition-all duration-300 transform hover:scale-105 shadow-md ${getNavButtonClass(currentPage === totalPages)}`}
      >
        &gt;&gt;
      </button>
    </div>
  );
};

export default Pagination;