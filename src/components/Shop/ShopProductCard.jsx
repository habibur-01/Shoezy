import React from "react";
import { FaStar } from "react-icons/fa";

const ShopProductCard = ({ product, grid }) => {
  return (
    <div
      className={`relative border rounded-md p-4 bg-white shadow-all hover:shadow-md transition ${
        grid ? "" : "flex items-center space-x-4"
      }`}
    >
      {/* Discount */}
      {product.discount > 0 && (
        <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
          -{product.discount}%
        </span>
      )}

      {/* Image */}
      <img
        src={product.image}
        alt={product.name}
        className={`${grid ? "w-full h-48" : "w-28 h-28"} object-contain mb-3`}
      />

      {/* Info */}
      <div className="flex flex-col items-start justify-between flex-1">
        <h3 className="text-sm font-medium text-gray-800 hover:text-gray-600 transition">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex space-x-1 text-yellow-400 text-xs my-1">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < product.rating ? "" : "opacity-30"} />
          ))}
        </div>

        {/* Price */}
        <div className="text-sm text-gray-800">
          {product.oldPrice && (
            <span className="text-gray-400 line-through mr-1">
              ${product.oldPrice}
            </span>
          )}
          <span className="font-semibold">${product.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;
