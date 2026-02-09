import { Slash } from "lucide-react";
import React from "react";

const SizeSelector = ({ sizeGroup, availableSizes, selectedSize, selectedColor, variants=[], onSelect }) => {
 
  // Predefined sizes based on gender/category
  const sizeOptions = {
    men: ["6", "7", "8", "9", "10"],
    women: ["4", "5", "6", "7", "8"],
    children: ["1", "2", "3", "4", "5"]
  };

  const groupSizes = sizeOptions[sizeGroup] || [];

  // Filter sizes that belong to selected color
  const availableSizesForColor = variants
    .filter(v => v.color.toLowerCase() === selectedColor?.toLowerCase())
    .map(v => v.size);

  return (
    <div className="mt-4">
      <span className="font-semibold">Size:</span>

      <div className="flex gap-2 mt-2 flex-wrap">
        {groupSizes.map((size, index) => {
          const isAvailable = selectedColor
            ? availableSizesForColor.includes(size)
            : availableSizes.includes(size);

          const isSelected = selectedSize === size;

          return (
            <button
              key={index}
              disabled={!isAvailable}
              className={`
                relative px-3 py-1 border rounded
                ${isSelected ? "border-red-200 font-semibold" : "border-gray-300"}
                ${!isAvailable ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "cursor-pointer"}
              `}
              onClick={() => isAvailable && onSelect(size)}
            >
              {size}
              {!isAvailable && (
                <span className="absolute inset-0 flex items-center justify-center text-lg text-gray-500 font-bold">
                  <Slash size={25} />
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
