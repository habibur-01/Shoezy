import React from 'react';
import { Package, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';












export const InventorySection = ({
  sku,
  setSku,
  stock,
  setStock,
  lowStockThreshold,
  setLowStockThreshold,
  title,
  category
}) => {
  const generateSku = () => {
    const catPrefix = (category || 'CAT').slice(0, 3).toUpperCase();
    const titlePrefix = (title || 'PROD').
    replace(/[^a-zA-Z0-9]/g, '').
    slice(0, 4).
    toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setSku(`${catPrefix}-${titlePrefix}-${randomSuffix}`);
  };

  const getStockStatusPill = () => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> Out of Stock
        </span>);

    }
    if (stock <= lowStockThreshold) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" /> Low Stock Warning ({stock} remaining)
        </span>);

    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Available in Stock ({stock} units)
      </span>);

  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-zinc-700" />
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Inventory & Stock Tracking
          </h2>
        </div>
        {getStockStatusPill()}
      </div>

      <div className="p-5 space-y-4">
        {/* SKU Field with Generator */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-zinc-800">
              SKU (Stock Keeping Unit) <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={generateSku}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
              
              <RefreshCw className="w-3 h-3" /> Auto-Generate SKU
            </button>
          </div>
          <input
            type="text"
            required
            id="input-product-sku"
            placeholder="e.g. AUD-APX-8492"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg font-mono text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
          
        </div>

        {/* Stock counts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Available Quantity / Stock <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              required
              id="input-product-stock"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white font-semibold" />
            
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Low Stock Alert Threshold
            </label>
            <input
              type="number"
              min="1"
              id="input-product-threshold"
              placeholder="10"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
            
            <span className="text-[10px] text-zinc-400 mt-1 block">
              Dashboard alerts trigger when stock drops below this level.
            </span>
          </div>
        </div>
      </div>
    </div>);

};