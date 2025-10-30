import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ item }) => {
  const oldPrice = true;
  return (
    <div>
      <Link to={`/products/${item?.id}`}>
        <div className="bg-[var(--card-background)] h-96 relative group hover:cursor-pointer">
          <img
            src={item?.images.main}
            alt="product image"
            className="w-full h-full object-cover group-hover:hidden"
          />
          <img
            src={item?.images?.cover}
            alt="product image"
            className="w-full h-full object-cover hidden opacity-0 group-hover:block group-hover:opacity-100"
          />
          <div className="px-4 pb-3 w-full absolute bottom-0">
            <button className="btn-black w-full ">Shop Now</button>
          </div>
        </div>
        <div className="px-6 py-5 flex flex-col justify-center items-center space-y-3">
          <p className="capitalize text-base text-gray-700 font-medium text-center px-4">
            Hiking traking Climbing Mountain Shoes for men
          </p>
          {oldPrice && (
            <div className="flex items-center gap-x-3">
              <p className="text-gray-400 de">
                <del>TK 2000.00</del>
              </p>
              <p className="text-[var(--color-black)] font-bold">Tk 1600.00</p>
            </div>
          )}
          {!oldPrice && (
            <p className="text-[var(--color-black)] font-bold">Tk 1600.00</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
