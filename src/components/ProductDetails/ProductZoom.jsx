import React, { useState, useRef } from "react";

const ProductZoom = ({ image }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const imgRef = useRef(null);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
  };

  return (
    <div
      className="w-9/12 h-[600px] overflow-hidden cursor-zoom-in"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        ref={imgRef}
        src={image}
        alt="Zoomed product"
        className={`w-full h-full object-cover transition-transform duration-200 ease-out ${
          isZoomed ? "scale-200" : "scale-100"
        }`}
        style={{
          transformOrigin,
        }}
      />
    </div>
  );
};

export default ProductZoom;
