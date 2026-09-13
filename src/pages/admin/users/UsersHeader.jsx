import React from 'react';
import { UserPlus, RefreshCw, Shield, Users } from 'lucide-react';

export const UsersHeader = ({
  totalUsers = 0,
  onOpenCreateModal,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                User & Role Management
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                {totalUsers} Accounts
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Inspect user directories, reassign access clearance roles, and manage account statuses.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        <button
          id="btn-refresh-users"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh user list from database"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-500' : 'text-zinc-500'}`} />
          <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
        </button>

        <button
          id="btn-create-user-modal"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer font-medium tracking-wide"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New User</span>
        </button>
      </div>
    </div>
  );
};
