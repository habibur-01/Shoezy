import React from 'react';
import { Globe } from 'lucide-react';

export const GeographicFootprintCard = () => {
  const regions = [
  { label: 'North America (US & CA)', value: '$5,900.50', share: '32%' },
  { label: 'Middle East (UAE)', value: '$6,740.00', share: '35%' },
  { label: 'Europe (Sweden & Denmark)', value: '$4,160.00', share: '22%' },
  { label: 'Asia-Pacific (Japan)', value: '$890.00', share: '5%' },
  { label: 'Latin America (Colombia)', value: '$2,150.00', share: '11%' }];


  return (
    <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs">
      <div className="pb-3 mb-3 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-semibold text-zinc-900">Geographic Footprint</h3>
        </div>
      </div>

      <div className="space-y-2.5 text-xs">
        {regions.map((region) =>
        <div
          key={region.label}
          className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
          
            <span className="font-medium text-zinc-800">{region.label}</span>
            <span className="font-mono font-semibold text-zinc-900">
              {region.value} ({region.share})
            </span>
          </div>
        )}
      </div>
    </div>);

};