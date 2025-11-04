import React, { useState } from "react";

const OrderSummary = ({ subtotal = 418, shipping = 0, onApplyCoupon }) => {
  const [coupon, setCoupon] = useState("");

  const handleApply = () => {
    if (onApplyCoupon) {
      onApplyCoupon(coupon);
    }
    setCoupon("");
  };

  return (
    <div className="w-1/3 bg-[var(--color-background)] rounded-md p-5 ml-10 shadow-all">
      <h3 className="text-[var(--color-black)] font-medium mb-4">Order Summary</h3>

      <div className="flex justify-between text-sm text-[var(--text-gray)] mb-2">
        <span>Subtotal</span>
        <span className="text-[var(--color-black)] font-medium">${subtotal}</span>
      </div>

      <div className="flex justify-between text-sm text-[var(--text-gray)] mb-2">
        <span>Shipping</span>
        <span className="text-green-600 font-medium">
          {shipping === 0 ? "Free" : `$${shipping}`}
        </span>
      </div>

      {/* Coupon Field */}
      <div className="mt-3 mb-4">
        <label className="block text-sm text-[var(--text-gray)] mb-1">
          Add coupon code
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter code"
            className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
          />
          <button
            onClick={handleApply}
            className="bg-green-600 text-white text-sm px-3 py-2 rounded-md hover:bg-green-700 transition"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      <div className="flex justify-between text-base text-[var(--color-black)] font-medium mb-4">
        <span>Total</span>
        <span>${subtotal + shipping}</span>
      </div>

      <button className="w-full bg-green-600 text-white text-sm py-2.5 rounded-sm hover:bg-green-700 transition">
        CHECKOUT
      </button>
    </div>
  );
};

export default OrderSummary;
