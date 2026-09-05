import React, { memo } from "react";
import { ShoppingBag, Loader2, Tag, ShieldCheck } from "lucide-react";

const CheckoutSummary = memo(
  ({
    finalPrice = 0,
    totalPrice = 0,
    discount = 0,
    appliedCoupon = "",
    deliveryFee = 0,
    vat = 0,
    serviceFee = 0,
    products = [],
    isCalculating = false,
  }) => {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs relative overflow-hidden">
        {/* Backdrop Overlay Loading Spinner while calculating */}
        {isCalculating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs z-30 flex flex-col items-center justify-center gap-2 animate-in fade-in duration-150">
            <div className="p-3 bg-stone-900 text-white rounded-xl shadow-lg flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Calculating Order Totals...
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-base font-bold text-stone-900">Order Summary</h2>
            <p className="text-xs text-stone-500 font-medium">
              {products?.length || 0} {products?.length === 1 ? "item" : "items"} in cart
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        {/* Product Items List */}
        <div className="py-4 space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-stone-100">
          {products && products.length > 0 ? (
            products.map((item) => {
              const prod = item?.product || {};
              const image =
                prod?.image ||
                prod?.images?.cover ||
                (typeof prod?.images === "string" ? prod.images : "/placeholder.jpg");
              const size = item?.selectedSize || prod?.variantSize;
              const price = item?.price || prod?.price || 0;
              const subtotal = item?.subtotal || price * item.quantity;

              return (
                <div key={item._id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={image}
                      alt={prod?.name || "Product"}
                      className="w-12 h-12 object-cover rounded-xl bg-stone-100 border border-stone-200 flex-shrink-0"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {prod?.name || "Product"}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                        <span>Qty: {item.quantity}</span>
                        {size && (
                          <span className="px-1.5 py-0.2 bg-stone-100 border border-stone-200 rounded text-[10px] font-bold text-stone-700">
                            Size: {size}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-stone-900 flex-shrink-0">
                    ${subtotal}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-stone-500 py-4 text-center">No items in cart</p>
          )}
        </div>

        {/* Calculation Rows */}
        <div className="border-t border-stone-200 pt-4 space-y-2.5">
          <div className="flex justify-between text-xs font-semibold text-stone-600">
            <span>Subtotal</span>
            <span className="text-stone-900 font-bold">${totalPrice}</span>
          </div>

          <div className="flex justify-between text-xs font-semibold text-stone-600">
            <span>Shipping</span>
            <span className="text-emerald-600 font-bold">
              {deliveryFee === 0 ? "Free" : `$${deliveryFee}`}
            </span>
          </div>

          {serviceFee > 0 && (
            <div className="flex justify-between text-xs font-semibold text-stone-600">
              <span>Service Fee</span>
              <span className="text-stone-900 font-bold">${serviceFee}</span>
            </div>
          )}

          {vat > 0 && (
            <div className="flex justify-between text-xs font-semibold text-stone-600">
              <span>VAT / Tax</span>
              <span className="text-stone-900 font-bold">${vat}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Coupon Discount {appliedCoupon ? `(${appliedCoupon})` : ""}</span>
              </span>
              <span className="font-bold">-${discount}</span>
            </div>
          )}
        </div>

        {/* Final Total */}
        <div className="border-t border-stone-200 mt-4 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-stone-900">Total Payable</h3>
              <p className="text-[10px] text-stone-400 font-medium">Includes taxes & fee calculations</p>
            </div>
            <span className="text-xl font-black text-stone-900">
              ${finalPrice + deliveryFee + vat + serviceFee}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-stone-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Guaranteed Safe & Secure Checkout</span>
        </div>
      </div>
    );
  }
);

export default CheckoutSummary;