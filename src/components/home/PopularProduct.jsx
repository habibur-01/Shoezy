import React from "react";
import TitleSection from "../common/header/TitleSection";
import Container from "../common/Container/Container";
import ProductCard from "../common/product/ProductCard";
import { products } from "../../../public/data";

const PopularProduct = () => {
  return (
    <div>
      <Container>
        <TitleSection title={"Popular Product"} />
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
