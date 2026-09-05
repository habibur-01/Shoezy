import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ShoppingBag, ArrowRight, ShieldCheck, Tag, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCartItem, removeCartItem } from "../../../server/cart/cart";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BagDrawer = ({ isOpen, onClose, user, onProceedToAuth }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch real dynamic cart items (handles offline guest_cart & online user cart)
  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await getCartItem();
      return res?.data?.data;
    },
    enabled: isOpen,
  });

  const items = cartData?.items || [];
  const subtotal = cartData?.totalPrice || items.reduce((sum, i) => sum + (i.subtotal || i.price * i.quantity), 0);
  const discountAmount = cartData?.discount || 0;
  const total = cartData?.finalPrice || subtotal - discountAmount;

  const handleRemove = async (itemId) => {
    try {
      const res = await removeCartItem(itemId);
      if (res?.data?.success) {
        toast.info("Item removed from bag");
        queryClient.invalidateQueries(["cart"]);
      }
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleCheckoutClick = () => {
    onClose();
    if (!user) {
      onProceedToAuth();
    } else {
      navigate("/mycart/checkout");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-10"
          >
            <div className="w-screen max-w-md bg-[#fcfbf9] border-l border-stone-200 shadow-2xl flex flex-col justify-between">
              {/* Header */}
              <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-stone-900" />
                  <h2 className="font-serif-editorial text-xl text-stone-900 font-medium">
                    Your Shopping Bag ({items.length})
                  </h2>
                </div>

                <button
                  onClick={onClose}
                  id="close-bag-drawer-btn"
                  className="p-1 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {/* Guest Message */}
                {!user && (
                  <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>
                        Sign in to save your bag & proceed to checkout
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onProceedToAuth();
                      }}
                      className="font-semibold text-amber-900 underline ml-2 shrink-0 cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                )}

                {/* Bag Items */}
                {items.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-stone-600">Your shopping bag is empty</p>
                    <button
                      onClick={() => {
                        onClose();
                        navigate("/products");
                      }}
                      className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold transition hover:bg-stone-800 cursor-pointer"
                    >
                      Explore Products
                    </button>
                  </div>
                ) : (
                  items.map((item) => {
                    const prod = item.product || {};
                    const image =
                      prod.image ||
                      prod.images?.cover ||
                      (typeof prod.images === "string" ? prod.images : "/placeholder.jpg");
                    const name = prod.name || "Product";
                    const color = item.selectedColor || prod.variantColor;
                    const size = item.selectedSize || prod.variantSize;

                    return (
                      <div
                        key={item._id}
                        className="flex space-x-4 p-3 bg-white rounded-xl border border-stone-200/80 shadow-2xs relative"
                      >
                        <img
                          src={image}
                          alt={name}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                        />

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="pr-6">
                            <h3 className="text-xs font-semibold text-stone-900 truncate">
                              {name}
                            </h3>
                            <p className="text-[11px] text-stone-500">
                              {color ? `Color: ${color}` : ""} {size ? `• Size: ${size}` : ""}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-stone-500 font-medium">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-xs font-bold text-stone-900">
                              ${item.subtotal || item.price * item.quantity}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemove(item._id)}
                          className="absolute top-2 right-2 p-1 text-stone-400 hover:text-red-600 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Subtotal & Checkout */}
              <div className="p-6 bg-white border-t border-stone-200 space-y-4">
                <div className="space-y-2 text-xs">
                  {/* Subtotal */}
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-stone-900">${subtotal}</span>
                  </div>

                  {/* Discount */}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount</span>
                      <span>-${discountAmount}</span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping</span>
                    <span className="text-emerald-700 font-medium">Complimentary</span>
                  </div>

                  {/* Total */}
                  <div className="border-t border-stone-100 pt-2 flex justify-between text-sm font-semibold text-stone-900">
                    <span>Estimated Total</span>
                    <span className="font-extrabold">${total}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckoutClick}
                  disabled={items.length === 0}
                  id="bag-checkout-btn"
                  className="w-full py-3 px-5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-stone-50 rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>{user ? "Proceed to Checkout" : "Sign in to Checkout"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Security / Returns */}
                <div className="flex items-center justify-center space-x-1.5 text-[11px] text-stone-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                  <span>30-Day Effortless Returns & Global Courier</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BagDrawer;