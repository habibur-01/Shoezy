import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';







export const getSeverityBadge = (sev) => {
  switch (sev) {
    case 'critical':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'warning':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'info':
      return 'bg-zinc-100 text-zinc-700 border-zinc-200';
  }
};

export const AuditLogRow = ({ log, onInspect }) => {
  return (
    <tr className="hover:bg-zinc-50/60 transition-colors">
      {/* Timestamp */}
      <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap text-zinc-600">
        <div>{new Date(log.timestamp).toLocaleDateString()}</div>
        <div className="text-[10px] text-zinc-400">
          {new Date(log.timestamp).toLocaleTimeString()}
        </div>
      </td>

      {/* Actor */}
      <td className="py-3 px-4 whitespace-nowrap">
        <div className="font-semibold text-zinc-900">{log.actorName}</div>
        <div className="text-[10px] text-zinc-500">{log.actorRole}</div>
      </td>

      {/* Action */}
      <td className="py-3 px-4">
        <span className="font-mono text-[11px] font-semibold text-zinc-900 px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-200">
          {log.action}
        </span>
      </td>

      {/* Category */}
      <td className="py-3 px-4 text-zinc-600 font-medium">{log.category}</td>

      {/* Severity */}
      <td className="py-3 px-4">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${getSeverityBadge(
            log.severity
          )}`}>
          
          {log.severity}
        </span>
      </td>

      {/* Details */}
      <td className="py-3 px-4 max-w-md">
        <p className="line-clamp-2 text-zinc-700 text-[11px] leading-relaxed">{log.details}</p>
        {log.diff &&
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
            <span className="text-zinc-400">Before: {String(log.diff.before)}</span>
            <ArrowRight className="w-2.5 h-2.5" />
            <span className="text-zinc-900 font-semibold">After: {String(log.diff.after)}</span>
          </div>
        }
      </td>

      {/* Action */}
      <td className="py-3 px-4 text-right">
        <button
          id={`btn-view-log-${log.id}`}
          onClick={() => onInspect(log)}
          className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
          title="View log payload details">
          
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>);

};