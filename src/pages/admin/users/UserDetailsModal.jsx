import React from 'react';
import { X, Shield, Mail, Phone, Calendar, Clock, CheckCircle2, XCircle, Edit3, User } from 'lucide-react';

export const UserDetailsModal = ({
  isOpen,
  onClose,
  user,
  onEditClick,
}) => {
  if (!isOpen || !user) return null;

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'manager':
        return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'customer':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'suspended':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
    }
  };

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unnamed Account';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const formatDate = (dateVal) => {
    if (!dateVal) return 'Never';
    return new Date(dateVal).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                User Clearance Record
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                ID: {user._id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {fullName}
                </h4>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getRoleBadge(user.role)} uppercase tracking-wider`}>
                  {user.role}
                </span>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadge(user.status)} capitalize`}>
                  {user.status}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                @{user.username || 'no-username'}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs">
            <div className="space-y-1">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </span>
              <p className="font-medium text-zinc-900 dark:text-zinc-100 break-all">
                {user.email}
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                {user.emailVerified ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" /> Email Verified
                  </>
                ) : (
                  <span className="text-zinc-400">Verification Pending</span>
                )}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone Contact
              </span>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {user.phone || 'Not provided'}
              </p>
              <span className="text-[11px] text-zinc-400 font-medium">
                {user.phoneVerified ? 'Verified Phone' : 'Unverified Phone'}
              </span>
            </div>

            <div className="space-y-1 pt-2 border-t border-zinc-200/60 dark:border-zinc-700/50">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Registration Date
              </span>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatDate(user.createdAt)}
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-zinc-200/60 dark:border-zinc-700/50">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Last Activity Login
              </span>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatDate(user.lastLoginAt)}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEditClick(user);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
