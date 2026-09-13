import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';










export const ActiveHierarchyBreadcrumb = ({
  activeCategory,
  activeSubCategory,
  activeChildCategory,
  matchingProductsCount,
  onNavigateToAddProduct
}) => {
  return (
    <div className="p-3 bg-white border border-zinc-200 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 flex-wrap text-zinc-600">
        <span className="font-semibold text-zinc-400">Current Hierarchy:</span>
        {activeCategory ?
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            {activeCategory.name}
          </span> :

        <span className="text-zinc-400 italic">None selected</span>
        }

        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />

        {activeSubCategory ?
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            {activeSubCategory.name}
          </span> :

        <span className="text-zinc-400 italic">Select Subcategory</span>
        }

        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />

        {activeChildCategory ?
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            {activeChildCategory.name}
          </span> :

        <span className="text-zinc-400 italic">All child nodes</span>
        }
      </div>

      {/* Quick Product Count / Action */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <span className="text-zinc-500 font-medium">
          {matchingProductsCount} product(s) linked
        </span>
        {onNavigateToAddProduct &&
        <button
          onClick={() =>
          onNavigateToAddProduct(
            activeCategory?.name || '',
            activeSubCategory?.name || '',
            activeChildCategory?.name || ''
          )
          }
          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium hover:underline text-xs cursor-pointer">
          
            Add Product to this path
            <ArrowRight className="w-3 h-3" />
          </button>
        }
      </div>
    </div>);

};