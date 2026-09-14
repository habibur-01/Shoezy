import React from 'react';
import {
  CheckCircle2,
  PackageCheck,
  Printer,
  ArrowRight,
  PlusCircle,
  Truck,
  Gift,
  ExternalLink,
} from 'lucide-react';
import { Order } from '../../types';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onViewOrderTracking: () => void;
  onCreateAnother: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  onViewOrderTracking,
  onCreateAnother,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-6 text-white text-center relative">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h3 className="text-lg font-bold">Order Created & Dispatched!</h3>
          <p className="text-xs text-emerald-100 mt-1">
            Manual social order successfully logged and catalog inventory updated.
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Order ID & Status Header */}
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 block font-medium">
                Order Tracking ID
              </span>
              <span className="text-sm font-bold font-mono text-zinc-900">
                #{order.id}
              </span>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {order.status.toUpperCase()}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">
                Channel: <strong className="text-zinc-700 uppercase">{order.source}</strong>
              </span>
            </div>
          </div>

          {/* Key Attributes */}
          <div className="grid grid-cols-2 gap-3 text-zinc-600">
            <div className="p-3 border border-zinc-100 rounded-lg">
              <span className="text-[11px] text-zinc-400 block">Customer</span>
              <strong className="text-zinc-900 font-semibold">{order.customerName}</strong>
              <span className="block text-[11px] text-zinc-500 truncate">{order.customerEmail}</span>
            </div>

            <div className="p-3 border border-zinc-100 rounded-lg">
              <span className="text-[11px] text-zinc-400 block">Carrier & Tracking</span>
              <strong className="text-zinc-900 font-semibold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-zinc-500" />
                {order.carrier || 'Standard'}
              </strong>
              <span className="font-mono text-[11px] text-zinc-600">
                {order.trackingNumber || 'Tracking Pending'}
              </span>
            </div>
          </div>

          {/* Gift info if applicable */}
          {order.isGiftOrder && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-2.5 text-purple-900">
              <Gift className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Gift Order Packaging Confirmed</span>
                {order.giftMessage && (
                  <p className="text-[11px] text-purple-700 italic mt-0.5">
                    "{order.giftMessage}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Line items summary */}
          <div>
            <span className="text-[11px] font-semibold text-zinc-700 block mb-1.5">
              Line Items ({order.items.length})
            </span>
            <div className="max-h-28 overflow-y-auto divide-y divide-zinc-100 border border-zinc-200 rounded-lg bg-zinc-50/50">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-zinc-800">{item.quantity}x</span>
                    <span className="truncate text-zinc-700">{item.title}</span>
                    {item.isGift && (
                      <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-1.5 py-0.2 rounded">
                        GIFT
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-medium text-zinc-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
            <span className="font-medium text-zinc-600">Total Settled</span>
            <span className="text-base font-bold font-mono text-zinc-900">
              ${order.total.toFixed(2)}
            </span>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-500" />
              Print Slip
            </button>

            <button
              type="button"
              onClick={onCreateAnother}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-zinc-600" />
              New Order
            </button>

            <button
              type="button"
              onClick={onViewOrderTracking}
              className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <span>View Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
