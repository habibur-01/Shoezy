import React from "react";
import TitleSection from "../common/header/TitleSection";
import { featuredProduct } from "../../../public/data";
import ProductCard from "../common/product/ProductCard";
import Container from "../common/Container/Container";

const FeaturedProduct = () => {
  return (
    <Container>
      <TitleSection title={"Featured Products"} />
      <div className="grid grid-cols-4 gap-8">
        {featuredProduct.map((item) => (
          <ProductCard key={item?.id} item={item} />
        ))}
      </div>
    </Container>
  );
};

export default FeaturedProduct;
