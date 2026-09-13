import React from 'react';
import { AlertOctagon, ArrowRight, PackageX, ExternalLink } from 'lucide-react';

export const CriticalStockWatchlist = ({
  criticalInventory,
  products = [],
  onNavigateProducts,
}) => {
  // Use criticalInventory items if provided, otherwise filter products
  let criticalItems = [];
  let alertsCount = 0;

  if (criticalInventory?.items && Array.isArray(criticalInventory.items)) {
    criticalItems = criticalInventory.items.slice(0, 5);
    alertsCount = criticalInventory.totalAlerts ?? criticalInventory.items.length;
  } else {
    criticalItems = products
      .filter((p) => Number(p.stock ?? 0) <= Number(p.lowStockThreshold || 8))
      .slice(0, 5);
    alertsCount = criticalItems.length;
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Critical Inventory
              </h3>
              <p className="text-xs text-zinc-500">Items at or below safety stock</p>
            </div>
          </div>

          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
            {alertsCount} {alertsCount === 1 ? 'alert' : 'alerts'}
          </span>
        </div>

        {criticalItems.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 text-xs flex flex-col items-center gap-2">
            <PackageX className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
            <span>All shoe stock levels are healthy & above threshold.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {criticalItems.map((item) => {
              const stock = item.currentStock !== undefined ? item.currentStock : (item.stock ?? 0);
              const minThreshold = item.minStock !== undefined ? item.minStock : (item.lowStockThreshold || 8);
              const isOut = item.isOutOfStock || stock === 0;

              return (
                <div
                  key={item.id || item._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 hover:border-zinc-300 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'}
                      alt={item.title || item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-zinc-100 border border-zinc-200 dark:border-zinc-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.title || item.name}
                      </h4>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        SKU: {item.sku || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <div className={`text-xs font-bold font-mono ${isOut ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {item.badgeText || (isOut ? 'Out of Stock' : `${stock} left`)}
                    </div>
                    <span className="text-[10px] text-zinc-400">
                      Min: {minThreshold}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        id="btn-stock-view-all"
        onClick={onNavigateProducts}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
      >
        <span>Manage Product Catalog</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
