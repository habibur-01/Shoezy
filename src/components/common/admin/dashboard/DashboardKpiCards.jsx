import React from 'react';
import { DollarSign, ShoppingBag, AlertTriangle, Ticket, ArrowUpRight, TrendingUp, Users } from 'lucide-react';

export const DashboardKpiCards = ({
  metrics,
  orders = [],
  products = [],
  onNavigateOrders,
  onNavigateCoupons,
}) => {
  const cards = [
    {
      id: 'kpi-revenue',
      title: 'Total Gross Volume',
      value: `$${(metrics?.totalRevenue || 128450).toLocaleString()}`,
      change: '+18.4%',
      trend: 'up',
      subtitle: 'vs. prior month ($108.4k)',
      icon: DollarSign,
      iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      onClick: null,
    },
    {
      id: 'kpi-orders',
      title: 'Fulfilled Orders',
      value: (metrics?.totalOrders || orders.length || 248).toLocaleString(),
      change: '+12.6%',
      trend: 'up',
      subtitle: '99.2% on-time delivery rate',
      icon: ShoppingBag,
      iconColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      onClick: onNavigateOrders,
    },
    {
      id: 'kpi-stock',
      title: 'Low Stock Alerts',
      value: metrics?.lowStockCount !== undefined ? metrics.lowStockCount : 2,
      change: metrics?.lowStockCount > 0 ? 'Requires Action' : 'Optimal',
      trend: metrics?.lowStockCount > 0 ? 'alert' : 'neutral',
      subtitle: 'Units below safety threshold',
      icon: AlertTriangle,
      iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      onClick: null,
    },
    {
      id: 'kpi-coupons',
      title: 'Active Promotions',
      value: metrics?.activeCouponsCount !== undefined ? metrics.activeCouponsCount : 3,
      change: '+2 campaigns',
      trend: 'up',
      subtitle: 'Average redemptions +34%',
      icon: Ticket,
      iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      onClick: onNavigateCoupons,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={card.onClick || undefined}
            className={`group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all ${
              card.onClick ? 'cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${card.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {card.value}
              </span>
              <span
                className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                  card.trend === 'alert'
                    ? 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400'
                    : 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400'
                }`}
              >
                {card.change}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>{card.subtitle}</span>
              {card.onClick && (
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
