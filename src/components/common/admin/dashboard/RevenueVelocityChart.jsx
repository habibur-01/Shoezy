import React from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

export const RevenueVelocityChart = ({
  chartRange,
  setChartRange,
  chartData = [],
  maxRevenue = 1000,
}) => {
  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalOrders = chartData.reduce((acc, curr) => acc + curr.orders, 0);

  return (
    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Revenue & Fulfillment Velocity
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              Live Feed
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Gross checkout revenue and volume over selected time window
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
          {['7D', '30D', '90D'].map((range) => (
            <button
              key={range}
              id={`btn-range-${range.toLowerCase()}`}
              onClick={() => setChartRange(range)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                chartRange === range
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Summary pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/80 dark:border-zinc-700/60">
        <div>
          <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
            Window Revenue
          </div>
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 font-mono">
            ${totalRevenue.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
            Completed Orders
          </div>
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 font-mono">
            {totalOrders}
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
            Avg Basket Value
          </div>
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 font-mono">
            ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="h-48 sm:h-56 flex items-end gap-2 sm:gap-4 pt-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        {chartData.map((item, index) => {
          const heightPercent = maxRevenue > 0 ? Math.max(12, Math.round((item.revenue / maxRevenue) * 100)) : 10;
          return (
            <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-zinc-900 text-white text-[10px] rounded-lg py-1 px-2 font-mono whitespace-nowrap shadow-lg z-20">
                <div>${item.revenue}</div>
                <div className="text-zinc-400">{item.orders} orders</div>
              </div>

              {/* Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-300 transition-all duration-300 shadow-xs"
              />

              {/* Label */}
              <div className="mt-2 text-[10px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
