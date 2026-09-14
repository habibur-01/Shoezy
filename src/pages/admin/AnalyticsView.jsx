import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { AnalyticsHeader } from './analytics/AnalyticsHeader';
import { AnalyticsKpis } from './analytics/AnalyticsKpis';
import { CustomerSegmentationCard } from './analytics/CustomerSegmentationCard';
import { GeographicFootprintCard } from './analytics/GeographicFootprintCard';
import { CustomersLeaderboard } from './analytics/CustomersLeaderboard';

export const AnalyticsView = () => {
  const { customers, orders, metrics, assertPermission } = useAdmin();
  const [selectedTier, setSelectedTier] = useState('all');

  const totalSpentAcrossAll = customers.reduce((sum, c) => sum + (Number(c.totalSpent) || 0), 0);
  const averageOrderValue = (metrics.totalRevenue || 0) / Math.max(1, orders.length);
  const avgCustomerLtv = totalSpentAcrossAll / Math.max(1, customers.length);

  const vipCount = customers.filter((c) => (c.tier || '').toUpperCase() === 'VIP').length;
  const regularCount = customers.filter((c) => (c.tier || '').toUpperCase() === 'REGULAR').length;
  const newCount = customers.filter((c) => (c.tier || '').toUpperCase() === 'NEW').length;
  const atRiskCount = customers.filter((c) => (c.tier || '').toUpperCase() === 'AT-RISK').length;

  const vipPercent = (vipCount / Math.max(1, customers.length) * 100).toFixed(0);

  const filteredCustomers = customers.filter((c) => {
    if (selectedTier === 'all') return true;
    return String(c.tier || '').toLowerCase() === selectedTier.toLowerCase();
  });

  const exportAnalyticsCSV = () => {
    if (!assertPermission('analytics.export', 'Export Customer Analytics CSV')) return;

    const headers = ['Customer ID,Name,Email,Tier,Orders,Total Spent,Last Order,Location\n'];
    const rows = filteredCustomers.map(
      (c) =>
      `"${c.id}","${c.name}","${c.email}","${c.tier}",${c.ordersCount},${c.totalSpent},"${
      c.lastOrderDate}","${
      c.city}, ${c.country}"\n`
    );

    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <AnalyticsHeader onExportAnalytics={exportAnalyticsCSV} />

      {/* Financial Health & Cohort KPIs */}
      <AnalyticsKpis
        averageOrderValue={averageOrderValue}
        avgCustomerLtv={avgCustomerLtv}
        vipPercent={vipPercent}
        vipCount={vipCount} />
      

      {/* Customer Segmentation Distribution & Geographic footprint */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CustomerSegmentationCard
          totalCustomers={customers.length}
          vipCount={vipCount}
          regularCount={regularCount}
          newCount={newCount}
          atRiskCount={atRiskCount} />
        
        <GeographicFootprintCard />
      </div>

      {/* Top Customers Leaderboard */}
      <CustomersLeaderboard
        customers={filteredCustomers}
        selectedTier={selectedTier}
        setSelectedTier={setSelectedTier} />
      
    </div>);

};

export default AnalyticsView;