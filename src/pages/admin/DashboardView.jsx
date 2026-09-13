import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';
import { getDashboardData } from '../../server/dashboard/dashboard';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { BusinessInsightsBar } from './dashboard/BusinessInsightsBar';
import { DashboardKpiCards } from './dashboard/DashboardKpiCards';
import { RevenueVelocityChart } from './dashboard/RevenueVelocityChart';
import { CriticalStockWatchlist } from './dashboard/CriticalStockWatchlist';
import { RecentOrdersCard } from './dashboard/RecentOrdersCard';
import { TopSellingProductsCard } from './dashboard/TopSellingProductsCard';
import { CategoryDistributionCard } from './dashboard/CategoryDistributionCard';
import { AuditStreamCard } from './dashboard/AuditStreamCard';

export const DashboardView = ({
  setActiveTab,
  openNewProductModal,
  openNewCouponModal,
}) => {
  const { metrics, orders, products, auditLogs, currentRole } = useAdmin();
  const [chartRange, setChartRange] = useState('Today');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);

  const getTimeframeParam = (range) => {
    switch (range) {
      case 'Today':
        return 'today';
      case 'This Week':
      case '7D':
        return '7d';
      case 'This Month':
      case '30D':
        return '30d';
      case '90D':
        return '90d';
      default:
        return 'today';
    }
  };

  // Fetch full consolidated dashboard payload from backend API
  const fetchDashboard = useCallback(async (timeframe = chartRange) => {
    setIsLoadingDashboard(true);
    setDashboardError(null);
    try {
      const tf = getTimeframeParam(timeframe);
      const res = await getDashboardData(tf);
      if (res?.success && res?.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.warn('Dashboard API error, falling back to local context:', err.message);
      setDashboardError(err.message);
    } finally {
      setIsLoadingDashboard(false);
    }
  }, [chartRange]);

  // Load dashboard data on mount and whenever chartRange changes
  useEffect(() => {
    fetchDashboard(chartRange);
  }, [chartRange, fetchDashboard]);

  // Default fallback chart dataset if API is loading or unavailable
  const fallbackChartData = {
    'Today': [
      { label: '12 AM', revenue: 810, orders: 5 },
      { label: '4 AM', revenue: 1450, orders: 8 },
      { label: '8 AM', revenue: 3200, orders: 16 },
      { label: '12 PM', revenue: 5600, orders: 28 },
      { label: '4 PM', revenue: 3800, orders: 19 },
      { label: '8 PM', revenue: 4900, orders: 24 },
      { label: '11 PM', revenue: 1200, orders: 7 },
    ],
    'This Week': [
      { label: 'Sun', revenue: 7280, orders: 27 },
      { label: 'Mon', revenue: 5909, orders: 25 },
      { label: 'Tue', revenue: 4591, orders: 20 },
      { label: 'Wed', revenue: 1258, orders: 6 },
      { label: 'Thu', revenue: 3248, orders: 13 },
      { label: 'Fri', revenue: 1304, orders: 7 },
      { label: 'Sat', revenue: 9158, orders: 49 },
    ],
    '7D': [
      { label: 'Mon', revenue: 420, orders: 4 },
      { label: 'Tue', revenue: 680, orders: 6 },
      { label: 'Wed', revenue: 310, orders: 3 },
      { label: 'Thu', revenue: 890, orders: 8 },
      { label: 'Fri', revenue: 1140, orders: 11 },
      { label: 'Sat', revenue: 1420, orders: 15 },
      { label: 'Sun', revenue: 980, orders: 9 },
    ],
    'This Month': [
      { label: 'W1', revenue: 4800, orders: 42 },
      { label: 'W2', revenue: 6200, orders: 58 },
      { label: 'W3', revenue: 5900, orders: 51 },
      { label: 'W4', revenue: 7800, orders: 74 },
    ],
    '30D': [
      { label: 'W1', revenue: 4800, orders: 42 },
      { label: 'W2', revenue: 6200, orders: 58 },
      { label: 'W3', revenue: 5900, orders: 51 },
      { label: 'W4', revenue: 7800, orders: 74 },
    ],
    '90D': [
      { label: 'Jul', revenue: 21500, orders: 198 },
      { label: 'Aug', revenue: 26800, orders: 245 },
      { label: 'Sep', revenue: 31200, orders: 289 },
    ],
  }[chartRange] || [];

  const activeChartData =
    dashboardData?.revenueTrend?.chartData && dashboardData.revenueTrend.chartData.length > 0
      ? dashboardData.revenueTrend.chartData
      : fallbackChartData;

  const maxRevenue = Math.max(...activeChartData.map((d) => Number(d.revenue) || 0), 100);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Operations Quick Actions Bar */}
      <DashboardHeader
        currentRole={currentRole}
        openNewProductModal={openNewProductModal}
        openNewCouponModal={openNewCouponModal}
        onNavigateAudit={() => setActiveTab('audit')}
        onRefresh={() => fetchDashboard(chartRange)}
        isLoading={isLoadingDashboard}
      />

      {/* Dynamic AI Operations Insights Bar */}
      {dashboardData?.businessInsights && (
        <BusinessInsightsBar insights={dashboardData.businessInsights} />
      )}

      {/* KPI Summary Cards */}
      <DashboardKpiCards
        overview={dashboardData?.overview}
        metrics={metrics}
        orders={orders}
        products={products}
        onNavigateOrders={() => setActiveTab('orders')}
        onNavigateCoupons={() => setActiveTab('coupons')}
        onNavigateProducts={() => setActiveTab('products')}
      />

      {/* Grid 1: Revenue Velocity Chart (2 cols) + Critical Stock Alerts (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueVelocityChart
          chartRange={chartRange}
          setChartRange={setChartRange}
          chartData={activeChartData}
          maxRevenue={maxRevenue}
          revenueTrend={dashboardData?.revenueTrend}
          isLoading={isLoadingDashboard}
        />

        <CriticalStockWatchlist
          criticalInventory={dashboardData?.criticalInventory}
          products={products}
          onNavigateProducts={() => setActiveTab('products')}
        />
      </div>

      {/* Grid 2: Recent Customer Orders (2 cols) + Top Performing Footwear (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentOrdersCard
          recentOrders={dashboardData?.recentOrders}
          orders={orders}
          onNavigateOrders={() => setActiveTab('orders')}
        />

        <TopSellingProductsCard
          products={dashboardData?.topSellingProducts || []}
          onNavigateProducts={() => setActiveTab('products')}
        />
      </div>

      {/* Grid 3: Category Demand & Fulfillment Pipeline (2 cols) + Security Audit Stream (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CategoryDistributionCard
          categoryData={dashboardData?.categories}
          orderStatusData={dashboardData?.orderStatus}
          onNavigateCategories={() => setActiveTab('categories')}
        />

        <AuditStreamCard
          auditLogs={auditLogs}
          onNavigateAudit={() => setActiveTab('audit')}
        />
      </div>
    </div>
  );
};