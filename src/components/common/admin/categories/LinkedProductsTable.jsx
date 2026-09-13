import React from 'react';
import { Package, ArrowRight } from 'lucide-react';










export const LinkedProductsTable = ({
  matchingProducts,
  activeCategoryName,
  activeSubCategoryName,
  activeChildCategoryName,
  onNavigateToAddProduct
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-zinc-200 bg-zinc-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Products In Selected Hierarchy ({matchingProducts.length})
          </h2>
          <p className="text-[11px] text-zinc-500">
            Catalog inventory items linked to the currently selected taxonomy path
          </p>
        </div>

        {onNavigateToAddProduct &&
        <button
          onClick={() =>
          onNavigateToAddProduct(
            activeCategoryName || '',
            activeSubCategoryName || '',
            activeChildCategoryName || ''
          )
          }
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
          
            Add Product Here
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        }
      </div>

      {matchingProducts.length === 0 ?
      <div className="py-12 text-center text-zinc-400">
          <Package className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
          <p className="text-xs">No products currently assigned to this category tier.</p>
        </div> :

      <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50/50 text-zinc-500 border-b border-zinc-100 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5">Product Title</th>
                <th className="px-4 py-2.5">SKU</th>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5">Subcategory</th>
                <th className="px-4 py-2.5">Child Category</th>
                <th className="px-4 py-2.5">Price</th>
                <th className="px-4 py-2.5">Current Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {matchingProducts.map((prod) =>
            <tr key={prod.id} className="hover:bg-zinc-50/50">
                  <td className="px-4 py-2.5 flex items-center gap-2.5">
                    <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-7 h-7 rounded-md object-cover border border-zinc-200" />
                
                    <span className="font-semibold text-zinc-900">{prod.title}</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-zinc-500">
                    {prod.sku}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium text-[10px]">
                      {prod.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium text-[10px]">
                      {prod.subCategory || 'General'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium text-[10px]">
                      {prod.childCategory || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-zinc-900">
                    ${prod.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                  className={`font-semibold ${
                  prod.stock === 0 ?
                  'text-rose-600' :
                  prod.stock <= prod.lowStockThreshold ?
                  'text-amber-600' :
                  'text-emerald-700'}`
                  }>
                  
                      {prod.stock} units
                    </span>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      }
    </div>);

};