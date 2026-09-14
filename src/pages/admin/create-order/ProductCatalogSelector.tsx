import React, { useState } from 'react';
import {
  Search,
  Plus,
  Gift,
  Package,
  Check,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Product, OrderItem } from '../../types';

interface ProductCatalogSelectorProps {
  onAddItem: (item: OrderItem) => void;
  selectedItems: OrderItem[];
}

export const ProductCatalogSelector: React.FC<ProductCatalogSelectorProps> = ({
  onAddItem,
  selectedItems,
}) => {
  const { products, categories } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      (p.brand && p.brand.toLowerCase().includes(query)) ||
      (p.barcode && p.barcode.includes(query));

    return matchesCategory && matchesSearch;
  });

  const handleAddProduct = (prod: Product, asGift = false) => {
    const existing = selectedItems.find(
      (it) => it.productId === prod.id && it.isGift === asGift
    );

    const newItem: OrderItem = {
      productId: prod.id,
      title: prod.title,
      price: asGift ? 0 : prod.price,
      originalPrice: prod.price,
      quantity: 1,
      sku: prod.sku,
      isGift: asGift,
      giftMessage: asGift ? 'Complimentary Social Gift with order' : undefined,
      image: prod.image,
    };

    onAddItem(newItem);
    setRecentlyAddedId(prod.id + (asGift ? '-gift' : ''));
    setTimeout(() => setRecentlyAddedId(null), 1200);
  };

  const getStockBadge = (stock: number, threshold: number) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
          <XCircle className="w-2.5 h-2.5" /> Out of stock
        </span>
      );
    }
    if (stock <= threshold) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
          <AlertTriangle className="w-2.5 h-2.5" /> Low: {stock} left
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
        <Check className="w-2.5 h-2.5" /> {stock} in stock
      </span>
    );
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <span>3. Select Products from Store Inventory</span>
            <span className="text-[11px] font-normal text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
              Live Warehouse Catalog
            </span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Search items to add as regular purchased products or complimentary social gifts.
          </p>
        </div>

        <span className="text-xs font-mono text-zinc-400">
          {products.length} catalog items available
        </span>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-3.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by product title, SKU (e.g., AUR-NC-001), or barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800"
          />
        </div>

        <div className="sm:w-52">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800"
          >
            <option value="All">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List Grid */}
      <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100 border border-zinc-200 rounded-xl bg-zinc-50/40">
        {filteredProducts.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 flex flex-col items-center gap-1.5">
            <Package className="w-6 h-6 text-zinc-300" />
            <span className="text-xs">No products matched your search filter.</span>
          </div>
        ) : (
          filteredProducts.map((prod) => {
            const isOutOfStock = prod.stock === 0;
            const regularAdded = recentlyAddedId === prod.id;
            const giftAdded = recentlyAddedId === `${prod.id}-gift`;

            return (
              <div
                key={prod.id}
                className="p-3 bg-white hover:bg-zinc-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                {/* Product Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-lg object-cover border border-zinc-200 flex-shrink-0 bg-zinc-100"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-zinc-900 truncate">
                        {prod.title}
                      </h4>
                      {getStockBadge(prod.stock, prod.lowStockThreshold)}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                      <span className="font-mono text-zinc-600">{prod.sku}</span>
                      <span>•</span>
                      <span>{prod.category}</span>
                      {prod.brand && (
                        <>
                          <span>•</span>
                          <span>{prod.brand}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-zinc-900 font-mono">
                      ${prod.price.toFixed(2)}
                    </div>
                    {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                      <div className="text-[10px] text-zinc-400 line-through">
                        ${prod.compareAtPrice.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Standard Add */}
                    <button
                      type="button"
                      id={`btn-add-prod-${prod.id}`}
                      disabled={isOutOfStock}
                      onClick={() => handleAddProduct(prod, false)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        regularAdded
                          ? 'bg-emerald-600 text-white'
                          : isOutOfStock
                          ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                      }`}
                    >
                      {regularAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Added!
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Add
                        </>
                      )}
                    </button>

                    {/* Add as Gift Item */}
                    <button
                      type="button"
                      id={`btn-add-gift-${prod.id}`}
                      disabled={isOutOfStock}
                      title="Add as a Complimentary Gift item ($0.00)"
                      onClick={() => handleAddProduct(prod, true)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                        giftAdded
                          ? 'bg-purple-600 text-white border-purple-600'
                          : isOutOfStock
                          ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border-zinc-200'
                          : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Gift ($0)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
