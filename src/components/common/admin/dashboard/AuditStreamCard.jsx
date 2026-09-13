import React from 'react';
import { Activity, ShieldCheck, ArrowRight, User } from 'lucide-react';

export const AuditStreamCard = ({
  auditLogs = [],
  onNavigateAudit,
}) => {
  const recentLogs = auditLogs.slice(0, 4);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Security & Audit Trail
              </h3>
              <p className="text-xs text-zinc-500">Live operational events</p>
            </div>
          </div>

          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="space-y-3.5">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <img
                src={log.actor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={log.actor?.name}
                className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-zinc-200 dark:border-zinc-700"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {log.actor?.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                    {log.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-0.5 line-clamp-2">
                  {log.details || log.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        id="btn-audit-view-all"
        onClick={onNavigateAudit}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
      >
        <span>Inspect All Audit Logs</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
