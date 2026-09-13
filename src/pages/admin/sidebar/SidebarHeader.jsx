import React from 'react';
import { Sparkles } from 'lucide-react';

export const SidebarHeader = () => {
  return (
    <div className="p-5 border-b border-zinc-800 flex items-center gap-3 shrink-0">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white shadow-sm font-semibold shrink-0">
        <Sparkles className="w-5 h-5 text-indigo-200" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-bold text-white tracking-tight truncate">CommerceHQ</div>
        <div className="text-[11px] text-zinc-400 truncate">Enterprise Admin Console</div>
      </div>
    </div>);

};