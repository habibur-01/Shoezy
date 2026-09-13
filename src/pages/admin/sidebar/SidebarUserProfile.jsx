import React from 'react';








export const SidebarUserProfile = ({
  currentUser,
  currentRole,
  onNavigateRoles
}) => {
  return (
    <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover border border-zinc-700" />
          
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-900" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
          <p className="text-[11px] text-zinc-400 truncate">{currentRole.name}</p>
        </div>
      </div>
      <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Active Session
        </span>
        <button
          onClick={onNavigateRoles}
          className="hover:text-white transition-colors text-[10px] text-indigo-400 cursor-pointer">
          
          Role Settings
        </button>
      </div>
    </div>);

};