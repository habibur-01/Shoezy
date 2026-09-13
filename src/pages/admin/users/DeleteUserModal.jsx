import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

export const DeleteUserModal = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen || !user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || user.email;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-rose-50/50 dark:bg-rose-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-rose-950 dark:text-rose-200">
                Confirm Account Deletion
              </h3>
              <p className="text-xs text-rose-700/80 dark:text-rose-300/70">
                This action is irreversible
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Are you sure you want to permanently delete the account for{' '}
            <strong className="text-zinc-900 dark:text-white font-semibold">
              {fullName}
            </strong>{' '}
            (<code className="px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono">{user.email}</code>)?
          </p>

          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-400 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Safety Notice:
            </p>
            <p className="text-[11px] text-rose-600/90 dark:text-rose-300/80">
              Active sessions will be immediately invalidated. System administrator accounts cannot be deleted if they are the sole administrator.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              id="btn-confirm-delete-user"
              onClick={() => onConfirm(user._id)}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleting ? 'Deleting User...' : 'Delete Account'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
