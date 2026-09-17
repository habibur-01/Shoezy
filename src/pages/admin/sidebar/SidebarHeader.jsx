import React from 'react';
import { ShoppingCart } from 'lucide-react';
export const SidebarHeader = ({ isCollapsed = false, onToggleCollapse, }) => {
    return (<div className="h-16 px-3.5 border-b border-slate-800/80 flex items-center justify-start shrink-0 overflow-hidden w-full relative">
      <div className={`flex items-center ${isCollapsed ? '' : 'gap-3 min-w-0 pr-10'}`}>
        <div onClick={isCollapsed ? onToggleCollapse : undefined} className={`w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shrink-0 ${isCollapsed ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`} title={isCollapsed ? 'Click to expand sidebar' : 'CommerceHQ'}>
          <ShoppingCart className="w-5 h-5 text-white"/>
        </div>
        <div className={`min-w-0 whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out ${isCollapsed ? 'opacity-0 max-w-0 -translate-x-3 pointer-events-none ml-0' : 'opacity-100 max-w-full translate-x-0 ml-3'}`}>
          <div className="text-sm font-bold text-white tracking-tight truncate">CommerceHQ</div>
          <div className="text-[11px] text-slate-400 truncate">Enterprise Admin Console</div>
        </div>
      </div>
    </div>);
};
