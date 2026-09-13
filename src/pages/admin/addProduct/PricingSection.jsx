import React from 'react';
import { DollarSign, TrendingUp, Percent, AlertCircle } from 'lucide-react';












export const PricingSection = ({
  price,
  setPrice,
  compareAtPrice,
  setCompareAtPrice,
  costPrice,
  setCostPrice,
  isTaxable,
  setIsTaxable
}) => {
  // Margin & Profit calculations
  const profit = price > 0 && costPrice > 0 ? price - costPrice : 0;
  const marginPercent = price > 0 && costPrice > 0 ? (profit / price * 100).toFixed(1) : '0.0';
  const discountPercent =
  compareAtPrice > price && compareAtPrice > 0 ?
  ((compareAtPrice - price) / compareAtPrice * 100).toFixed(0) :
  null;

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Pricing & Financial Margins
          </h2>
        </div>
        <span className="text-[11px] text-zinc-400 font-medium">USD Currency</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Selling Price */}
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Selling Price ($) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-medium text-zinc-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                id="input-product-price"
                placeholder="0.00"
                value={price === 0 ? '' : price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg font-semibold text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
              
            </div>
          </div>

          {/* Compare at price */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-800">
                Compare-at Price ($)
              </label>
              {discountPercent &&
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                  -{discountPercent}% OFF
                </span>
              }
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-medium text-zinc-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                id="input-product-compare-price"
                placeholder="0.00"
                value={compareAtPrice === 0 ? '' : compareAtPrice}
                onChange={(e) => setCompareAtPrice(parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
              
            </div>
          </div>

          {/* Cost per Item */}
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Cost per Item ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-medium text-zinc-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                id="input-product-cost-price"
                placeholder="0.00"
                value={costPrice === 0 ? '' : costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
              
            </div>
          </div>
        </div>

        {/* Live Profit & Margin Indicator */}
        <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-zinc-500 font-medium">Estimated Gross Margin:</span>{' '}
              <strong className="text-zinc-900 font-bold ml-1">{marginPercent}%</strong>
            </div>
            <div className="h-3 w-px bg-zinc-300 hidden sm:block" />
            <div>
              <span className="text-zinc-500 font-medium">Net Profit / Unit:</span>{' '}
              <strong
                className={`font-bold ml-1 ${
                profit > 0 ? 'text-emerald-700' : profit < 0 ? 'text-rose-600' : 'text-zinc-900'}`
                }>
                
                ${profit.toFixed(2)}
              </strong>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isTaxable}
              onChange={(e) => setIsTaxable(e.target.checked)}
              className="rounded text-zinc-900 focus:ring-zinc-900" />
            
            <span className="text-xs text-zinc-700 font-medium">Charge sales tax on this product</span>
          </label>
        </div>
      </div>
    </div>);

};