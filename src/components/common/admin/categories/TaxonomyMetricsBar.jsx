import React from 'react';
import { Package } from 'lucide-react';







export const TaxonomyMetricsBar = ({ metrics, totalProducts }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-3.5 bg-white border border-zinc-200 rounded-xl shadow-xs flex items-center justify-between">
        <div>
          <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Level 1: Categories</div>
          <div className="text-xl font-bold text-zinc-900 mt-0.5">{metrics.totalCategoriesCount}</div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs">
          L1
        </div>
      </div>

      <div className="p-3.5 bg-white border border-zinc-200 rounded-xl shadow-xs flex items-center justify-between">
        <div>
          <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Level 2: Subcategories</div>
          <div className="text-xl font-bold text-zinc-900 mt-0.5">{metrics.totalSubCategoriesCount}</div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-xs">
          L2
        </div>
      </div>

      <div className="p-3.5 bg-white border border-zinc-200 rounded-xl shadow-xs flex items-center justify-between">
        <div>
          <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Level 3: Child Categories</div>
          <div className="text-xl font-bold text-zinc-900 mt-0.5">{metrics.totalChildCategoriesCount}</div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-semibold text-xs">
          L3
        </div>
      </div>

      <div className="p-3.5 bg-white border border-zinc-200 rounded-xl shadow-xs flex items-center justify-between">
        <div>
          <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Catalog Products</div>
          <div className="text-xl font-bold text-zinc-900 mt-0.5">{totalProducts}</div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 font-semibold text-xs">
          <Package className="w-4 h-4 text-zinc-500" />
        </div>
      </div>
    </div>);

};