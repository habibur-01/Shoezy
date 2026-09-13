import React from 'react';








export const CustomersLeaderboard = ({
  customers,
  selectedTier,
  setSelectedTier
}) => {
  return (
    <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-zinc-100">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">
            Top Customer Accounts Leaderboard
          </h3>
          <p className="text-xs text-zinc-500">Ranked by total historical spend</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg text-xs">
          {['all', 'vip', 'regular', 'new', 'at-risk'].map((tier) =>
          <button
            key={tier}
            id={`tier-filter-${tier}`}
            onClick={() => setSelectedTier(tier)}
            className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors cursor-pointer ${
            selectedTier === tier ?
            'bg-white text-zinc-900 shadow-xs' :
            'text-zinc-500 hover:text-zinc-900'}`
            }>
            
              {tier}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50/75 text-zinc-500 border-b border-zinc-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Customer Name & Contact</th>
              <th className="py-3 px-4">Cohort Tier</th>
              <th className="py-3 px-4">Total Orders</th>
              <th className="py-3 px-4">Lifetime Spend</th>
              <th className="py-3 px-4">Last Order</th>
              <th className="py-3 px-4">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {customers.map((cust) =>
            <tr key={cust.id} className="hover:bg-zinc-50/60 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-zinc-900">{cust.name}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">{cust.email}</div>
                </td>
                <td className="py-3 px-4">
                  <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  cust.tier === 'VIP' ?
                  'bg-amber-50 text-amber-800 border-amber-200' :
                  cust.tier === 'Regular' ?
                  'bg-indigo-50 text-indigo-700 border-indigo-200' :
                  cust.tier === 'New' ?
                  'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  'bg-rose-50 text-rose-700 border-rose-200'}`
                  }>
                  
                    {cust.tier}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-medium">{cust.ordersCount} orders</td>
                <td className="py-3 px-4 font-bold text-zinc-900 font-mono">
                  ${cust.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-zinc-500">{cust.lastOrderDate}</td>
                <td className="py-3 px-4 text-zinc-600">
                  {cust.city}, {cust.country}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

};