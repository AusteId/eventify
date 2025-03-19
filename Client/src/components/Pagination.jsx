import React from 'react';

const Pagination = ({ totalPages, currentPage, paginate }) => {
  // Handle invalid inputs
  if (totalPages < 1 || currentPage < 1 || currentPage > totalPages) {
    return null;
  }

  const getPaginationNumbers = () => {
    const pagination = [];

    // Single page case
    if (totalPages === 1) {
      pagination.push(currentPage);
      return pagination;
    }

    // Maximum number of visible pages (excluding ellipses and first/last)
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2) + 1;

    // Always include first page
    pagination.push(1);

    // Determine the range of pages to show
    let start = Math.max(2, currentPage - halfVisible);
    let end = Math.min(totalPages - 1, currentPage + halfVisible);

    // Adjust if near the start or end
    if (currentPage <= halfVisible + 1) {
      end = Math.min(totalPages - 1, maxVisible - 1);
    } else if (currentPage >= totalPages - halfVisible) {
      start = Math.max(2, totalPages - maxVisible + 2);
    }

    // Add ellipsis if needed
    if (start > 2) {
      pagination.push('...');
    }

    // Add the range of pages

    // check if total pages fit
    for (let i = start; i <= end; i++) {
      pagination.push(i);
    }

    // Add ellipsis if needed before the last page
    if (end < totalPages - 1) {
      pagination.push('...');
    }

    // Always include the last page if different from the range
    if (totalPages > 1 && pagination[pagination.length - 1] !== totalPages) {
      pagination.push(totalPages);
    }

    return pagination;
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-6 py-3 bg-white text-black rounded-full mr-2 transition-all duration-300 transform hover:scale-105 ${currentPage === 1 ? 'opacity-50 bg-[#F3E3C7]' : 'hover:bg-[#DFA238]'} shadow-md`}
      >
        &lt;&lt;
      </button>

      {getPaginationNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => {
            if (page !== '...' && page !== currentPage) {
              paginate(page);
            }
          }}
          className={`px-4 py-2 ${
            page === currentPage
              ? 'bg-[#DFA238] text-white'
              : 'bg-[#F3E3C7] text-black'
          } rounded-md mx-1 transition-all duration-300 transform hover:scale-105 ${page === '...' ? "bg-[#F3E3C7]": "hover:bg-[#DFA238]"}  shadow-md ${
            page === '...' || page === currentPage ? 'cursor-default' : ''
          }`}
          disabled={page === '...' || page === currentPage}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-6 py-3 bg-white text-black rounded-full ml-2 transition-all duration-300 transform hover:scale-105 ${currentPage === totalPages ? 'opacity-50 bg-[#F3E3C7]' : 'hover:bg-[#DFA238]'} shadow-md`}
      >
        &gt;&gt;
      </button>
    </div>
  );
};

export default Pagination;