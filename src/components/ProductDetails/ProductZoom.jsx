import React, { useState, useRef } from "react";
import { Maximize2 } from "lucide-react";

const ProductZoom = ({ image }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const imgRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
  };

  return (
    <div
      className="relative flex-1 h-[520px] rounded-2xl bg-stone-50 border border-stone-200/80 overflow-hidden cursor-zoom-in group shadow-xs"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        ref={imgRef}
        src={image || "/placeholder.jpg"}
        alt="Product View"
        className={`w-full h-full object-cover transition-transform duration-200 ease-out ${
          isZoomed ? "scale-225" : "scale-100"
        }`}
        style={{
          transformOrigin,
        }}
      />

      {/* Hover Zoom Hint */}
      <div className={`absolute bottom-4 right-4 bg-stone-900/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
        <Maximize2 className="w-3.5 h-3.5" />
        <span>Hover to zoom</span>
      </div>
    </div>
  );
};

export default ProductZoom;
