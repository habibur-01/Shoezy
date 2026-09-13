import React from 'react';
import { FileClock } from 'lucide-react';

import { AuditLogRow } from './AuditLogRow';






export const AuditLogsTable = ({ logs, onInspect }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50/75 text-zinc-500 border-b border-zinc-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Staff Member</th>
              <th className="py-3 px-4">Action Identifier</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Details & Payload</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {logs.length === 0 ?
            <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-400">
                  <FileClock className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                  No audit logs match your search filters.
                </td>
              </tr> :

            logs.map((log) =>
            <AuditLogRow key={log.id} log={log} onInspect={onInspect} />
            )
            }
          </tbody>
        </table>
      </div>
    </div>);

};