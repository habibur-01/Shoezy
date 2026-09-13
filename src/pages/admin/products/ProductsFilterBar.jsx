import React from 'react';
import { Search, Filter } from 'lucide-react';













export const ProductsFilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  stockFilter,
  setStockFilter,
  products
}) => {
  const totalCount = products.length;
  const lowCount = products.filter((p) => {
    const stock = Number(p?.stock ?? p?.stock_quantity ?? 0);
    const threshold = Number(p?.lowStockThreshold ?? p?.min_stock_alert ?? 8);
    return stock > 0 && stock <= threshold;
  }).length;
  const outCount = products.filter((p) => {
    const stock = Number(p?.stock ?? p?.stock_quantity ?? 0);
    return stock <= 0;
  }).length;

  return (
    <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            id="input-product-search"
            type="text"
            placeholder="Search by title, SKU, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
          
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-zinc-400" />
          <select
            id="select-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 cursor-pointer">
            
            {categories.map((cat) =>
            <option key={cat} value={cat}>
                Category: {cat}
              </option>
            )}
          </select>
        </div>

        {/* Stock Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg text-xs self-stretch md:self-auto justify-center">
          <button
            id="stock-filter-all"
            onClick={() => setStockFilter('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
            stockFilter === 'all' ?
            'bg-white text-zinc-900 shadow-xs' :
            'text-zinc-500 hover:text-zinc-900'}`
            }>
            
            All ({totalCount})
          </button>
          <button
            id="stock-filter-low"
            onClick={() => setStockFilter('low_stock')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
            stockFilter === 'low_stock' ?
            'bg-white text-amber-900 shadow-xs' :
            'text-zinc-500 hover:text-amber-700'}`
            }>
            
            Low Stock ({lowCount})
          </button>
          <button
            id="stock-filter-out"
            onClick={() => setStockFilter('out_of_stock')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
            stockFilter === 'out_of_stock' ?
            'bg-white text-rose-900 shadow-xs' :
            'text-zinc-500 hover:text-rose-700'}`
            }>
            
            Out of Stock ({outCount})
          </button>
        </div>
      </div>
    </div>);

};