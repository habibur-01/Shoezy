import React from 'react';
import { UserPlus, X } from 'lucide-react';















export const InviteMemberModal = ({
  isOpen,
  onClose,
  inviteName,
  setInviteName,
  inviteEmail,
  setInviteEmail,
  inviteRoleId,
  setInviteRoleId,
  roles,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-semibold text-zinc-900">Invite Administrative Staff</h3>
              <p className="text-xs text-zinc-500">Provide staff name, email, and initial access role</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md cursor-pointer">
            
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">Full Name</label>
            <input
              id="form-invite-name"
              type="text"
              required
              placeholder="e.g. Jordan Miller"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
            
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Work Email</label>
            <input
              id="form-invite-email"
              type="email"
              required
              placeholder="jordan.miller@commercehq.io"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
            
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Initial Access Role</label>
            <select
              id="form-invite-role"
              value={inviteRoleId}
              onChange={(e) => setInviteRoleId(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-hidden cursor-pointer">
              
              {roles.map((r) =>
              <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              )}
            </select>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer">
              
              Cancel
            </button>
            <button
              id="btn-submit-invite-staff"
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition-colors cursor-pointer">
              
              Send Access Invite
            </button>
          </div>
        </form>
      </div>
    </div>);

};