import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToWishlist, removeFromWishlist, checkWishlistStatus } from "../../server/wishlist/wishlist";
import { increaseWishlistCount, decreaseWishlistCount } from "../../redux/features/initial/initialSlice";
import { useAuth } from "../../hooks/useAuth";

const ShopProductCard = ({ product, viewMode }) => {
  const { isAuthenticated: hasUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inWishlist, setInWishlist] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const categorySlug = typeof product?.category === "object" ? product?.category?.slug : (product?.category || "all");
  const subCategorySlug = typeof product?.subcategory === "object" ? product?.subcategory?.slug : (product?.subcategory || "all");
  const coverImage = product?.images?.cover || (typeof product?.images === "string" ? product.images : "/placeholder.jpg");
  const displayPrice = product?.discount_price || product?.price || 0;
  const originalPrice = product?.price || 0;
  const rating = product?.rating || 5;

  useEffect(() => {
    const checkStatus = async () => {
      if (hasUser && product?._id) {
        const res = await checkWishlistStatus(product._id);
        if (res?.data?.success) {
          setInWishlist(res.data.data?.inWishlist || false);
        }
      }
    };
    checkStatus();
  }, [hasUser, product?._id]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // REQUIREMENT: Check if user is logged in
    if (!hasUser) {
      toast.warning("Please login first to add items to your wishlist!");
      navigate("/login");
      return;
    }

    if (loadingWishlist) return;
    setLoadingWishlist(true);

    try {
      if (inWishlist) {
        const res = await removeFromWishlist(product._id);
        if (res?.data?.success) {
          setInWishlist(false);
          dispatch(decreaseWishlistCount());
          toast.info("Removed from wishlist");
        } else {
          toast.error(res?.data?.message || "Failed to remove from wishlist");
        }
      } else {
        const res = await addToWishlist(product._id);
        if (res?.data?.success) {
          setInWishlist(true);
          dispatch(increaseWishlistCount());
          toast.success("Added to wishlist ❤️");
        } else {
          toast.error(res?.data?.message || "Failed to add to wishlist");
        }
      }
    } catch (err) {
      toast.error("Wishlist operation failed");
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <div className={`flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row'} bg-white rounded-xl border border-stone-200 overflow-hidden group hover:shadow-lg transition-all duration-300 relative`}>
      <div className="relative overflow-hidden">
        {product?.discount_price && originalPrice > product.discount_price && (
          <span className="absolute top-3 left-3 bg-stone-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md z-10 uppercase tracking-wider">
            SALE
          </span>
        )}

        {/* Wishlist Heart Button Icon */}
        <button
          onClick={handleWishlistToggle}
          disabled={loadingWishlist}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full shadow-md transition-all cursor-pointer ${
            inWishlist
              ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
              : "bg-white/90 text-stone-600 hover:text-red-600 hover:bg-white border border-stone-200"
          }`}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 transition-transform active:scale-125 ${inWishlist ? "fill-red-600 text-red-600" : ""}`} />
        </button>

        <Link to={`/products/${categorySlug}/${subCategorySlug}/${product?.slug}`}>
          <img
            src={coverImage}
            alt={product?.name || "Product"}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </Link>
      </div>

      <div className={`p-5 flex ${viewMode === 'grid' ? "flex-col justify-between flex-1" : 'flex-row flex-1 justify-between items-center'}`}>
        <div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 block">
            {product?.brand || "Brand"}
          </span>
          <Link to={`/products/${categorySlug}/${subCategorySlug}/${product?.slug}`}>
            <h3 className="font-semibold text-stone-900 text-sm mb-2 line-clamp-2 hover:text-red-600 transition-colors cursor-pointer">
              {product?.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-xs ${i < Math.floor(rating) ? 'text-amber-400' : 'text-stone-200'}`}>
                ★
              </span>
            ))}
            <span className="text-[11px] text-stone-400 font-medium ml-1">({product?.numReviews || 0})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-stone-900">
              ${displayPrice}
            </span>
            {product?.discount_price && originalPrice > product.discount_price && (
              <span className="text-xs text-stone-400 line-through font-medium">
                ${originalPrice}
              </span>
            )}
          </div>
        </div>

        <div className={viewMode === 'grid' ? "mt-4" : ""}>
          <Link to={`/products/${categorySlug}/${subCategorySlug}/${product?.slug}`}>
            <button className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-2.5 px-5 rounded-lg transition-colors cursor-pointer shadow-xs">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;