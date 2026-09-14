import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Highly Responsive Admin Pagination Component
 * Features:
 * - Mobile (< 640px): Compact, touch-friendly control bar with Page X of Y pill, Prev/Next, First/Last
 * - Desktop (>= 640px): Full numbered pagination with smart windowed ellipsis (1 ... 4 5 6 ... 20)
 * - Flexible Summary: Showing X to Y of Z items
 * - Items Per Page Selector (10, 20, 50, 100)
 * - Full Dark / Light Theme Support (matches Admin console theme)
 * - Accessible ARIA attributes and keyboard-friendly focus rings
 */
export const AdminPagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [10, 20, 50, 100],
  className = '',
}) => {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const safeCurrentPage = Math.max(1, Math.min(Number(currentPage) || 1, safeTotalPages));

  if (totalItems === 0) return null;

  const startItem = Math.min((safeCurrentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(safeCurrentPage * itemsPerPage, totalItems);

  const handlePageSelect = (page) => {
    if (page < 1 || page > safeTotalPages || page === safeCurrentPage) return;
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Generate page numbers with smart ellipsis for desktop window
  const getPageNumbers = () => {
    const pages = [];

    if (safeTotalPages <= 7) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      if (safeCurrentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(safeTotalPages);
      } else if (safeCurrentPage >= safeTotalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = safeTotalPages - 4; i <= safeTotalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(safeCurrentPage - 1);
        pages.push(safeCurrentPage);
        pages.push(safeCurrentPage + 1);
        pages.push('...');
        pages.push(safeTotalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      role="navigation"
      aria-label="Admin Products Pagination"
      className={`flex flex-col md:flex-row items-center justify-between gap-3.5 p-3.5 sm:p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs text-xs text-zinc-600 dark:text-zinc-400 ${className}`}
    >
      {/* Upper Info Row: Summary & Page Size selector */}
      <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-3">
        <div className="text-zinc-600 dark:text-zinc-400">
          Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">{startItem}</span> to{' '}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{endItem}</span> of{' '}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalItems}</span> products
        </div>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-2 pl-3 sm:border-l border-zinc-200 dark:border-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Show:</span>
            <select
              id="select-admin-items-per-page"
              value={itemsPerPage}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                if (onItemsPerPageChange) onItemsPerPageChange(newSize);
                if (onPageChange) onPageChange(1);
              }}
              className="px-2.5 py-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
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

      {/* --- Mobile View (< 640px) --- */}
      <div className="flex sm:hidden items-center justify-between w-full gap-1 pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
        {/* First Page */}
        <button
          type="button"
          onClick={() => handlePageSelect(1)}
          disabled={safeCurrentPage === 1}
          aria-label="First page"
          title="First page"
          className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => handlePageSelect(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          aria-label="Previous page"
          title="Previous page"
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        {/* Current Page Pill */}
        <div className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-zinc-100 shrink-0 select-none">
          Page {safeCurrentPage} of {safeTotalPages}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => handlePageSelect(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          aria-label="Next page"
          title="Next page"
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => handlePageSelect(safeTotalPages)}
          disabled={safeCurrentPage === safeTotalPages}
          aria-label="Last page"
          title="Last page"
          className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* --- Desktop & Tablet View (>= 640px) --- */}
      <div className="hidden sm:flex items-center gap-1.5">
        {/* First Page */}
        <button
          type="button"
          onClick={() => handlePageSelect(1)}
          disabled={safeCurrentPage === 1}
          aria-label="Jump to first page"
          title="First Page"
          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Prev Page */}
        <button
          type="button"
          onClick={() => handlePageSelect(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          aria-label="Previous page"
          title="Previous Page"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-zinc-400 dark:text-zinc-500 select-none font-mono text-xs"
                >
                  ...
                </span>
              );
            }

            const isActive = page === safeCurrentPage;
            return (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => handlePageSelect(page)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Page ${page}`}
                className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-xs font-bold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700/60 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => handlePageSelect(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          aria-label="Next page"
          title="Next Page"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => handlePageSelect(safeTotalPages)}
          disabled={safeCurrentPage === safeTotalPages}
          aria-label="Jump to last page"
          title="Last Page"
          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
};

export default AdminPagination;
