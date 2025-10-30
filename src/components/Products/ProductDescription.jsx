import React from "react";

const ProductDescription = ({ title, price, stock, description }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-xl font-semibold mt-2">{price}</p>
      <p className="text-green-600 mt-1">{stock} in stock</p>
      <p className="mt-3 text-gray-600">{description}</p>
    </div>
  );
};

export default ProductDescription;
