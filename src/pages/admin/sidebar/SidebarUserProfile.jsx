import React from 'react';
import { LogOut } from 'lucide-react';

export const SidebarUserProfile = ({
  currentUser,
  currentRole,
  isCollapsed = false,
  onNavigateRoles,
  onLogout,
}) => {
  return (
    <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 shrink-0 overflow-hidden w-full">
      <div className="flex items-center min-w-0">
        {/* User Avatar */}
        <div
          className="relative shrink-0 cursor-pointer"
          onClick={isCollapsed ? onLogout : undefined}
          title={
            isCollapsed
              ? `${currentUser.name} (${currentRole.name}) - Click to sign out`
              : undefined
          }
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-700 hover:border-indigo-500 transition-colors shrink-0"
          />

          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
        </div>

        {/* User Info */}
        <div
          className={`whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out ${
            isCollapsed
              ? 'opacity-0 max-w-0 -translate-x-3 pointer-events-none ml-0'
              : 'opacity-100 max-w-full translate-x-0 flex-1 min-w-0 ml-3'
          }`}
        >
          <p className="text-xs font-semibold text-white truncate">
            {currentUser.name}
          </p>

          <p className="text-[11px] text-slate-400 truncate">
            {currentRole.name}
          </p>
        </div>

        {/* Logout Button */}
        <button
          id="btn-sidebar-signout"
          onClick={onLogout}
          className={`p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all duration-300 cursor-pointer ${
            isCollapsed
              ? 'opacity-0 max-w-0 overflow-hidden pointer-events-none p-0'
              : 'opacity-100 shrink-0'
          }`}
          title="Sign out of CommerceHQ"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Active Session strip */}
      <div
        className={`mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out ${
          isCollapsed
            ? 'h-0 mt-0 pt-0 opacity-0 pointer-events-none border-transparent'
            : 'h-auto opacity-100'
        }`}
      >
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active Session
        </span>

        <button
          onClick={onNavigateRoles}
          className="hover:text-white transition-colors text-[10px] font-medium text-indigo-400 cursor-pointer"
        >
          Role Settings
        </button>
      </div>
    </div>
  );
};