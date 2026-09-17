import React from 'react';

export const SidebarNavItem = ({
  id,
  label,
  icon: Icon,
  badge,
  badgeColor,
  isActive,
  onClick,
}) => {
  return (
    <button
      id={`nav-${id}`}
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
        isActive
          ? 'bg-zinc-800 text-white shadow-xs border border-zinc-700'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon
          className={`w-4 h-4 shrink-0 ${
            isActive ? 'text-indigo-400' : 'text-zinc-400'
          }`}
        />

        <span className="truncate">{label}</span>
      </div>

      {badge && (
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
            badgeColor || 'bg-zinc-800 text-zinc-300 border-zinc-700'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};