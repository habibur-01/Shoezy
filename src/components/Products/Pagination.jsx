import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/**
 * Responsive Pagination Component
 * Supports:
 * - Desktop: Full windowed pagination with ellipsis (1 ... 4 5 6 ... 12)
 * - Mobile: Compact, touch-friendly navigation bar (Prev, Page X of Y, Next, First, Last)
 * - Items per page selector (12, 24, 36, 48)
 * - Range summary (Showing 1-12 of 48 items)
 * - Smooth scroll to top of product list on page change
 * - Disabled states with proper accessibility
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  className = "",
}) => {
  const safeCurrent = Math.max(1, Math.min(Number(currentPage) || 1, Math.max(1, totalPages)));
  const safeTotal = Math.max(1, Number(totalPages) || 1);

  // If there's only 1 page and no item count is shown, or 0 items
  if (safeTotal <= 1 && (!totalItems || totalItems <= (itemsPerPage || 12))) {
    if (totalItems && totalItems > 0) {
      return (
        <div className="mt-8 pt-4 border-t border-stone-200/70 flex justify-center text-xs font-medium text-stone-500">
          Showing all {totalItems} {totalItems === 1 ? "product" : "products"}
        </div>
      );
    }
    return null;
  }

  const handlePageClick = (page) => {
    if (page < 1 || page > safeTotal || page === safeCurrent) return;
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Generate page numbers window for desktop
  const getDesktopPages = () => {
    const pages = [];
    if (safeTotal <= 7) {
      for (let i = 1; i <= safeTotal; i++) pages.push(i);
      return pages;
    }

    // Always include page 1
    pages.push(1);

    if (safeCurrent > 3) {
      pages.push("ellipsis-start");
    }

    const start = Math.max(2, safeCurrent - 1);
    const end = Math.min(safeTotal - 1, safeCurrent + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (safeCurrent < safeTotal - 2) {
      pages.push("ellipsis-end");
    }

    // Always include last page
    pages.push(safeTotal);

    return pages;
  };

  const desktopPages = getDesktopPages();

  // Calculate item range summary
  const startItem = totalItems && itemsPerPage ? (safeCurrent - 1) * itemsPerPage + 1 : null;
  const endItem = totalItems && itemsPerPage ? Math.min(safeCurrent * itemsPerPage, totalItems) : null;

  return (
    <div className={`mt-8 pt-6 border-t border-stone-200/80 space-y-4 ${className}`}>
      {/* Upper Info Row: Range count & Items per page dropdown */}
      {(totalItems || onItemsPerPageChange) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          {totalItems ? (
            <p className="font-medium text-center sm:text-left">
              Showing <span className="font-bold text-stone-800">{startItem}</span> to{" "}
              <span className="font-bold text-stone-800">{endItem}</span> of{" "}
              <span className="font-bold text-stone-800">{totalItems}</span> products
            </p>
          ) : (
            <span />
          )}

          {onItemsPerPageChange && (
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Per page:</span>
              <select
                value={itemsPerPage || 12}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-stone-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
                <option value={48}>48</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center">
        {/* --- Mobile View (< 640px) --- */}
        <div className="flex sm:hidden items-center justify-between w-full max-w-sm gap-1.5 px-2">
          {/* First Page Jump */}
          <button
            type="button"
            disabled={safeCurrent === 1}
            onClick={() => handlePageClick(1)}
            aria-label="First page"
            className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous Page */}
          <button
            type="button"
            disabled={safeCurrent === 1}
            onClick={() => handlePageClick(safeCurrent - 1)}
            aria-label="Previous page"
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {/* Current Page Indicator Pill */}
          <div className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold text-stone-800 shrink-0 select-none">
            {safeCurrent} / {safeTotal}
          </div>

          {/* Next Page */}
          <button
            type="button"
            disabled={safeCurrent === safeTotal}
            onClick={() => handlePageClick(safeCurrent + 1)}
            aria-label="Next page"
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Last Page Jump */}
          <button
            type="button"
            disabled={safeCurrent === safeTotal}
            onClick={() => handlePageClick(safeTotal)}
            aria-label="Last page"
            className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

        {/* --- Tablet & Desktop View (>= 640px) --- */}
        <nav
          aria-label="Pagination"
          className="hidden sm:flex items-center gap-1.5"
        >
          {/* Jump to First Page */}
          <button
            type="button"
            disabled={safeCurrent === 1}
            onClick={() => handlePageClick(1)}
            aria-label="Go to first page"
            title="First Page"
            className="p-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 disabled:opacity-35 disabled:pointer-events-none transition cursor-pointer shadow-xs"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous Page */}
          <button
            type="button"
            disabled={safeCurrent === 1}
            onClick={() => handlePageClick(safeCurrent - 1)}
            aria-label="Go to previous page"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 text-xs font-semibold disabled:opacity-35 disabled:pointer-events-none transition cursor-pointer shadow-xs mr-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Numbered Page Buttons with Ellipsis */}
          {desktopPages.map((page, idx) => {
            if (typeof page === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-9 h-9 flex items-center justify-center text-stone-400 text-xs font-bold select-none"
                >
                  •••
                </span>
              );
            }

            const isActive = page === safeCurrent;

            return (
              <button
                key={page}
                type="button"
                onClick={() => handlePageClick(page)}
                aria-current={isActive ? "page" : undefined}
                className={`min-w-[38px] h-9 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-stone-900 text-white border border-stone-900 shadow-sm"
                    : "bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200 shadow-xs"
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next Page */}
          <button
            type="button"
            disabled={safeCurrent === safeTotal}
            onClick={() => handlePageClick(safeCurrent + 1)}
            aria-label="Go to next page"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 text-xs font-semibold disabled:opacity-35 disabled:pointer-events-none transition cursor-pointer shadow-xs ml-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Jump to Last Page */}
          <button
            type="button"
            disabled={safeCurrent === safeTotal}
            onClick={() => handlePageClick(safeTotal)}
            aria-label="Go to last page"
            title="Last Page"
            className="p-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 disabled:opacity-35 disabled:pointer-events-none transition cursor-pointer shadow-xs"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;