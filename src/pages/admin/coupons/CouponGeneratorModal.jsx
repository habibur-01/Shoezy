import React from 'react';
import { Sparkles, X } from 'lucide-react';



























export const CouponGeneratorModal = ({
  isOpen,
  onClose,
  code,
  setCode,
  description,
  setDescription,
  discountType,
  setDiscountType,
  discountValue,
  setDiscountValue,
  minSpend,
  setMinSpend,
  usageLimit,
  setUsageLimit,
  customerTierLimit,
  setCustomerTierLimit,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onGenerateCode,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[92vh]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-semibold text-zinc-900">Custom Coupon Generator</h3>
              <p className="text-xs text-zinc-500">Formulate rules, redemption caps, and promo codes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md cursor-pointer">
            
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          {/* Code input with Random Generator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-zinc-700">Promo Code Identifier</label>
              <button
                type="button"
                onClick={onGenerateCode}
                className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1 cursor-pointer">
                
                <Sparkles className="w-3 h-3" />
                Auto-generate random code
              </button>
            </div>
            <input
              id="form-coupon-code"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER25 or VIPFREESHIP"
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono font-bold tracking-wider uppercase focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
            
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Campaign Description</label>
            <input
              id="form-coupon-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 20% discount on all orders over $50"
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
            
          </div>

          {/* Discount Type Selector */}
          <div>
            <label className="block font-medium text-zinc-700 mb-1">Discount Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDiscountType('percentage')}
                className={`p-2 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                discountType === 'percentage' ?
                'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold' :
                'border-zinc-200 hover:bg-zinc-50 text-zinc-700'}`
                }>
                
                Percentage (%)
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('fixed_amount')}
                className={`p-2 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                discountType === 'fixed_amount' ?
                'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold' :
                'border-zinc-200 hover:bg-zinc-50 text-zinc-700'}`
                }>
                
                Fixed Amount ($)
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('free_shipping')}
                className={`p-2 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                discountType === 'free_shipping' ?
                'border-amber-600 bg-amber-50 text-amber-900 font-semibold' :
                'border-zinc-200 hover:bg-zinc-50 text-zinc-700'}`
                }>
                
                Free Shipping
              </button>
            </div>
          </div>

          {/* Discount Value & Min Spend */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">
                {discountType === 'percentage' ? 'Percentage Value (%)' : 'Deduction Amount ($)'}
              </label>
              <input
                id="form-coupon-value"
                type="number"
                min="1"
                max={discountType === 'percentage' ? 100 : 10000}
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
              
            </div>
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Minimum Cart Spend ($)</label>
              <input
                id="form-coupon-min-spend"
                type="number"
                min="0"
                required
                value={minSpend}
                onChange={(e) => setMinSpend(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
              
            </div>
          </div>

          {/* Usage Limit & Customer Tier */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Total Max Usage Limit</label>
              <input
                id="form-coupon-usage-limit"
                type="number"
                min="1"
                required
                value={usageLimit}
                onChange={(e) => setUsageLimit(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
              
            </div>
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Customer Eligibility</label>
              <select
                id="form-coupon-tier"
                value={customerTierLimit}
                onChange={(e) => setCustomerTierLimit(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-hidden cursor-pointer">
                
                <option value="all">All Shoppers</option>
                <option value="vip">VIP Tier Only</option>
                <option value="new">First-Time Customers Only</option>
              </select>
            </div>
          </div>

          {/* Start & Expiry Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Valid From</label>
              <input
                id="form-coupon-start-date"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
              
            </div>
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Expiration Date</label>
              <input
                id="form-coupon-end-date"
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-hidden" />
              
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer">
              
              Cancel
            </button>
            <button
              id="btn-save-coupon-submit"
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer">
              
              Issue Promo Coupon
            </button>
          </div>
        </form>
      </div>
    </div>);

};