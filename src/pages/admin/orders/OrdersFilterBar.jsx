import React from 'react';
import { Search, X, ArrowUpDown, Filter } from 'lucide-react';

export const OrdersFilterBar = ({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  orders = [],
  stats = null,
  sortBy = 'createdAt',
  setSortBy = () => {},
  pageSize = 10,
  setPageSize = () => {},
  onResetFilters = () => {},
}) => {
  const getTabCount = (tab) => {
    if (stats) {
      if (tab === 'all') return stats.total ?? orders.length;
      if (tab === 'pending') return stats.pending ?? 0;
      if (tab === 'processing') return stats.processing ?? 0;
      if (tab === 'shipped') return stats.shipped ?? 0;
      if (tab === 'delivered') return stats.delivered ?? 0;
      if (tab === 'cancelled') return stats.cancelled ?? 0;
    }
    return tab === 'all' ? orders.length : orders.filter((o) => o.status === tab).length;
  };

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'all';

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs space-y-3.5 transition-colors">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg text-xs overflow-x-auto scrollbar-none w-full lg:w-auto">
          {tabs.map((tab) => {
            const count = getTabCount(tab.id);
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                id={`order-tab-${tab.id}`}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md font-medium capitalize whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'bg-zinc-200/80 dark:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Controls: Search, Sort & Clear */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
            <input
              id="input-order-search"
              type="text"
              placeholder="Search ID, customer, tracking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-800 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:inline" />
            <select
              id="select-order-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="createdAt_desc">Date: Newest First</option>
              <option value="createdAt_asc">Date: Oldest First</option>
              <option value="total_desc">Amount: High to Low</option>
              <option value="total_asc">Amount: Low to High</option>
            </select>
          </div>

          {/* Page Size Selector */}
          <select
            id="select-page-size"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="py-1.5 px-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            title="Orders per page"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              id="btn-reset-order-filters"
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              title="Reset all search & status filters"
            >
              <Filter className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};