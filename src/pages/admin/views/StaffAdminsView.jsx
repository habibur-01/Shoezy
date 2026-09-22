import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  MoreVertical,
  CheckCircle2,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const StaffAdminsView = () => {
  const { teamMembers, roles, assignMemberRole, updateMemberStatus, inviteTeamMember, hasPermission } =
    useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRoleId, setInviteRoleId] = useState('store_manager');

  const canManageUsers = hasPermission('users.manage');

  const filteredMembers = teamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    inviteTeamMember(inviteName.trim(), inviteEmail.trim(), inviteRoleId);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Staff & Administrator Directory</h1>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              Management
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage system administrators, grant granular operational scopes, and audit active staff accounts.
          </p>
        </div>

        {canManageUsers && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Invite Staff Member
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search staff name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Access Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filteredMembers.map((member) => {
                const memberRole = roles.find((r) => r.id === member.roleId);

                return (
                  <tr key={member.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-9 h-9 rounded-full object-cover border border-zinc-200"
                        />
                        <div>
                          <div className="font-semibold text-zinc-900">{member.name}</div>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {canManageUsers ? (
                        <select
                          value={member.roleId}
                          onChange={(e) => assignMemberRole(member.id, e.target.value)}
                          className="px-2.5 py-1 text-xs border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden font-medium text-zinc-800 cursor-pointer"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="font-medium text-zinc-800">{memberRole?.name}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          member.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : member.status === 'away'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-500">
                      {new Date(member.lastActive).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {canManageUsers ? (
                        <div className="inline-flex items-center gap-1">
                          {member.status === 'active' ? (
                            <button
                              onClick={() => updateMemberStatus(member.id, 'suspended')}
                              className="px-2.5 py-1 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors font-semibold"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => updateMemberStatus(member.id, 'active')}
                              className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors font-semibold"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-400 italic">No admin rights</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-zinc-900">Invite Team Administrator</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Send an onboarding credential invitation to a new staff member.
            </p>

            <form onSubmit={handleInvite} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="jordan.miller@commercehq.io"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Assign Security Role</label>
                <select
                  value={inviteRoleId}
                  onChange={(e) => setInviteRoleId(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-hidden"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
