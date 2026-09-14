import React, { useState } from 'react';
import {
  TicketPercent,
  CheckCircle2,
  AlertCircle,
  X,
  Tag,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface CouponAndDiscountSectionProps {
  subtotal: number;
  couponCode: string;
  setCouponCode: (code: string) => void;
  discount: number;
  setDiscount: (amount: number) => void;
  manualDiscount: number;
  setManualDiscount: (val: number) => void;
}

export const CouponAndDiscountSection: React.FC<CouponAndDiscountSectionProps> = ({
  subtotal,
  couponCode,
  setCouponCode,
  discount,
  setDiscount,
  manualDiscount,
  setManualDiscount,
}) => {
  const { coupons } = useAdmin();
  const [inputCode, setInputCode] = useState(couponCode || '');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedMessage, setAppliedMessage] = useState<string | null>(
    couponCode ? `Coupon ${couponCode} active` : null
  );

  // Active coupons available in the store
  const activeCoupons = coupons.filter(
    (c) => c.status === 'active' && new Date(c.expiryDate) > new Date()
  );

  const applyCode = (codeToApply: string) => {
    setCouponError(null);
    const trimmed = codeToApply.trim().toUpperCase();
    if (!trimmed) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const found = coupons.find((c) => c.code.toUpperCase() === trimmed);
    if (!found) {
      setCouponError(`Coupon code "${trimmed}" not found.`);
      return;
    }

    if (found.status !== 'active') {
      setCouponError(`Coupon "${trimmed}" is currently disabled.`);
      return;
    }

    if (new Date(found.expiryDate) < new Date()) {
      setCouponError(`Coupon "${trimmed}" has expired.`);
      return;
    }

    if (found.minSpend && subtotal < found.minSpend) {
      setCouponError(
        `Minimum order subtotal of $${found.minSpend.toFixed(2)} required for "${trimmed}".`
      );
      return;
    }

    let calculatedDiscount = 0;
    if (found.discountType === 'percentage') {
      calculatedDiscount = (subtotal * found.discountValue) / 100;
    } else {
      calculatedDiscount = Math.min(subtotal, found.discountValue);
    }

    setCouponCode(found.code);
    setDiscount(calculatedDiscount);
    setAppliedMessage(
      `Applied ${found.code}: -$${calculatedDiscount.toFixed(2)} (${
        found.discountType === 'percentage'
          ? `${found.discountValue}% OFF`
          : `$${found.discountValue} OFF`
      })`
    );
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
    setInputCode('');
    setAppliedMessage(null);
    setCouponError(null);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <TicketPercent className="w-4 h-4 text-emerald-600" />
            <span>7. Promotional Coupons & Social Discounts</span>
            {couponCode && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Applied
              </span>
            )}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Apply active promotional vouchers or staff negotiated price discounts.
          </p>
        </div>

        {discount + manualDiscount > 0 && (
          <span className="text-xs font-mono font-bold text-emerald-600 self-start sm:self-auto">
            Total Discount: -${(discount + manualDiscount).toFixed(2)}
          </span>
        )}
      </div>

      {/* Quick Apply Chips */}
      {activeCoupons.length > 0 && (
        <div className="mb-3.5">
          <span className="block text-[11px] font-medium text-zinc-500 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Active Store Coupons (Click to Apply)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activeCoupons.map((cpn) => {
              const isApplied = couponCode.toUpperCase() === cpn.code.toUpperCase();
              return (
                <button
                  key={cpn.id}
                  type="button"
                  id={`btn-quick-coupon-${cpn.id}`}
                  onClick={() => {
                    setInputCode(cpn.code);
                    applyCode(cpn.code);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                    isApplied
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  <strong>{cpn.code}</strong>
                  <span className="text-[10px] opacity-80">
                    {cpn.discountType === 'percentage'
                      ? `(${cpn.discountValue}%)`
                      : `($${cpn.discountValue})`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Coupon Code Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label htmlFor="input-coupon-code" className="block text-xs font-medium text-zinc-700 mb-1">
            Coupon Promo Code
          </label>
          <div className="flex gap-1.5">
            <input
              id="input-coupon-code"
              type="text"
              placeholder="e.g., WELCOME10 or FLASH50"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="flex-1 text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono uppercase text-zinc-800"
            />
            <button
              type="button"
              id="btn-apply-coupon"
              onClick={() => applyCode(inputCode)}
              className="px-3.5 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Manual Staff Courtesy Discount */}
        <div>
          <label htmlFor="input-manual-discount" className="block text-xs font-medium text-zinc-700 mb-1">
            Staff Courtesy Discount ($){' '}
            <span className="text-zinc-400 font-normal">(negotiated on chat)</span>
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-2.5 text-xs text-zinc-400 font-mono">$</span>
            <input
              id="input-manual-discount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={manualDiscount || ''}
              onChange={(e) =>
                setManualDiscount(Math.max(0, parseFloat(e.target.value) || 0))
              }
              className="w-full text-xs pl-7 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-zinc-800"
            />
          </div>
        </div>
      </div>

      {/* Applied Feedback or Error */}
      {couponError && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{couponError}</span>
        </div>
      )}

      {appliedMessage && !couponError && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span className="font-medium">{appliedMessage}</span>
          </div>
          <button
            type="button"
            onClick={removeCoupon}
            className="text-emerald-700 hover:text-emerald-900 text-[11px] underline flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" /> Remove
          </button>
        </div>
      )}
    </div>
  );
};
