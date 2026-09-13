import React from 'react';
import { FileClock, X } from 'lucide-react';







export const AuditDetailModal = ({ log, onClose }) => {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-xl shadow-2xl p-6">
        <div className="flex items-start justify-between pb-3 mb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <FileClock className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-semibold text-zinc-900">Audit Record Detail</h3>
              <p className="text-xs text-zinc-500 font-mono">{log.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md cursor-pointer">
            
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-50 rounded-lg border border-zinc-100 font-mono">
            <div>
              <span className="text-zinc-400 block text-[10px]">TIMESTAMP</span>
              <span className="text-zinc-900 font-medium">{log.timestamp}</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px]">SEVERITY</span>
              <span className="font-semibold uppercase text-zinc-900">{log.severity}</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px]">ACTOR</span>
              <span className="text-zinc-900 font-medium">
                {log.actorName} ({log.actorRole})
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px]">CATEGORY</span>
              <span className="text-zinc-900 font-medium">{log.category}</span>
            </div>
          </div>

          <div>
            <span className="font-medium text-zinc-700 block mb-1">Action Description</span>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 leading-relaxed font-sans">
              {log.details}
            </div>
          </div>

          {log.diff &&
          <div>
              <span className="font-medium text-zinc-700 block mb-1">State Mutation Diff</span>
              <div className="p-3 bg-zinc-900 text-zinc-100 rounded-lg font-mono text-[11px] space-y-1">
                <div className="text-rose-400">- Before: {JSON.stringify(log.diff.before)}</div>
                <div className="text-emerald-400">+ After: {JSON.stringify(log.diff.after)}</div>
              </div>
            </div>
          }
        </div>

        <div className="mt-5 pt-3 border-t border-zinc-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition-colors cursor-pointer">
            
            Close Audit Record
          </button>
        </div>
      </div>
    </div>);

};