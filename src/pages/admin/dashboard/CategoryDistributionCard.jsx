import React from 'react';
import { PieChart, Layers, CheckCircle2, Truck, Clock, XCircle } from 'lucide-react';

export const CategoryDistributionCard = ({
  categoryData,
  orderStatusData,
  onNavigateCategories,
}) => {
  const categories = categoryData?.categories || [
    { name: 'Running Shoes', percentage: 40, ordersCount: 86, revenue: 14190, color: '#f97316' },
    { name: 'Sneakers', percentage: 31, ordersCount: 68, revenue: 14110, color: '#eab308' },
    { name: 'Accessories', percentage: 15, ordersCount: 33, revenue: 792, color: '#10b981' },
    { name: 'Basketball', percentage: 12, ordersCount: 26, revenue: 3380, color: '#8b5cf6' },
  ];

  const distribution = orderStatusData?.distribution || {
    completed: { count: 82, percentage: 48, label: 'Completed', color: '#10b981' },
    preparing: { count: 47, percentage: 27, label: 'In Transit', color: '#f59e0b' },
    pending: { count: 18, percentage: 10, label: 'Pending', color: '#f97316' },
    cancelled: { count: 25, percentage: 15, label: 'Cancelled', color: '#ef4444' },
  };

  return (
    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Category Sales & Order Pipeline
              </h3>
              <p className="text-xs text-zinc-500">
                {categoryData?.topCategory?.insight || 'Category demand and fulfillment distribution'}
              </p>
            </div>
          </div>
          {onNavigateCategories && (
            <button
              onClick={onNavigateCategories}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Taxonomy Settings
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Demand Bars */}
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-3">
              Volume by Product Line
            </span>
            <div className="space-y-3">
              {categories.slice(0, 4).map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {cat.name}
                    </span>
                    <span className="font-mono text-zinc-500 text-[11px]">
                      {cat.ordersCount} units • {cat.percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(8, cat.percentage))}%`,
                        backgroundColor: cat.color || '#6366f1',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fulfillment Pipeline Progress */}
          <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-700/60 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-3">
              Fulfillment Pipeline
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200/70 dark:border-zinc-700/60">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Delivered</span>
                </div>
                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {distribution.completed?.percentage || 48}%
                </div>
                <div className="text-[10px] text-zinc-400">
                  {distribution.completed?.count || 0} orders
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200/70 dark:border-zinc-700/60">
                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold mb-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>In Transit</span>
                </div>
                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {distribution.preparing?.percentage || 27}%
                </div>
                <div className="text-[10px] text-zinc-400">
                  {distribution.preparing?.count || 0} orders
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200/70 dark:border-zinc-700/60">
                <div className="flex items-center gap-1.5 text-xs text-orange-500 font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending</span>
                </div>
                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {distribution.pending?.percentage || 10}%
                </div>
                <div className="text-[10px] text-zinc-400">
                  {distribution.pending?.count || 0} orders
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200/70 dark:border-zinc-700/60">
                <div className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold mb-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancelled</span>
                </div>
                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {distribution.cancelled?.percentage || 15}%
                </div>
                <div className="text-[10px] text-zinc-400">
                  {distribution.cancelled?.count || 0} orders
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
