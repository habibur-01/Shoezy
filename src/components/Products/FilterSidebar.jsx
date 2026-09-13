import React from "react";
import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";
import ColorFilter from "./ColorFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import RatingFilter from "./RatingFilter";
import SizeFilter from "./SizeFilter";

const FilterSidebar = ({
  filters,
  categories = [],
  selectedCategories,
  brands = [],
  colors = [],
  sizes = [],
  onToggleCategory,
  onToggleSubCategory,
  onToggleChildCategory,
  onToggleBrand,
  onToggleColor,
  onToggleSize,
  onPriceRangeChange,
  onRatingChange,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col max-h-[calc(100vh-7rem)] bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <h3 className="font-bold text-stone-900 text-sm tracking-wide">Filters</h3>
        <button
          type="button"
          onClick={onClearFilters}
          className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* Scrollable Filter List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
        {/* Multi-Level Categories */}
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories || filters?.categories || []}
          selectedSubCategories={filters?.subCategories || []}
          selectedChildCategories={filters?.childCategories || []}
          onToggleCategory={onToggleCategory}
          onToggleSubCategory={onToggleSubCategory}
          onToggleChildCategory={onToggleChildCategory}
        />

        {/* Brand Filter */}
        <BrandFilter
          brands={brands}
          selectedBrands={filters.brands || []}
          onToggle={onToggleBrand}
        />

        {/* Color Filter */}
        <ColorFilter
          colors={colors}
          selectedColors={filters.colors || []}
          onToggle={onToggleColor}
        />

        {/* Size Filter */}
        <SizeFilter
          sizes={sizes}
          selectedSizes={filters.sizes || []}
          onToggle={onToggleSize}
        />

        {/* Price Range Filter */}
        <PriceRangeFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={onPriceRangeChange}
        />

        {/* Rating Filter */}
        <RatingFilter
          selectedRating={filters.rating}
          onChange={onRatingChange}
        />
      </div>

      {/* Always-Visible Bottom Clear All Filters Button */}
      <div className="p-4 bg-stone-50 border-t border-stone-200/80">
        <button
          type="button"
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