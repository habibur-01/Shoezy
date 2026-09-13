import React from 'react';
import { Users, ShieldCheck, UserCheck, UserX, AlertTriangle } from 'lucide-react';

export const UsersMetrics = ({ users = [] }) => {
  const total = users.length;
  const activeCount = users.filter((u) => u.status === 'active').length;
  const adminCount = users.filter((u) => u.role === 'admin' || u.role === 'manager').length;
  const customerCount = users.filter((u) => u.role === 'customer' || u.role === 'user').length;
  const inactiveOrSuspended = users.filter((u) => u.status === 'suspended' || u.status === 'inactive' || u.status === 'pending').length;

  const activePercent = total > 0 ? Math.round((activeCount / total) * 100) : 0;
  const adminPercent = total > 0 ? Math.round((adminCount / total) * 100) : 0;

  const metrics = [
    {
      id: 'total',
      title: 'Total Accounts',
      value: total,
      subtitle: `${customerCount} customers / shoppers`,
      icon: Users,
      gradient: 'from-blue-500/10 to-indigo-500/5',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200/50 dark:border-blue-900/30',
      badge: 'All Entities',
      badgeColor: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    },
    {
      id: 'active',
      title: 'Active Accounts',
      value: activeCount,
      subtitle: `${activePercent}% operational health`,
      icon: UserCheck,
      gradient: 'from-emerald-500/10 to-teal-500/5',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-200/50 dark:border-emerald-900/30',
      badge: `${activePercent}% Rate`,
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    },
    {
      id: 'admins',
      title: 'Executive Admins',
      value: adminCount,
      subtitle: `${adminPercent}% clearance footprint`,
      icon: ShieldCheck,
      gradient: 'from-purple-500/10 to-violet-500/5',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200/50 dark:border-purple-900/30',
      badge: 'Privileged',
      badgeColor: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    },
    {
      id: 'restricted',
      title: 'Suspended / Inactive',
      value: inactiveOrSuspended,
      subtitle: inactiveOrSuspended > 0 ? 'Requires administrative review' : 'No account anomalies',
      icon: inactiveOrSuspended > 0 ? AlertTriangle : UserX,
      gradient: inactiveOrSuspended > 0 ? 'from-amber-500/10 to-rose-500/5' : 'from-zinc-500/10 to-zinc-500/5',
      iconColor: inactiveOrSuspended > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-500',
      borderColor: inactiveOrSuspended > 0 ? 'border-amber-200/50 dark:border-amber-900/30' : 'border-zinc-200 dark:border-zinc-800',
      badge: inactiveOrSuspended > 0 ? 'Flagged' : 'Healthy',
      badgeColor: inactiveOrSuspended > 0 ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.id}
            className={`relative overflow-hidden rounded-xl bg-white dark:bg-zinc-900 border ${m.borderColor} p-4 sm:p-5 shadow-xs transition-all hover:shadow-md`}
          >
            {/* Ambient subtle background glow */}
            <div className={`absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-gradient-to-br ${m.gradient} blur-xl pointer-events-none`} />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {m.title}
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {m.value}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  {m.subtitle}
                </p>
              </div>

              <div className={`p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 ${m.iconColor} border border-zinc-100 dark:border-zinc-800`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${m.badgeColor}`}>
                {m.badge}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Live DB</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
