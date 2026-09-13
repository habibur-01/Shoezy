import React from "react";
import FilterSection from "./FilterSection";

const SizeFilter = ({ sizes = [], selectedSizes = [], onToggle }) => (
  <FilterSection title="Filter By Size">
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const isSelected = selectedSizes.includes(String(size));
        return (
          <button
            key={size}
            type="button"
            onClick={() => onToggle(String(size))}
            className={`px-3.5 py-1.5 border rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              isSelected
                ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                : "bg-white text-stone-700 border-stone-300 hover:border-stone-800"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  </FilterSection>
);

export default SizeFilter;