import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  Heart,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  MapPin,
  Sparkles,
  Package,
} from "lucide-react";

const MobileNavbar = ({
  hasUser,
  user,
  categories,
  cartItemNum,
  wishlistItemNum,
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  handleLogOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategoryExpand = (id) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const onLogoutClick = async () => {
    setMobileMenuOpen(false);
    await handleLogOut();
  };

  return (
    <div className="lg:hidden w-full bg-white border-b border-stone-200/80 shadow-2xs">
      {/* Mobile Top Header */}
      <div className="h-16 px-4 flex justify-between items-center">
        {/* Left: Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-stone-900 hover:text-orange-600 rounded-xl transition cursor-pointer"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center: Shoezy Brand Logo */}
        <Link to="/" className="flex items-center">
          <span className="font-black text-xl tracking-tighter text-stone-950">
            SHOEZY<span className="text-orange-600">.</span>
          </span>
        </Link>

        {/* Right Action Icons: Search, Wishlist, Cart */}
        <div className="flex items-center gap-x-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-2 text-stone-800 hover:text-orange-600 rounded-xl transition cursor-pointer"
            aria-label="Toggle Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist Icon */}
          <Link
            to="/account/wishlist"
            className="relative p-2 text-stone-800 hover:text-orange-600 rounded-xl transition cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            {wishlistItemNum > 0 && (
              <span className="absolute top-1 right-1 bg-orange-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlistItemNum}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/account/mycart"
            className="relative p-2 text-stone-800 hover:text-orange-600 rounded-xl transition cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemNum > 0 && (
              <span className="absolute top-1 right-1 bg-orange-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartItemNum}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Expandable Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="px-4 pb-3 pt-1 border-t border-stone-100 bg-stone-50/80 animate-in fade-in duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search shoes, trail, race..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-9 rounded-full bg-white text-xs border border-stone-300 focus:border-stone-500 outline-none shadow-2xs"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      )}

      {/* Slide-out Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-stone-950 text-white">
                <span className="font-black text-lg tracking-tighter">
                  SHOEZY<span className="text-orange-500">.</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
                <NavLink
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-stone-900 hover:bg-stone-50"
                >
                  Home
                </NavLink>

                {/* Categories */}
                {categories.map((cat) => {
                  const catId = cat._id || cat.id;
                  const isExpanded = !!expandedCategories[catId];
                  const subs = cat.subcategories || cat.subCategories || [];

                  return (
                    <div key={catId} className="border-b border-stone-100 pb-1">
                      <div className="flex items-center justify-between py-2 px-3">
                        <Link
                          to={`/products?category=${cat.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="font-bold text-xs uppercase tracking-wider text-stone-900 hover:text-orange-600"
                        >
                          {cat.name}
                        </Link>
                        {subs.length > 0 && (
                          <button
                            onClick={() => toggleCategoryExpand(catId)}
                            className="p-1 text-stone-400 hover:text-stone-700"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-orange-600" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Subcategories */}
                      {isExpanded && subs.length > 0 && (
                        <div className="pl-5 pr-2 py-1 space-y-1 bg-stone-50/70 rounded-xl">
                          {subs.map((sub) => (
                            <Link
                              key={sub._id || sub.id}
                              to={`/products?category=${cat.slug}&sub-category=${sub.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block py-1.5 px-2 text-xs font-medium text-stone-600 hover:text-orange-600"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <NavLink
                  to="/outlets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-stone-900 hover:bg-stone-50"
                >
                  Our Outlets
                </NavLink>

                <NavLink
                  to="/products?discount=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-orange-600 bg-orange-50/60"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Special Offers & Sale</span>
                </NavLink>
              </div>
            </div>

            {/* Drawer Footer / Profile Links */}
            <div className="p-4 border-t border-stone-100 bg-stone-50/80">
              {hasUser ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-stone-950 text-white font-bold text-xs flex items-center justify-center uppercase">
                      {user?.firstName ? user.firstName[0] : (user?.username ? user.username[0] : "U")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : (user?.username || "Shoezy Member")}
                      </p>
                      <p className="text-[10px] text-stone-500 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <Link
                    to="/account/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Account</span>
                  </Link>

                  <Link
                    to="/account/myorders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Orders & Returns</span>
                  </Link>

                  <button
                    onClick={onLogoutClick}
                    className="flex items-center gap-2 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 w-full text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider text-center rounded-xl transition shadow-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2 text-center text-xs font-bold text-stone-600 hover:text-stone-900"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
