import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { PERMISSION_DEFINITIONS } from '../../../data/mockData';

export const PermissionsMatrixGrid = ({
  roles,
  categories,
  canManagePermissions,
  onTogglePermission,
  onToggleCategoryForRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDefinitions = useMemo(() => {
    if (!searchTerm.trim()) return PERMISSION_DEFINITIONS;
    const term = searchTerm.toLowerCase().trim();
    return PERMISSION_DEFINITIONS.filter(
      (p) =>
        p.label.toLowerCase().includes(term) ||
        p.key.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const activeCategories = useMemo(() => {
    return categories.filter((cat) =>
      filteredDefinitions.some((p) => p.category === cat)
    );
  }, [categories, filteredDefinitions]);

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      {/* Top Search & Filter Bar */}
      <div className="p-3 bg-zinc-50 border-b border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-800">
            Navigation Routes & Capabilities Matrix
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            {filteredDefinitions.length} permissions
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-filter-permissions"
            type="text"
            placeholder="Search permissions or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50 text-zinc-700 border-b border-zinc-200">
              <th className="py-3 px-4 w-72 sticky left-0 bg-zinc-50 z-10 font-semibold border-r border-zinc-200">
                Admin Nav Route / Capability Key
              </th>
              {roles.map((role) => (
                <th
                  key={role.id}
                  className="py-3 px-4 text-center min-w-[130px] font-semibold border-r border-zinc-200 last:border-0"
                >
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-zinc-900">{role.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono font-normal">
                      {role.permissions.length} active
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {activeCategories.map((cat) => {
              const catPerms = filteredDefinitions.filter((p) => p.category === cat);

              return (
                <React.Fragment key={cat}>
                  {/* Category Header Row */}
                  <tr className="bg-zinc-100/75 text-zinc-800 font-semibold text-[11px]">
                    <td className="py-2.5 px-4 sticky left-0 bg-zinc-100/95 z-10 border-r border-zinc-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="uppercase tracking-wider text-zinc-700 font-bold">{cat}</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-zinc-200 text-zinc-600">
                          {catPerms.length}
                        </span>
                      </div>
                    </td>
                    {roles.map((role) => (
                      <td
                        key={role.id}
                        className="py-1.5 px-4 text-center border-r border-zinc-200 last:border-0"
                      >
                        {role.id !== 'super_admin' && canManagePermissions ? (
                          <button
                            id={`btn-toggle-cat-${role.id}-${cat.replace(/[^a-zA-Z0-9]/g, '-')}`}
                            onClick={() => onToggleCategoryForRole(role.id, cat)}
                            className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium hover:underline cursor-pointer"
                            title={`Toggle all ${cat} permissions for ${role.name}`}
                          >
                            Toggle All
                          </button>
                        ) : (
                          <span className="text-[10px] text-zinc-400 font-mono">Full Access</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Permission rows */}
                  {catPerms.map((perm) => (
                    <tr key={perm.key} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-2.5 px-4 sticky left-0 bg-white z-10 border-r border-zinc-200">
                        <div className="font-medium text-zinc-900">{perm.label}</div>
                        <div className="text-[10px] text-indigo-600 font-mono">{perm.key}</div>
                        <div className="text-[10px] text-zinc-500 line-clamp-1">{perm.description}</div>
                      </td>

                      {roles.map((role) => {
                        const isGranted = role.permissions.includes(perm.key);
                        const isSuperAdmin = role.id === 'super_admin';

                        return (
                          <td
                            key={role.id}
                            className="py-2.5 px-4 text-center border-r border-zinc-200 last:border-0 align-middle"
                          >
                            <label className="inline-flex items-center justify-center cursor-pointer p-1">
                              <input
                                type="checkbox"
                                id={`perm-${role.id}-${perm.key.replace('.', '-')}`}
                                checked={isGranted}
                                disabled={isSuperAdmin || !canManagePermissions}
                                onChange={() => onTogglePermission(role.id, perm.key)}
                                className={`w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 transition-colors ${
                                  isSuperAdmin || !canManagePermissions ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                                }`}
                              />
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
