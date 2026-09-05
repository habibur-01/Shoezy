import React from "react";
import FilterSection from "./FilterSection";

const PriceRangeFilter = ({ priceRange = [0, 5000], onChange }) => {
  const minVal = priceRange[0] !== undefined ? priceRange[0] : 0;
  const maxVal = priceRange[1] !== undefined ? priceRange[1] : 5000;

  const handleMinChange = (e) => {
    const val = e.target.value === "" ? 0 : Number(e.target.value);
    onChange([val, Math.max(val, maxVal)]);
  };

  const handleMaxChange = (e) => {
    const val = e.target.value === "" ? 5000 : Number(e.target.value);
    onChange([Math.min(minVal, val), val]);
  };

  return (
    <FilterSection title="Price Range">
      <div className="space-y-4">
        {/* Slider Input */}
        <input
          type="range"
          min="0"
          max="5000"
          step="50"
          value={maxVal}
          onChange={(e) => onChange([minVal, Number(e.target.value)])}
          className="w-full accent-black cursor-pointer"
        />

        {/* Min & Max Numeric Inputs */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">$</span>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={minVal}
              onChange={handleMinChange}
              className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <span className="text-xs text-gray-400 font-semibold">-</span>
          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">$</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={maxVal}
              onChange={handleMaxChange}
              className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-semibold text-gray-700 bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
          <span>Min: ${minVal}</span>
          <span>Max: ${maxVal}</span>
        </div>
      </div>
    </FilterSection>
  );
};

export default PriceRangeFilter;