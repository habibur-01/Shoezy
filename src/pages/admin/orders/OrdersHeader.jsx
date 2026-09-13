import React from 'react';
import { Download } from 'lucide-react';





export const OrdersHeader = ({ onExportOrders }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Order Tracking & Fulfillment</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Monitor shipments, manage dispatch pipelines, and handle customer returns
        </p>
      </div>

      <button
        id="btn-export-orders"
        onClick={onExportOrders}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg shadow-2xs transition-colors self-start sm:self-auto cursor-pointer">
        
        <Download className="w-3.5 h-3.5 text-zinc-500" />
        Export Orders (CSV)
      </button>
    </div>);

};