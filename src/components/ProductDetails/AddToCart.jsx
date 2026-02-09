
import React from "react";

const AddToCart = ({ id, isloading, quantity, onIncrease, onDecrease,handleSubmit }) => {
  
  return (
    <div className="flex items-center mt-6 gap-2">
      <button onClick={onDecrease} className="px-3 py-1 border border-gray-300 hover:cursor-pointer">
        -
      </button>
      <span>{quantity}</span>
      <button onClick={onIncrease} className="px-3 py-1 border border-gray-300 hover:cursor-pointer">
        +
      </button>
      <button type="submit" className="bg-black text-white px-4 h-9 ml-4 hover:cursor-pointer" onClick={()=>handleSubmit(id)}>
       {isloading ? <span className="animate-spin h-4"/> : " Add to Cart"}
      </button>
    </div>
  );
};

export default AddToCart;
