import React from 'react';
import { Info } from 'lucide-react';








export const RolesNavTabs = ({
  activeSubTab,
  setActiveSubTab,
  rolesCount,
  membersCount
}) => {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200">
      <div className="flex gap-4">
        <button
          id="subtab-matrix"
          onClick={() => setActiveSubTab('matrix')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
          activeSubTab === 'matrix' ?
          'border-zinc-900 text-zinc-900' :
          'border-transparent text-zinc-400 hover:text-zinc-600'}`
          }>
          
          Permissions Matrix Grid ({rolesCount} Roles)
        </button>
        <button
          id="subtab-members"
          onClick={() => setActiveSubTab('members')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
          activeSubTab === 'members' ?
          'border-zinc-900 text-zinc-900' :
          'border-transparent text-zinc-400 hover:text-zinc-600'}`
          }>
          
          Staff & Access Roster ({membersCount} Members)
        </button>
      </div>

      <div className="text-xs text-zinc-500 hidden sm:flex items-center gap-1 pb-2">
        <Info className="w-3.5 h-3.5 text-indigo-500" />
        Click any checkbox to modify permissions in real-time
      </div>
    </div>);

};