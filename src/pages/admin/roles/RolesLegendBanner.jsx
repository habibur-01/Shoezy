import React from 'react';






export const RolesLegendBanner = ({ roles }) => {
  return (
    <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
      <div className="text-xs font-semibold text-zinc-900 mb-2">Configured Role Architecture</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {roles.map((r) =>
        <div
          key={r.id}
          className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/70 text-xs">
          
            <div className="flex items-center justify-between font-semibold text-zinc-900">
              <span className="flex items-center gap-1.5">
                <span
                className={`w-2 h-2 rounded-full ${
                r.id === 'super_admin' ? 'bg-emerald-500' : 'bg-indigo-500'}`
                } />
              
                {r.name}
              </span>
              {r.isSystem ?
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-600 font-mono">
                  System
                </span> :

            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-mono">
                  Custom
                </span>
            }
            </div>
            <p className="text-zinc-500 text-[11px] mt-1 line-clamp-2">{r.description}</p>
            <div className="mt-2 text-[10px] font-mono text-indigo-700 font-medium">
              {r.permissions.length} capabilities granted
            </div>
          </div>
        )}
      </div>
    </div>);

};