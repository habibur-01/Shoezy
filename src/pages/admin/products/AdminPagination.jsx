import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const AdminPagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [10, 20, 50, 100]
}) => {
  if (totalItems === 0) return null;

  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with smart ellipsis for smooth navigation
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-zinc-200 rounded-xl shadow-xs text-xs">
      {/* Left: Summary and Page Size selector */}
      <div className="flex flex-wrap items-center gap-3 text-zinc-600">
        <div>
          Showing <span className="font-semibold text-zinc-900">{startItem}</span> to{' '}
          <span className="font-semibold text-zinc-900">{endItem}</span> of{' '}
          <span className="font-semibold text-zinc-900">{totalItems}</span> products
        </div>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-zinc-200">
            <span className="text-zinc-500">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 cursor-pointer"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Pagination controls */}
      <div className="flex items-center gap-1">
        {/* First Page button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          title="First Page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Prev Page button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-zinc-400 select-none font-mono"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-100 border border-transparent hover:border-zinc-200'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          title="Last Page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
