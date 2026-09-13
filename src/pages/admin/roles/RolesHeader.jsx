import React from 'react';
import { UserPlus, Plus } from 'lucide-react';






export const RolesHeader = ({
  onOpenInviteModal,
  onOpenCreateRoleModal
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          User Roles & Permissions Management
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Intuitive granular capability matrix, staff access tiers, and security boundaries
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          id="btn-open-invite-modal"
          onClick={onOpenInviteModal}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg shadow-2xs transition-colors cursor-pointer">
          
          <UserPlus className="w-3.5 h-3.5 text-zinc-500" />
          Invite Staff
        </button>
        <button
          id="btn-open-create-role-modal"
          onClick={onOpenCreateRoleModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition-colors cursor-pointer">
          
          <Plus className="w-4 h-4" />
          Create Custom Role
        </button>
      </div>
    </div>);

};