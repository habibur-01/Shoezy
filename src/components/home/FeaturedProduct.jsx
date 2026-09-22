import React from "react";
import TitleSection from "../common/header/TitleSection";
import { featuredProduct } from "../../../public/data";
import ProductCard from "../common/product/ProductCard";
import Container from "../common/Container/Container";

const FeaturedProduct = ({ title = "Featured Products", subtitle }) => {
  return (
    <Container>
      <TitleSection title={title || "Featured Products"} />
      {subtitle && (
        <p className="text-center text-sm text-zinc-500 -mt-6 mb-8 max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="grid grid-cols-4 gap-8">
        {featuredProduct.map((item) => (
          <ProductCard key={item?.id} item={item} />
        ))}
      </div>
    </Container>
  );
};

export default FeaturedProduct;
