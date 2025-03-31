import React, { useMemo } from 'react';

const Pagination = ({ totalPages, currentPage, paginate }) => {

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

  return (
    <div className="flex justify-center mt-6 bg-transparent">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-6 py-3 bg-white text-black rounded-full mr-2 transition-all duration-300 transform hover:scale-105 ${currentPage === 1 ? 'opacity-50 bg-[#F3E3C7] cursor-not-allowed' : 'hover:bg-[#DFA238]'} shadow-md`}
      >
        &lt;&lt;
      </button>

      {paginationNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => page !== '...' && paginate(page)}
          disabled={page === '...' || page === currentPage}
          className={`px-4 py-2 transition-all duration-300 transform shadow-md ${page === '...'
              ? 'bg-[#f3f4f6] text-gray-400 cursor-default'
              : page === currentPage
                ? 'bg-[#DFA238] text-white cursor-default'
                : 'bg-[#F3E3C7] text-black hover:bg-[#DFA238] hover:scale-105'
            } rounded-md mx-1`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-6 py-3 bg-white text-black rounded-full ml-2 transition-all duration-300 transform hover:scale-105 ${currentPage === totalPages ? 'opacity-50 bg-[#F3E3C7] cursor-not-allowed' : 'hover:bg-[#DFA238]'} shadow-md`}
      >
        &gt;&gt;
      </button>
    </div>
  );
};

export default Pagination;