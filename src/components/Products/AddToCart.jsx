import React from "react";

const AddToCart = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center mt-6 gap-2">
      <button onClick={onDecrease} className="px-3 py-1 border border-gray-300">
        -
      </button>
      <span>{quantity}</span>
      <button onClick={onIncrease} className="px-3 py-1 border border-gray-300">
        +
      </button>
      <button className="bg-black text-white px-4 py-2 ml-4">
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCart;
