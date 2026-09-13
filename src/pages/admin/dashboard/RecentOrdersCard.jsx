import React from 'react';
import { ShoppingCart, ArrowRight, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  delivered: {
    label: 'Delivered',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
    icon: CheckCircle2,
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400',
    icon: Truck,
  },
  processing: {
    label: 'Processing',
    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400',
    icon: Clock,
  },
  pending: {
    label: 'Pending',
    color: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300',
    icon: Clock,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400',
    icon: XCircle,
  },
};

export const RecentOrdersCard = ({
  recentOrders,
  orders = [],
  onNavigateOrders,
}) => {
  const sourceOrders = recentOrders && recentOrders.length > 0 ? recentOrders : orders;
  const displayedOrders = sourceOrders.slice(0, 5);

  return (
    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Recent Customer Orders
              </h3>
              <p className="text-xs text-zinc-500">Live order fulfillment stream</p>
            </div>
          </div>
          <button
            onClick={onNavigateOrders}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({sourceOrders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {displayedOrders.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 text-xs">
            No recent orders recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {displayedOrders.map((order) => {
              const statusKey = (order.orderStatus || order.status || 'pending').toLowerCase();
              const statusInfo = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
              const StatusIcon = statusInfo.icon;
              const customerName = order.customer?.name || order.customerName || 'Valued Customer';
              const customerAvatar = order.customer?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customerName)}`;
              const orderNum = order.orderNumber || `SHZ-${(order.id || order._id || '').toString().slice(-6).toUpperCase()}`;

              const itemsSummary = Array.isArray(order.items) && order.items.length > 0
                ? order.items.map((i) => `${i.quantity || 1}x ${i.title || i.name || 'Shoe'}`).join(', ')
                : 'Footwear item';

              return (
                <div
                  key={order.id || order._id}
                  className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={customerAvatar}
                      alt={customerName}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700 bg-zinc-100"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {customerName}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {orderNum}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate max-w-xs sm:max-w-md">
                        {itemsSummary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {order.createdAt || 'Recent'}
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusInfo.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusInfo.label}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
