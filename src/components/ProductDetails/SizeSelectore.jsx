import React from "react";
import { Slash, Ruler } from "lucide-react";

const SizeSelector = ({
  sizeGroup = "men",
  availableSizes = [],
  selectedSize,
  selectedColor,
  variants = [],
  onSelect,
}) => {
  const sizeOptions = {
    men: ["6", "7", "8", "9", "10", "11", "12"],
    women: ["4", "5", "6", "7", "8", "9"],
    children: ["1", "2", "3", "4", "5"],
  };

  const groupSizes = availableSizes.length > 0
    ? availableSizes
    : (sizeOptions[sizeGroup.toLowerCase()] || sizeOptions.men);

  // Filter sizes available for the currently selected color
  const availableSizesForColor = variants
    .filter((v) => !selectedColor || v.color?.toLowerCase() === selectedColor?.toLowerCase())
    .filter((v) => Number(v.stock) > 0)
    .map((v) => v.size);

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
          Select Size: <span className="font-extrabold text-stone-900">{selectedSize || "Required"}</span>
        </span>
        <button
          type="button"
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Size Guide</span>
        </button>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
        {groupSizes.map((size, index) => {
          const isAvailable = availableSizesForColor.length === 0 || availableSizesForColor.includes(size);
          const isSelected = selectedSize === size;

          return (
            <button
              key={index}
              disabled={!isAvailable}
              onClick={() => isAvailable && onSelect(size)}
              className={`relative h-11 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer flex items-center justify-center border ${
                isSelected
                  ? "bg-stone-900 text-white border-stone-900 shadow-md scale-[1.02]"
                  : "bg-white text-stone-800 border-stone-200 hover:border-stone-400 hover:bg-stone-50"
              } ${!isAvailable ? "bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed" : ""}`}
            >
              <span>{size}</span>
              {!isAvailable && (
                <span className="absolute inset-0 flex items-center justify-center text-stone-300">
                  <Slash className="w-5 h-5 text-stone-300 stroke-[2]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;
