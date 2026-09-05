import React, { useState } from "react";
import { toast } from "react-toastify";
import LoadingSpin from "../common/loader/LoadingSpin";
import { hasBillingAddress } from "../../server/billing/billing";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { sethasAdrress } from "../../redux/features/initial/initialSlice";
import { useNavigate } from "react-router-dom";

import { Tag, X, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const OrderSummary = ({
  cartItems,
  couponError = "",
  shipping = 0,
  isApplying,
  isRemovingCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [coupon, setCoupon] = useState("");
  const { isAuthenticated: hasUser } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Is address available
  const { data: hasAddress } = useQuery({
    queryKey: ["hasAddress"],
    queryFn: async () => {
      const result = await hasBillingAddress();
      dispatch(sethasAdrress(true));
      return result?.data?.data;
    },
  });

  const appliedCoupon = cartItems?.appliedCoupon;
  const discountAmount = cartItems?.discount || 0;
  const totalPrice = cartItems?.totalPrice || 0;
  const finalPrice = cartItems?.finalPrice !== undefined ? cartItems.finalPrice : totalPrice;

  const handleApply = () => {
    if (!coupon.trim()) return;
    onApplyCoupon(coupon.trim());
    setCoupon("");
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-200 bg-stone-50/50">
        <h3 className="text-base font-bold text-stone-900">Order Summary</h3>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between text-xs font-semibold text-stone-600">
          <span>Subtotal</span>
          <span className="text-stone-900 font-bold">${totalPrice}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-xs font-semibold text-stone-600">
          <span>Shipping</span>
          <span className="text-emerald-600 font-bold">
            {shipping === 0 ? "Free Shipping" : `$${shipping}`}
          </span>
        </div>

        {/* Discount */}
        {discountAmount > 0 && (
          <div className="flex justify-between text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Discount</span>
            </span>
            <span className="font-bold">-${discountAmount}</span>
          </div>
        )}

        {/* Coupon Input or Active Coupon Pill */}
        <div className="pt-2">
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 bg-stone-900 text-white rounded-xl shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block">
                    {appliedCoupon}
                  </span>
                  <span className="text-[10px] text-stone-300">
                    Coupon Active (-${discountAmount})
                  </span>
                </div>
              </div>

              <button
                onClick={onRemoveCoupon}
                disabled={isRemovingCoupon}
                className="p-1 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition cursor-pointer"
                title="Remove coupon"
              >
                {isRemovingCoupon ? <LoadingSpin /> : <X className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-600">
                Have a coupon code?
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  placeholder="Enter coupon code"
                  className="flex-1 border border-stone-200 rounded-xl px-3.5 h-10 text-xs font-medium bg-white focus:outline-none focus:border-stone-900 transition"
                />
                <button
                  onClick={handleApply}
                  disabled={!coupon.trim() || isApplying}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-4 h-10 rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[70px]"
                >
                  {isApplying ? <LoadingSpin /> : "Apply"}
                </button>
              </div>
              {couponError && (
                <p className="text-red-600 text-[11px] font-medium pt-1">
                  {couponError}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-stone-200 my-2"></div>

        {/* Total Amount */}
        <div className="flex justify-between items-center py-1">
          <span className="text-sm font-bold text-stone-900">Total</span>
          <span className="text-lg font-extrabold text-stone-900">
            ${finalPrice + shipping}
          </span>
        </div>
      </div>

      <div className="p-4 bg-stone-50 border-t border-stone-200">
        <button
          disabled={!cartItems?.items || cartItems?.items?.length === 0}
          className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed shadow-md uppercase tracking-wider"
          onClick={() => {
            if (!hasUser) {
              toast.warning("Please login first to proceed with checkout!");
              navigate("/login");
              return;
            }
            navigate("/mycart/checkout");
          }}
        >
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
