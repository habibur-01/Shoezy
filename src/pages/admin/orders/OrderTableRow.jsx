import React from 'react';
import { Truck, ChevronRight } from 'lucide-react';







export const getStatusBadge = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'shipped':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'processing':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'pending':
      return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    case 'cancelled':
      return 'bg-rose-50 text-rose-700 border-rose-200';
  }
};

export const OrderTableRow = ({ order, onOpenDetail }) => {
  return (
    <tr className="hover:bg-zinc-50/60 transition-colors">
      {/* Order ID */}
      <td className="py-3 px-4">
        <div className="font-mono font-bold text-zinc-900">{order.id || order._id}</div>
        <div className="text-[10px] text-zinc-400">
          {new Date(order.createdAt || order.created_at || Date.now()).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </td>

      {/* Customer */}
      <td className="py-3 px-4">
        <div className="font-medium text-zinc-900">{order.customerName || 'Customer'}</div>
        <div className="text-[10px] text-zinc-400 truncate max-w-[150px]">
          {order.customerEmail || ''}
        </div>
      </td>

      {/* Items */}
      <td className="py-3 px-4">
        <div className="font-medium text-zinc-800">
          {(order.items || []).map((it) => `${it.quantity || 1}x ${it.title || it.name || 'Item'}`).join(', ')}
        </div>
        <div className="text-[10px] text-zinc-400">{(order.items || []).length} unique line item(s)</div>
      </td>

      {/* Financials */}
      <td className="py-3 px-4">
        <div className="font-bold text-zinc-900">${Number(order.total ?? order.totalAmount ?? 0).toFixed(2)}</div>
        <div className="text-[10px] text-zinc-400">
          {Number(order.discount || 0) > 0 &&
          <span className="text-emerald-600">Saved ${Number(order.discount).toFixed(2)} • </span>
          }
          <span className="capitalize">{order.paymentStatus || 'pending'}</span>
        </div>
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${getStatusBadge(
            order.status
          )}`}>
          
          {order.status}
        </span>
      </td>

      {/* Tracking */}
      <td className="py-3 px-4 font-mono text-[11px]">
        {order.trackingNumber ?
        <div className="flex items-center gap-1.5 text-zinc-800">
            <Truck className="w-3.5 h-3.5 text-zinc-400" />
            <span className="truncate max-w-[130px]">{order.trackingNumber}</span>
          </div> :

        <span className="text-zinc-400 italic font-sans text-xs">Unassigned</span>
        }
      </td>

      {/* Action */}
      <td className="py-3 px-4 text-right">
        <button
          id={`btn-manage-order-${order.id}`}
          onClick={() => onOpenDetail(order)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors cursor-pointer">
          
          Track & Edit <ChevronRight className="w-3 h-3" />
        </button>
      </td>
    </tr>);

};