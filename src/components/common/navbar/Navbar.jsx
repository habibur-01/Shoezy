/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  LogOut,
  Package,
  MapPin,
  Sparkles,
  Loader2,
  X,
  ChevronDown,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { totalCartItem } from "../../../server/cart/cart";
import { getWishlistCount } from "../../../server/wishlist/wishlist";
import {
  setCountCartItem,
  setCountWishlistItem,
  setCategories,
} from "../../../redux/features/initial/initialSlice";
import { getProducts } from "../../../server/product/product";
import { toast } from "react-toastify";
import MobileNavbar from "./MobileNavbar";
import MegaMenu from "./MegaMenu";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../api";
import { GET_NAVBAR_ENDPOINT } from "../../../endpoint";

const Navbar = () => {
  const { logout } = useAuth();
  const { user, isAuthenticated: hasUser } = useSelector((state) => state.auth);
  const categoriesFromState = useSelector((state) => state.initial.categories);
  const categoryFallback = useSelector((state) => state.initial.category);
  const categories = useMemo(() => {
    return categoriesFromState && categoriesFromState.length > 0
      ? categoriesFromState
      : categoryFallback && categoryFallback.length > 0
      ? categoryFallback
      : [];
  }, [categoriesFromState, categoryFallback]);

  const cartItemNum = useSelector((state) => state.initial.countCartItem);
  const wishlistItemNum = useSelector((state) => state.initial.countWishlistItem);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Mega Menu Dropdown States
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const closeTimeoutRef = useRef(null);

  const handleCategoryMouseEnter = (cat) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveCategory(cat);
    setIsMegaMenuOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
      setActiveCategory(null);
    }, 200);
  };

  const handleMegaMenuMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
      setActiveCategory(null);
    }, 150);
  };

  const handleCloseMegaMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsMegaMenuOpen(false);
    setActiveCategory(null);
  };

  const handleCategoryClick = (e, cat) => {
    e.preventDefault();
    handleCloseMegaMenu();
    navigate(`/products?category=${cat.slug}`);
  };

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [liveResults, setLiveResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  // Handle logout
  const handleLogOut = async () => {
    try {
      await logout();
      dispatch(setCountWishlistItem(0));
      toast.info("Logged out successfully");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const loadCartItem = async () => {
    try {
      const result = await totalCartItem(hasUser);
      if (result?.data?.success) {
        dispatch(setCountCartItem(result.data?.data));
      }
    } catch (error) {
      console.log("loadCartItem error:", error);
    }

    try {
      if (hasUser) {
        const wishResult = await getWishlistCount();
        if (wishResult?.data?.success) {
          dispatch(setCountWishlistItem(wishResult.data?.data || 0));
        }
      } else {
        dispatch(setCountWishlistItem(0));
      }
    } catch (error) {
      console.log("getWishlistCount error:", error);
      dispatch(setCountWishlistItem(0));
    }
  };

  useEffect(() => {
    loadCartItem();
  }, [hasUser]);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      api
        .get(GET_NAVBAR_ENDPOINT)
        .then((res) => {
          if (res?.data?.success && Array.isArray(res?.data?.data)) {
            dispatch(setCategories(res.data.data));
          }
        })
        .catch((err) => {
          console.error("Navbar category fetch error:", err);
        });
    }
  }, [categories, dispatch]);

  // Debounced live search preview effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await getProducts({
            page: 1,
            limit: 5,
            filters: { search: searchQuery.trim() },
          });
          if (res?.data?.success) {
            setLiveResults(res.data.data?.products || []);
            setShowDropdown(true);
          }
        } catch (err) {
          console.error("Live search error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setLiveResults([]);
        setShowDropdown(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowDropdown(false);
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Athletic Micro-Announcement Bar */}
      <div className="bg-stone-950 text-stone-300 text-[11px] font-medium py-1.5 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-300">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            <span>
              Free Global Express Delivery on orders over $99 • 30-Day Trial Guarantee
            </span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-stone-400">
            <Link
              to="/track-order"
              className="hover:text-white transition flex items-center gap-1"
            >
              <Truck className="w-3 h-3 text-orange-500" />
              <span>Track Order</span>
            </Link>
            <span className="text-stone-700">|</span>
            <Link
              to="/outlets"
              className="hover:text-white transition flex items-center gap-1"
            >
              <MapPin className="w-3 h-3 text-orange-500" />
              <span>Store Locator</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Frosted Luxury Header */}
      <div className="hidden lg:flex w-full h-20 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-6 lg:px-12 xl:px-16 justify-between items-center relative z-40 transition-all shadow-xs">
        {/* Left: Modern Nav Links */}
        <nav className="flex items-center gap-x-6 font-bold text-xs uppercase tracking-wider">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative py-2 transition-colors cursor-pointer ${
                isActive ? "text-orange-600 font-black" : "text-stone-800 hover:text-stone-950"
              }`
            }
          >
            Home
          </NavLink>

          {categories.length > 0 &&
            categories.map((navItem) => {
              const navId = navItem?._id || navItem?.id;
              const activeId = activeCategory?._id || activeCategory?.id;
              const isActiveInMenu = Boolean(
                activeId && navId && activeId === navId && isMegaMenuOpen
              );
              const isCurrentUrlCategory =
                (location.pathname === "/products" &&
                  new URLSearchParams(location.search).get("category") === navItem.slug) ||
                location.pathname === `/products/${navItem.slug}` ||
                location.pathname.startsWith(`/products/${navItem.slug}/`);
              const isHighlighted = isActiveInMenu || isCurrentUrlCategory;

              return (
                <div
                  key={navId}
                  className="relative flex items-center py-5"
                  onMouseEnter={() => handleCategoryMouseEnter(navItem)}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <button
                    onClick={(e) => handleCategoryClick(e, navItem)}
                    className={`relative py-1 transition-colors cursor-pointer outline-none flex items-center gap-1 ${
                      isHighlighted
                        ? "text-orange-600 font-black"
                        : "text-stone-800 hover:text-stone-950"
                    }`}
                  >
                    <span>{navItem.name}</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                    {isHighlighted && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-orange-600 rounded-full"></span>
                    )}
                  </button>
                </div>
              );
            })}

          <NavLink
            to="/outlets"
            className={({ isActive }) =>
              `relative py-2 transition-colors cursor-pointer ${
                isActive ? "text-orange-600 font-black" : "text-stone-800 hover:text-stone-950"
              }`
            }
          >
            Outlets
          </NavLink>

          <Link
            to="/products?discount=true"
            className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors text-[11px] font-extrabold"
          >
            <Sparkles className="w-3 h-3" />
            <span>Sale</span>
          </Link>
        </nav>

        {/* Center: Brand Athletic Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="flex items-center gap-1 group">
            <span className="font-black text-2xl tracking-tighter text-stone-950 group-hover:text-stone-800 transition-colors">
              SHOEZY<span className="text-orange-600">.</span>
            </span>
          </Link>
        </div>

        {/* Right Section: Search, Wishlist, Cart & Profile */}
        <div className="flex items-center gap-x-4">
          {/* Capsule Search Bar */}
          <div className="relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search shoes, trail, race..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (liveResults.length > 0) setShowDropdown(true);
                }}
                className="w-[200px] xl:w-[260px] h-9.5 pl-9 pr-8 rounded-full bg-stone-100 hover:bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-400 focus:bg-white focus:w-[280px] transition-all"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setShowDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </form>

            {/* Instant Search Dropdown */}
            {showDropdown && searchQuery.trim().length >= 2 && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-2.5 border-b border-stone-100 bg-stone-50/80 flex items-center justify-between text-[11px] font-bold text-stone-500 px-3">
                  <span>Live Matches</span>
                  <span>{liveResults.length} found</span>
                </div>

                {liveResults.length > 0 ? (
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-stone-100">
                    {liveResults.map((product) => {
                      const image =
                        product?.images?.cover ||
                        (typeof product?.images === "string"
                          ? product.images
                          : "/placeholder.jpg");
                      const price = product?.discount_price || product?.price || 0;

                      return (
                        <Link
                          key={product._id}
                          to={`/product/${product.slug || product._id}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 p-2.5 hover:bg-stone-50 transition-colors"
                        >
                          <img
                            src={image}
                            alt={product.name}
                            className="w-11 h-11 rounded-lg object-cover bg-stone-100 border border-stone-200"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-stone-900 truncate">
                              {product.name}
                            </h4>
                            <span className="text-[10px] text-stone-500 font-medium capitalize">
                              {product.brand || "Footwear"}
                            </span>
                          </div>
                          <span className="text-xs font-black text-stone-950">
                            ${price}
                          </span>
                        </Link>
                      );
                    })}

                    <button
                      onClick={handleSearchSubmit}
                      className="w-full py-2 px-3 bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs text-center transition cursor-pointer"
                    >
                      View All Results &rarr;
                    </button>
                  </div>
                ) : (
                  <div className="py-5 px-3 text-center text-xs text-stone-500">
                    No footwear matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <Link
            to="/account/wishlist"
            className="relative w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200/80 flex items-center justify-center text-stone-700 hover:text-stone-950 transition cursor-pointer"
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistItemNum > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistItemNum}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <Link
            to="/account/mycart"
            className="relative flex items-center gap-2 h-9 px-3 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden xl:inline text-[11px] font-extrabold uppercase tracking-wider">Cart</span>
            <span className="bg-orange-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {cartItemNum || 0}
            </span>
          </Link>

          {/* User Account / Dropdown */}
          <div className="relative group">
            {hasUser ? (
              <button className="p-0.5 rounded-full border border-stone-300 hover:border-stone-950 transition cursor-pointer flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.firstName || "Profile"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-stone-950 text-white font-bold text-xs flex items-center justify-center uppercase">
                    {user?.firstName ? user.firstName[0] : (user?.username ? user.username[0] : <User className="w-3.5 h-3.5" />)}
                  </div>
                )}
              </button>
            ) : (
              <Link
                to="/login"
                className="h-9 px-3.5 rounded-full border border-stone-300 hover:border-stone-950 text-stone-800 hover:text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-stone-500" />
                <span>Sign In</span>
              </Link>
            )}

            {hasUser && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50 p-1.5">
                <div className="px-3 py-2 border-b border-stone-100 mb-1">
                  <p className="text-xs font-black text-stone-900 truncate">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.username || 'Shoezy Member')}
                  </p>
                  <p className="text-[10px] text-stone-500 truncate">{user?.email}</p>
                </div>
                <NavLink
                  to="/account/profile"
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 rounded-xl transition"
                >
                  <User className="w-3.5 h-3.5 text-stone-500" />
                  <span>My Profile</span>
                </NavLink>
                <NavLink
                  to="/account/myorders"
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 rounded-xl transition"
                >
                  <Package className="w-3.5 h-3.5 text-stone-500" />
                  <span>Orders & Returns</span>
                </NavLink>
                <NavLink
                  to="/account/wishlist"
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 rounded-xl transition"
                >
                  <Heart className="w-3.5 h-3.5 text-stone-500" />
                  <span>Saved Wishlist</span>
                </NavLink>
                <div className="border-t border-stone-100 my-1"></div>
                <button
                  onClick={handleLogOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Mega Menu Dropdown */}
      <MegaMenu
        category={activeCategory}
        isOpen={isMegaMenuOpen}
        onClose={handleCloseMegaMenu}
        onMouseEnter={handleMegaMenuMouseEnter}
        onMouseLeave={handleMegaMenuMouseLeave}
      />

      {/* Mobile Device Navbar Component */}
      <MobileNavbar
        hasUser={hasUser}
        user={user}
        categories={categories}
        cartItemNum={cartItemNum}
        wishlistItemNum={wishlistItemNum}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchSubmit={handleSearchSubmit}
        handleLogOut={handleLogOut}
      />
    </header>
  );
};

export default Navbar;
