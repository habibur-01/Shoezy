import React from "react";

const ProductThumbnails = ({ thumbnails = [], selectedImage, onSelect }) => {
  return (
    <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-24 max-h-[520px] overflow-x-auto lg:overflow-y-auto pr-1 scrollbar-thin">
      {thumbnails.map((img, idx) => {
        const isSelected = selectedImage === img;
        return (
          <button
            key={idx}
            onClick={() => onSelect(img)}
            className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
              isSelected
                ? "border-stone-900 shadow-md scale-95"
                : "border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {isSelected && (
              <span className="absolute inset-0 bg-black/5" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ProductThumbnails;
