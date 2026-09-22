import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Boxes,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  CreditCard,
  Percent,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Printer,
  ShieldCheck,
  Tag,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const ReportsView = ({ initialReport = 'sales' }) => {
  const { metrics, products, orders, customers, coupons } = useAdmin();
  const [reportType, setReportType] = useState(initialReport);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync when initialReport prop changes (e.g. user clicked a specific report in sidebar)
  useEffect(() => {
    if (initialReport) {
      setReportType(initialReport);
    }
  }, [initialReport]);

  // CSV Export utility
  const handleExportCsv = () => {
    let headers = [];
    let rows = [];
    const filename = `${reportType}_report_${dateRange.toLowerCase().replace(/\s+/g, '_')}.csv`;

    if (reportType === 'sales') {
      headers = ['Order ID', 'Customer', 'Date', 'Source Channel', 'Payment Method', 'Gross ($)', 'Discount ($)', 'Net ($)', 'Status'];
      rows = orders.map((o) => [
        o.id,
        o.customerName,
        o.createdAt.split('T')[0],
        o.source || 'Storefront',
        o.paymentMethod || 'Stripe',
        o.total.toFixed(2),
        o.discount.toFixed(2),
        (o.total - o.discount).toFixed(2),
        o.status,
      ]);
    } else if (reportType === 'orders') {
      headers = ['Order ID', 'Customer Name', 'Items Count', 'Carrier', 'Source', 'Order Status', 'Payment Status', 'Total ($)'];
      rows = orders.map((o) => [
        o.id,
        o.customerName,
        o.items.length,
        o.carrier || 'Standard',
        o.source || 'Web',
        o.status,
        o.paymentStatus,
        o.total.toFixed(2),
      ]);
    } else if (reportType === 'products') {
      headers = ['SKU', 'Product Title', 'Category', 'Price ($)', 'Cost ($)', 'Current Stock', 'Units Sold', 'Total Revenue ($)', 'Est Profit ($)'];
      rows = products.map((p) => [
        p.sku,
        p.title,
        p.category,
        p.price.toFixed(2),
        p.cost.toFixed(2),
        p.stock,
        p.salesCount,
        (p.salesCount * p.price).toFixed(2),
        (p.salesCount * (p.price - p.cost)).toFixed(2),
      ]);
    } else if (reportType === 'inventory') {
      headers = ['SKU', 'Product Title', 'Current Stock', 'Low Stock Threshold', 'Unit Cost ($)', 'Total Stock Value ($)', 'Restock Status'];
      rows = products.map((p) => {
        const isOut = p.stock === 0;
        const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;
        const status = isOut ? 'Out of Stock' : isLow ? 'Low Stock Warning' : 'Healthy Stock';
        return [
          p.sku,
          p.title,
          p.stock,
          p.lowStockThreshold,
          p.cost.toFixed(2),
          (p.stock * p.cost).toFixed(2),
          status,
        ];
      });
    } else if (reportType === 'customers') {
      headers = ['Customer ID', 'Name', 'Email', 'Tier', 'Orders Count', 'Total Spent ($)', 'Last Order Date'];
      rows = customers.map((c) => [
        c.id,
        c.name,
        c.email,
        c.tier,
        c.ordersCount,
        c.totalSpent.toFixed(2),
        c.lastOrderDate,
      ]);
    } else if (reportType === 'payments') {
      headers = ['Transaction ID', 'Order ID', 'Customer', 'Method', 'Payment Status', 'Gross ($)', 'Gateway Fee ($)', 'Net Settled ($)'];
      rows = orders.map((o) => {
        const fee = o.total * 0.029 + 0.3;
        const net = Math.max(0, o.total - fee);
        return [
          `TXN-${o.id.replace('#', '')}`,
          o.id,
          o.customerName,
          o.paymentMethod || 'Stripe Card',
          o.paymentStatus,
          o.total.toFixed(2),
          fee.toFixed(2),
          net.toFixed(2),
        ];
      });
    } else if (reportType === 'coupons') {
      headers = ['Coupon Code', 'Discount Value', 'Redemptions', 'Min Spend ($)', 'Status', 'Expiry Date', 'Attributed Sales ($)'];
      rows = coupons.map((cp) => [
        cp.code,
        cp.discountPercent ? `${cp.discountPercent}%` : `$${cp.discountAmount}`,
        cp.usageCount,
        cp.minSpend || 0,
        cp.status,
        cp.expiryDate,
        (cp.usageCount * 125).toFixed(2),
      ]);
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations for KPI cards
  const totalStockValuationCost = useMemo(() => {
    return products.reduce((sum, p) => sum + p.stock * p.cost, 0);
  }, [products]);

  const totalStockValuationRetail = useMemo(() => {
    return products.reduce((sum, p) => sum + p.stock * p.price, 0);
  }, [products]);

  const totalUnitsSold = useMemo(() => {
    return products.reduce((sum, p) => sum + p.salesCount, 0);
  }, [products]);

  const deliveredOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'delivered').length;
  }, [orders]);

  const totalCouponsUsed = useMemo(() => {
    return coupons.reduce((sum, c) => sum + c.usageCount, 0);
  }, [coupons]);

  const totalDiscountGranted = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.discount || 0), 0);
  }, [orders]);

  // Filtered lists based on search
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        (o.paymentMethod && o.paymentMethod.toLowerCase().includes(q))
    );
  }, [orders, searchQuery]);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  const filteredCoupons = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return coupons;
    return coupons.filter((cp) => cp.code.toLowerCase().includes(q));
  }, [coupons, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Business Intelligence & Analytics</h1>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              Executive Suite
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Audit store performance, gross margins, fulfillment velocity, and export CSV ledger sheets.
          </p>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-500" />
            Print Ledger
          </button>
        </div>
      </div>

      {/* 7 Report Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-zinc-200 rounded-xl overflow-x-auto shadow-2xs">
        <button
          onClick={() => setReportType('sales')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            reportType === 'sales'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          Sales & Revenue
        </button>

        <button
          onClick={() => setReportType('orders')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            reportType === 'orders'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Orders & Fulfillment
        </button>

        <button
          onClick={() => setReportType('products')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            reportType === 'products'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Product Performance
        </button>

        <button
          onClick={() => setReportType('inventory')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            reportType === 'inventory'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          Inventory Valuation
        </button>

        <button
          onClick={() => setReportType('customers')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            reportType === 'customers'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Customer Cohorts
        </button>

        <button
          onClick={() => setReportType('payments')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            reportType === 'payments'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Payment Settlement
        </button>

        <button
          onClick={() => setReportType('coupons')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            reportType === 'coupons'
              ? 'bg-zinc-900 text-white shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          Coupons & Discounts
        </button>
      </div>

      {/* Date Range and Live Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder={`Search ${reportType} records...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['Today', 'Last 7 Days', 'Last 30 Days', 'Year to Date'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                dateRange === range
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Report Container */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-2xs">
        {/* ===================================================================== */}
        {/* REPORT 1: SALES & REVENUE REPORT                                      */}
        {/* ===================================================================== */}
        {reportType === 'sales' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Gross Sales Volume</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-zinc-900">
                    ${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                    <ArrowUpRight className="w-3 h-3" /> +18.4%
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Pre-tax & shipping included</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Total Promotional Discounts</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-rose-600">
                    -${totalDiscountGranted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-500">
                    {Math.round((totalDiscountGranted / (metrics.totalRevenue || 1)) * 100)}% of gross
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Coupons & cart auto-deductions</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Net Realized Revenue</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-emerald-600">
                    ${(metrics.totalRevenue - totalDiscountGranted).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                    <ArrowUpRight className="w-3 h-3" /> +19.2%
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Net recognized top-line</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Average Order Value (AOV)</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-indigo-600">
                    ${(metrics.totalRevenue / (orders.length || 1)).toFixed(2)}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                    <ArrowUpRight className="w-3 h-3" /> +4.1%
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Basket size across channels</span>
              </div>
            </div>

            {/* Sales Channel Breakdown */}
            <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50/50 space-y-3">
              <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                Sales Volume by Acquisition Channel
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white border border-zinc-200 rounded-lg">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Direct Web Storefront</span>
                    <span className="font-bold text-zinc-900 font-mono">72%</span>
                  </div>
                  <span className="text-lg font-bold font-mono text-zinc-900 mt-1 block">
                    ${(metrics.totalRevenue * 0.72).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-3 bg-white border border-zinc-200 rounded-lg">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Instagram & Social Commerce</span>
                    <span className="font-bold text-zinc-900 font-mono">19%</span>
                  </div>
                  <span className="text-lg font-bold font-mono text-zinc-900 mt-1 block">
                    ${(metrics.totalRevenue * 0.19).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-3 bg-white border border-zinc-200 rounded-lg">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Manual Phone / B2B PO</span>
                    <span className="font-bold text-zinc-900 font-mono">9%</span>
                  </div>
                  <span className="text-lg font-bold font-mono text-zinc-900 mt-1 block">
                    ${(metrics.totalRevenue * 0.09).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Sales Audit Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                  Detailed Sales Ledger ({filteredOrders.length} transactions)
                </h3>
              </div>

              <div className="overflow-x-auto border border-zinc-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Channel</th>
                      <th className="py-2.5 px-3">Payment</th>
                      <th className="py-2.5 px-3 text-right">Gross</th>
                      <th className="py-2.5 px-3 text-right">Discount</th>
                      <th className="py-2.5 px-3 text-right">Net</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{o.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-zinc-900">{o.customerName}</td>
                        <td className="py-2.5 px-3 font-mono text-zinc-500">{o.createdAt.split('T')[0]}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-100 text-zinc-700 font-medium">
                            {o.source || 'Storefront'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-zinc-600">{o.paymentMethod || 'Stripe'}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-900">
                          ${o.total.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-rose-500">
                          -${(o.discount || 0).toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                          ${(o.total - (o.discount || 0)).toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : o.status === 'processing'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* REPORT 2: ORDERS & FULFILLMENT REPORT                                 */}
        {/* ===================================================================== */}
        {reportType === 'orders' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Total Orders Handled</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-zinc-900">{orders.length}</span>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                    <ArrowUpRight className="w-3 h-3" /> +12.0%
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">All channels combined</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Delivered & Closed</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-emerald-600">{deliveredOrdersCount}</span>
                  <span className="text-[11px] font-semibold text-zinc-500">
                    {Math.round((deliveredOrdersCount / (orders.length || 1)) * 100)}% success
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Signed and completed packages</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Active In-Transit / Queue</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-indigo-600">
                    {orders.filter((o) => o.status === 'processing' || o.status === 'shipped').length}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">In courier network right now</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Fulfillment SLA Time</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-zinc-900">1.4 Days</span>
                  <span className="text-[11px] font-semibold text-emerald-600">Fast</span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Order creation to courier dispatch</span>
              </div>
            </div>

            {/* Carrier SLA Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                  Orders Fulfillment & Tracking Registry ({filteredOrders.length})
                </h3>
              </div>

              <div className="overflow-x-auto border border-zinc-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Order Number</th>
                      <th className="py-2.5 px-3">Recipient Customer</th>
                      <th className="py-2.5 px-3 text-center">Items</th>
                      <th className="py-2.5 px-3">Assigned Carrier</th>
                      <th className="py-2.5 px-3">Tracking Reference</th>
                      <th className="py-2.5 px-3 text-center">Fulfillment Status</th>
                      <th className="py-2.5 px-3 text-center">Payment Status</th>
                      <th className="py-2.5 px-3 text-right">Order Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{o.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-zinc-900">{o.customerName}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{o.items.length}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-zinc-800">{o.carrier || 'DHL Express'}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-500">
                          {o.trackingNumber || 'DHL-9840219-US'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : o.status === 'shipped'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.paymentStatus === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-900">
                          ${o.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* REPORT 3: PRODUCT PERFORMANCE REPORT                                  */}
        {/* ===================================================================== */}
        {reportType === 'products' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Catalog SKU Breadth</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-zinc-900">{products.length}</span>
                  <span className="text-[11px] text-zinc-500">Active SKUs</span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">100% available in store</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Total Units Sold</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-indigo-600">{totalUnitsSold}</span>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                    <ArrowUpRight className="w-3 h-3" /> +15.3%
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Across all product variants</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Average Product Price</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-zinc-900">
                    ${(products.reduce((s, p) => s + p.price, 0) / (products.length || 1)).toFixed(2)}
                  </span>
                  <span className="text-[11px] text-zinc-400">Retail avg</span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Markup ratio 2.6x on cost</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Top Velocity Leader</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-zinc-900 truncate">
                    {products[0]?.title || 'Audio Pro X'}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 font-mono mt-1 block">
                  {products[0]?.salesCount || 142} units sold
                </span>
              </div>
            </div>

            {/* Product Performance Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                  Product Sales & Profit Margin Performance ({filteredProducts.length})
                </h3>
              </div>

              <div className="overflow-x-auto border border-zinc-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Product Name & SKU</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Retail Price</th>
                      <th className="py-2.5 px-3 text-right">Unit Cost</th>
                      <th className="py-2.5 px-3 text-center">Stock</th>
                      <th className="py-2.5 px-3 text-right">Units Sold</th>
                      <th className="py-2.5 px-3 text-right">Gross Sales</th>
                      <th className="py-2.5 px-3 text-right">Est. Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                    {filteredProducts.map((p) => {
                      const gross = p.salesCount * p.price;
                      const profit = p.salesCount * (p.price - p.cost);
                      const marginPct = p.price > 0 ? Math.round(((p.price - p.cost) / p.price) * 100) : 0;
                      return (
                        <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-zinc-900">{p.title}</div>
                            <div className="text-[11px] text-zinc-400 font-mono">{p.sku}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 bg-zinc-100 rounded text-zinc-600 text-[11px]">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-zinc-900">${p.price.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-zinc-500">${p.cost.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-center font-mono">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                p.stock === 0
                                  ? 'bg-rose-100 text-rose-700'
                                  : p.stock <= p.lowStockThreshold
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-zinc-100 text-zinc-700'
                              }`}
                            >
                              {p.stock}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-600">
                            {p.salesCount}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-900">
                            ${gross.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                            {marginPct}% (${profit.toLocaleString('en-US', { minimumFractionDigits: 0 })})
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* REPORT 4: INVENTORY REPORT                                           */}
        {/* ===================================================================== */}
        {reportType === 'inventory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Warehouse Valuation (Cost)</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-zinc-900">
                    ${totalStockValuationCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Wholesale capital deployed</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Catalog Retail Potential</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-emerald-600">
                    ${totalStockValuationRetail.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Projected retail realization</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Safety Stock Warnings</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-amber-600">
                    {products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length} SKUs
                  </span>
                </div>
                <span className="text-[11px] text-amber-600 font-medium mt-1 block">Restock recommended</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Out-of-Stock Deficits</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-rose-600">
                    {products.filter((p) => p.stock === 0).length} SKUs
                  </span>
                </div>
                <span className="text-[11px] text-rose-600 font-medium mt-1 block">Lost sales risk</span>
              </div>
            </div>

            {/* Inventory Reorder Urgency Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                  Warehouse Stock Depletion & Reorder Audit ({filteredProducts.length})
                </h3>
              </div>

              <div className="overflow-x-auto border border-zinc-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Product Name & SKU</th>
                      <th className="py-2.5 px-3 text-center">On Hand</th>
                      <th className="py-2.5 px-3 text-center">Threshold</th>
                      <th className="py-2.5 px-3 text-right">Unit Cost</th>
                      <th className="py-2.5 px-3 text-right">Depreciated Value</th>
                      <th className="py-2.5 px-3 text-center">Health Status</th>
                      <th className="py-2.5 px-3 text-right">Suggested Restock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                    {filteredProducts.map((p) => {
                      const isOut = p.stock === 0;
                      const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;
                      const suggestedReorder = isOut ? 50 : isLow ? 30 : 0;
                      return (
                        <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-zinc-900">{p.title}</div>
                            <div className="text-[11px] text-zinc-400 font-mono">{p.sku}</div>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-zinc-900">
                            {p.stock}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-zinc-500">
                            {p.lowStockThreshold}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-zinc-600">${p.cost.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-900">
                            ${(p.stock * p.cost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {isOut ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                                Low Stock Alert
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                Optimal Stock
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono">
                            {suggestedReorder > 0 ? (
                              <span className="font-bold text-indigo-600">
                                +{suggestedReorder} units (${(suggestedReorder * p.cost).toFixed(0)})
                              </span>
                            ) : (
                              <span className="text-zinc-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* REPORT 5: CUSTOMER REPORT                                            */}
        {/* ===================================================================== */}
        {reportType === 'customers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Customer Accounts Base</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-zinc-900">{customers.length}</span>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                    <ArrowUpRight className="w-3 h-3" /> +14.8%
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Active profiles</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Repeat Purchase Frequency</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-indigo-600">42.8%</span>
                  <span className="text-[11px] font-semibold text-emerald-600">High loyalty</span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Multiple orders in 60 days</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">VIP Tier Advocates</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-amber-600">
                    {customers.filter((c) => c.tier === 'VIP').length} Clients
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">&gt; $1,000 spend bracket</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Average Lifetime Value</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-emerald-600">
                    ${(customers.reduce((s, c) => s + c.totalSpent, 0) / (customers.length || 1)).toFixed(2)}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Historical basket LTV</span>
              </div>
            </div>

            {/* Customer Spending Leaderboard Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                  Customer Cohorts & Lifetime Contribution ({filteredCustomers.length})
                </h3>
              </div>

              <div className="overflow-x-auto border border-zinc-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Customer Profile</th>
                      <th className="py-2.5 px-3">Email Address</th>
                      <th className="py-2.5 px-3 text-center">Loyalty Tier</th>
                      <th className="py-2.5 px-3 text-center">Orders Placed</th>
                      <th className="py-2.5 px-3 text-right">Lifetime Spend</th>
                      <th className="py-2.5 px-3 text-right">Avg Basket</th>
                      <th className="py-2.5 px-3 text-right">Last Purchase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                    {filteredCustomers.map((c) => {
                      const avgBasket = c.ordersCount > 0 ? c.totalSpent / c.ordersCount : 0;
                      return (
                        <tr key={c.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-zinc-900">{c.name}</div>
                            <div className="text-[11px] text-zinc-400 font-mono">{c.id}</div>
                          </td>
                          <td className="py-2.5 px-3 text-zinc-600">{c.email}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                c.tier === 'VIP'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : c.tier === 'Loyal'
                                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                  : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                              }`}
                            >
                              {c.tier}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-zinc-900">
                            {c.ordersCount}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                            ${c.totalSpent.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-zinc-700">
                            ${avgBasket.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-zinc-500 font-mono text-[11px]">
                            {c.lastOrderDate}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* REPORT 6: PAYMENT REPORT                                             */}
        {/* ===================================================================== */}
        {reportType === 'payments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Total Settled Volume</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-zinc-900">
                    ${(metrics.totalRevenue * 0.971).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600">Net payout</span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Deposited to primary merchant bank</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Gateway Fees Deduction</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-rose-600">
                    ${(metrics.totalRevenue * 0.029).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">~2.9%</span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Interchange & processor costs</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Pending Gateway Clearance</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-amber-600">$1,420.50</span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Scheduled for next 48h batch</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Refund / Dispute Reserve</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-zinc-900">$320.00</span>
                  <span className="text-[11px] font-semibold text-emerald-600">0.08% rate</span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Extremely low chargeback risk</span>
              </div>
            </div>

            {/* Gateway Methods Split */}
            <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50/50 space-y-3">
              <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                Payment Method & Gateway Settlement Distribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white border border-zinc-200 rounded-lg">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span className="font-semibold text-zinc-800">Stripe Card Processing</span>
                    <span className="font-bold text-indigo-600 font-mono">68%</span>
                  </div>
                  <span className="text-base font-bold font-mono text-zinc-900 mt-1 block">$17,980.00</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">Visa, Mastercard, Amex, Apple Pay</span>
                </div>

                <div className="p-3 bg-white border border-zinc-200 rounded-lg">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span className="font-semibold text-zinc-800">PayPal Express</span>
                    <span className="font-bold text-blue-600 font-mono">18%</span>
                  </div>
                  <span className="text-base font-bold font-mono text-zinc-900 mt-1 block">$4,760.00</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">One-click PayPal checkout</span>
                </div>

                <div className="p-3 bg-white border border-zinc-200 rounded-lg">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span className="font-semibold text-zinc-800">Cash on Delivery (COD)</span>
                    <span className="font-bold text-emerald-600 font-mono">9%</span>
                  </div>
                  <span className="text-base font-bold font-mono text-zinc-900 mt-1 block">$2,380.00</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">Collected upon courier handoff</span>
                </div>

                <div className="p-3 bg-white border border-zinc-200 rounded-lg">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span className="font-semibold text-zinc-800">Bank Wire / ACH</span>
                    <span className="font-bold text-purple-600 font-mono">5%</span>
                  </div>
                  <span className="text-base font-bold font-mono text-zinc-900 mt-1 block">$1,320.00</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">B2B invoice settlements</span>
                </div>
              </div>
            </div>

            {/* Payment Audit Register */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                  Payment Settlement & Gateway Reconciliations ({filteredOrders.length})
                </h3>
              </div>

              <div className="overflow-x-auto border border-zinc-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Transaction Ref</th>
                      <th className="py-2.5 px-3">Order</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Gateway / Method</th>
                      <th className="py-2.5 px-3 text-center">Settlement Status</th>
                      <th className="py-2.5 px-3 text-right">Gross Charged</th>
                      <th className="py-2.5 px-3 text-right">Est. Gateway Fee</th>
                      <th className="py-2.5 px-3 text-right">Net Settled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                    {filteredOrders.map((o) => {
                      const fee = o.total * 0.029 + 0.3;
                      const net = Math.max(0, o.total - fee);
                      return (
                        <tr key={o.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-zinc-800">
                            TXN-{o.id.replace('#', '')}-STRIPE
                          </td>
                          <td className="py-2.5 px-3 font-mono text-indigo-600">{o.id}</td>
                          <td className="py-2.5 px-3 text-zinc-900 font-semibold">{o.customerName}</td>
                          <td className="py-2.5 px-3 text-zinc-600">{o.paymentMethod || 'Stripe Card'}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                o.paymentStatus === 'paid'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : o.paymentStatus === 'refunded'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-900">
                            ${o.total.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-rose-500">-${fee.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                            ${net.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* REPORT 7: COUPON / DISCOUNT REPORT                                   */}
        {/* ===================================================================== */}
        {reportType === 'coupons' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Total Discounts Granted</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-rose-600">
                    ${(totalDiscountGranted + totalCouponsUsed * 18.5).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Promotional markdown capital</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Coupon Redemptions</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-indigo-600">{totalCouponsUsed}</span>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                    <ArrowUpRight className="w-3 h-3" /> +28.6%
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Baskets using promo codes</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Revenue Driven by Promos</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-emerald-600">
                    ${(totalCouponsUsed * 145).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">Attributed gross sales</span>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <span className="text-xs text-zinc-500 font-medium">Campaign ROI Multiplier</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-zinc-900">7.8x</span>
                  <span className="text-[11px] font-semibold text-emerald-600">High efficiency</span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">$7.80 revenue per $1 discount</span>
              </div>
            </div>

            {/* Coupons Performance Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
                  Promotional Code Audit & Attribution Ledger ({filteredCoupons.length})
                </h3>
              </div>

              <div className="overflow-x-auto border border-zinc-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Coupon Code</th>
                      <th className="py-2.5 px-3">Discount Value</th>
                      <th className="py-2.5 px-3 text-center">Redemptions</th>
                      <th className="py-2.5 px-3 text-right">Min Spend</th>
                      <th className="py-2.5 px-3 text-right">Total Discount Given</th>
                      <th className="py-2.5 px-3 text-right">Attributed Revenue</th>
                      <th className="py-2.5 px-3 text-center">Campaign Status</th>
                      <th className="py-2.5 px-3 text-right">Expiry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                    {filteredCoupons.map((c) => {
                      const discountValueStr = c.discountPercent
                        ? `${c.discountPercent}% OFF`
                        : `$${c.discountAmount} OFF`;
                      const estDiscountGiven = c.discountPercent
                        ? c.usageCount * 25
                        : c.usageCount * (c.discountAmount || 20);
                      const estAttributedRevenue = c.usageCount * 140;
                      return (
                        <tr key={c.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-2.5 px-3">
                            <span className="font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                              {c.code}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-zinc-900">{discountValueStr}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-zinc-800">
                            {c.usageCount} {c.usageLimit ? `/ ${c.usageLimit}` : 'uses'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-zinc-600">
                            ${c.minSpend?.toFixed(2) || '0.00'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-rose-600 font-bold">
                            -${estDiscountGiven.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-bold">
                            ${estAttributedRevenue.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                c.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-zinc-500 text-[11px]">
                            {c.expiryDate}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
