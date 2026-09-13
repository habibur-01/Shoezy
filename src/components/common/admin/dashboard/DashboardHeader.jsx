import React from 'react';
import { PlusCircle, TicketPercent, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export const DashboardHeader = ({
  currentRole,
  openNewProductModal,
  openNewCouponModal,
  onNavigateAudit,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
      <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Live HQ Console
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Role: <strong className="text-white">{currentRole?.name || 'Super Admin'}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Shoezy Commerce Operations
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Real-time fulfillment metrics, inventory velocity, automated coupon campaigns, and RBAC governance.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-dash-add-product"
            onClick={openNewProductModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          <button
            id="btn-dash-create-coupon"
            onClick={openNewCouponModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-600 transition-all cursor-pointer"
          >
            <TicketPercent className="w-4 h-4 text-emerald-400" />
            <span>New Coupon</span>
          </button>

          <button
            id="btn-dash-view-audit"
            onClick={onNavigateAudit}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-600 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>
    </div>
  );
};
