import React from "react";

const ProductThumbnails = ({ thumbnails, selectedImage, onSelect }) => {
  return (
    <div className="flex flex-col justify-between w-1/6 h-[600px] overflow-y-auto">
      {thumbnails.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`thumb-${idx}`}
          className={`w-full h-32 object-cover cursor-pointer border-2 p-1 ${
            selectedImage === img ? "border-gray-100" : "border-transparent"
          }`}
          onClick={() => onSelect(img)}
        />
      ))}
    </div>
  );
};

export default ProductThumbnails;
