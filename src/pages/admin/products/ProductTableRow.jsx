import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';









export const ProductTableRow = ({
  product,
  onUpdateStock,
  onEdit,
  onDelete
}) => {
  const productId = product?.id || product?._id || '';
  const title = product?.title || product?.name || 'Untitled Product';
  const sku = product?.sku || product?._id || 'N/A';
  const price = Number(product?.price ?? 0);
  const cost = Number(
    product?.cost ??
    product?.costPrice ??
    (price > 0 ? Number((price * 0.55).toFixed(2)) : 0)
  );
  const margin = price > 0 ? (((price - cost) / price) * 100).toFixed(0) : '0';
  const stock = Number(product?.stock ?? product?.stock_quantity ?? 0);
  const lowStockThreshold = Number(product?.lowStockThreshold ?? product?.min_stock_alert ?? 8);
  const isLow = stock > 0 && stock <= lowStockThreshold;
  const isOut = stock <= 0;

  const categoryName = typeof product?.category === 'object' && product?.category !== null
    ? (product.category.name || 'General')
    : (product?.category || 'General');

  const imageUrl = product?.image ||
    product?.images?.cover ||
    (Array.isArray(product?.images?.gallery) && product.images.gallery[0]) ||
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80';

  const salesCount = Number(product?.salesCount ?? product?.numReviews ?? 0);
  const status = product?.status || 'active';

  return (
    <tr className="hover:bg-zinc-50/60 transition-colors">
      {/* Product details */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <img
            src={imageUrl}
            alt={title}
            className="w-10 h-10 rounded-lg object-cover border border-zinc-200 shrink-0"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80';
            }}
          />
          
          <div className="min-w-0 max-w-xs">
            <div className="font-semibold text-zinc-900 truncate" title={title}>{title}</div>
            <div className="text-[10px] text-zinc-400 font-mono truncate">SKU: {sku}</div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-3 px-4 text-zinc-600">
        <span className="px-2 py-0.5 bg-zinc-100 rounded text-[11px] border border-zinc-200">
          {categoryName}
        </span>
      </td>

      {/* Price / Cost */}
      <td className="py-3 px-4">
        <div className="font-semibold text-zinc-900">${price.toFixed(2)}</div>
        <div className="text-[10px] text-zinc-400">
          Cost: ${cost.toFixed(2)} ({margin}% margin)
        </div>
      </td>

      {/* Real-time Stock control stepper */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 overflow-hidden shadow-2xs">
            <button
              id={`stock-dec-${productId}`}
              disabled={stock <= 0}
              onClick={() => onUpdateStock(productId, stock - 1, 'Manual decrement')}
              className="px-2 py-1 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 disabled:opacity-40 disabled:hover:bg-transparent font-mono text-xs transition-colors cursor-pointer"
              title="Decrease stock (-1)">
              -
            </button>
            <input
              type="number"
              value={stock}
              onChange={(e) =>
                onUpdateStock(
                  productId,
                  Math.max(0, parseInt(e.target.value) || 0),
                  'Direct input'
                )
              }
              className="w-12 text-center py-1 text-xs font-bold text-zinc-900 bg-white border-x border-zinc-200 focus:outline-hidden" />
            
            <button
              id={`stock-inc-${productId}`}
              onClick={() => onUpdateStock(productId, stock + 1, 'Manual restock')}
              className="px-2 py-1 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 font-mono text-xs transition-colors cursor-pointer"
              title="Increase stock (+1)">
              +
            </button>
          </div>

          {/* Stock status indicator pill */}
          {isOut ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              Out of stock
            </span>
          ) : isLow ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Low ({stock})
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              Healthy
            </span>
          )}
        </div>
      </td>

      {/* Units sold */}
      <td className="py-3 px-4 font-mono text-zinc-700">{salesCount} sold</td>

      {/* Status */}
      <td className="py-3 px-4">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase border ${
            status === 'active' || status === 'published'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-zinc-100 text-zinc-600 border-zinc-200'
          }`}>
          {status}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            id={`edit-prod-${productId}`}
            onClick={() => onEdit(product)}
            className="p-1.5 text-zinc-500 hover:text-indigo-600 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
            title="Edit product specs">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            id={`delete-prod-${productId}`}
            onClick={() => onDelete(productId, title)}
            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            title="Delete catalog item">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );

};