import React from "react";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";

const CartItem = ({ item, onIncrement, onDecrement, onRemove }) => {
  const prod = item?.product || {};
  const image =
    prod?.image ||
    prod?.images?.cover ||
    (typeof prod?.images === "string" ? prod.images : "/placeholder.jpg");
  const name = prod?.name || "Product";
  const color = item?.selectedColor || prod?.variantColor || prod?.colors?.[0] || "Default";
  const size = item?.selectedSize || prod?.variantSize || prod?.sizes?.[0] || "N/A";
  const stock = prod?.variantStock ?? prod?.stock_quantity ?? 99;

  return (
    <tr className="border-b border-stone-200 hover:bg-stone-50/50 transition-colors">
      {/* Product Info */}
      <td colSpan={2} className="py-4 px-3 flex items-center space-x-3">
        <img
          src={image}
          alt={name}
          className="w-14 h-14 object-cover rounded-xl bg-stone-100 border border-stone-200 flex-shrink-0"
        />
        <div className="min-w-0 space-y-0.5">
          <h4 className="text-xs font-bold text-stone-900 truncate max-w-xs">
            {name}
          </h4>
          <p className="text-[11px] text-stone-500 font-medium">
            Color: <span className="text-stone-700 font-bold">{color}</span>
          </p>
          <p className="text-[11px] font-semibold text-emerald-600">
            {stock > 0 ? `In Stock` : `Out of Stock`}
          </p>
        </div>
      </td>

      {/* Price */}
      <td className="text-xs font-bold text-stone-900 py-4 px-3">
        ${item.price}
      </td>

      {/* Size */}
      <td className="text-xs font-semibold text-stone-700 py-4 px-3 text-center">
        <span className="px-2 py-0.5 bg-stone-100 rounded-md border border-stone-200">
          {size}
        </span>
      </td>

      {/* Quantity */}
      <td className="text-center py-4 px-3">
        <div className="inline-flex items-center space-x-2">
          <button
            onClick={onDecrement}
            disabled={item?.quantity === 1}
            className="border border-stone-300 rounded-lg p-1 w-6 h-6 flex items-center justify-center hover:bg-stone-100 disabled:opacity-40 transition cursor-pointer"
          >
            <FaMinus className="text-[10px] text-stone-700" />
          </button>

          <span className="text-xs font-bold text-stone-900 px-1">{item.quantity}</span>

          <button
            onClick={onIncrement}
            disabled={stock <= item.quantity}
            className="border border-stone-300 rounded-lg p-1 w-6 h-6 flex items-center justify-center hover:bg-stone-100 disabled:opacity-40 transition cursor-pointer"
          >
            <FaPlus className="text-[10px] text-stone-700" />
          </button>
        </div>
      </td>

      {/* Subtotal */}
      <td className="text-center text-xs font-extrabold text-stone-900 py-4 px-3">
        ${item.subtotal}
      </td>

      {/* Remove */}
      <td className="text-center py-4 px-3">
        <button
          onClick={onRemove}
          className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
          title="Remove item"
        >
          <FaTimes className="text-xs" />
        </button>
      </td>
    </tr>
  );
};

export default React.memo(CartItem);
