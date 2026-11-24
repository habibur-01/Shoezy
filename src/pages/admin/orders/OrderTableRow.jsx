import React from 'react';
import { Truck, ChevronRight, Package, User, CreditCard } from 'lucide-react';

export const getStatusBadge = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    case 'shipped':
      return 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    case 'processing':
      return 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    case 'pending':
      return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
    case 'cancelled':
      return 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    case 'returned':
    case 'return_requested':
      return 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    default:
      return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
  }
};

export const OrderTableRow = ({ order, onOpenDetail }) => {
  const displayId = order.id || order._id || '';
  const shortId = order.orderNumber || (displayId ? `#${String(displayId).slice(-6).toUpperCase()}` : 'N/A');

  const items = Array.isArray(order.items) ? order.items : [];
  const firstItem = items[0] || {};
  const firstImg = firstItem.image || firstItem.product?.images?.cover || '';

  return (
    <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors">
      {/* Order ID & Date */}
      <td className="py-3 px-4">
        <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5" title={displayId}>
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{shortId}</span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal hidden sm:inline">
            ({String(displayId).slice(-8)})
          </span>
        </div>
        <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
          {new Date(order.createdAt || order.created_at || Date.now()).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </td>

      {/* Customer Info */}
      <td className="py-3 px-4">
        <div className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300 shrink-0">
            {(order.customerName || 'C')[0].toUpperCase()}
          </div>
          <span className="truncate max-w-[140px]">{order.customerName || 'Customer'}</span>
        </div>
        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate max-w-[160px] pl-6.5">
          {order.customerEmail || order.customerPhone || 'Direct Store Order'}
        </div>
      </td>

      {/* Purchased Items Preview */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          {firstImg ? (
            <img
              src={firstImg}
              alt=""
              className="w-7 h-7 object-cover rounded-md border border-zinc-200 dark:border-zinc-700 shrink-0 bg-zinc-50 dark:bg-zinc-800"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
              <Package className="w-3.5 h-3.5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="font-medium text-zinc-800 dark:text-zinc-200 text-xs truncate max-w-[180px]">
              {items.map((it) => `${it.quantity || 1}x ${it.title || it.name || 'Item'}`).join(', ') || '1x Shoezy Item'}
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
              {items.length} line item{items.length !== 1 ? 's' : ''}
              {firstItem.sku && ` • SKU: ${firstItem.sku}`}
            </div>
          </div>
        </div>
      </td>

      {/* Financials & Payment */}
      <td className="py-3 px-4">
        <div className="font-bold text-zinc-900 dark:text-zinc-100">
          ${Number(order.total ?? order.total_amount ?? order.totalAmount ?? 0).toFixed(2)}
        </div>
        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
          {Number(order.discount || 0) > 0 && (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              -${Number(order.discount).toFixed(2)}
            </span>
          )}
          <span className="inline-flex items-center gap-0.5 capitalize">
            <CreditCard className="w-2.5 h-2.5 text-zinc-400" />
            {order.paymentStatus || 'pending'}
          </span>
        </div>
      </td>

      {/* Fulfillment Status */}
      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </td>

      {/* Carrier & Tracking */}
      <td className="py-3 px-4 font-mono text-[11px]">
        {order.trackingNumber ? (
          <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
            <Truck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate max-w-[120px]" title={order.trackingNumber}>
              {order.trackingNumber}
            </span>
          </div>
        ) : (
          <span className="text-zinc-400 dark:text-zinc-600 italic font-sans text-xs">Unassigned</span>
        )}
        <div className="text-[9px] text-zinc-400 dark:text-zinc-500 font-sans truncate max-w-[120px]">
          {order.carrier || 'FedEx Express'}
        </div>
      </td>

      {/* Action */}
      <td className="py-3 px-4 text-right">
        <button
          id={`btn-manage-order-${displayId}`}
          type="button"
          onClick={() => onOpenDetail(order)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 rounded-md transition-colors cursor-pointer"
        >
          <span>Manage</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </td>
    </tr>
  );
};