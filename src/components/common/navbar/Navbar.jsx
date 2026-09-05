import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaRegUser } from "react-icons/fa";
import { MdFavoriteBorder, MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { CiLogout, CiUser } from "react-icons/ci";
import { useEffect, useState, useRef } from "react";
import { totalCartItem } from "../../../server/cart/cart";
import { getWishlistCount } from "../../../server/wishlist/wishlist";
import { setCountCartItem, setCountWishlistItem } from "../../../redux/features/initial/initialSlice";
import { getProducts } from "../../../server/product/product";
import { toast } from "react-toastify";
import { Loader2, X, User } from "lucide-react";
import MobileNavbar from "./MobileNavbar";
import { useAuth } from "../../../hooks/useAuth";

const Navbar = () => {
  const { logout } = useAuth();
  const { user, isAuthenticated:hasUser } = useSelector((state) => state.auth);
  const categories = useSelector((state) => state.initial.categories);
  const cartItemNum = useSelector((state) => state.initial.countCartItem);
  const wishlistItemNum = useSelector((state) => state.initial.countWishlistItem);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    // 1. Fetch Cart Count
    try {
      const result = await totalCartItem(hasUser);
      if (result?.data?.success) {
        dispatch(setCountCartItem(result.data?.data));
      }
    } catch (error) {
      console.log("loadCartItem error:", error);
    }

    // 2. Fetch Wishlist Count (Only if logged in)
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
    }, 300);

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
    <header className="sticky top-0 z-40 bg-[var(--color-background)] border-b border-stone-200/60 shadow-xs">
      <div className="hidden lg:flex w-full h-28 bg-[var(--color-background)] py-3 px-8 lg:px-20 justify-between items-center relative z-40">
      {/* Left section */}
      <div>
        <ul className="flex items-center gap-x-8 py-3 font-medium">
          <li>
            <NavLink
              to="/"
              className="text-base text-[var(--color-text)] hover:text-[var(--color-red)] transition-colors duration-300"
            >
              Home
            </NavLink>
          </li>
          <li className="relative group">
            <NavLink
              to="/products"
              className="text-base text-[var(--color-text)] hover:text-[var(--color-red)] transition-colors duration-300"
            >
              Shop
            </NavLink>
          </li>

          {categories.length > 0 &&
            categories.map((navItem) => (
              <li key={navItem?._id} className="relative group">
                <NavLink
                  to={
                    navItem?.subcategories?.length > 0
                      ? "#"
                      : `/products/${navItem.slug}`
                  }
                  className="text-base text-[var(--color-text)] hover:text-[var(--color-red)] transition-colors duration-300 capitalize"
                >
                  {navItem?.name}
                </NavLink>

                {/* Only show dropdown if there are subcategories */}
                {navItem?.subcategories?.length > 0 && (
                  <div className="absolute left-0 mt-2 min-w-[150px] bg-[var(--color-background)] z-50 rounded-md shadow-md opacity-0 invisible translate-y-1/3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-in-out">
                    <ul className="flex flex-col">
                      {navItem.subcategories.map((subItem) => (
                        <li key={subItem?._id} className="px-4 py-3">
                          <NavLink
                            to={`/products/${navItem.slug}/${subItem.slug}`}
                            className="text-sm flex items-center font-light text-[var(--color-text)] hover:text-[var(--color-red)] transition-colors duration-300"
                          >
                            {subItem?.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}

          <li>
            <NavLink
              to="/outlets"
              className="text-base text-[var(--color-text)] hover:text-[var(--color-red)] transition-colors duration-300"
            >
              Our Outlets
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Logo section */}
      <div className="flex justify-center items-center gap-2">
        <Link to="/">
          <h1 className="text-3xl text-black font-bold tracking-tight">Shoezy</h1>
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-x-6">
        {/* Global Search Input & Dropdown */}
        <div className="relative" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (liveResults.length > 0) setShowDropdown(true);
              }}
              className="w-[260px] lg:w-[320px] h-11 pl-4 pr-10 rounded-full bg-[var(--color-search)] text-sm outline-none border border-transparent focus:border-stone-400 focus:bg-white transition-all shadow-xs"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowDropdown(false);
                }}
                className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}

            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer p-1"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
              ) : (
                <FaSearch className="text-base" />
              )}
            </button>
          </form>

          {/* Live Search Results Dropdown */}
          {showDropdown && searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2 border-b border-stone-100 bg-stone-50 flex items-center justify-between text-xs font-semibold text-stone-500 px-4">
                <span>Quick Results</span>
                <span>{liveResults.length} matches found</span>
              </div>

              {liveResults.length > 0 ? (
                <div className="max-h-[320px] overflow-y-auto divide-y divide-stone-100">
                  {liveResults.map((product) => {
                    const categorySlug =
                      typeof product?.category === "object"
                        ? product?.category?.slug
                        : product?.category || "all";
                    const subCategorySlug =
                      typeof product?.subcategory === "object"
                        ? product?.subcategory?.slug
                        : product?.subcategory || "all";
                    const image =
                      product?.images?.cover ||
                      (typeof product?.images === "string"
                        ? product.images
                        : "/placeholder.jpg");
                    const price = product?.discount_price || product?.price || 0;

                    return (
                      <Link
                        key={product._id}
                        to={`/products/${categorySlug}/${subCategorySlug}/${product.slug}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 p-3 hover:bg-stone-50 transition-colors"
                      >
                        <img
                          src={image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {product.name}
                          </h4>
                          <span className="text-[11px] text-stone-500 font-medium capitalize">
                            {product.brand || "Shoes"}
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-stone-900">
                          ${price}
                        </span>
                      </Link>
                    );
                  })}

                  <button
                    onClick={handleSearchSubmit}
                    className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs text-center transition cursor-pointer"
                  >
                    View All Results for "{searchQuery}"
                  </button>
                </div>
              ) : (
                <div className="py-6 px-4 text-center text-xs font-medium text-stone-500">
                  No products matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Account Menu with Avatar */}
        <div className="relative group">
          {hasUser ? (
            <button className="p-0.5 text-stone-800 hover:text-black transition cursor-pointer flex items-center justify-center rounded-full border border-stone-300 hover:border-stone-500 shadow-2xs">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.firstName || "Profile Avatar"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center uppercase">
                  {user?.firstName ? user.firstName[0] : (user?.username ? user.username[0] : <User className="w-4 h-4" />)}
                </div>
              )}
            </button>
          ) : (
            <Link
              to="/login"
              className="p-2 text-stone-800 hover:text-black transition cursor-pointer flex items-center"
            >
              <FaRegUser className="text-2xl" />
            </Link>
          )}

          {hasUser && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-200 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-in-out z-50 p-1.5">
              <div className="px-3 py-2 border-b border-stone-100 mb-1">
                <p className="text-xs font-bold text-stone-900 truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.username || 'User')}
                </p>
                <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
              </div>
              <NavLink
                to="/account/profile"
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg transition"
              >
                <CiUser className="text-lg" />
                <span>Profile</span>
              </NavLink>
              <button
                onClick={handleLogOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer text-left"
              >
                <CiLogout className="text-lg" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Wishlist */}
        <div className="relative hover:cursor-pointer">
          <Link to={"/account/wishlist"}>
            <MdFavoriteBorder className="text-3xl text-stone-800 hover:text-black" />
            <div className="bg-[var(--color-black)] w-5 h-5 flex justify-center items-center aspect-square rounded-full absolute top-0 left-1/2 -translate-y-1/3 translate-x-1/12">
              <p className="text-white text-xs font-bold">{wishlistItemNum || 0}</p>
            </div>
          </Link>
        </div>

        {/* Cart */}
        <NavLink
          className="flex items-center gap-x-2 hover:cursor-pointer"
          to={"/account/mycart"}
        >
          <div className="relative">
            <MdOutlineShoppingCart className="text-3xl text-stone-800 hover:text-black" />
            <div className="bg-[var(--color-black)] w-5 h-5 flex justify-center items-center aspect-square rounded-full absolute top-0 left-1/2 -translate-y-1/3 translate-x-1/12">
              <p className="text-white text-xs font-bold">{cartItemNum || "0"}</p>
            </div>
          </div>
          <p className="font-semibold text-sm">My Cart</p>
        </NavLink>
      </div>
    </div>

      {/* Separate Small Device Navbar Component */}
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
