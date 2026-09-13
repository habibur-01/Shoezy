import React from 'react';
import { ShieldAlert, X, ArrowRight, UserCheck } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const UnauthorizedModal = () => {
  const { unauthorizedNotice, dismissUnauthorizedNotice, teamMembers, setCurrentUserId } = useAdmin();

  if (!unauthorizedNotice) return null;

  const superAdminUser = teamMembers.find((m) => m.roleId === 'super_admin');

  const handleSwitchToSuperAdmin = () => {
    if (superAdminUser) {
      setCurrentUserId(superAdminUser.id);
      dismissUnauthorizedNotice();
    }
  };

  return (
    <div
      id="unauthorized-permission-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-white border border-rose-200 rounded-xl shadow-2xl p-6 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-rose-100 text-rose-700">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900">Access Restricted</h3>
              <p className="text-xs text-zinc-500">Role-Based Access Control (RBAC)</p>
            </div>
          </div>
          <button
            id="btn-close-unauthorized-modal"
            onClick={dismissUnauthorizedNotice}
            className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md transition-colors">
            
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-zinc-700 leading-relaxed">
            Your current assigned role{' '}
            <span className="font-semibold text-zinc-900 px-2 py-0.5 bg-zinc-100 rounded border border-zinc-200">
              {unauthorizedNotice.currentRoleName}
            </span>{' '}
            does not have permission to execute:
          </p>
          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-xs space-y-1.5 font-mono">
            <div className="text-zinc-500">Attempted Action:</div>
            <div className="text-zinc-900 font-medium font-sans">{unauthorizedNotice.actionName}</div>
            <div className="text-zinc-500 pt-1">Required Capability Key:</div>
            <div className="text-rose-700 font-semibold">{unauthorizedNotice.requiredPermission}</div>
          </div>
          <p className="text-xs text-zinc-500">
            This activity was logged to the security audit trail. To perform this action, request elevated permissions in the
            Roles & Permissions matrix or switch to a persona with appropriate clearance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-end">
          {superAdminUser &&
          <button
            id="btn-switch-super-admin"
            onClick={handleSwitchToSuperAdmin}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors">
            
              <UserCheck className="w-4 h-4" />
              Switch to Super Admin
            </button>
          }
          <button
            id="btn-dismiss-unauthorized"
            onClick={dismissUnauthorizedNotice}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors">
            
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>);

};