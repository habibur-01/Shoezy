import React from 'react';
import { Truck, Box } from 'lucide-react';














export const ShippingSection = ({
  isPhysical,
  setIsPhysical,
  weight,
  setWeight,
  length,
  setLength,
  width,
  setWidth,
  height,
  setHeight
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-orange-600" />
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Shipping & Parcel Dimensions
          </h2>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPhysical}
            onChange={(e) => setIsPhysical(e.target.checked)}
            className="rounded text-zinc-900 focus:ring-zinc-900" />
          
          <span className="text-xs text-zinc-700 font-medium">Physical Goods</span>
        </label>
      </div>

      {isPhysical ?
      <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Weight */}
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Weight (kg)
              </label>
              <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.45"
              value={weight === 0 ? '' : weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
            
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Length (cm)
              </label>
              <input
              type="number"
              step="0.1"
              min="0"
              placeholder="20"
              value={length === 0 ? '' : length}
              onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
            
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Width (cm)
              </label>
              <input
              type="number"
              step="0.1"
              min="0"
              placeholder="15"
              value={width === 0 ? '' : width}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
            
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Height (cm)
              </label>
              <input
              type="number"
              step="0.1"
              min="0"
              placeholder="8"
              value={height === 0 ? '' : height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white" />
            
            </div>
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center gap-2 text-xs text-zinc-600">
            <Box className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>
              Volumetric weight calculated automatically during checkout for carrier parcel rate calculation.
            </span>
          </div>
        </div> :

      <div className="p-6 text-center text-xs text-zinc-400">
          This is a digital product or service. No shipping labels will be generated.
        </div>
      }
    </div>);

};