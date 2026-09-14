import React from "react";
import { ChevronDown, Grid, List, SlidersHorizontal } from "lucide-react";

/**
 * Responsive Header Component
 * Provides:
 * - Dynamic results counter
 * - Mobile filter drawer trigger with active filters counter badge
 * - Sorting dropdown
 * - Grid and List view mode switchers
 * - Guaranteed non-overflow layout on all viewport sizes (from 320px mobile to 4K)
 */
const Header = ({
  viewMode = "grid",
  onViewModeChange,
  onShowFilters,
  sortBy = "default",
  onSortChange,
  totalResults = 0,
  currentCount = 0,
  activeFiltersCount = 0,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-3 sm:p-4 mb-6 shadow-xs">
      <div className="flex flex-col gap-3">
        {/* Row 1 on mobile: Results Count & Grid/List Toggles (On sm+ screens, becomes full row with sorting) */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-stone-600 text-xs sm:text-sm font-medium">
            Showing <span className="font-bold text-stone-900">{currentCount}</span>{" "}
            {totalResults > 0 ? (
              <>
                of <span className="font-bold text-stone-900">{totalResults}</span>
              </>
            ) : null}{" "}
            products
          </p>

          {/* View Mode Toggle Buttons (always aligned nicely) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              aria-label="Grid view"
              className={`p-2 rounded-xl transition cursor-pointer ${
                viewMode === "grid"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-600"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              aria-label="List view"
              className={`p-2 rounded-xl transition cursor-pointer ${
                viewMode === "list"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-600"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2 on mobile / controls bar on desktop: Filters button and Sort dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
          {/* Mobile Filter Drawer Button (Visible on mobile/tablet up to lg) */}
          <button
            type="button"
            onClick={onShowFilters}
            className="lg:hidden flex items-center justify-center gap-2 py-2 px-3.5 bg-stone-50 hover:bg-stone-100 active:scale-98 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-700" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-stone-900 text-white text-[10px] font-bold rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown with custom chevron */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortBy || "default"}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full sm:w-auto min-w-[170px] appearance-none pl-3 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer shadow-xs"
            >
              <option value="default">Default sorting</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="top_rated">Top Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;