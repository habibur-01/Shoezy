import React from 'react';
import { Plus, Layers, RefreshCw } from 'lucide-react';

export const ProductsHeader = ({
  onOpenAddModal,
  onNavigateToCategories,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Product & Inventory Management</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Real-time stock controls, item specifications, and warehouse replenishers
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        {onRefresh && (
          <button
            id="btn-refresh-products"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh product catalog from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-600 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        )}

        {onNavigateToCategories && (
          <button
            id="btn-goto-categories"
            onClick={onNavigateToCategories}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Categories & Taxonomy
          </button>
        )}

        <button
          id="btn-add-product-main"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>
    </div>
  );
};