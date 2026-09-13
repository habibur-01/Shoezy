import React from 'react';
import { UserCheck } from 'lucide-react';














export const PersonaSwitcher = ({
  isOpen,
  onToggle,
  onClose,
  currentUser,
  currentRole,
  teamMembers,
  roles,
  onSelectPersona,
  onNavigateRoles
}) => {
  return (
    <div className="relative">
      <button
        id="btn-active-persona-dropdown"
        onClick={onToggle}
        className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 rounded-lg transition-colors text-left cursor-pointer"
        title="Switch User Persona to test Role-Based Permissions">
        
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-7 h-7 rounded-full object-cover border border-zinc-300" />
        
        <div className="hidden lg:block">
          <div className="text-xs font-semibold text-zinc-900 leading-tight">
            {currentUser.name}
          </div>
          <div className="text-[10px] text-indigo-700 font-medium leading-none mt-0.5">
            {currentRole.name}
          </div>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 bg-white font-mono rounded text-zinc-600 border border-zinc-200">
          Role: {currentRole.name}
        </span>
      </button>

      {isOpen &&
      <div
        id="persona-selector-modal"
        className="absolute right-0 mt-2 w-72 bg-white border border-zinc-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
        
          <div className="px-2 py-1.5 mb-2 border-b border-zinc-100">
            <div className="text-xs font-semibold text-zinc-900">Switch Active Persona</div>
            <div className="text-[11px] text-zinc-500">
              Select a staff member to simulate their exact RBAC role and capabilities.
            </div>
          </div>

          <div className="space-y-1">
            {teamMembers.map((member) => {
            const memberRole = roles.find((r) => r.id === member.roleId);
            const isSelected = member.id === currentUser.id;

            return (
              <button
                key={member.id}
                id={`select-persona-${member.id}`}
                onClick={() => {
                  onSelectPersona(member.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                isSelected ?
                'bg-indigo-50 border border-indigo-200 text-indigo-950' :
                'hover:bg-zinc-50 text-zinc-700'}`
                }>
                
                  <div className="flex items-center gap-2.5">
                    <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-7 h-7 rounded-full object-cover" />
                  
                    <div>
                      <div className="text-xs font-medium text-zinc-900">{member.name}</div>
                      <div className="text-[10px] text-zinc-500">{memberRole?.name}</div>
                    </div>
                  </div>
                  {isSelected ?
                <UserCheck className="w-4 h-4 text-indigo-600" /> :

                <span className="text-[10px] text-zinc-400 font-mono">
                      {memberRole?.permissions.length} perms
                    </span>
                }
                </button>);

          })}
          </div>

          <div className="mt-3 pt-2 border-t border-zinc-100">
            <button
            onClick={() => {
              onClose();
              onNavigateRoles();
            }}
            className="w-full text-center text-xs font-medium text-indigo-600 hover:text-indigo-700 py-1 cursor-pointer">
            
              Configure Role Permissions Matrix →
            </button>
          </div>
        </div>
      }
    </div>);

};