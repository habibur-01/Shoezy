import React from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Users,
} from 'lucide-react';

export const UsersTable = ({
  users = [],
  isLoading = false,
  onQuickRoleChange,
  onQuickStatusChange,
  onViewDetails,
  onEditUser,
  onDeleteUser,
  currentAdminEmail = '',
}) => {
  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'manager':
        return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'customer':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'suspended':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'pending':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
    }
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return 'Never';
    return new Date(dateVal).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-8 flex flex-col items-center justify-center gap-3 text-zinc-500">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono tracking-wider uppercase text-zinc-400">
            Querying User Clearance Directory...
          </span>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto mb-3">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          No user accounts found
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
          No records match your active search filter criteria. Try adjusting filters or provision a new user.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-zinc-50/80 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider select-none">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                User Identity
              </th>
              <th scope="col" className="px-4 py-3.5">
                Email & Contact
              </th>
              <th scope="col" className="px-4 py-3.5">
                Clearance Role (Rule)
              </th>
              <th scope="col" className="px-4 py-3.5">
                Account Status
              </th>
              <th scope="col" className="px-4 py-3.5 hidden md:table-cell">
                Created
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-normal">
            {users.map((u) => {
              const fullName = [u.firstName, u.lastName].filter(Boolean).join(' ') || 'Unnamed Account';
              const initials = fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'U';

              const isSelf = currentAdminEmail && u.email?.toLowerCase() === currentAdminEmail.toLowerCase();

              return (
                <tr
                  key={u._id}
                  className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors group"
                >
                  {/* User Identity */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={fullName}
                            className="w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                            {initials}
                          </div>
                        )}
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${
                            u.status === 'active'
                              ? 'bg-emerald-500'
                              : u.status === 'suspended'
                              ? 'bg-rose-500'
                              : 'bg-amber-400'
                          }`}
                          title={`Status: ${u.status}`}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {fullName}
                          </span>
                          {isSelf && (
                            <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400 font-mono block">
                          @{u.username || 'unregistered'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email & Contact */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
                        <span className="font-medium text-xs truncate max-w-[180px]">{u.email}</span>
                        {u.emailVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Email verified" />
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 block font-mono">
                        {u.phone || 'No phone record'}
                      </span>
                    </div>
                  </td>

                  {/* Interactive Clearance Role Dropdown */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="inline-flex items-center">
                      <select
                        aria-label="Update user role"
                        value={u.role || 'user'}
                        onChange={(e) => onQuickRoleChange(u._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase tracking-wider ${getRoleStyle(
                          u.role
                        )}`}
                      >
                        <option value="user" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                          USER
                        </option>
                        <option value="customer" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                          CUSTOMER
                        </option>
                        <option value="manager" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                          MANAGER
                        </option>
                        <option value="admin" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                          ADMIN
                        </option>
                      </select>
                    </div>
                  </td>

                  {/* Interactive Account Status Dropdown */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="inline-flex items-center">
                      <select
                        aria-label="Update user status"
                        value={u.status || 'active'}
                        onChange={(e) => onQuickStatusChange(u._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all capitalize ${getStatusStyle(
                          u.status
                        )}`}
                      >
                        <option value="active" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                          Active
                        </option>
                        <option value="inactive" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                          Inactive
                        </option>
                        <option value="suspended" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                          Suspended
                        </option>
                        <option value="pending" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                          Pending
                        </option>
                      </select>
                    </div>
                  </td>

                  {/* Joined Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell text-zinc-500 dark:text-zinc-400">
                    <div className="space-y-0.5">
                      <span className="block font-medium text-zinc-800 dark:text-zinc-200">
                        {formatDate(u.createdAt)}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Login: {formatDate(u.lastLoginAt)}
                      </span>
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="px-5 py-3.5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View Details */}
                      <button
                        onClick={() => onViewDetails(u)}
                        className="p-1.5 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        title="View Clearance Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit Profile */}
                      <button
                        onClick={() => onEditUser(u)}
                        className="p-1.5 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        title="Edit User Profile"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Account (protected if self) */}
                      {!isSelf && (
                        <button
                          onClick={() => onDeleteUser(u)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
