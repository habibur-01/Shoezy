import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingBag, Loader2, ArrowRight, Lock } from "lucide-react";
import Container from "../../components/common/Container/Container";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import { getWishlist, removeFromWishlist } from "../../server/wishlist/wishlist";
import { addToCart } from "../../server/cart/cart";
import { useDispatch } from "react-redux";
import { decreaseWishlistCount, increaseItemCount, setCountWishlistItem } from "../../redux/features/initial/initialSlice";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

const WishlistPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingCartId, setAddingCartId] = useState(null);
  const dispatch = useDispatch();

  const fetchWishlistData = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await getWishlist();
      if (res?.data?.success) {
        setWishlistItems(res.data.data || []);
        dispatch(setCountWishlistItem(res.data.data?.length || 0));
      } else if (res?.status === 401) {
        toast.warning("Please login first to view your saved wishlist!");
      }
    } catch (error) {
      console.error("fetchWishlistData error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, [isAuthenticated]);

  const handleRemove = async (productId) => {
    try {
      const res = await removeFromWishlist(productId);
      if (res?.data?.success) {
        setWishlistItems((prev) => prev.filter((item) => item.product?._id !== productId));
        dispatch(decreaseWishlistCount());
        toast.info("Item removed from wishlist");
      } else {
        toast.error(res?.data?.message || "Failed to remove item");
      }
    } catch (error) {
      toast.error("Error removing item");
    }
  };

  const handleMoveToCart = async (product) => {
    try {
      setAddingCartId(product._id);
      const cartItem = {
        product: product._id,
        name: product.name,
        image: product.images?.cover || (typeof product.images === "string" ? product.images : "/placeholder.jpg"),
        price: product.discount_price || product.price,
        quantity: 1,
      };

      const result = await addToCart(cartItem);
      if (result?.data?.success) {
        dispatch(increaseItemCount());
        toast.success("Added to cart!");
      } else {
        toast.error(result?.data?.message || "Failed to add to cart");
      }
    } catch (error) {
      toast.error("Error adding to cart");
    } finally {
      setAddingCartId(null);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div className="min-h-[450px] flex items-center justify-center flex-col gap-3 py-16">
          <Loader2 className="w-8 h-8 text-stone-900 animate-spin" />
          <p className="text-stone-500 font-semibold text-xs uppercase tracking-widest">
            Loading Your Saved Wishlist...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Breadcrumb />
      <div className="max-w-5xl mx-auto px-4 py-8 mb-10">
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-600 fill-red-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
              My Saved Wishlist
            </h1>
            {isAuthenticated && (
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold">
                {wishlistItems.length} items
              </span>
            )}
          </div>

          <Link
            to="/products"
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 transition"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Unauthenticated User Warning Prompt */}
        {!isAuthenticated ? (
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto my-8 space-y-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">Login Required for Wishlist</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Please log in to your account to save items to your wishlist and access them across devices.
              </p>
            </div>
            <Link to="/login" className="inline-block">
              <button className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer">
                Log In to View Wishlist
              </button>
            </Link>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto my-8 space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Heart className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">Your wishlist is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our store and save your favorite items to view them later.
              </p>
            </div>
            <Link to="/products" className="inline-block">
              <button className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer">
                Discover Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden divide-y divide-stone-100">
            {wishlistItems.map((item) => {
              const prod = item.product;
              if (!prod) return null;

              const categorySlug =
                typeof prod.category === "object"
                  ? prod.category?.slug
                  : prod.category || "all";
              const subCategorySlug =
                typeof prod.subcategory === "object"
                  ? prod.subcategory?.slug
                  : prod.subcategory || "all";
              const image =
                prod.images?.cover ||
                (typeof prod.images === "string" ? prod.images : "/placeholder.jpg");
              const price = prod.discount_price || prod.price || 0;
              const isOutOfStock = prod.stock_quantity <= 0;

              return (
                <div
                  key={item._id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition"
                >
                  {/* Product Details */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Link to={`/products/${categorySlug}/${subCategorySlug}/${prod.slug}`}>
                      <img
                        src={image}
                        alt={prod.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-stone-100 border border-stone-200 flex-shrink-0 cursor-pointer"
                      />
                    </Link>

                    <div className="space-y-1 flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        {prod.brand || "Brand"}
                      </span>
                      <Link to={`/products/${categorySlug}/${subCategorySlug}/${prod.slug}`}>
                        <h3 className="text-sm font-bold text-stone-900 hover:text-red-600 transition truncate cursor-pointer">
                          {prod.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-sm font-extrabold text-stone-900">
                          ${price}
                        </span>
                        {prod.discount_price && prod.price > prod.discount_price && (
                          <span className="text-xs text-stone-400 line-through">
                            ${prod.price}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ml-2 ${
                            isOutOfStock
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {isOutOfStock ? "Out of Stock" : "In Stock"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleMoveToCart(prod)}
                      disabled={isOutOfStock || addingCartId === prod._id}
                      className="py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {addingCartId === prod._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ShoppingBag className="w-3.5 h-3.5" />
                      )}
                      <span>{isOutOfStock ? "Unavailable" : "Add to Cart"}</span>
                    </button>

                    <button
                      onClick={() => handleRemove(prod._id)}
                      className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
};

export default WishlistPage;
