import React from "react";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";

const CartItem = ({ item, onIncrement, onDecrement, onRemove }) => {
  return (
    <tr className="border-b border-gray-200">
      {/* Product Info */}
      <td colSpan={2} className="py-4 px-2 flex items-center space-x-4">
        <img
          src={item.product?.image}
          alt={item.product?.name}
          className="w-16 h-16 object-contain rounded-md bg-[var(--color-search)]"
        />
        <div className="">
          <h4 className="text-sm font-medium text-[var(--color-black)]">
            {item.product.name}
          </h4>
          <div className="flex gap-1">
            <p className="text-xs text-[var(--text-gray)]">Color:</p>
            <p className="text-xs text-[var(--text-gray)]">{item?.product?.variantColor}</p>
          </div>
          <p className="text-xs text-[var(--color-success)]">{item?.product.variantStock > 0 && `In Stock (${item?.product.variantStock})`} </p>
          <p className="text-xs text-[var(--color-red)]">{item?.product.variantStock <= 0 && `Out of Stock `}</p>
        </div>
      </td>

      {/* Price */}
      <td className="text-sm text-[var(--color-black)] py-4 px-2">
        ${item.price}
      </td>
      {/* Price */}
      <td className="text-sm text-[var(--color-black)] py-4 px-2 text-center">
        {item.product.variantSize}
      </td>

      {/* Quantity */}
      <td className="text-center py-4 px-2">
        <div className="inline-flex items-center space-x-2">
          <button
            onClick={onDecrement}
            disabled={item?.quantity === 1}
            className="border border-gray-300 rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-gray-100 disabled:hover:bg-transparent"
          >
            <FaMinus className="text-xs text-[var(--text-gray)]" />
          </button>

          <span className="text-sm text-[var(--color-black)]">{item.quantity}</span>

          <button
            onClick={onIncrement}
            disabled={item?.product.variantStock === item.quantity}
            className="border border-gray-300 rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-gray-100 disabled:hover:bg-transparent"
          >
            <FaPlus className="text-xs text-[var(--text-gray)]" />
          </button>
        </div>
      </td>

      {/* Total */}
      <td className="text-center text-sm text-[var(--color-black)] py-4 px-2">
        ${item.subtotal}
      </td>

      {/* Remove */}
      <td className="text-center py-4 px-2">
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600"
        >
          <FaTimes />
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
