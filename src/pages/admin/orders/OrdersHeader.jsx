import React from 'react';
import { Download, RefreshCw, Plus, PackageCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrdersHeader = ({ onExportOrders, onRefresh, isRefreshing, totalCount, lastUpdated }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Order Tracking & Fulfillment
          </h1>
          {typeof totalCount === 'number' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60">
              {totalCount} Total
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Real-time platform orders, shipment logistics, carrier tracking, and financial reconciliation
          {lastUpdated && (
            <span className="hidden md:inline ml-2 text-zinc-400 dark:text-zinc-500">
              • Last synced: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
        {/* Refresh Orders Button */}
        <button
          id="btn-refresh-orders"
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          title="Refresh orders from server"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
        </button>

        {/* Export Orders Button */}
        <button
          id="btn-export-orders"
          type="button"
          onClick={onExportOrders}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-2xs transition-all cursor-pointer"
          title="Export visible orders to CSV"
        >
          <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span>Export CSV</span>
        </button>

        {/* Create Manual Order Button */}
        <Link
          id="btn-create-order-shortcut"
          to="/admin/create_order"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
          title="Record a new order manually"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Order</span>
        </Link>
      </div>
    </div>
  );
};