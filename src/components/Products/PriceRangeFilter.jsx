import React, { useState, useEffect } from "react";
import FilterSection from "./FilterSection";

const PriceRangeFilter = ({ minPrice, maxPrice, onChange }) => {
  const [localMin, setLocalMin] = useState(minPrice !== null && minPrice !== undefined ? String(minPrice) : "");
  const [localMax, setLocalMax] = useState(maxPrice !== null && maxPrice !== undefined ? String(maxPrice) : "");

  useEffect(() => {
    setLocalMin(minPrice !== null && minPrice !== undefined ? String(minPrice) : "");
  }, [minPrice]);

  useEffect(() => {
    setLocalMax(maxPrice !== null && maxPrice !== undefined ? String(maxPrice) : "");
  }, [maxPrice]);

  const handleApply = (e) => {
    e?.preventDefault();
    const minNum = localMin !== "" && !isNaN(localMin) ? Number(localMin) : null;
    const maxNum = localMax !== "" && !isNaN(localMax) ? Number(localMax) : null;
    onChange(minNum, maxNum);
  };

  const handlePreset = (min, max) => {
    setLocalMin(min !== null ? String(min) : "");
    setLocalMax(max !== null ? String(max) : "");
    onChange(min, max);
  };

  return (
    <FilterSection title="Price Range ($)">
      <div className="space-y-3">
        {/* Min & Max Inputs */}
        <form onSubmit={handleApply} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-medium">
              $
            </span>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              className="w-full pl-6 pr-2 py-1.5 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-black"
            />
          </div>
          <span className="text-xs text-stone-400 font-bold">-</span>
          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-medium">
              $
            </span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              className="w-full pl-6 pr-2 py-1.5 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-black"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            Go
          </button>
        </form>

        {/* Quick Price Range Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { label: "Under $50", min: null, max: 50 },
            { label: "$50 - $100", min: 50, max: 100 },
            { label: "$100 - $150", min: 100, max: 150 },
            { label: "$150+", min: 150, max: null },
          ].map((preset) => {
            const isPresetActive =
              (preset.min === null ? minPrice === null : minPrice === preset.min) &&
              (preset.max === null ? maxPrice === null : maxPrice === preset.max);

            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePreset(preset.min, preset.max)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition cursor-pointer ${
                  isPresetActive
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </FilterSection>
  );
};

export default PriceRangeFilter;