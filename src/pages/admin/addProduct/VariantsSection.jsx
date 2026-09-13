import React, { useState } from 'react';
import { Sliders, Plus, Trash2, Check } from 'lucide-react';











export const VariantsSection = ({
  hasVariants,
  setHasVariants,
  variants,
  setVariants,
  basePrice,
  baseSku
}) => {
  const [optionName, setOptionName] = useState('');
  const [optionSku, setOptionSku] = useState('');
  const [optionPrice, setOptionPrice] = useState(basePrice);
  const [optionStock, setOptionStock] = useState(10);

  const handleAddVariant = (e) => {
    e.preventDefault();
    if (!optionName.trim()) return;

    const newVariant = {
      id: `var_${Date.now()}`,
      name: optionName.trim(),
      sku: optionSku.trim() || `${baseSku || 'SKU'}-${variants.length + 1}`,
      price: optionPrice || basePrice,
      stock: optionStock || 0
    };

    setVariants([...variants, newVariant]);
    setOptionName('');
    setOptionSku('');
  };

  const handleRemoveVariant = (id) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Product Variants & Options
          </h2>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasVariants}
            onChange={(e) => setHasVariants(e.target.checked)}
            className="rounded text-zinc-900 focus:ring-zinc-900" />
          
          <span className="text-xs text-zinc-700 font-medium">Enable Variants</span>
        </label>
      </div>

      {hasVariants ?
      <div className="p-5 space-y-4">
          <p className="text-xs text-zinc-500">
            Define options like size, color, storage capacity, or material with distinct SKUs, prices, and stock allocations.
          </p>

          {/* New Variant Input Bar */}
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
            <div className="text-xs font-semibold text-zinc-800">Add Variant Option</div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div>
                <input
                type="text"
                placeholder="Variant Name (e.g. Matte Black / Large)"
                value={optionName}
                onChange={(e) => setOptionName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900" />
              
              </div>
              <div>
                <input
                type="text"
                placeholder="Variant SKU (optional)"
                value={optionSku}
                onChange={(e) => setOptionSku(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg font-mono text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900" />
              
              </div>
              <div>
                <input
                type="number"
                step="0.01"
                placeholder={`Price ($${basePrice})`}
                value={optionPrice || ''}
                onChange={(e) => setOptionPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900" />
              
              </div>
              <div className="flex gap-2">
                <input
                type="number"
                placeholder="Stock"
                value={optionStock}
                onChange={(e) => setOptionStock(parseInt(e.target.value, 10) || 0)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900" />
              
                <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shrink-0 transition-colors">
                
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Variants Table */}
          {variants.length > 0 &&
        <div className="border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold">
                  <tr>
                    <th className="px-3 py-2">Variant Name</th>
                    <th className="px-3 py-2">SKU</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2">Allocated Stock</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {variants.map((v) =>
              <tr key={v.id} className="hover:bg-zinc-50">
                      <td className="px-3 py-2 font-medium text-zinc-900">{v.name}</td>
                      <td className="px-3 py-2 font-mono text-zinc-600">{v.sku}</td>
                      <td className="px-3 py-2 font-semibold text-zinc-900">
                        ${v.price ? v.price.toFixed(2) : basePrice.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-zinc-700">{v.stock} units</td>
                      <td className="px-3 py-2 text-right">
                        <button
                    type="button"
                    onClick={() => handleRemoveVariant(v.id)}
                    className="p-1 text-zinc-400 hover:text-rose-600 rounded transition-colors">
                    
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
              )}
                </tbody>
              </table>
            </div>
        }
        </div> :

      <div className="p-6 text-center text-xs text-zinc-400">
          This is a standalone product with a single SKU and uniform inventory count.
        </div>
      }
    </div>);

};