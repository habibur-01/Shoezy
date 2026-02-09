import React, { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";
import ColorFilter from "./ColorFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import RatingFilter from "./RatingFilter";
import SizeFilter from "./SizeFilter";

// Sidebar Component
const FilterSidebar = ({ filters, onFilterChange, onClearFilters, categories, brands, colors, sizes, subCategory,handleCategoryChange  }) => {
  console.log("🚀 ~ FilterSidebar ~ subCategory:", subCategory)
  return <div className="space-y-6">
    <CategoryFilter
      categories={categories}
      selectedCategory={subCategory}
      onToggle={handleCategoryChange }
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
      onChange={(range) => onFilterChange('priceRange', range)}
    />
    <RatingFilter
      selectedRating={filters.rating}
      onChange={(rating) => onFilterChange('rating', rating)}
    />
    <button
      onClick={onClearFilters}
      className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
    >
      Clear All Filters
    </button>
  </div>;
};
export default FilterSidebar