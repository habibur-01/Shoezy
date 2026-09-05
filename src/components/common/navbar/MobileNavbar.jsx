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
    <div className="lg:hidden w-full bg-[var(--color-background)] border-b border-stone-200/60 shadow-xs">
      {/* Mobile Top Header */}
      <div className="h-16 px-4 flex justify-between items-center">
        {/* Left: Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-stone-800 hover:text-black rounded-lg transition cursor-pointer"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Center: Shoezy Brand Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl text-stone-900 font-extrabold tracking-tight">
            Shoezy
          </h1>
        </Link>

        {/* Right Action Icons: Search, User Profile Avatar, Cart Badge */}
        <div className="flex items-center gap-x-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-2 text-stone-800 hover:text-black rounded-lg transition cursor-pointer"
            aria-label="Toggle Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User Profile Avatar Link */}
          {hasUser ? (
            <Link
              to="/account/profile"
              className="p-1 rounded-full border border-stone-300 flex items-center justify-center"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center uppercase">
                  {user?.firstName ? user.firstName[0] : (user?.username ? user.username[0] : <User className="w-3.5 h-3.5" />)}
                </div>
              )}
            </Link>
          ) : (
            <Link to="/login" className="p-2 text-stone-800 hover:text-black transition cursor-pointer">
              <User className="w-5 h-5" />
            </Link>
          )}

          {/* Wishlist Badge Icon */}
          <Link
            to="/account/wishlist"
            className="relative p-2 text-stone-900 flex items-center cursor-pointer"
          >
            <Heart className="w-5 h-5 text-stone-800 hover:text-black" />
            <span className="bg-stone-900 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center absolute -top-0.5 -right-0.5">
              {wishlistItemNum || 0}
            </span>
          </Link>

          {/* Cart Badge Icon */}
          <Link
            to="/account/mycart"
            className="relative p-2 text-stone-900 flex items-center cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="bg-stone-900 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center absolute -top-0.5 -right-0.5">
              {cartItemNum || 0}
            </span>
          </Link>
        </div>
      </div>

      {/* Expandable Mobile Search Field */}
      {mobileSearchOpen && (
        <div className="border-t border-stone-200 bg-white p-3 px-4 animate-in slide-in-from-top duration-200">
          <form onSubmit={(e) => {
            setMobileSearchOpen(false);
            handleSearchSubmit(e);
          }} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-4 pr-10 rounded-full bg-stone-100 text-xs font-medium outline-none border border-stone-300 focus:border-black"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 p-1 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Slide-over Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Drawer Panel */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
              <h2 className="text-lg font-bold text-stone-900">Navigation</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-stone-200 text-stone-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links & Categories Accordions */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <nav>
                <ul className="space-y-1">
                  <li>
                    <NavLink
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `px-4 py-2.5 rounded-xl font-bold text-sm block transition-colors ${
                          isActive ? "bg-stone-900 text-white" : "text-stone-800 hover:bg-stone-100"
                        }`
                      }
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/products"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `px-4 py-2.5 rounded-xl font-bold text-sm block transition-colors ${
                          isActive ? "bg-stone-900 text-white" : "text-stone-800 hover:bg-stone-100"
                        }`
                      }
                    >
                      Shop All Products
                    </NavLink>
                  </li>

                  {/* Categories Accordion */}
                  {categories.length > 0 &&
                    categories.map((cat) => (
                      <li key={cat._id} className="space-y-1">
                        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-stone-100 transition">
                          <NavLink
                            to={cat?.subcategories?.length > 0 ? "#" : `/products/${cat.slug}`}
                            onClick={() => {
                              if (!cat?.subcategories?.length) setMobileMenuOpen(false);
                            }}
                            className="font-bold text-sm text-stone-800 capitalize flex-1"
                          >
                            {cat.name}
                          </NavLink>

                          {cat?.subcategories?.length > 0 && (
                            <button
                              onClick={() => toggleCategoryExpand(cat._id)}
                              className="p-1 text-stone-500 hover:text-black cursor-pointer"
                            >
                              {expandedCategories[cat._id] ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Subcategories */}
                        {cat?.subcategories?.length > 0 && expandedCategories[cat._id] && (
                          <ul className="pl-6 space-y-1 border-l-2 border-stone-200 ml-4 py-1">
                            {cat.subcategories.map((sub) => (
                              <li key={sub._id}>
                                <NavLink
                                  to={`/products/${cat.slug}/${sub.slug}`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="px-3 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:text-black block capitalize hover:bg-stone-100"
                                >
                                  {sub.name}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}

                  <li>
                    <NavLink
                      to="/outlets"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `px-4 py-2.5 rounded-xl font-bold text-sm block transition-colors flex items-center gap-2 ${
                          isActive ? "bg-stone-900 text-white" : "text-stone-800 hover:bg-stone-100"
                        }`
                      }
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Our Outlets</span>
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Footer User Account Details */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-2">
              {hasUser ? (
                <>
                  <Link
                    to="/account/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900 hover:bg-stone-100 transition shadow-2xs"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-7 h-7 rounded-full object-cover border border-stone-200"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center uppercase">
                        {user?.firstName ? user.firstName[0] : (user?.username ? user.username[0] : <User className="w-3.5 h-3.5" />)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'My Account'}</p>
                      <p className="text-[10px] text-stone-400 font-normal truncate">{user?.email}</p>
                    </div>
                  </Link>
                  <button
                    onClick={onLogoutClick}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition"
                >
                  <User className="w-4 h-4" />
                  <span>Login / Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
