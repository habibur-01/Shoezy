import React from 'react';
import {
  CheckCircle,
  AlertCircle,
  Gift,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { OrderItem, SocialOrderSource } from '../../types';

interface OrderFinancialSummaryProps {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  manualDiscount: number;
  couponCode?: string;
  shippingRate: number;
  carrier: string;
  source: SocialOrderSource | string;
  sourceHandle?: string;
  isGiftOrder: boolean;
  total: number;
  customerName: string;
  customerEmail: string;
  isSubmitting: boolean;
  validationError: string | null;
  onSubmit: () => void;
  onReset: () => void;
  onCancel: () => void;
}

export const OrderFinancialSummary: React.FC<OrderFinancialSummaryProps> = ({
  items,
  subtotal,
  discount,
  manualDiscount,
  couponCode,
  shippingRate,
  carrier,
  source,
  sourceHandle,
  isGiftOrder,
  total,
  customerName,
  customerEmail,
  isSubmitting,
  validationError,
  onSubmit,
  onReset,
  onCancel,
}) => {
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const giftItemsCount = items
    .filter((i) => i.isGift)
    .reduce((sum, item) => sum + item.quantity, 0);
  const totalDiscount = discount + manualDiscount;

  const isFormValid = items.length > 0 && customerName.trim().length > 0 && customerEmail.trim().length > 0;

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm sticky top-20 space-y-4">
      {/* Header */}
      <div className="pb-3 border-b border-zinc-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Order Summary</h3>
          <span className="text-[11px] text-zinc-400">Live price calculation</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full capitalize">
          {source} {sourceHandle ? `(${sourceHandle})` : ''}
        </span>
      </div>

      {/* Badges / Highlights */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {isGiftOrder && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200">
            <Gift className="w-3 h-3" /> Gift Order
          </span>
        )}
        {giftItemsCount > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-purple-700 bg-purple-50 border border-purple-200">
            {giftItemsCount} Complimentary Gift{giftItemsCount === 1 ? '' : 's'}
          </span>
        )}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-zinc-600 bg-zinc-100">
          <Truck className="w-3 h-3 text-zinc-400" /> {carrier}
        </span>
      </div>

      {/* Financial Line Items */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-zinc-600">
          <span>
            Line Items ({totalItemsCount} unit{totalItemsCount === 1 ? '' : 's'})
          </span>
          <span className="font-mono font-medium text-zinc-900">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {couponCode && discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 font-medium">
            <span className="flex items-center gap-1">
              <span>Coupon ({couponCode})</span>
            </span>
            <span className="font-mono">-${discount.toFixed(2)}</span>
          </div>
        )}

        {manualDiscount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 font-medium">
            <span>Staff Courtesy Discount</span>
            <span className="font-mono">-${manualDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-zinc-600">
          <div className="flex items-center gap-1">
            <span>Shipping & Handling</span>
          </div>
          <span className="font-mono font-medium text-zinc-900">
            {shippingRate === 0 ? (
              <span className="text-emerald-600 font-semibold">FREE</span>
            ) : (
              `$${shippingRate.toFixed(2)}`
            )}
          </span>
        </div>

        {/* Total Divider */}
        <div className="pt-3 border-t border-zinc-200 flex items-baseline justify-between">
          <div>
            <span className="text-sm font-bold text-zinc-900 block">Total Due</span>
            <span className="text-[10px] text-zinc-400">All discounts & freight included</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold font-mono text-zinc-900">
              ${total.toFixed(2)}
            </span>
            {totalDiscount > 0 && (
              <div className="text-[10px] text-emerald-600 font-medium">
                Saved ${totalDiscount.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Validation alert */}
      {validationError && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Primary Action Button */}
      <button
        type="button"
        id="btn-submit-create-order"
        disabled={isSubmitting || !isFormValid}
        onClick={onSubmit}
        className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer ${
          !isFormValid
            ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed'
            : isSubmitting
            ? 'bg-indigo-400 text-white cursor-wait'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.99]'
        }`}
      >
        {isSubmitting ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating Order...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            Create & Finalize Order
          </>
        )}
      </button>

      {/* Action links */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <button
          type="button"
          onClick={onReset}
          className="text-zinc-500 hover:text-zinc-700 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Reset Form
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Help notice */}
      <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/70 text-[11px] text-zinc-500 flex items-start gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
        <span>
          Creating this order will automatically deduct items from warehouse inventory, record staff attribution, and post an immutable entry to the audit log.
        </span>
      </div>
    </div>
  );
};
