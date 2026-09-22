import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Sparkles,
  Sliders,
  Check,
  Edit2,
  Tag,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';


const INITIAL_VARIANTS= [
  {
    id: 'var_01',
    productTitle: 'Aura Studio Wireless Noise-Canceling Headphones',
    parentSku: 'AUR-NC-001',
    variantSku: 'AUR-NC-001-SLV',
    variantName: 'Anodized Silver / Standard Cushion',
    colorHex: '#cbd5e1',
    size: 'Over-Ear',
    price: 349.99,
    stock: 28,
    barcode: '850021498011',
    status: 'in_stock',
  },
  {
    id: 'var_02',
    productTitle: 'Aura Studio Wireless Noise-Canceling Headphones',
    parentSku: 'AUR-NC-001',
    variantSku: 'AUR-NC-001-BLK',
    variantName: 'Matte Obsidian / Memory Foam',
    colorHex: '#18181b',
    size: 'Over-Ear',
    price: 349.99,
    stock: 14,
    barcode: '850021498012',
    status: 'in_stock',
  },
  {
    id: 'var_03',
    productTitle: 'Aura Studio Wireless Noise-Canceling Headphones',
    parentSku: 'AUR-NC-001',
    variantSku: 'AUR-NC-001-GLD',
    variantName: 'Champagne Gold / Alcantara',
    colorHex: '#d4af37',
    size: 'Over-Ear',
    price: 379.99,
    stock: 3,
    barcode: '850021498013',
    status: 'low_stock',
  },
  {
    id: 'var_04',
    productTitle: 'Mechanical Wireless Keyboard 75%',
    parentSku: 'KEY-75-WRL',
    variantSku: 'KEY-75-TACT-SLV',
    variantName: 'Silver Chassis / Tactile Brown Switches',
    colorHex: '#94a3b8',
    size: '75% Compact',
    price: 169.0,
    stock: 20,
    barcode: '850021498068',
    status: 'in_stock',
  },
  {
    id: 'var_05',
    productTitle: 'Mechanical Wireless Keyboard 75%',
    parentSku: 'KEY-75-WRL',
    variantSku: 'KEY-75-LIN-BLK',
    variantName: 'Midnight Black / Linear Red Switches',
    colorHex: '#0f172a',
    size: '75% Compact',
    price: 169.0,
    stock: 0,
    barcode: '850021498069',
    status: 'out_of_stock',
  },
  {
    id: 'var_06',
    productTitle: 'Organic Heavyweight Fleece Hoodie',
    parentSku: 'APP-HD-310',
    variantSku: 'APP-HD-310-M-OLV',
    variantName: 'Olive Green / Medium',
    colorHex: '#556b2f',
    size: 'Medium (M)',
    price: 110.0,
    stock: 32,
    barcode: '850021498075',
    status: 'in_stock',
  },
  {
    id: 'var_07',
    productTitle: 'Organic Heavyweight Fleece Hoodie',
    parentSku: 'APP-HD-310',
    variantSku: 'APP-HD-310-L-OLV',
    variantName: 'Olive Green / Large',
    colorHex: '#556b2f',
    size: 'Large (L)',
    price: 110.0,
    stock: 42,
    barcode: '850021498076',
    status: 'in_stock',
  },
];

export const ProductVariantsView = () => {
  const [variants, setVariants] = useState(INITIAL_VARIANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  const filteredVariants = variants.filter((v) => {
    const matchesSearch =
      v.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.variantSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.variantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = stockFilter === 'all' || v.status === stockFilter;
    return matchesSearch && matchesStock;
  });

  const handleStockAdjust = (id, delta) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const nextStock = Math.max(0, v.stock + delta);
          let nextStatus = 'in_stock';
          if (nextStock === 0) nextStatus = 'out_of_stock';
          else if (nextStock <= 5) nextStatus = 'low_stock';
          return { ...v, stock: nextStock, status: nextStatus };
        }
        return v;
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Product Variants Matrix</h1>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" /> New Multi-SKU Engine
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure matrix combinations for sizes, colorways, technical specifications, and discrete barcode tracking.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search variant name, SKU, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['all', 'in_stock', 'low_stock', 'out_of_stock']).map((status) => (
            <button
              key={status}
              onClick={() => setStockFilter(status)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer capitalize ${
                stockFilter === status
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Variants Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Variant & Parent Product</th>
                <th className="py-3 px-4">Variant SKU & Barcode</th>
                <th className="py-3 px-4">Attributes</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Variant Stock</th>
                <th className="py-3 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filteredVariants.map((v) => (
                <tr key={v.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-zinc-900 flex items-center gap-2">
                      {v.colorHex && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-2xs shrink-0"
                          style={{ backgroundColor: v.colorHex }}
                        />
                      )}
                      <span>{v.variantName}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{v.productTitle}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-mono text-xs font-semibold text-zinc-800">{v.variantSku}</div>
                    <div className="font-mono text-[10px] text-zinc-400">UPC: {v.barcode}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10px] font-medium border border-zinc-200">
                      {v.size || 'Standard'}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                    ${v.price.toFixed(2)}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900">{v.stock}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          v.status === 'in_stock'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : v.status === 'low_stock'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {v.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleStockAdjust(v.id, -1)}
                        className="px-2 py-1 text-xs border border-zinc-200 rounded hover:bg-zinc-100 font-bold"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleStockAdjust(v.id, +5)}
                        className="px-2.5 py-1 text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold rounded hover:bg-indigo-100"
                      >
                        +5 Restock
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
