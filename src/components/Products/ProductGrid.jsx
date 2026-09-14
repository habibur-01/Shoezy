import React from "react";
import ShopProductCard from "./ShopProductCard";

const ProductGrid = ({ products, viewMode }) => (
  <div
    id="shop-products-grid"
    className={`grid ${
      viewMode === "grid"
        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
        : "grid-cols-1"
    } gap-4 sm:gap-6`}
  >
    {products.map((product) => (
      <ShopProductCard
        key={product._id || product.slug}
        product={product}
        viewMode={viewMode}
      />
    ))}
  </div>
);

export default ProductGrid;