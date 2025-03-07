import React from 'react';

const Pagination = ({ totalPages, currentPage, paginate }) => {
  const getPaginationNumbers = () => {
    const pagination = [];
    
    pagination.push(1);

    if (currentPage <= 3) {
      for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
        pagination.push(i);
      }
      if (totalPages > 3) pagination.push('...');
    } else {
      pagination.push('...');
      
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        pagination.push(i);
      }
      
      if (currentPage < totalPages - 2) pagination.push('...');
    }

    if (currentPage >= totalPages - 2) {
      pagination.length = 0; 
      pagination.push(1);
      pagination.push('...');
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pagination.push(i);
      }
    }

    if (totalPages > 1 && !pagination.includes(totalPages)) {
      pagination.push(totalPages);
    }

    return pagination;
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-6 py-3 bg-white text-black rounded-full mr-2 transition-all duration-300 transform hover:scale-105 hover:bg-[#DFA238] disabled:opacity-50 shadow-md"
      >
        &lt;
      </button>

      {getPaginationNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => {
            if (page !== '...') {
              paginate(page);
            }
          }}
          className={`px-4 py-2 ${
            page === currentPage
              ? 'bg-[#DFA238] text-white'
              : 'bg-[#F3E3C7] text-black'
          } rounded-md mx-1 transition-all duration-300 transform hover:scale-105 hover:bg-[#DFA238] shadow-md`}
          disabled={page === '...' || page === currentPage}
        >
          {page === '...' ? '...' : page}
        </button>
      ))}
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-6 py-3 bg-white text-black rounded-full ml-2 transition-all duration-300 transform hover:scale-105 hover:bg-[#DFA238] disabled:opacity-50 shadow-md"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
