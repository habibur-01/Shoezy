import React from "react";
import FilterSection from "./FilterSection";
import { Star } from "lucide-react";

const RatingFilter = ({ selectedRating, onChange }) => (
  <FilterSection title="Customer Ratings">
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map((star) => {
        const isSelected = selectedRating === star;

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(isSelected ? null : star)}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              isSelected
                ? "bg-stone-900 text-white shadow-2xs"
                : "hover:bg-stone-100 text-stone-700"
            }`}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < star
                      ? isSelected
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-amber-400 fill-amber-400"
                      : "text-stone-300"
                  }`}
                />
              ))}
              <span className="ml-1 text-[11px] font-medium">& Up</span>
            </div>
            {isSelected && (
              <span className="text-[10px] text-stone-300 font-bold">Selected</span>
            )}
          </button>
        );
      })}
    </div>
  </FilterSection>
);

export default RatingFilter;