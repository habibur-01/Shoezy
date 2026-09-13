import React from 'react';
import { PERMISSION_DEFINITIONS } from '../../../data/mockData';









export const PermissionsMatrixGrid = ({
  roles,
  categories,
  onTogglePermission,
  onToggleCategoryForRole
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50 text-zinc-700 border-b border-zinc-200">
              <th className="py-3 px-4 w-72 sticky left-0 bg-zinc-50 z-10 font-semibold border-r border-zinc-200">
                Capability / Permission Key
              </th>
              {roles.map((role) =>
              <th
                key={role.id}
                className="py-3 px-4 text-center min-w-[120px] font-semibold border-r border-zinc-200 last:border-0">
                
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-zinc-900">{role.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono font-normal">
                      {role.permissions.length} active
                    </span>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {categories.map((cat) => {
              const catPerms = PERMISSION_DEFINITIONS.filter((p) => p.category === cat);

              return (
                <React.Fragment key={cat}>
                  {/* Category Header Row */}
                  <tr className="bg-zinc-100/75 text-zinc-800 font-semibold text-[11px]">
                    <td className="py-2 px-4 sticky left-0 bg-zinc-100/95 z-10 border-r border-zinc-200">
                      <span className="uppercase tracking-wider text-zinc-600">{cat}</span>
                    </td>
                    {roles.map((role) =>
                    <td
                      key={role.id}
                      className="py-1.5 px-4 text-center border-r border-zinc-200 last:border-0">
                      
                        {role.id !== 'super_admin' &&
                      <button
                        id={`btn-toggle-cat-${role.id}-${cat}`}
                        onClick={() => onToggleCategoryForRole(role.id, cat)}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium underline cursor-pointer"
                        title={`Toggle all ${cat} permissions for ${role.name}`}>
                        
                            Toggle All
                          </button>
                      }
                      </td>
                    )}
                  </tr>

                  {/* Permission rows */}
                  {catPerms.map((perm) =>
                  <tr key={perm.key} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-2.5 px-4 sticky left-0 bg-white z-10 border-r border-zinc-200">
                        <div className="font-medium text-zinc-900">{perm.label}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">{perm.key}</div>
                        <div className="text-[10px] text-zinc-500 line-clamp-1">
                          {perm.description}
                        </div>
                      </td>

                      {roles.map((role) => {
                      const isGranted = role.permissions.includes(perm.key);
                      const isSuperAdmin = role.id === 'super_admin';

                      return (
                        <td
                          key={role.id}
                          className="py-2.5 px-4 text-center border-r border-zinc-200 last:border-0 align-middle">
                          
                            <label className="inline-flex items-center justify-center cursor-pointer p-1">
                              <input
                              type="checkbox"
                              id={`perm-${role.id}-${perm.key.replace('.', '-')}`}
                              checked={isGranted}
                              disabled={isSuperAdmin}
                              onChange={() => onTogglePermission(role.id, perm.key)}
                              className={`w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 transition-colors ${
                              isSuperAdmin ?
                              'cursor-not-allowed opacity-80' :
                              'cursor-pointer'}`
                              } />
                            
                            </label>
                          </td>);

                    })}
                    </tr>
                  )}
                </React.Fragment>);

            })}
          </tbody>
        </table>
      </div>
    </div>);

};