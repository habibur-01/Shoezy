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

  const lastModName =
    order.lastActivity?.actorName ||
    order.updatedByName ||
    order.updatedBy?.name ||
    order.confirmedByName ||
    order.confirmedBy?.name;

  const confirmedName = order.confirmedByName || order.confirmedBy?.name;

  // Build complete activities list (newest first)
  const activityList = Array.isArray(order.activities) && order.activities.length > 0
    ? order.activities
    : (Array.isArray(order.timeline) ? [...order.timeline].reverse() : []);

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
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-zinc-500 mt-0.5">
              <span>Placed on {new Date(order.createdAt).toLocaleString()}</span>
              {confirmedName && (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70 font-medium">
                  Confirmed by: {confirmedName}
                </span>
              )}
              {lastModName && (
                <span className="inline-flex items-center gap-1 text-[11px] text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/70 font-medium">
                  Last edited by: {lastModName}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Last Activity Summary Banner */}
        {order.lastActivity && (
          <div className="mb-4 p-3 bg-zinc-50 border border-zinc-200/90 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
                <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Last Activity:</span>
                <span className="text-indigo-700 font-bold uppercase text-[11px]">
                  {order.lastActivity.action?.replace(/_/g, ' ') || 'STATUS_UPDATED'}
                </span>
                <span className="text-zinc-500 font-normal">
                  by <span className="font-medium text-zinc-800">{order.lastActivity.actorName || 'Operations Admin'}</span>
                  {order.lastActivity.actorRole && ` (${order.lastActivity.actorRole})`}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                {new Date(order.lastActivity.timestamp || Date.now()).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="text-zinc-600 text-[11px] pl-5">
              {order.lastActivity.note || `Transitioned status to ${order.lastActivity.newStatus || order.status}`}
              {order.lastActivity.carrier && ` • Carrier: ${order.lastActivity.carrier}`}
              {order.lastActivity.trackingNumber && ` (Tracking: ${order.lastActivity.trackingNumber})`}
            </div>
          </div>
        )}

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
            {(order.items || []).map((item, idx) =>
            <div
              key={idx}
              className="flex items-center justify-between py-1 border-b border-zinc-200/60 last:border-0">
              
                <div>
                  <div className="font-medium text-zinc-900">{item.title || item.name || 'Product'}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    {item.sku || 'SHZ-PRD'} • Qty: {item.quantity || 1}
                  </div>
                </div>
                <div className="font-mono font-semibold">
                  ${Number((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-200 text-right space-y-1">
              <div className="text-zinc-500">Subtotal: ${Number(order.subtotal ?? order.total ?? 0).toFixed(2)}</div>
              {Number(order.discount || 0) > 0 &&
              <div className="text-emerald-700 font-medium">
                  Promo ({order.couponCode || 'Discount'}): -${Number(order.discount).toFixed(2)}
                </div>
              }
              <div className="text-sm font-bold text-zinc-900">Total: ${Number(order.total ?? order.totalAmount ?? 0).toFixed(2)}</div>
            </div>
          </div>

          {/* Customer & Shipping destination */}
          <div className="p-3 bg-zinc-50/70 border border-zinc-200 rounded-lg text-xs space-y-2">
            <div className="font-semibold text-zinc-900">Shipping Destination</div>
            <div className="space-y-1 text-zinc-600">
              <div className="flex items-center gap-1.5 font-medium text-zinc-900">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                {order.customerName || 'Customer'}
              </div>
              <div className="text-zinc-500">{order.customerEmail || ''}</div>
              {order.customerPhone && <div className="text-zinc-500">{order.customerPhone}</div>}
              <div className="flex items-start gap-1.5 pt-1 text-zinc-700">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5" />
                <div>
                  <div>{order.shippingAddress?.street || order.shipping?.street || order.shipping?.address || 'Address on file'}</div>
                  <div>
                    {order.shippingAddress?.city || order.shipping?.city || 'N/A'}{order.shippingAddress?.state || order.shipping?.state ? `, ${order.shippingAddress?.state || order.shipping?.state}` : ''}{' '}
                    {order.shippingAddress?.postalCode || order.shipping?.postal_code || ''}
                  </div>
                  <div className="text-zinc-500">{order.shippingAddress?.country || order.shipping?.country || 'Bangladesh'}</div>
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

        {/* Administrative Activities & Audit History List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Administrative Activities & Order History List</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-medium">
              {activityList.length} recorded {activityList.length === 1 ? 'activity' : 'activities'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {activityList.map((step, idx) => {
              const actorName =
                step.actorName ||
                step.actor ||
                (step.adminUser?.name || (step.adminUser?.firstName ? `${step.adminUser.firstName} ${step.adminUser.lastName || ''}`.trim() : null)) ||
                'Operations Staff';
              const actorRole =
                step.actorRole ||
                step.adminUser?.role ||
                (idx === activityList.length - 1 ? 'Customer' : 'Staff');
              const actionText = step.action
                ? step.action.replace(/_/g, ' ')
                : (step.status ? step.status.toUpperCase() : 'ACTIVITY');
              const timeStr = new Date(step.timestamp || step.date || Date.now()).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 text-zinc-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <User className="w-3 h-3 text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-zinc-900 text-xs">
                          {actorName}
                        </span>
                        {actorRole && (
                          <span className="px-1.5 py-0.2 bg-zinc-200/80 text-zinc-700 rounded text-[9px] font-medium uppercase">
                            {actorRole}
                          </span>
                        )}
                        <span className="px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded text-[9px] font-semibold uppercase border border-indigo-100">
                          {actionText}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {timeStr}
                      </span>
                    </div>
                    <div className="text-zinc-600 text-[11px] mt-1">
                      {step.notes || step.note || step.description || `Executed activity by ${actorName}`}
                    </div>
                    {(step.carrier || step.trackingNumber) && (
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-500">
                        {step.carrier && (
                          <span className="font-medium text-zinc-700">Carrier: {step.carrier}</span>
                        )}
                        {step.trackingNumber && (
                          <span className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-700">
                            Code: {step.trackingNumber}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
                  This will revoke the order, refund ${Number(order.total ?? order.totalAmount ?? 0).toFixed(2)}, and record an audit
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