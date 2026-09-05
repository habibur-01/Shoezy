import React, { useState, useEffect } from "react";
import { ShoppingBag, Heart, Truck, ShieldCheck, RefreshCw, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToWishlist, removeFromWishlist, checkWishlistStatus } from "../../server/wishlist/wishlist";
import { increaseWishlistCount, decreaseWishlistCount } from "../../redux/features/initial/initialSlice";
import { useAuth } from "../../hooks/useAuth";

const AddToCart = ({
  id,
  isloading,
  quantity,
  onIncrease,
  onDecrease,
  handleSubmit,
}) => {
  const { isAuthenticated: hasUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inWishlist, setInWishlist] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (hasUser && id) {
        const res = await checkWishlistStatus(id);
        if (res?.data?.success) {
          setInWishlist(res.data.data?.inWishlist || false);
        }
      }
    };
    checkStatus();
  }, [hasUser, id]);

  const handleWishlistToggle = async () => {
    // REQUIREMENT: Check if user is logged in
    if (!hasUser) {
      toast.warning("Please login first to add items to your wishlist!");
      navigate("/login");
      return;
    }

    if (!id || loadingWishlist) return;
    setLoadingWishlist(true);

    try {
      if (inWishlist) {
        const res = await removeFromWishlist(id);
        if (res?.data?.success) {
          setInWishlist(false);
          dispatch(decreaseWishlistCount());
          toast.info("Removed from wishlist");
        } else {
          toast.error(res?.data?.message || "Failed to remove from wishlist");
        }
      } else {
        const res = await addToWishlist(id);
        if (res?.data?.success) {
          setInWishlist(true);
          dispatch(increaseWishlistCount());
          toast.success("Added to wishlist ❤️");
        } else {
          toast.error(res?.data?.message || "Failed to add to wishlist");
        }
      }
    } catch (err) {
      toast.error(err.respoanse.data.message || "Wishlist operation failed" );
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <div className="space-y-6 pt-4 border-t border-stone-200/80">
      {/* Quantity & Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Quantity Stepper */}
        <div className="flex items-center justify-between border border-stone-300 rounded-xl px-3 py-2 bg-stone-50 w-full sm:w-36 flex-shrink-0">
          <button
            type="button"
            onClick={onDecrease}
            className="w-8 h-8 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center font-bold text-stone-700 transition cursor-pointer text-sm"
          >
            -
          </button>
          <span className="font-extrabold text-stone-900 text-sm px-2">{quantity}</span>
          <button
            type="button"
            onClick={onIncrease}
            className="w-8 h-8 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center font-bold text-stone-700 transition cursor-pointer text-sm"
          >
            +
          </button>
        </div>

        {/* Add To Cart Primary Button */}
        <button
          type="button"
          disabled={isloading}
          onClick={() => handleSubmit(id)}
          className="flex-1 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-75"
        >
          {isloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Adding to Cart...</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={loadingWishlist}
          className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
            inWishlist
              ? "bg-rose-50 border-rose-200 text-rose-600 shadow-2xs"
              : "bg-white border-stone-300 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
          }`}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-5 h-5 transition-transform active:scale-125 ${inWishlist ? "fill-rose-600 text-rose-600" : ""}`} />
        </button>
      </div>

      {/* Value Proposition Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/60">
          <Truck className="w-5 h-5 text-stone-700 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-stone-900">Express Delivery</h4>
            <p className="text-[11px] text-stone-500">Ships in 24-48 hours</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/60">
          <ShieldCheck className="w-5 h-5 text-stone-700 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-stone-900">100% Authentic</h4>
            <p className="text-[11px] text-stone-500">Verified quality</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/60">
          <RefreshCw className="w-5 h-5 text-stone-700 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-stone-900">Easy Returns</h4>
            <p className="text-[11px] text-stone-500">30 days return policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
