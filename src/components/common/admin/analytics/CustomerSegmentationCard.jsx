import React from 'react';









export const CustomerSegmentationCard = ({
  totalCustomers,
  vipCount,
  regularCount,
  newCount,
  atRiskCount
}) => {
  const safeTotal = Math.max(1, totalCustomers);
  const vipPercent = (vipCount / safeTotal * 100).toFixed(0);
  const regularPercent = (regularCount / safeTotal * 100).toFixed(0);
  const newPercent = (newCount / safeTotal * 100).toFixed(0);
  const atRiskPercent = (atRiskCount / safeTotal * 100).toFixed(0);

  return (
    <div className="lg:col-span-2 p-5 bg-white border border-zinc-200 rounded-xl shadow-xs">
      <div className="pb-3 mb-4 border-b border-zinc-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Customer Segment Breakdown</h3>
          <p className="text-xs text-zinc-500">Distribution by purchasing frequency and spend</p>
        </div>
        <div className="text-xs font-mono text-zinc-400">{totalCustomers} total profiles</div>
      </div>

      <div className="space-y-4">
        {/* VIP */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              VIP Customers (3+ Orders, &gt;$3,000 LTV)
            </span>
            <span className="font-mono text-zinc-700 font-medium">
              {vipCount} shoppers ({vipPercent}%)
            </span>
          </div>
          <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
            <div style={{ width: `${vipPercent}%` }} className="bg-amber-500 h-full rounded-full" />
          </div>
        </div>

        {/* Regular */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-indigo-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Regular Repeat Buyers
            </span>
            <span className="font-mono text-zinc-700 font-medium">
              {regularCount} shoppers ({regularPercent}%)
            </span>
          </div>
          <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${regularPercent}%` }}
              className="bg-indigo-500 h-full rounded-full" />
            
          </div>
        </div>

        {/* New */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              First-Time Buyers (Acquired &lt;30 days)
            </span>
            <span className="font-mono text-zinc-700 font-medium">
              {newCount} shoppers ({newPercent}%)
            </span>
          </div>
          <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${newPercent}%` }}
              className="bg-emerald-500 h-full rounded-full" />
            
          </div>
        </div>

        {/* At-Risk */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-rose-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              At-Risk (No orders &gt;60 days)
            </span>
            <span className="font-mono text-zinc-700 font-medium">
              {atRiskCount} shoppers ({atRiskPercent}%)
            </span>
          </div>
          <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${atRiskPercent}%` }}
              className="bg-rose-400 h-full rounded-full" />
            
          </div>
        </div>
      </div>
    </div>);

};