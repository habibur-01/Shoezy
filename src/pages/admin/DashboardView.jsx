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

  // Clean zero-baseline chart dataset if no transactions exist yet
  const emptyChartData = {
    'Today': [
      { label: '12 AM', revenue: 0, orders: 0 },
      { label: '4 AM', revenue: 0, orders: 0 },
      { label: '8 AM', revenue: 0, orders: 0 },
      { label: '12 PM', revenue: 0, orders: 0 },
      { label: '4 PM', revenue: 0, orders: 0 },
      { label: '8 PM', revenue: 0, orders: 0 },
      { label: '11 PM', revenue: 0, orders: 0 },
    ],
    'This Week': [
      { label: 'Sun', revenue: 0, orders: 0 },
      { label: 'Mon', revenue: 0, orders: 0 },
      { label: 'Tue', revenue: 0, orders: 0 },
      { label: 'Wed', revenue: 0, orders: 0 },
      { label: 'Thu', revenue: 0, orders: 0 },
      { label: 'Fri', revenue: 0, orders: 0 },
      { label: 'Sat', revenue: 0, orders: 0 },
    ],
    '7D': [
      { label: 'Mon', revenue: 0, orders: 0 },
      { label: 'Tue', revenue: 0, orders: 0 },
      { label: 'Wed', revenue: 0, orders: 0 },
      { label: 'Thu', revenue: 0, orders: 0 },
      { label: 'Fri', revenue: 0, orders: 0 },
      { label: 'Sat', revenue: 0, orders: 0 },
      { label: 'Sun', revenue: 0, orders: 0 },
    ],
    'This Month': [
      { label: 'W1', revenue: 0, orders: 0 },
      { label: 'W2', revenue: 0, orders: 0 },
      { label: 'W3', revenue: 0, orders: 0 },
      { label: 'W4', revenue: 0, orders: 0 },
    ],
    '30D': [
      { label: 'W1', revenue: 0, orders: 0 },
      { label: 'W2', revenue: 0, orders: 0 },
      { label: 'W3', revenue: 0, orders: 0 },
      { label: 'W4', revenue: 0, orders: 0 },
    ],
    '90D': [
      { label: 'Month 1', revenue: 0, orders: 0 },
      { label: 'Month 2', revenue: 0, orders: 0 },
      { label: 'Month 3', revenue: 0, orders: 0 },
    ],
  }[chartRange] || [];

  const activeChartData =
    dashboardData?.revenueTrend?.chartData && dashboardData.revenueTrend.chartData.length > 0
      ? dashboardData.revenueTrend.chartData
      : emptyChartData;

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