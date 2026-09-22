import React from "react";
import TitleSection from "../common/header/TitleSection";
import Container from "../common/Container/Container";
import ProductCard from "../common/product/ProductCard";
import { products } from "../../../public/data";

const PopularProduct = ({ title = "Popular Product", subtitle }) => {
  return (
    <div>
      <Container>
        <TitleSection title={title || "Popular Product"} />
        {subtitle && (
          <p className="text-center text-sm text-zinc-500 -mt-6 mb-8 max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="grid grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product?.id} item={product} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default PopularProduct;
