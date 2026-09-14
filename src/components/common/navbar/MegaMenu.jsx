import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * Aarong-Style Multi-Column Mega Menu Dropdown
 * Displays subcategories with vertical divider lines between columns
 * Supports:
 * - Direct Category navigation: /products?category=${category.slug}
 * - Direct Subcategory navigation: /products?category=${category.slug}&sub-category=${sub.slug}
 * - Direct Child Category navigation: /products?category=${category.slug}&sub-category=${sub.slug}&child-category=${child.slug}
 */
const MegaMenu = ({
  category,
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !category) return null;

  const subcategories = category?.subcategories || category?.subCategories || [];

  // Distribute subcategories into 3 or 4 columns with vertical dividers
  const renderColumns = () => {
    // If we have 3 or fewer subcategories, put each in its own column and use 4th column for promo/featured
    if (subcategories.length <= 3) {
      return (
        <>
          {subcategories.map((sub) => (
            <div key={sub._id || sub.id} className="px-6 first:pl-0 last:pr-0">
              {/* Subcategory Bold Uppercase Title */}
              <Link
                to={`/products?category=${category.slug}&sub-category=${sub.slug}`}
                onClick={onClose}
                className="block text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-orange-600 transition-colors mb-3 cursor-pointer"
              >
                {sub.name}
              </Link>

              {/* Child Categories List */}
              {sub.childCategories && sub.childCategories.length > 0 ? (
                <ul className="space-y-2">
                  {sub.childCategories.map((child) => (
                    <li key={child._id}>
                      <Link
                        to={`/products?category=${category.slug}&sub-category=${sub.slug}&child-category=${child.slug}`}
                        onClick={onClose}
                        className="block text-xs text-stone-600 hover:text-stone-950 hover:text-orange-600 transition-colors capitalize font-normal py-0.5 cursor-pointer"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-stone-400 italic">No sub-groups</p>
              )}

              {/* View All in Subcategory Quick Link */}
              <div className="mt-4 pt-2">
                <Link
                  to={`/products?category=${category.slug}&sub-category=${sub.slug}`}
                  onClick={onClose}
                  className="text-[11px] font-semibold text-stone-400 hover:text-orange-600 inline-flex items-center gap-1 transition-colors"
                >
                  <span>All {sub.name}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}

          {/* 4th Column: Curated Promo & Highlights */}
          <div className="px-6 last:pr-0 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-1.5">
                <span>NEW ARRIVALS</span>
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              </div>

              <ul className="space-y-2">
                <li>
                  <Link
                    to={`/products?category=${category.slug}&sort=newest`}
                    onClick={onClose}
                    className="block text-xs text-stone-600 hover:text-orange-600 transition-colors font-normal py-0.5"
                  >
                    Trending in {category.name}
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/products?category=${category.slug}&sort=rating`}
                    onClick={onClose}
                    className="block text-xs text-stone-600 hover:text-orange-600 transition-colors font-normal py-0.5"
                  >
                    Top Rated Picks
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/products?category=${category.slug}`}
                    onClick={onClose}
                    className="block text-xs text-stone-600 hover:text-orange-600 transition-colors font-normal py-0.5"
                  >
                    All {category.name} Collection
                  </Link>
                </li>
              </ul>
            </div>

            {/* Visual Promo Banner */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-stone-900 to-stone-800 text-white shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block mb-1">
                Seasonal Exclusive
              </span>
              <h4 className="text-sm font-extrabold tracking-tight mb-2">
                {category.name}'s Collection
              </h4>
              <p className="text-[11px] text-stone-300 mb-3 leading-relaxed">
                Discover the latest arrivals crafted for everyday luxury and performance.
              </p>
              <Link
                to={`/products?category=${category.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
              >
                <span>Shop All {category.name}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </>
      );
    }

    // For 4 or more subcategories, distribute them evenly across 4 columns
    const numColumns = 4;
    const columns = Array.from({ length: numColumns }, () => []);
    subcategories.forEach((sub, idx) => {
      columns[idx % numColumns].push(sub);
    });

    return columns.map((colSubs, colIdx) => (
      <div key={colIdx} className="px-6 first:pl-0 last:pr-0 space-y-6">
        {colSubs.map((sub) => (
          <div key={sub._id || sub.id}>
            {/* Subcategory Bold Uppercase Title */}
            <Link
              to={`/products?category=${category.slug}&sub-category=${sub.slug}`}
              onClick={onClose}
              className="block text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-orange-600 transition-colors mb-2.5 cursor-pointer"
            >
              {sub.name}
            </Link>

            {/* Child Categories List */}
            {sub.childCategories && sub.childCategories.length > 0 ? (
              <ul className="space-y-1.5 pl-0.5">
                {sub.childCategories.map((child) => (
                  <li key={child._id || child.id}>
                    <Link
                      to={`/products?category=${category.slug}&sub-category=${sub.slug}&child-category=${child.slug}`}
                      onClick={onClose}
                      className="block text-xs text-stone-600 hover:text-stone-950 hover:text-orange-600 transition-colors capitalize font-normal py-0.5 cursor-pointer"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute left-0 top-full w-full bg-white shadow-2xl border-t border-stone-200 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-8">
        {/* Multi-Column Grid with Vertical Divider Lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-stone-200">
          {renderColumns()}
        </div>

        {/* Mega Menu Footer Bar */}
        <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span className="font-medium">
            Showing catalog for{" "}
            <strong className="text-stone-900 uppercase font-bold">
              {category.name}
            </strong>
          </span>
          <Link
            to={`/products?category=${category.slug}`}
            onClick={onClose}
            className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 group cursor-pointer transition-colors"
          >
            <span>Explore All {category.name} Collection</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
