import React from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight, PackageSearch, RefreshCw } from 'lucide-react';
import { OrderTableRow } from './OrderTableRow';

export const OrdersTable = ({
  orders = [],
  isLoading = false,
  onOpenDetail,
  currentPage = 1,
  totalPages = 1,
  totalOrders = 0,
  pageSize = 10,
  onPageChange = () => {},
  onResetFilters = () => {},
}) => {
  // Skeleton Loader Row
  const renderSkeletonRow = (idx) => (
    <tr key={`skeleton-${idx}`} className="animate-pulse">
      <td className="py-3.5 px-4">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24 mb-1.5" />
        <div className="h-2.5 bg-zinc-100 dark:bg-zinc-850 rounded w-16" />
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
          <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-28" />
        </div>
        <div className="h-2.5 bg-zinc-100 dark:bg-zinc-850 rounded w-36 mt-1 pl-7" />
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-zinc-200 dark:bg-zinc-800 shrink-0" />
          <div className="space-y-1">
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-32" />
            <div className="h-2.5 bg-zinc-100 dark:bg-zinc-850 rounded w-20" />
          </div>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-16 mb-1" />
        <div className="h-2.5 bg-zinc-100 dark:bg-zinc-850 rounded w-12" />
      </td>
      <td className="py-3.5 px-4">
        <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full w-20" />
      </td>
      <td className="py-3.5 px-4">
        <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-24 mb-1" />
        <div className="h-2.5 bg-zinc-100 dark:bg-zinc-850 rounded w-16" />
      </td>
      <td className="py-3.5 px-4 text-right">
        <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded-md w-20 ml-auto" />
      </td>
    </tr>
  );

  const startItem = totalOrders === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalOrders);

  // Generate pagination page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let p = startPage; p <= endPage; p++) {
      pages.push(p);
    }
    return pages;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50/80 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider text-[10px] font-semibold">
            <tr>
              <th className="py-3 px-4">Order ID & Date</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Purchased Items</th>
              <th className="py-3 px-4">Financials</th>
              <th className="py-3 px-4">Fulfillment Status</th>
              <th className="py-3 px-4">Carrier Tracking</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-zinc-700 dark:text-zinc-300">
            {isLoading ? (
              // 6 skeleton placeholder rows while loading
              Array.from({ length: 6 }).map((_, i) => renderSkeletonRow(i))
            ) : orders.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={7} className="py-16 text-center text-zinc-400 dark:text-zinc-500">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 text-zinc-400 dark:text-zinc-500">
                      <PackageSearch className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                      No orders found
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                      No customer orders match your active search keyword or status filter.
                    </p>
                    <button
                      id="btn-clear-table-filter"
                      type="button"
                      onClick={onResetFilters}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Filters</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <OrderTableRow
                  key={order.id || order._id}
                  order={order}
                  onOpenDetail={onOpenDetail}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalOrders > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-zinc-50/50 dark:bg-zinc-800/30 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
          <div>
            Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">{startItem}</span> to{' '}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{endItem}</span> of{' '}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalOrders}</span> orders
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* Previous Page */}
              <button
                id="btn-prev-page"
                type="button"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Numbered Page Buttons */}
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next Page */}
              <button
                id="btn-next-page"
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};