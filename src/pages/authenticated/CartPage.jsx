import React, { useEffect, useState } from "react";
import CartItem from "../../components/Cart/CartItem";
import OrderSummary from "../../components/Cart/OrderSummary";
import Container from "../../components/common/Container/Container";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import { getCartItem, removeCouponCode } from "../../server/cart/cart";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../components/common/loader/Loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { decrementCartItem, incrementCartItem, removeItemFromCart } from "../../utils/cartHandler";
import { applyCouponCode as applyCouponAPI } from "../../server/cart/cart";
import { setCarts } from "../../redux/features/cart/cartSlice";
import { setCountCartItem } from "../../redux/features/initial/initialSlice";
import { Loader2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [couponError, setCouponError] = useState("");
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
   const { isAuthenticated } = useSelector((state) => state.auth);
   console.log("🚀 ~ CartPage ~ isAuthenticated:", isAuthenticated)

  // Fetch Cart (Always calculates totals on the backend)
  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["cart"],
    retry: false,
    queryFn: async () => {
      const result = await getCartItem(isAuthenticated);
      return result?.data?.data;
    },
  });

  // Apply coupon mutation
  const { mutate: applyCoupon, isPending: isApplying } = useMutation({
    mutationFn: ({ couponCode }) => applyCouponAPI(couponCode),
    retry: false,
    onSuccess: (data) => {
      setCouponError("");
      toast.success(data?.data?.message || "Coupon applied successfully!");
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (error) => {
      const msg = error?.response?.data?.error || error?.response?.data?.message || "Invalid coupon code";
      setCouponError(msg);
      toast.error(msg);
    },
  });

  // Remove coupon mutation
  const { mutate: removeCoupon, isPending: isRemovingCoupon } = useMutation({
    mutationFn: () => removeCouponCode(),
    retry: false,
    onSuccess: () => {
      setCouponError("");
      toast.info("Coupon removed");
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to remove coupon");
    },
  });

  const handleApplyCoupon = (couponCode) => {
    if (!couponCode) return;
    applyCoupon({ couponCode });
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
  };

  useEffect(() => {
    if (cartItems) {
      const itemsList = cartItems?.items || [];
      dispatch(
        setCarts({
          items: itemsList,
          totalPrice: cartItems?.totalPrice,
          discount: cartItems?.discount,
          finalPrice: cartItems?.finalPrice,
          appliedCoupon: cartItems?.appliedCoupon,
        })
      );
      dispatch(setCountCartItem(itemsList.length));
    }
  }, [cartItems, dispatch]);

  const isOverlayBusy = isUpdatingCart || isApplying || isRemovingCoupon;

  return (
    <Container>
      <Breadcrumb />
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <div className="max-w-6xl mx-auto py-10 flex flex-col lg:flex-row gap-8 relative">
          {/* Backdrop Overlay Loading Spinner for all cart actions */}
          {isOverlayBusy && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-30 flex flex-col items-center justify-center gap-3 rounded-2xl animate-in fade-in duration-150">
              <div className="p-4 bg-stone-900 text-white rounded-2xl shadow-xl flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Updating Cart & Calculating Totals...
                </span>
              </div>
            </div>
          )}

          {/* Cart Table Container */}
          <div className="w-full lg:w-2/3 ">
            {!cartItems?.items || cartItems?.items?.length === 0 ? (
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-12 text-center my-4 space-y-4">
                <div className="w-16 h-16 bg-stone-200 text-stone-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-stone-900">Your shopping cart is empty</h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    You have no items in your shopping bag. Explore our collection and add your favorite shoes!
                  </p>
                </div>
                <Link to="/products" className="inline-block">
                  <button className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer">
                    Explore Shop
                  </button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-transparent border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-3 font-semibold text-xs text-stone-500 uppercase tracking-wider">PRODUCT</th>
                      <th className="py-3 px-3 font-semibold text-xs text-stone-500 uppercase tracking-wider">PRICE</th>
                      <th className="py-3 px-3 font-semibold text-xs text-stone-500 uppercase tracking-wider">SIZE</th>
                      <th className="py-3 px-3 text-center font-semibold text-xs text-stone-500 uppercase tracking-wider">QUANTITY</th>
                      <th className="py-3 px-3 text-center font-semibold text-xs text-stone-500 uppercase tracking-wider">SUBTOTAL</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stone-100">
                    {cartItems?.items?.map((item) => (
                      <CartItem
                        key={item._id}
                        item={item}
                        onIncrement={() =>
                          incrementCartItem(
                            queryClient,
                            item._id,
                            item.quantity,
                            item?.product?.variantStock,
                            setIsUpdatingCart
                          )
                        }
                        onDecrement={() =>
                          decrementCartItem(
                            queryClient,
                            item._id,
                            item.quantity,
                            setIsUpdatingCart
                          )
                        }
                        onRemove={() =>
                          removeItemFromCart(
                            queryClient,
                            dispatch,
                            item._id,
                            setIsUpdatingCart
                          )
                        }
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Backend-Calculated Order Summary */}
          <div className="w-full lg:w-1/3">
            <OrderSummary
              cartItems={{ ...cartItems }}
              discount={cartItems?.discount}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              couponError={couponError}
              isApplying={isApplying}
              isRemovingCoupon={isRemovingCoupon}
            />
          </div>
        </div>
      )}
    </Container>
  );
};

export default CartPage;
