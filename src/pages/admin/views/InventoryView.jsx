import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Search,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  PackageCheck,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const InventoryView = () => {
  const { products, updateProductStock, metrics, hasPermission } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('low_stock');
  const [restockAmount, setRestockAmount] = useState({});

  const canUpdate = hasPermission('inventory.update');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === 'low_stock') {
      return p.stock <= p.lowStockThreshold && p.stock > 0;
    }
    if (filterMode === 'out_of_stock') {
      return p.stock === 0;
    }
    if (filterMode === 'healthy') {
      return p.stock > p.lowStockThreshold;
    }
    return true;
  });

  const handleRestock = (productId) => {
    const amount = restockAmount[productId] || 10;
    const current = products.find((p) => p.id === productId)?.stock || 0;
    updateProductStock(productId, current + amount, `Inventory replenishment batch (+${amount})`);
    setRestockAmount((prev) => ({ ...prev, [productId]: 10 }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Inventory Control & Alerts</h1>
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              {metrics.lowStockCount} Low Stock Items
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monitor warehouse inventory, replenish depleted SKUs, and manage real-time restock triggers.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-400 font-medium">Critical Low Stock</span>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {metrics.lowStockCount}
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Under safe safety-stock threshold</p>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-400 font-medium">Out of Stock SKUs</span>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-1">
            {metrics.outOfStockCount}
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Immediate supplier reorder required</p>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-400 font-medium">Healthy Inventory</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {products.filter((p) => p.stock > p.lowStockThreshold).length}
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Adequate fulfillment cushion</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search SKU, product title, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['low_stock', 'out_of_stock', 'healthy', 'all'].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer capitalize ${
                filterMode === mode
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Min Threshold</th>
                <th className="py-3 px-4">Health Status</th>
                <th className="py-3 px-4 text-right">Direct Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filteredProducts.map((product) => {
                const isLow = product.stock <= product.lowStockThreshold && product.stock > 0;
                const isOut = product.stock === 0;

                return (
                  <tr key={product.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-900">{product.title}</div>
                      <div className="font-mono text-[11px] text-zinc-400">{product.sku}</div>
                    </td>

                    <td className="py-3 px-4 text-zinc-600">{product.category}</td>

                    <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                      {product.stock} units
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-500">
                      {product.lowStockThreshold} units
                    </td>

                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          Low Stock Alert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Optimal Stock
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {canUpdate ? (
                        <div className="inline-flex items-center gap-1.5">
                          <input
                            type="number"
                            min="1"
                            value={restockAmount[product.id] ?? 15}
                            onChange={(e) =>
                              setRestockAmount({
                                ...restockAmount,
                                [product.id]: parseInt(e.target.value) || 1,
                              })
                            }
                            className="w-16 px-2 py-1 text-xs border border-zinc-200 rounded font-mono text-center"
                          />
                          <button
                            onClick={() => handleRestock(product.id)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-xs transition-colors shadow-2xs"
                          >
                            Add Stock
                          </button>
                        </div>
                      ) : (
                        <span className="text-zinc-400 italic">Read-only role</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
