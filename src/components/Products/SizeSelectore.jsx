import React from "react";

const SizeSelector = ({ sizes, selectedSize, onSelect }) => {
  return (
    <div className="mt-4">
      <span className="font-semibold">Size:</span>
      <div className="flex gap-2 mt-2">
        {sizes.map((size) => (
          <button
            key={size}
            className={`px-3 py-1 border ${
              selectedSize === size ? "border-black" : "border-gray-300"
            }`}
            onClick={() => onSelect(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
