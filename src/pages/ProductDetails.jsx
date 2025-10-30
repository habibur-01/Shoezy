import React, { useState } from "react";
import ProductThumbnails from "../components/Products/ProductThumbnails";
import ProductZoom from "../components/Products/ProductZoom";
import ProductDescription from "../components/Products/ProductDescription";
import SizeSelector from "../components/Products/SizeSelectore";
import AddToCart from "../components/Products/AddToCart.jsx";
import Container from "../components/common/Container/Container.jsx";
import DetailsTabSection from "../components/Products/DetailsTabSection.jsx";

const ProductDetails = () => {
  const thumbnails = [
    "/assets/images/products/imgi_13_16-2-346x346.jpg",
    "/assets/images/products/imgi_6_02-40-346x346.jpg",
    "/assets/images/products/imgi_4_10-1-346x346.jpg",
    "/assets/images/products/imgi_3_01-12-346x346.jpg",
  ];

  const [selectedImage, setSelectedImage] = useState(thumbnails[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  // const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  return (
    <Container>
      <div></div>
      <div className="flex  w-full">
        {/* Left: Images */}
        <div className="flex gap-4 w-1/2">
          <ProductThumbnails
            thumbnails={thumbnails}
            selectedImage={selectedImage}
            onSelect={setSelectedImage}
          />
          <ProductZoom image={selectedImage} />
        </div>

        {/* Right: Details */}
        <div className=" flex-1">
          <ProductDescription
            title="Nike Air Force 1 '07 Men's Sneakers Sports Shoes"
            price="$33"
            stock={211}
            description="ARICS offers a wide range of shoes, sandals and slippers, 
            which are a perfect combination of both functionality and style."
          />
          {/* <ColorSelector
          colors={["red", "blue", "green"]}
          selectedColor={selectedColor}
          onSelect={setSelectedColor}
          
        /> */}
          <div className="mt-4">
            <h2 className="font-semibold mb-2">Color:</h2>
            <button className="px-3 py-1 border bg-black border-gray-300 h-8 w-8"></button>
          </div>
          <SizeSelector
            sizes={[6, 7, 8, 9, 10]}
            selectedSize={selectedSize}
            onSelect={setSelectedSize}
          />
          <AddToCart
            quantity={quantity}
            onIncrease={() => setQuantity(quantity + 1)}
            onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
          />
        </div>
      </div>
      <div>
        <DetailsTabSection />
      </div>
    </Container>
  );
};

export default ProductDetails;
