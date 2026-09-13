import React from 'react';
import { Package } from 'lucide-react';

import { ProductTableRow } from './ProductTableRow';








export const ProductsTable = ({
  products,
  onUpdateStock,
  onEdit,
  onDelete,
  isLoading
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50/75 text-zinc-500 border-b border-zinc-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Product Details</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price / Margin</th>
              <th className="py-3 px-4">Real-time Stock Control</th>
              <th className="py-3 px-4">Units Sold</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {isLoading && products.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-zinc-500 font-medium">Loading catalog products from database...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-400">
                  <Package className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                  No products match your search or filter parameters.
                </td>
              </tr>
            ) : (
              products.map((product, idx) => (
                <ProductTableRow
                  key={product.id || product._id || `prod-${idx}`}
                  product={product}
                  onUpdateStock={onUpdateStock}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};