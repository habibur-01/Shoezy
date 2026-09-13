import React from 'react';
import { DollarSign, ShoppingBag, AlertTriangle, Ticket, ArrowUpRight, TrendingUp, Users } from 'lucide-react';

export const DashboardKpiCards = ({
  overview,
  metrics,
  orders = [],
  products = [],
  onNavigateOrders,
  onNavigateCoupons,
  onNavigateProducts,
}) => {
  // 1. Gross Volume
  const revenueValue = overview?.totalRevenue?.formatted
    ? overview.totalRevenue.formatted
    : `$${(metrics?.totalRevenue || 0).toLocaleString()}`;
  const revenueGrowth = overview?.totalRevenue?.growth !== undefined
    ? `${overview.totalRevenue.growth >= 0 ? '+' : ''}${overview.totalRevenue.growth}%`
    : '+18.4%';
  const revenueTrend = overview?.totalRevenue?.isPositive !== false ? 'up' : 'down';
  const revenueSubtitle = overview?.comparisonLabel
    ? `${overview.comparisonLabel} (${overview.timeframe || 'period'})`
    : 'vs. prior period';

  // 2. Orders Volume
  const totalOrdersCount = overview?.totalOrders?.value !== undefined
    ? overview.totalOrders.value
    : (metrics?.totalOrders || orders.length || 0);

  const fulfilledOrdersCount = overview?.fulfilledOrders?.value !== undefined
    ? overview.fulfilledOrders.value
    : totalOrdersCount;

  const ordersGrowth = overview?.totalOrders?.growth !== undefined
    ? `${overview.totalOrders.growth >= 0 ? '+' : ''}${overview.totalOrders.growth}%`
    : '+12.6%';

  const ordersSubtitle = overview?.fulfilledOrders?.deliveryRateLabel
    ? `${fulfilledOrdersCount} fulfilled (${overview.fulfilledOrders.deliveryRateLabel})`
    : `${fulfilledOrdersCount} fulfilled orders`;

  // 3. Low Stock Alerts
  const stockAlertsCount = overview?.lowStockAlerts?.count !== undefined
    ? overview.lowStockAlerts.count
    : (metrics?.lowStockCount !== undefined ? metrics.lowStockCount : 0);
  const stockSubtitle = overview?.lowStockAlerts?.subtitle || 'Units below safety threshold';
  const stockStatusLabel = overview?.lowStockAlerts?.label || (stockAlertsCount > 0 ? 'Requires Action' : 'Optimal');

  // 4. Active Promotions
  const couponsCount = overview?.activePromotions?.count !== undefined
    ? overview.activePromotions.count
    : (metrics?.activeCouponsCount !== undefined ? metrics.activeCouponsCount : 0);
  const couponsGrowth = overview?.activePromotions?.growthLabel || '+2 campaigns';
  const couponsSubtitle = overview?.activePromotions?.subtitle || 'Average redemptions +34%';

  const cards = [
    {
      id: 'kpi-revenue',
      title: 'Total Gross Volume',
      value: revenueValue,
      change: revenueGrowth,
      trend: revenueTrend,
      subtitle: revenueSubtitle,
      icon: DollarSign,
      iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      onClick: null,
    },
    {
      id: 'kpi-orders',
      title: 'Total Orders',
      value: totalOrdersCount.toLocaleString(),
      change: ordersGrowth,
      trend: 'up',
      subtitle: ordersSubtitle,
      icon: ShoppingBag,
      iconColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      onClick: onNavigateOrders,
    },
    {
      id: 'kpi-stock',
      title: 'Low Stock Alerts',
      value: stockAlertsCount,
      change: stockStatusLabel,
      trend: stockAlertsCount > 0 ? 'alert' : 'neutral',
      subtitle: stockSubtitle,
      icon: AlertTriangle,
      iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      onClick: onNavigateProducts,
    },
    {
      id: 'kpi-coupons',
      title: 'Active Promotions',
      value: couponsCount,
      change: couponsGrowth,
      trend: 'up',
      subtitle: couponsSubtitle,
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
                    ? 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60'
                    : card.trend === 'down'
                    ? 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                    : 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
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
