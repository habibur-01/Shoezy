import React from "react";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";

const ProductDescription = ({
  brand = "Premium Brand",
  title = "Product Title",
  price = 0,
  discountPrice,
  stock = 10,
  rating = 4.9,
  numReviews = 48,
  description = "",
}) => {
  const finalPrice = discountPrice || price;
  const hasDiscount = discountPrice && price > discountPrice;
  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  return (
    <div className="space-y-4 border-b border-stone-200/80 pb-6">
      {/* Brand & Stock Header */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-stone-500 bg-stone-100 px-3 py-1 rounded-md">
          {brand}
        </span>
        {stock > 0 ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <CheckCircle2 className="w-3.5 h-3.5" />
            In Stock ({stock} available)
          </span>
        ) : (
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Title */}
      <h1 className="text-2xl lg:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
        {title}
      </h1>

      {/* Ratings Row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-stone-800">{rating}</span>
        </div>
        <span className="text-xs text-stone-500 font-medium">
          Based on <strong className="text-stone-800">{numReviews} customer reviews</strong>
        </span>
      </div>

      {/* Pricing Row */}
      <div className="flex items-baseline gap-3 pt-2">
        <span className="text-3xl font-black text-stone-900 tracking-tight">
          ${finalPrice}
        </span>
        {hasDiscount && (
          <>
            <span className="text-lg text-stone-400 line-through font-medium">
              ${price}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
              Save {discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* Short Description */}
      {description && (
        <p className="text-sm text-stone-600 leading-relaxed font-normal pt-1">
          {description}
        </p>
      )}
    </div>
  );
};

export default ProductDescription;
