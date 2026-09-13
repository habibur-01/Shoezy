import React from 'react';
import { TicketPercent } from 'lucide-react';

import { CouponCard } from './CouponCard';







export const CouponsGrid = ({
  coupons,
  onToggleStatus,
  onDeleteCoupon
}) => {
  if (coupons.length === 0) {
    return (
      <div className="py-16 text-center bg-white border border-zinc-200 rounded-xl shadow-xs">
        <TicketPercent className="w-10 h-10 mx-auto mb-2 text-zinc-300" />
        <h3 className="text-sm font-semibold text-zinc-800">No active promotional campaigns</h3>
        <p className="text-xs text-zinc-500 mt-1">
          Generate custom coupons to incentivize customer acquisitions and repeat cart checkouts.
        </p>
      </div>);

  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {coupons.map((coupon) =>
      <CouponCard
        key={coupon.id}
        coupon={coupon}
        onToggleStatus={onToggleStatus}
        onDeleteCoupon={onDeleteCoupon} />

      )}
    </div>);

};