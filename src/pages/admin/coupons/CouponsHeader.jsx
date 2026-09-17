import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

export const CouponsHeader = ({ onOpenGenerator, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    try {
      setIsRefreshing(true);
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Custom Discount Coupon Generation
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Architect custom promotional incentives, configure usage limits, and track redemption yield
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        {onRefresh && (
          <button
            type="button"
            id="btn-refresh-coupons"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
            title="Refresh coupons from server"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : 'text-zinc-500'}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        )}

        <button
          id="btn-open-coupon-generator"
          onClick={onOpenGenerator}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          Generate Custom Coupon
        </button>
      </div>
    </div>
  );
};