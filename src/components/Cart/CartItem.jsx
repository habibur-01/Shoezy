import React from "react";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";

const CartItem = ({ item, onIncrement, onDecrement, onRemove }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-4">
      {/* Product Info */}
      <div className="flex items-center space-x-4 w-1/2">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-contain rounded-md bg-[var(--color-search)]"
        />
        <div>
          <h4 className="text-sm font-medium text-[var(--color-black)]">
            {item.name}
          </h4>
          <p className="text-xs text-[var(--text-gray)]">{item.color}</p>
        </div>
      </div>

      {/* Price */}
      <div className="w-1/6 text-sm text-[var(--color-black)]">${item.price}</div>

      {/* Quantity */}
      <div className="w-1/6 flex items-center justify-center space-x-2">
        <button
          onClick={() => onDecrement(item.id)}
          className="border border-gray-300 rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-gray-100"
        >
          <FaMinus className="text-xs text-[var(--text-gray)]" />
        </button>

        <span className="text-sm text-[var(--color-black)]">{item.quantity}</span>

        <button
          onClick={() => onIncrement(item.id)}
          className="border border-gray-300 rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-gray-100"
        >
          <FaPlus className="text-xs text-[var(--text-gray)]" />
        </button>
      </div>

      {/* Total */}
      <div className="w-1/6 text-sm text-[var(--color-black)] text-center">
        ${item.price * item.quantity}
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="text-gray-400 hover:text-gray-600"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default CartItem;
