import React from 'react';
import {
  CreditCard,
  CheckCircle,
  Clock,
  Banknote,
  DollarSign,
  Send,
} from 'lucide-react';
import { OrderStatus, PaymentStatus } from '../../types';

interface OrderPaymentSectionProps {
  paymentStatus: PaymentStatus;
  setPaymentStatus: (status: PaymentStatus) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  fulfillmentStatus: OrderStatus;
  setFulfillmentStatus: (status: OrderStatus) => void;
}

const PAYMENT_METHODS = [
  { id: 'Facebook Pay', label: 'Facebook / Messenger Pay', icon: Send },
  { id: 'Instagram Pay', label: 'Instagram DM Pay', icon: Send },
  { id: 'WhatsApp Pay', label: 'WhatsApp Pay', icon: Send },
  { id: 'Cash on Delivery (COD)', label: 'Cash on Delivery (COD)', icon: Banknote },
  { id: 'Bank Transfer / Zelle', label: 'Zelle / Bank Wire', icon: DollarSign },
  { id: 'Credit Card (Stripe)', label: 'Credit Card / Stripe', icon: CreditCard },
  { id: 'PayPal', label: 'PayPal', icon: CreditCard },
  { id: 'Other Direct Payment', label: 'Other Direct Payment', icon: Banknote },
];

export const OrderPaymentSection: React.FC<OrderPaymentSectionProps> = ({
  paymentStatus,
  setPaymentStatus,
  paymentMethod,
  setPaymentMethod,
  fulfillmentStatus,
  setFulfillmentStatus,
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-zinc-500" />
            <span>8. Payment Status & Initial Fulfillment State</span>
            <span className="text-[11px] font-normal text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
              Settlement
            </span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Record whether funds have been received and select initial workflow stage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Payment Status Toggle */}
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-2">
            Payment Settlement Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="btn-payment-paid"
              onClick={() => setPaymentStatus('paid')}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                paymentStatus === 'paid'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                  : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  paymentStatus === 'paid'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-100 text-zinc-400'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold block">Paid / Captured</span>
                <span className="text-[10px] text-zinc-400">Funds verified</span>
              </div>
            </button>

            <button
              type="button"
              id="btn-payment-pending"
              onClick={() => setPaymentStatus('pending')}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                paymentStatus === 'pending'
                  ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                  : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  paymentStatus === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'bg-zinc-100 text-zinc-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold block">Pending / COD</span>
                <span className="text-[10px] text-zinc-400">Collect on delivery</span>
              </div>
            </button>
          </div>
        </div>

        {/* Initial Fulfillment Status */}
        <div>
          <label
            htmlFor="select-fulfillment-status"
            className="block text-xs font-medium text-zinc-700 mb-2"
          >
            Initial Order Status
          </label>
          <select
            id="select-fulfillment-status"
            value={fulfillmentStatus}
            onChange={(e) => setFulfillmentStatus(e.target.value as OrderStatus)}
            className="w-full text-xs px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800"
          >
            <option value="processing">Processing (Ready for Pick & Pack)</option>
            <option value="pending">Pending Review (Awaiting Staff Check)</option>
            <option value="shipped">Shipped (Already Handed to Carrier)</option>
          </select>
          <p className="text-[10px] text-zinc-400 mt-1">
            Standard manual orders enter the queue as "Processing".
          </p>
        </div>

        {/* Payment Method Selector */}
        <div className="sm:col-span-2">
          <label
            htmlFor="select-payment-method"
            className="block text-xs font-medium text-zinc-700 mb-1"
          >
            Payment Processing Channel / Gateway
          </label>
          <select
            id="select-payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
