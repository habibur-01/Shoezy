import React from 'react';
import {
  Bell,
  Radio,
  Package,
  TrendingDown,
  TrendingUp,
  X,
  ExternalLink } from
'lucide-react';











export const NotificationsDropdown = ({
  isOpen,
  onToggle,
  onClose,
  alerts,
  onDismissAlert,
  onNavigateProducts
}) => {
  return (
    <div className="relative">
      <button
        id="btn-toggle-notifications"
        onClick={onToggle}
        className="relative p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
        title="Inventory Notifications">
        
        <Bell className="w-5 h-5" />
        {alerts.length > 0 &&
        <span className="absolute top-1.5 right-1.5 flex w-2.5 h-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
        }
      </button>

      {isOpen &&
      <div
        id="notifications-popover"
        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-zinc-200 rounded-xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
        
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              <h4 className="text-sm font-semibold text-zinc-900">Real-Time Inventory Stream</h4>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              {alerts.length} events
            </span>
          </div>

          {alerts.length === 0 ?
        <div className="py-8 text-center text-zinc-400 text-xs">
              <Package className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
              No live stock events yet. Simulation updates automatically every 18 seconds.
            </div> :

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {alerts.map((alert) =>
          <div
            key={alert.id}
            className="flex items-start justify-between p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/70 hover:bg-zinc-100/70 transition-colors text-xs">
            
                  <div className="flex items-start gap-2">
                    {alert.delta > 0 ?
              <span className="p-1 rounded bg-emerald-100 text-emerald-700 mt-0.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </span> :

              <span className="p-1 rounded bg-rose-100 text-rose-700 mt-0.5">
                        <TrendingDown className="w-3.5 h-3.5" />
                      </span>
              }
                    <div>
                      <div className="font-medium text-zinc-900 line-clamp-1">
                        {alert.productTitle}
                      </div>
                      <div className="text-zinc-500 text-[11px] mt-0.5">{alert.message}</div>
                      <div className="text-[10px] text-zinc-400 mt-1">{alert.timestamp}</div>
                    </div>
                  </div>
                  <button
              onClick={() => onDismissAlert(alert.id)}
              className="text-zinc-400 hover:text-zinc-600 p-0.5 cursor-pointer">
              
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
          )}
            </div>
        }

          <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs">
            <button
            onClick={() => {
              onClose();
              onNavigateProducts();
            }}
            className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1 cursor-pointer">
            
              Manage inventory catalog <ExternalLink className="w-3 h-3" />
            </button>
            <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 text-xs cursor-pointer">
            
              Dismiss
            </button>
          </div>
        </div>
      }
    </div>);

};