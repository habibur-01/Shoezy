import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Heart, Eye } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToWishlist, removeFromWishlist, checkWishlistStatus } from "../../../server/wishlist/wishlist";
import { increaseWishlistCount, decreaseWishlistCount } from "../../../redux/features/initial/initialSlice";
import { useAuth } from "../../../hooks/useAuth";

const ProductCard = ({ item }) => {
  const { isAuthenticated: hasUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inWishlist, setInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Extract images
  const mainImage =
    item?.images?.cover ||
    item?.image ||
    (typeof item?.images === "string" ? item.images : "/placeholder.jpg");
  const hoverImage =
    item?.images?.gallery?.[0] ||
    mainImage;

  const title = item?.name || item?.title || "Premium Athletic Footwear";
  const brand = item?.brand?.name || item?.brandName || (typeof item?.brand === "string" ? item.brand : "Shoezy");
  const originalPrice = Number(item?.price || 0);
  const price = Number(item?.discount_price || originalPrice);
  const hasDiscount = price > 0 && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const rating = Number(item?.rating ?? 0);
  const reviews = Number(item?.numReviews ?? item?.reviewsCount ?? 0);
  const productId = item?._id || item?.id;
  const categorySlug = typeof item?.category === "object" ? item.category?.slug : item?.category;
  const subCategorySlug = typeof item?.subcategory === "object" ? item.subcategory?.slug : item?.subcategory;
  const productTarget = `/products/${categorySlug || "all"}/${subCategorySlug || "all"}/${item?.slug || productId || ""}`;

  useEffect(() => {
    let isMounted = true;
    const fetchWishlistStatus = async () => {
      if (!hasUser || !productId) {
        setInWishlist(false);
        return;
      }
      const response = await checkWishlistStatus(productId);
      if (isMounted && response?.data?.success) {
        setInWishlist(Boolean(response.data.data?.inWishlist));
      }
    };

    fetchWishlistStatus();
    return () => {
      isMounted = false;
    };
  }, [hasUser, productId]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasUser) {
      toast.warning("Please sign in to save shoes to your wishlist!");
      navigate("/login");
      return;
    }

    if (isWishlistLoading) return;
    setIsWishlistLoading(true);

    try {
      if (inWishlist) {
        const res = await removeFromWishlist(productId);
        if (res?.data?.success) {
          setInWishlist(false);
          dispatch(decreaseWishlistCount());
          toast.info("Removed from wishlist");
        }
      } else {
        const res = await addToWishlist(productId);
        if (res?.data?.success) {
          setInWishlist(true);
          dispatch(increaseWishlistCount());
          toast.success("Saved to your wishlist ❤️");
        }
      }
    } catch {
      toast.error("Wishlist operation failed");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-stone-300 transition-all duration-300">
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 bg-orange-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
            inWishlist
              ? "bg-rose-50 text-rose-600 border border-rose-200"
              : "bg-white/90 backdrop-blur-xs text-stone-600 hover:text-rose-600 hover:bg-white border border-stone-200"
          }`}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              inWishlist ? "fill-rose-600 text-rose-600" : ""
            }`}
          />
        </button>

        {/* Product Images with Hover Transition */}
        <Link to={productTarget} className="block w-full h-full">
          <img
            src={mainImage}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          />
          {hoverImage && hoverImage !== mainImage && (
            <img
              src={hoverImage}
              alt={`${title} alternate`}
              loading="lazy"
              className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </Link>

        {/* Bottom Quick Action Overlay */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 flex gap-2">
          <Link
            to={productTarget}
            className="flex-1 bg-stone-950/90 hover:bg-stone-950 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
              {brand}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-stone-700">{rating}</span>
              <span className="text-[10px] text-stone-400">({reviews})</span>
            </div>
          </div>

          <Link to={productTarget}>
            <h3 className="text-sm sm:text-base font-bold text-stone-900 line-clamp-2 hover:text-orange-600 transition-colors leading-snug">
              {title}
            </h3>
          </Link>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline justify-between pt-2 border-t border-stone-100">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-stone-950">
              ${price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-400 line-through">
                ${originalPrice}
              </span>
            )}
          </div>
          <Link
            to={productTarget}
            className="text-[11px] font-bold uppercase tracking-wider text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Select Size</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
