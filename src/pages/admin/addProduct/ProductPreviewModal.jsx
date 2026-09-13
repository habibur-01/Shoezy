import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, ChevronRight } from 'lucide-react';




















export const ProductPreviewModal = ({
  isOpen,
  onClose,
  title,
  brand,
  price,
  compareAtPrice,
  image,
  galleryImages,
  category,
  subCategory,
  childCategory,
  description,
  stock,
  variants,
  sku
}) => {
  const [activeImage, setActiveImage] = useState(image);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]?.name || '');

  if (!isOpen) return null;

  const currentDisplayImage = activeImage || image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
  const allImages = [image, ...galleryImages].filter(Boolean);

  const discountPercent =
  compareAtPrice > price && compareAtPrice > 0 ?
  Math.round((compareAtPrice - price) / compareAtPrice * 100) :
  null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-900 tracking-wider uppercase">
              Customer Storefront Preview
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-200/60 transition-colors">
            
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Gallery & Hero Photo */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-2xs">
              <img
                src={currentDisplayImage}
                alt={title || 'Product'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer" />
              
              {discountPercent &&
              <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold bg-rose-600 text-white rounded-lg shadow-sm">
                  SAVE {discountPercent}%
                </span>
              }
            </div>

            {/* Thumbnail carousel */}
            {allImages.length > 1 &&
            <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) =>
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                currentDisplayImage === img ? 'border-zinc-900 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'}`
                }>
                
                    <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
              )}
              </div>
            }
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium mb-1">
                <span>{category || 'Catalog'}</span>
                <ChevronRight className="w-3 h-3" />
                <span>{subCategory || 'General'}</span>
                {childCategory &&
                <>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-zinc-600">{childCategory}</span>
                  </>
                }
              </div>

              {brand && <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{brand}</div>}
              <h1 className="text-xl font-bold text-zinc-900 mt-1">{title || 'Untitled Product'}</h1>

              {/* Rating stars */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) =>
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  )}
                </div>
                <span className="text-xs font-semibold text-zinc-800">5.0</span>
                <span className="text-xs text-zinc-400">(48 verified customer reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-bold text-zinc-900">${price.toFixed(2)}</span>
                {compareAtPrice > price &&
                <span className="text-sm text-zinc-400 line-through">${compareAtPrice.toFixed(2)}</span>
                }
              </div>

              {/* Stock Status */}
              <div className="mt-3">
                {stock > 0 ?
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> In Stock ({stock} units ready to ship)
                  </span> :

                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> Currently Out of Stock
                  </span>
                }
              </div>

              {/* Variants */}
              {variants.length > 0 &&
              <div className="mt-4 pt-4 border-t border-zinc-100">
                  <label className="block text-xs font-semibold text-zinc-800 mb-2">Available Options</label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v) =>
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selectedVariant === v.name ?
                    'border-zinc-900 bg-zinc-900 text-white' :
                    'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`
                    }>
                    
                        {v.name} {v.price ? `($${v.price.toFixed(2)})` : ''}
                      </button>
                  )}
                  </div>
                </div>
              }

              {/* Description */}
              <div className="mt-4 pt-4 border-t border-zinc-100">
                <h3 className="text-xs font-bold text-zinc-900 mb-1">Product Overview</h3>
                <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line">
                  {description || 'No description entered yet for this product.'}
                </p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="space-y-2 pt-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2">
                  
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
                <button
                  type="button"
                  className="p-2.5 border border-zinc-200 text-zinc-600 hover:text-rose-600 hover:bg-zinc-50 rounded-xl transition-colors">
                  
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-zinc-500 text-center">
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> Official Guarantee
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-zinc-400" /> Fast Delivery
                </div>
                <div className="flex items-center justify-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-400" /> 30-Day Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};