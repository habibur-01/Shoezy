import React from 'react';
import { Search } from 'lucide-react';










export const OrdersFilterBar = ({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  orders
}) => {
  return (
    <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg text-xs overflow-x-auto w-full md:w-auto">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(
            (tab) => {
              const count =
              tab === 'all' ? orders.length : orders.filter((o) => o.status === tab).length;
              return (
                <button
                  key={tab}
                  id={`order-tab-${tab}`}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-md font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === tab ?
                  'bg-white text-zinc-900 shadow-xs' :
                  'text-zinc-500 hover:text-zinc-900'}`
                  }>
                  
                  {tab} ({count})
                </button>);

            }
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            id="input-order-search"
            type="text"
            placeholder="Search by Order ID, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
          
        </div>
      </div>
    </div>);

};