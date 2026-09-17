import React, { useState } from 'react';
import {
  Percent,
  DollarSign,
  Truck,
  Copy,
  Check,
  Trash2 } from
'lucide-react';








export const CouponCard = ({
  coupon,
  onToggleStatus,
  onDeleteCoupon
}) => {
  const [copied, setCopied] = useState(false);

  const usagePercent = Math.min(
    100,
    Math.round(coupon.usedCount / coupon.usageLimit * 100)
  );
  const isExpired = new Date(coupon.endDate) < new Date();

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`p-5 bg-white border rounded-xl shadow-xs transition-all relative flex flex-col justify-between ${
      !coupon.isActive || isExpired ?
      'border-zinc-200 opacity-75' :
      'border-zinc-200 hover:border-indigo-300'}`
      }>
      
      {/* Card top */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`p-2 rounded-lg ${
              coupon.discountType === 'percentage' ?
              'bg-indigo-50 text-indigo-700' :
              coupon.discountType === 'fixed_amount' ?
              'bg-emerald-50 text-emerald-700' :
              'bg-amber-50 text-amber-700'}`
              }>
              
              {coupon.discountType === 'percentage' ?
              <Percent className="w-4 h-4" /> :
              coupon.discountType === 'fixed_amount' ?
              <DollarSign className="w-4 h-4" /> :

              <Truck className="w-4 h-4" />
              }
            </span>
            <div>
              <span className="text-base font-mono font-bold text-zinc-900 tracking-wider">
                {coupon.code}
              </span>
              <div className="text-[10px] text-zinc-400 capitalize">
                {coupon.customerTierLimit === 'all' ?
                'All Customers' :
                `${coupon.customerTierLimit} Tier Only`}
              </div>
            </div>
          </div>

          {/* Copy button */}
          <button
            id={`copy-coupon-${coupon.code}`}
            onClick={handleCopy}
            className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
            title="Copy code to clipboard">
            
            {copied ?
            <Check className="w-4 h-4 text-emerald-600" /> :

            <Copy className="w-4 h-4" />
            }
          </button>
        </div>

        <p className="text-xs text-zinc-600 mb-4 leading-relaxed">{coupon.description}</p>

        {/* Offer value banner */}
        <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg mb-4 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Discount:</span>
            <span className="font-bold text-zinc-900">
              {coupon.discountType === 'percentage' ?
              `${coupon.discountValue}% OFF` :
              coupon.discountType === 'fixed_amount' ?
              `$${coupon.discountValue}.00 OFF` :
              'Free Expedited Shipping'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>Min Spend: ${coupon.minSpend}</span>
            <span>Category: {coupon.validCategory || 'All'}</span>
          </div>
        </div>

        {/* Usage Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>Redemption Progress</span>
            <span className="font-mono font-medium text-zinc-700">
              {coupon.usedCount} / {coupon.usageLimit} ({usagePercent}%)
            </span>
          </div>
          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
            <div
              style={{ width: `${usagePercent}%` }}
              className={`h-full rounded-full transition-all ${
              usagePercent > 90 ? 'bg-amber-500' : 'bg-indigo-600'}`
              } />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
            <span>Per-user cap:</span>
            <span className="font-medium text-zinc-600">{coupon.usageLimitPerUser || 1} use{(coupon.usageLimitPerUser || 1) > 1 ? 's' : ''} max</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Status & Actions */}
      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            id={`toggle-coupon-active-${coupon.id}`}
            onClick={() => onToggleStatus(coupon.id)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors cursor-pointer ${
            coupon.isActive && !isExpired ?
            'bg-emerald-50 text-emerald-700 border-emerald-200' :
            'bg-zinc-100 text-zinc-600 border-zinc-200'}`
            }>
            
            {isExpired ? 'Expired' : coupon.isActive ? 'Active' : 'Disabled'}
          </button>
          <span className="text-[10px] text-zinc-400">Exp: {coupon.endDate}</span>
        </div>

        <button
          id={`delete-coupon-${coupon.id}`}
          onClick={() => onDeleteCoupon(coupon.id, coupon.code)}
          className="p-1 text-zinc-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
          title="Revoke and delete coupon">
          
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>);

};