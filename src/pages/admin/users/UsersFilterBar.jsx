import React from 'react';
import { Search, Filter, X, Shield, Activity, RotateCcw } from 'lucide-react';

export const UsersFilterBar = ({
  searchQuery = '',
  setSearchQuery,
  selectedRole = 'all',
  setSelectedRole,
  selectedStatus = 'all',
  setSelectedStatus,
  filteredCount = 0,
  totalCount = 0,
  onResetFilters,
}) => {
  const hasActiveFilters = searchQuery.trim() !== '' || selectedRole !== 'all' || selectedStatus !== 'all';

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            id="input-user-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, username, or phone..."
            className="w-full pl-9 pr-8 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1.5 rounded-lg text-xs">
            <Shield className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Role:</span>
            <select
              id="select-user-role-filter"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-transparent text-zinc-800 dark:text-zinc-200 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                All Roles
              </option>
              <option value="admin" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                Admin
              </option>
              <option value="manager" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                Manager
              </option>
              <option value="customer" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                Customer
              </option>
              <option value="user" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                User
              </option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1.5 rounded-lg text-xs">
            <Activity className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Status:</span>
            <select
              id="select-user-status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-zinc-800 dark:text-zinc-200 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                All Statuses
              </option>
              <option value="active" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                Active
              </option>
              <option value="inactive" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                Inactive
              </option>
              <option value="suspended" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                Suspended
              </option>
              <option value="pending" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                Pending
              </option>
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
              title="Reset all search filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results status indicator */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
        <span>
          Showing <strong className="text-zinc-800 dark:text-zinc-200">{filteredCount}</strong> of{' '}
          <strong>{totalCount}</strong> registered accounts
        </span>

        {hasActiveFilters && (
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/50">
            Filtered view active
          </span>
        )}
      </div>
    </div>
  );
};
