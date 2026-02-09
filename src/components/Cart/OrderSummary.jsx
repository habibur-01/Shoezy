import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import LoadingSpin from "../common/loader/LoadingSpin";
import { getBillingAddress, hasBillingAddress } from "../../server/billing/billing";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { sethasAdrress } from "../../redux/features/initial/initialSlice";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({ cartItems, couponError = "", shipping = 0, isApplying, onApplyCoupon }) => {
  const [coupon, setCoupon] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Is address available
  const { data: hasAddress } = useQuery({
    queryKey: ["hasAddress"],
    queryFn: async () => {
      const result = await hasBillingAddress();
      dispatch(sethasAdrress(true))
      return result?.data?.data;
    },
  });
 

 

  return (
    <div className="w-full shadow-all">

      <div className="w-full bg-[var(--color-background)] px-5 py-6">
        <div className="pb-4 border-b border-b-[var(--color-border)]">
          <h3 className="text-[var(--color-black)] font-medium mb-0">Order Summary</h3>
        </div>
        <div className="space-y-5 py-6">
          <div className="flex justify-between text-sm text-[var(--text-gray)] ">
            <span>Subtotal</span>
            <span className="text-[var(--color-black)] font-medium">${cartItems?.totalPrice}</span>
          </div>

          <div className="flex justify-between text-sm text-[var(--text-gray)] ">
            <span>Shipping</span>
            <span className="text-green-600 font-medium">
              {shipping === 0 ? "Free" : `$${shipping}`}
            </span>
          </div>
          {cartItems?.discount > 0 && (
            <div className="flex justify-between text-sm text-[var(--text-gray)] ">
              <span>Discount</span>
              <span className="text-red-400 font-medium">
                - ${cartItems?.discount}
              </span>
            </div>
          )}

          {/* Coupon Field */}
          <div className="mt-3">
            <label className="block text-sm text-[var(--text-gray)] mb-1">
              Add coupon code
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter code"
                className="flex-1 border border-gray-200 rounded-md px-3 h-10 text-sm bg-white"
              />
              <button
                onClick={()=> onApplyCoupon(coupon)}
                disabled={!coupon}
                className="bg-green-600 text-white text-sm px-3 h-10 w-16 rounded-md hover:bg-green-700 transition disabled:bg-gray-400 hover:cursor-pointer"
              >
                {isApplying ? <LoadingSpin /> : "Apply"}
              </button>
            </div>
            {couponError && <p className="text-red-600 text-xs mt-1 pl-1">{couponError}</p>}
          </div>
        </div>

        <div className="border-t border-gray-200 my-3"></div>

        <div className="flex justify-between text-base text-[var(--color-black)] font-medium py-2">
          <span>Total</span>
          <span>${cartItems?.finalPrice + shipping}</span>
        </div>


      </div>
      <button disabled={cartItems.items?.length === 0}  className={`w-full bg-green-600  disabled:bg-gray-300 text-white text-md py-3  hover:bg-green-700 transition hover:cursor-pointer`} onClick={()=>{navigate("/mycart/checkout")}}>
        CHECKOUT
      </button>
    </div>
  );
};

export default OrderSummary;
