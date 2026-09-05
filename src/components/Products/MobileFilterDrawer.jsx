import React from "react";
import { X, SlidersHorizontal } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

const MobileFilterDrawer = ({
  show,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  categories,
  brands,
  colors,
  sizes,
  subCategory,
  handleCategoryChange,
  totalResults = 0,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-900" />
            <h2 className="text-base font-bold text-stone-900">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-200/60 text-stone-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filter Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <FilterSidebar
            filters={filters}
            onFilterChange={onFilterChange}
            onClearFilters={onClearFilters}
            categories={categories}
            brands={brands}
            colors={colors}
            sizes={sizes}
            subCategory={subCategory}
            handleCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Drawer Footer Action */}
        <div className="p-4 border-t border-stone-200 bg-stone-50">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            Show Results ({totalResults})
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterDrawer;