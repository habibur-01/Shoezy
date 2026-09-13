import React from 'react';
import { Download } from 'lucide-react';





export const AuditHeader = ({ onExportLogs }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Audit Trails & Activity Logs
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Immutable chronological register of all administrative and security actions
        </p>
      </div>

      <button
        id="btn-export-audit-logs"
        onClick={onExportLogs}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg shadow-2xs transition-colors self-start sm:self-auto cursor-pointer">
        
        <Download className="w-3.5 h-3.5 text-zinc-500" />
        Export Audit Trail (CSV)
      </button>
    </div>);

};