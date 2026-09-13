import React from 'react';
import {
  X,
  CheckCircle,
  Truck,
  Clock,
  AlertCircle,
  User,
  MapPin } from
'lucide-react';

import { getStatusBadge } from './OrderTableRow';


















export const OrderDetailModal = ({
  order,
  onClose,
  carrier,
  setCarrier,
  trackingNumber,
  setTrackingNumber,
  updateNote,
  setUpdateNote,
  onAdvanceStatus,
  showRefundConfirm,
  setShowRefundConfirm,
  refundReason,
  setRefundReason,
  onProcessRefund
}) => {
  if (!order) return null;

  const carriers = ['FedEx Express', 'UPS Ground', 'DHL Express', 'USPS Priority', 'Royal Mail'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-zinc-900">{order.id}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${getStatusBadge(
                  order.status
                )}`}>
                
                {order.status}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md cursor-pointer">
            
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Pipeline */}
        <div className="mb-6 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
          <div className="text-xs font-semibold text-zinc-900 mb-3">Fulfillment Lifecycle</div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {['pending', 'processing', 'shipped', 'delivered'].map((step, idx) => {
              const stepIndex = ['pending', 'processing', 'shipped', 'delivered'].indexOf(
                order.status
              );
              const isCurrent = order.status === step;
              const isDone = stepIndex >= idx && order.status !== 'cancelled';

              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-colors ${
                    isDone ?
                    'bg-indigo-600 text-white shadow-2xs' :
                    'bg-zinc-200 text-zinc-500'}`
                    }>
                    
                    {isDone ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-medium capitalize ${
                    isCurrent ?
                    'text-indigo-700 font-bold' :
                    isDone ?
                    'text-zinc-800' :
                    'text-zinc-400'}`
                    }>
                    
                    {step}
                  </span>
                </div>);

            })}
          </div>
        </div>

        {/* Items & Financial summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Order Items */}
          <div className="p-3 bg-zinc-50/70 border border-zinc-200 rounded-lg text-xs space-y-2">
            <div className="font-semibold text-zinc-900">Purchased Items</div>
            {order.items.map((item, idx) =>
            <div
              key={idx}
              className="flex items-center justify-between py-1 border-b border-zinc-200/60 last:border-0">
              
                <div>
                  <div className="font-medium text-zinc-900">{item.title}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    {item.sku} • Qty: {item.quantity}
                  </div>
                </div>
                <div className="font-mono font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-200 text-right space-y-1">
              <div className="text-zinc-500">Subtotal: ${order.subtotal.toFixed(2)}</div>
              {order.discount > 0 &&
              <div className="text-emerald-700 font-medium">
                  Promo ({order.couponCode || 'Discount'}): -${order.discount.toFixed(2)}
                </div>
              }
              <div className="text-sm font-bold text-zinc-900">Total: ${order.total.toFixed(2)}</div>
            </div>
          </div>

          {/* Customer & Shipping destination */}
          <div className="p-3 bg-zinc-50/70 border border-zinc-200 rounded-lg text-xs space-y-2">
            <div className="font-semibold text-zinc-900">Shipping Destination</div>
            <div className="space-y-1 text-zinc-600">
              <div className="flex items-center gap-1.5 font-medium text-zinc-900">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                {order.customerName}
              </div>
              <div className="text-zinc-500">{order.customerEmail}</div>
              {order.customerPhone && <div className="text-zinc-500">{order.customerPhone}</div>}
              <div className="flex items-start gap-1.5 pt-1 text-zinc-700">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5" />
                <div>
                  <div>{order.shippingAddress.street}</div>
                  <div>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.postalCode}
                  </div>
                  <div className="text-zinc-500">{order.shippingAddress.country}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carrier & Tracking update form */}
        <div className="p-4 border border-indigo-100 bg-indigo-50/40 rounded-xl space-y-3 mb-6 text-xs">
          <div className="font-semibold text-zinc-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-600" />
            Shipping Carrier & Real-time Tracking Code
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-700 font-medium mb-1">Carrier Service</label>
              <select
                id="select-order-carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-hidden cursor-pointer">
                
                {carriers.map((c) =>
                <option key={c} value={c}>
                    {c}
                  </option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-zinc-700 font-medium mb-1">Tracking Number</label>
              <input
                id="input-order-tracking"
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. 1Z9999999999999999"
                className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white font-mono focus:outline-hidden" />
              
            </div>
          </div>

          <div>
            <label className="block text-zinc-700 font-medium mb-1">
              Fulfillment Note (Logged to audit trail)
            </label>
            <input
              id="input-order-note"
              type="text"
              value={updateNote}
              onChange={(e) => setUpdateNote(e.target.value)}
              placeholder="e.g. Dispatched via morning express pickup..."
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-hidden" />
            
          </div>

          {/* Status transition action buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-zinc-500 font-medium">Update Status:</span>
            <button
              id="btn-status-processing"
              onClick={() => onAdvanceStatus('processing')}
              disabled={order.status === 'processing'}
              className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 rounded font-medium disabled:opacity-40 cursor-pointer">
              
              Mark Processing
            </button>
            <button
              id="btn-status-shipped"
              onClick={() => onAdvanceStatus('shipped')}
              disabled={order.status === 'shipped'}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-800 border border-blue-300 rounded font-medium disabled:opacity-40 cursor-pointer">
              
              Mark Shipped
            </button>
            <button
              id="btn-status-delivered"
              onClick={() => onAdvanceStatus('delivered')}
              disabled={order.status === 'delivered'}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-medium disabled:opacity-40 cursor-pointer">
              
              Mark Delivered
            </button>
          </div>
        </div>

        {/* Audit Timeline */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-zinc-900 mb-2">Order Activity History</div>
          <div className="space-y-2 text-xs">
            {order.timeline.map((step, idx) =>
            <div
              key={idx}
              className="flex items-start gap-2.5 p-2 rounded bg-zinc-50 border border-zinc-100">
              
                <Clock className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-800 uppercase text-[10px]">
                      {step.status}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {new Date(step.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-zinc-600 text-[11px] mt-0.5">
                    {step.note || `Transitioned by ${step.actor}`}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Refund / Cancellation Section */}
        {order.status !== 'cancelled' &&
        <div className="pt-3 border-t border-zinc-100">
            {!showRefundConfirm ?
          <button
            id="btn-trigger-refund"
            onClick={() => setShowRefundConfirm(true)}
            className="text-xs text-rose-700 hover:text-rose-800 font-medium inline-flex items-center gap-1 cursor-pointer">
            
                <AlertCircle className="w-3.5 h-3.5" />
                Cancel Order & Process Customer Refund
              </button> :

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-2 text-xs">
                <div className="font-semibold text-rose-900">
                  Confirm Order Cancellation & Monetary Refund
                </div>
                <p className="text-rose-700">
                  This will revoke the order, refund ${order.total.toFixed(2)}, and record an audit
                  log entry.
                </p>
                <input
              id="input-refund-reason"
              type="text"
              placeholder="Reason for refund (optional)..."
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded text-xs focus:outline-hidden" />
            
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                onClick={() => setShowRefundConfirm(false)}
                className="px-3 py-1 text-zinc-600 hover:bg-zinc-100 rounded cursor-pointer">
                
                    Back
                  </button>
                  <button
                id="btn-confirm-refund-action"
                onClick={onProcessRefund}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-2xs cursor-pointer">
                
                    Authorize Full Refund
                  </button>
                </div>
              </div>
          }
          </div>
        }
      </div>
    </div>);

};