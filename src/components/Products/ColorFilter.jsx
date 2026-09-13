import React from "react";
import FilterSection from "./FilterSection";
import { Check } from "lucide-react";

const ColorFilter = ({ colors = [], selectedColors = [], onToggle }) => (
  <FilterSection title="Filter By Color">
    <div className="flex flex-wrap gap-2.5">
      {colors.map((color) => {
        const isSelected = selectedColors.some(
          (c) => c.toLowerCase() === color.name.toLowerCase()
        );
        const isWhite = color.name.toLowerCase() === "white";

        return (
          <button
            key={color.name}
            type="button"
            onClick={() => onToggle(color.name)}
            className={`w-8 h-8 rounded-full ${color.class || "bg-stone-300"} flex items-center justify-center transition-all cursor-pointer ${
              isSelected
                ? "ring-2 ring-offset-2 ring-stone-900 scale-105"
                : "hover:scale-105 border border-stone-200"
            }`}
            title={color.name}
          >
            {isSelected && (
              <Check
                className={`w-4 h-4 stroke-[3] ${
                  isWhite ? "text-stone-900" : "text-white"
                }`}
              />
            )}
          </button>
        );
      })}
    </div>
  </FilterSection>
);

export default ColorFilter;