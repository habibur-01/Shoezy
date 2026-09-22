import React from 'react';
import { Sparkles, ShieldCheck, Activity, Layers, Lock, Cpu, Server } from 'lucide-react';

export const LoginBrandPanel = () => {
  return (
    <div className="hidden lg:flex lg:w-5/12 xl:w-[460px] 2xl:w-[500px] flex-col justify-between p-8 xl:p-12 bg-zinc-900 text-white relative overflow-hidden border-r border-zinc-800">
      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Brand Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-sm font-semibold">
            <Sparkles className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">CommerceHQ</span>
            <span className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Operations Cloud v3.4
            </span>
          </div>
        </div>

        <div className="mt-10">
          <h1 className="text-2xl xl:text-3xl font-bold tracking-tight text-white leading-tight">
            Enterprise E-Commerce Operations & Intelligence
          </h1>
          <p className="mt-3 text-xs xl:text-sm text-zinc-400 leading-relaxed max-w-sm">
            Unified command center for high-velocity merchants. Control real-time stock allocation, order fulfillment pipelines, and granular staff governance.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/40 border border-zinc-800">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-zinc-200">Real-Time Inventory Stream</h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Sub-second stock decrements with automated low-stock warnings and multi-warehouse sync.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/40 border border-zinc-800">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-zinc-200">Role-Based Access Control (RBAC)</h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Principle-of-least-privilege matrix across Super Admin, Store Manager, Support, and Analyst tiers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/40 border border-zinc-800">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-zinc-200">Cryptographic Audit Logging</h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Chronological immutable timeline of pricing alterations, refunds, and permission mutations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics & Security Badges at Bottom */}
      <div className="relative z-10 pt-8 mt-8 border-t border-zinc-800">
        <div className="grid grid-cols-3 gap-3 pb-6 border-b border-zinc-800/60">
          <div>
            <div className="text-base font-bold text-white font-mono">$482.9K</div>
            <div className="text-[10px] text-zinc-500">Monthly GMV</div>
          </div>
          <div>
            <div className="text-base font-bold text-emerald-400 font-mono">99.98%</div>
            <div className="text-[10px] text-zinc-500">Service SLA</div>
          </div>
          <div>
            <div className="text-base font-bold text-white font-mono">&lt; 120ms</div>
            <div className="text-[10px] text-zinc-500">Event Latency</div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-zinc-400" />
            256-Bit TLS Secured
          </span>
          <span className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-zinc-400" />
            SOC 2 Type II Certified
          </span>
        </div>
      </div>
    </div>
  );
};
