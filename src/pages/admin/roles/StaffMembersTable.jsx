import React from 'react';










export const StaffMembersTable = ({
  teamMembers,
  roles,
  currentUserId,
  onAssignRole,
  onUpdateStatus
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Administrative Staff Accounts</h3>
          <p className="text-xs text-zinc-500">Reassign roles or suspend credentials</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Staff Member</th>
              <th className="py-3 px-4">Current Assigned Role</th>
              <th className="py-3 px-4">Capabilities Count</th>
              <th className="py-3 px-4">Account Status</th>
              <th className="py-3 px-4">Last Active</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {teamMembers.map((member) => {
              const assignedRole = roles.find((r) => r.id === member.roleId);
              const isCurrentSessionUser = member.id === currentUserId;

              return (
                <tr key={member.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover border border-zinc-200" />
                      
                      <div>
                        <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                          {member.name}
                          {isCurrentSessionUser &&
                          <span className="text-[10px] px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-normal">
                              You
                            </span>
                          }
                        </div>
                        <div className="text-[10px] text-zinc-400">{member.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Inline Role Reassigner */}
                  <td className="py-3 px-4">
                    <select
                      id={`select-role-for-${member.id}`}
                      value={member.roleId}
                      onChange={(e) => onAssignRole(member.id, e.target.value)}
                      className="px-2 py-1 text-xs border border-zinc-200 rounded-md bg-white font-medium text-zinc-800 focus:ring-2 focus:ring-zinc-900 cursor-pointer">
                      
                      {roles.map((r) =>
                      <option key={r.id} value={r.id}>
                          {r.name} {r.isSystem ? '(System)' : ''}
                        </option>
                      )}
                    </select>
                  </td>

                  <td className="py-3 px-4 font-mono text-zinc-600">
                    {assignedRole?.permissions.length} capabilities
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <select
                      id={`select-status-for-${member.id}`}
                      value={member.status}
                      onChange={(e) =>
                      onUpdateStatus(
                        member.id,
                        e.target.value
                      )
                      }
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase border cursor-pointer ${
                      member.status === 'active' ?
                      'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      member.status === 'away' ?
                      'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'}`
                      }>
                      
                      <option value="active">Active</option>
                      <option value="away">Away</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-zinc-500">{member.lastActive}</td>

                  <td className="py-3 px-4 text-right">
                    <span className="text-[11px] text-zinc-400 font-mono">{member.id}</span>
                  </td>
                </tr>);

            })}
          </tbody>
        </table>
      </div>
    </div>);

};