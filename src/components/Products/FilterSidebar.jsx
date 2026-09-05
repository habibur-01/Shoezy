import React from "react";
import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";
import ColorFilter from "./ColorFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import RatingFilter from "./RatingFilter";
import SizeFilter from "./SizeFilter";

const FilterSidebar = ({
  filters,
  onFilterChange,
  onClearFilters,
  categories,
  brands,
  colors,
  sizes,
  subCategory,
  handleCategoryChange,
}) => {
  return (
    <div className="flex flex-col max-h-[calc(100vh-7rem)] bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <h3 className="font-bold text-stone-900 text-sm tracking-wide">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* Scrollable Filter List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
        <CategoryFilter
          categories={categories}
          selectedCategory={subCategory}
          onToggle={handleCategoryChange}
        />
        <BrandFilter
          brands={brands}
          selectedBrands={filters.brands}
          onToggle={onFilterChange}
        />
        <ColorFilter
          colors={colors}
          selectedColors={filters.colors}
          onToggle={onFilterChange}
        />
        <SizeFilter
          sizes={sizes}
          selectedSizes={filters.sizes}
          onToggle={onFilterChange}
        />
        <PriceRangeFilter
          priceRange={filters.priceRange}
          onChange={(range) => onFilterChange("priceRange", range)}
        />
        <RatingFilter
          selectedRating={filters.rating}
          onChange={(rating) => onFilterChange("rating", rating)}
        />
      </div>

      {/* Always-Visible Bottom Clear All Filters Button */}
      <div className="p-4 bg-stone-50 border-t border-stone-200/80">
        <button
          onClick={onClearFilters}
          className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition cursor-pointer shadow-xs"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;