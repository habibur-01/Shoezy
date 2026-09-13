import React from 'react';
import { Shield, X } from 'lucide-react';
import { PERMISSION_DEFINITIONS } from '../../data/mockData';














export const CreateRoleModal = ({
  isOpen,
  onClose,
  newRoleName,
  setNewRoleName,
  newRoleDesc,
  setNewRoleDesc,
  newRolePermissions,
  setNewRolePermissions,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[92vh]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-semibold text-zinc-900">Define Custom Access Role</h3>
              <p className="text-xs text-zinc-500">
                Formulate specialized permissions for operational teams
              </p>
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
            <label className="block font-medium text-zinc-700 mb-1">Role Title</label>
            <input
              id="form-role-name"
              type="text"
              required
              placeholder="e.g. Catalog Specialist, Junior Support"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
            
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Role Description</label>
            <input
              id="form-role-desc"
              type="text"
              placeholder="Brief description of responsibilities..."
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
            
          </div>

          {/* Initial permissions checklist */}
          <div>
            <label className="block font-medium text-zinc-700 mb-2">
              Initial Granted Capabilities
            </label>
            <div className="p-3 border border-zinc-200 rounded-lg max-h-56 overflow-y-auto space-y-2 bg-zinc-50/50">
              {PERMISSION_DEFINITIONS.map((perm) => {
                const isChecked = newRolePermissions.includes(perm.key);
                return (
                  <label
                    key={perm.key}
                    className="flex items-start gap-2.5 p-1.5 hover:bg-white rounded cursor-pointer transition-colors">
                    
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewRolePermissions((prev) => [...prev, perm.key]);
                        } else {
                          setNewRolePermissions((prev) => prev.filter((k) => k !== perm.key));
                        }
                      }}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                    
                    <div>
                      <div className="font-semibold text-zinc-900">{perm.label}</div>
                      <div className="text-[10px] text-zinc-500">{perm.description}</div>
                    </div>
                  </label>);

              })}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer">
              
              Cancel
            </button>
            <button
              id="btn-submit-new-role"
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition-colors cursor-pointer">
              
              Create Custom Role
            </button>
          </div>
        </form>
      </div>
    </div>);

};