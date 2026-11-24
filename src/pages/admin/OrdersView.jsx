import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Package,
  Clock,
  RefreshCw,
  Truck,
  CheckCircle2,
  XCircle,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { getAdminOrders } from '../../server/order/adminOrder';

import { OrdersHeader } from './orders/OrdersHeader';
import { OrdersFilterBar } from './orders/OrdersFilterBar';
import { OrdersTable } from './orders/OrdersTable';
import { OrderDetailModal } from './orders/OrderDetailModal';

export const OrdersView = () => {
  const {
    orders: contextOrders,
    orderStats: contextStats,
    refreshOrders,
    updateOrderStatus,
    cancelAndRefundOrder,
    assertPermission,
    currentUser,
    currentRole,
  } = useAdmin();

  // Local state
  const [orders, setOrders] = useState(contextOrders || []);
  const [stats, setStats] = useState(contextStats || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // Filter & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [carrier, setCarrier] = useState('FedEx Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

  // Sync with context if context updates from elsewhere
  useEffect(() => {
    if (contextOrders && contextOrders.length > 0 && orders.length === 0) {
      setOrders(contextOrders);
    }
  }, [contextOrders]);

  useEffect(() => {
    if (contextStats && !stats) {
      setStats(contextStats);
    }
  }, [contextStats]);

  // Fetch orders directly from API
  const fetchOrdersFromApi = useCallback(async (showRefreshingSpinner = false) => {
    if (showRefreshingSpinner) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const res = await getAdminOrders();
      const rawData = res?.data;
      const ordersData = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.orders)
        ? rawData.orders
        : Array.isArray(res)
        ? res
        : [];

      if (rawData?.stats) {
        setStats(rawData.stats);
      }

      setOrders(ordersData);
      setLastUpdated(Date.now());
      // Also sync context in background
      if (typeof refreshOrders === 'function') {
        refreshOrders();
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
      setError(err?.response?.data?.message || err.message || 'Unable to connect to orders API');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [refreshOrders]);

  // Initial load
  useEffect(() => {
    fetchOrdersFromApi(false);
  }, []);

  // Sync selectedOrder when orders list updates
  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find(
        (o) =>
          o.id === selectedOrder.id ||
          o._id === selectedOrder.id ||
          o.id === selectedOrder._id ||
          o._id === selectedOrder._id
      );
      if (updated) {
        setSelectedOrder(updated);
      }
    }
  }, [orders]);

  // Reset to page 1 whenever search, status filter, sort, or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy, pageSize]);

  // Client-side filtering & sorting
  const filteredAndSortedOrders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const filtered = orders.filter((order) => {
      const orderId = String(order.id || order._id || order.orderNumber || '').toLowerCase();
      const customerName = String(order.customerName || '').toLowerCase();
      const customerEmail = String(order.customerEmail || '').toLowerCase();
      const tracking = String(order.trackingNumber || '').toLowerCase();
      const carrierName = String(order.carrier || '').toLowerCase();
      const itemNames = (order.items || []).map((it) => (it.title || it.name || '').toLowerCase()).join(' ');

      const matchesSearch =
        !q ||
        orderId.includes(q) ||
        customerName.includes(q) ||
        customerEmail.includes(q) ||
        tracking.includes(q) ||
        carrierName.includes(q) ||
        itemNames.includes(q);

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sorting
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
      const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
      const totalA = Number(a.total ?? a.total_amount ?? a.totalAmount ?? 0);
      const totalB = Number(b.total ?? b.total_amount ?? b.totalAmount ?? 0);

      switch (sortBy) {
        case 'createdAt_asc':
          return dateA - dateB;
        case 'total_desc':
          return totalB - totalA;
        case 'total_asc':
          return totalA - totalB;
        case 'createdAt_desc':
        default:
          return dateB - dateA;
      }
    });
  }, [orders, searchQuery, statusFilter, sortBy]);

  // Pagination calculation
  const totalOrdersCount = filteredAndSortedOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalOrdersCount / pageSize));
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedOrders, currentPage, pageSize]);

  // Executive KPI summary metrics
  const computedStats = useMemo(() => {
    if (stats) return stats;

    const total = orders.length;
    let revenue = 0;
    let pending = 0;
    let processing = 0;
    let shipped = 0;
    let delivered = 0;
    let cancelled = 0;

    orders.forEach((o) => {
      const amt = Number(o.total ?? o.total_amount ?? o.totalAmount ?? 0);
      if (o.status !== 'cancelled' && o.status !== 'failed') {
        revenue += amt;
      }
      if (o.status === 'pending') pending++;
      else if (o.status === 'processing') processing++;
      else if (o.status === 'shipped') shipped++;
      else if (o.status === 'delivered') delivered++;
      else if (o.status === 'cancelled') cancelled++;
    });

    return {
      total,
      totalOrders: total,
      revenue,
      totalRevenue: revenue,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
    };
  }, [orders, stats]);

  // Order Detail Modal handlers
  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setCarrier(order.carrier || 'FedEx Express');
    setTrackingNumber(order.trackingNumber || `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setUpdateNote('');
    setShowRefundConfirm(false);
  };

  const handleAdvanceStatus = async (newStatus) => {
    if (!selectedOrder) return;
    const actorName = currentUser?.name || 'Administrator';
    const actorRole = currentRole?.name || currentUser?.role || 'Admin';

    const orderIdentifier = selectedOrder.id || selectedOrder._id;
    const success = await updateOrderStatus(
      orderIdentifier,
      newStatus,
      carrier,
      trackingNumber,
      updateNote || `Transitioned order status to ${newStatus}`
    );

    if (success) {
      const nowIso = new Date().toISOString();
      const newStep = {
        status: newStatus,
        timestamp: nowIso,
        actor: actorName,
        actorName,
        actorRole,
        carrier,
        trackingNumber,
        note: updateNote || `Status updated to ${newStatus}`,
      };

      const newAct = {
        id: `act-${Date.now()}`,
        _id: `act-${Date.now()}`,
        action: newStatus === 'processing' ? 'ORDER_CONFIRMED' : 'STATUS_UPDATED',
        previousStatus: selectedOrder.status,
        newStatus,
        carrier,
        trackingNumber,
        notes: updateNote || `Status updated to ${newStatus}`,
        timestamp: nowIso,
        actorName,
        actorRole,
      };

      // Optimistically update local order
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderIdentifier || o._id === orderIdentifier
            ? {
                ...o,
                status: newStatus,
                carrier,
                trackingNumber,
                updatedByName: actorName,
                confirmedByName:
                  newStatus === 'processing' && !o.confirmedByName ? actorName : o.confirmedByName,
                lastActivity: {
                  actorName,
                  actorRole,
                  action: newStatus === 'processing' ? 'ORDER_CONFIRMED' : 'STATUS_UPDATED',
                  previousStatus: o.status,
                  newStatus,
                  carrier,
                  trackingNumber,
                  note: updateNote || `Status updated to ${newStatus}`,
                  timestamp: nowIso,
                },
                activities: [newAct, ...(o.activities || [])],
                timeline: [...(o.timeline || []), newStep],
              }
            : o
        )
      );

      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              carrier,
              trackingNumber,
              updatedByName: actorName,
              confirmedByName:
                newStatus === 'processing' && !prev.confirmedByName ? actorName : prev.confirmedByName,
              lastActivity: {
                actorName,
                actorRole,
                action: newStatus === 'processing' ? 'ORDER_CONFIRMED' : 'STATUS_UPDATED',
                previousStatus: prev.status,
                newStatus,
                carrier,
                trackingNumber,
                note: updateNote || `Status updated to ${newStatus}`,
                timestamp: nowIso,
              },
              activities: [newAct, ...(prev.activities || [])],
              timeline: [...(prev.timeline || []), newStep],
            }
          : null
      );

      setUpdateNote('');
      fetchOrdersFromApi(true);
    }
  };

  const handleProcessRefund = async () => {
    if (!selectedOrder) return;
    const actorName = currentUser?.name || 'Administrator';
    const actorRole = currentRole?.name || currentUser?.role || 'Admin';

    const orderIdentifier = selectedOrder.id || selectedOrder._id;
    const success = await cancelAndRefundOrder(
      orderIdentifier,
      refundReason || 'Customer requested return/cancellation'
    );

    if (success) {
      const nowIso = new Date().toISOString();
      const newAct = {
        id: `act-${Date.now()}`,
        _id: `act-${Date.now()}`,
        action: 'ORDER_CANCELLED',
        previousStatus: selectedOrder.status,
        newStatus: 'cancelled',
        notes: refundReason || 'Order cancelled and refunded',
        timestamp: nowIso,
        actorName,
        actorRole,
      };

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderIdentifier || o._id === orderIdentifier
            ? {
                ...o,
                status: 'cancelled',
                paymentStatus: 'refunded',
                updatedByName: actorName,
                lastActivity: {
                  actorName,
                  actorRole,
                  action: 'ORDER_CANCELLED',
                  previousStatus: o.status,
                  newStatus: 'cancelled',
                  note: refundReason || 'Order cancelled and refunded',
                  timestamp: nowIso,
                },
                activities: [newAct, ...(o.activities || [])],
                timeline: [
                  ...(o.timeline || []),
                  {
                    status: 'cancelled',
                    timestamp: nowIso,
                    actor: actorName,
                    actorName,
                    actorRole,
                    note: `Refunded: ${refundReason || 'Order cancelled and refunded'}`,
                  },
                ],
              }
            : o
        )
      );

      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: 'cancelled',
              paymentStatus: 'refunded',
              updatedByName: actorName,
              lastActivity: {
                actorName,
                actorRole,
                action: 'ORDER_CANCELLED',
                previousStatus: prev.status,
                newStatus: 'cancelled',
                note: refundReason || 'Order cancelled and refunded',
                timestamp: nowIso,
              },
              activities: [newAct, ...(prev.activities || [])],
              timeline: [
                ...(prev.timeline || []),
                {
                  status: 'cancelled',
                  timestamp: nowIso,
                  actor: actorName,
                  actorName,
                  actorRole,
                  note: `Refunded: ${refundReason || 'Order cancelled and refunded'}`,
                },
              ],
            }
          : null
      );
      setShowRefundConfirm(false);
      setRefundReason('');
      fetchOrdersFromApi(true);
    }
  };

  const exportOrdersCSV = () => {
    if (!assertPermission('orders.export', 'Export Orders Manifest to CSV')) return;

    const headers = ['Order ID,Customer,Email,Total,Status,Payment,Tracking,Created Date\n'];
    const rows = filteredAndSortedOrders.map(
      (o) =>
        `"${o.id || o._id}","${o.customerName}","${o.customerEmail}",${o.total},"${o.status}","${
          o.paymentStatus
        }","${o.trackingNumber || ''}","${o.createdAt}"\n`
    );

    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('createdAt_desc');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <OrdersHeader
        onExportOrders={exportOrdersCSV}
        onRefresh={() => fetchOrdersFromApi(true)}
        isRefreshing={isRefreshing || isLoading}
        totalCount={computedStats.total}
        lastUpdated={lastUpdated}
      />

      {/* API Error Notification Banner */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center justify-between text-xs text-rose-800 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Failed to load orders from API: {error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchOrdersFromApi(false)}
            className="px-2.5 py-1 bg-rose-600 text-white font-medium rounded-md hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* KPI Stats Cards - Double as Quick Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Orders Card */}
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-md ring-2 ring-indigo-500/30 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
              : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Total Orders</span>
            <Package className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="text-xl font-bold tracking-tight">{computedStats.total}</div>
          <div className="text-[10px] text-zinc-400 mt-1">Platform volume</div>
        </div>

        {/* Total Revenue Card */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Gross Sales</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            ${Number(computedStats.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Net non-cancelled</div>
        </div>

        {/* Pending Card */}
        <div
          onClick={() => setStatusFilter('pending')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30'
              : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:border-amber-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[11px] font-medium ${statusFilter === 'pending' ? 'text-amber-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
              Pending
            </span>
            <Clock className={`w-3.5 h-3.5 ${statusFilter === 'pending' ? 'text-white' : 'text-amber-500'}`} />
          </div>
          <div className="text-xl font-bold tracking-tight">{computedStats.pending}</div>
          <div className={`text-[10px] mt-1 ${statusFilter === 'pending' ? 'text-amber-100' : 'text-amber-600 dark:text-amber-400 font-medium'}`}>
            Needs intake review
          </div>
        </div>

        {/* Processing Card */}
        <div
          onClick={() => setStatusFilter('processing')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'processing'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/30'
              : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:border-blue-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[11px] font-medium ${statusFilter === 'processing' ? 'text-blue-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
              Processing
            </span>
            <RefreshCw className={`w-3.5 h-3.5 ${statusFilter === 'processing' ? 'text-white' : 'text-blue-500'}`} />
          </div>
          <div className="text-xl font-bold tracking-tight">{computedStats.processing}</div>
          <div className={`text-[10px] mt-1 ${statusFilter === 'processing' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400 font-medium'}`}>
            In fulfillment
          </div>
        </div>

        {/* Shipped Card */}
        <div
          onClick={() => setStatusFilter('shipped')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'shipped'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/30'
              : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[11px] font-medium ${statusFilter === 'shipped' ? 'text-indigo-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
              Shipped
            </span>
            <Truck className={`w-3.5 h-3.5 ${statusFilter === 'shipped' ? 'text-white' : 'text-indigo-500'}`} />
          </div>
          <div className="text-xl font-bold tracking-tight">{computedStats.shipped}</div>
          <div className={`text-[10px] mt-1 ${statusFilter === 'shipped' ? 'text-indigo-100' : 'text-indigo-600 dark:text-indigo-400 font-medium'}`}>
            With carrier partner
          </div>
        </div>

        {/* Delivered Card */}
        <div
          onClick={() => setStatusFilter('delivered')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'delivered'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
              : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[11px] font-medium ${statusFilter === 'delivered' ? 'text-emerald-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
              Delivered
            </span>
            <CheckCircle2 className={`w-3.5 h-3.5 ${statusFilter === 'delivered' ? 'text-white' : 'text-emerald-500'}`} />
          </div>
          <div className="text-xl font-bold tracking-tight">{computedStats.delivered}</div>
          <div className={`text-[10px] mt-1 ${statusFilter === 'delivered' ? 'text-emerald-100' : 'text-emerald-600 dark:text-emerald-400 font-medium'}`}>
            Completed orders
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Search */}
      <OrdersFilterBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        orders={orders}
        stats={computedStats}
        sortBy={sortBy}
        setSortBy={setSortBy}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onResetFilters={handleResetFilters}
      />

      {/* Orders Table with Loading Skeleton & Pagination */}
      <OrdersTable
        orders={paginatedOrders}
        isLoading={isLoading}
        onOpenDetail={handleOpenDetail}
        currentPage={currentPage}
        totalPages={totalPages}
        totalOrders={totalOrdersCount}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onResetFilters={handleResetFilters}
      />

      {/* Order Detail & Tracking Pipeline Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        carrier={carrier}
        setCarrier={setCarrier}
        trackingNumber={trackingNumber}
        setTrackingNumber={setTrackingNumber}
        updateNote={updateNote}
        setUpdateNote={setUpdateNote}
        onAdvanceStatus={handleAdvanceStatus}
        showRefundConfirm={showRefundConfirm}
        setShowRefundConfirm={setShowRefundConfirm}
        refundReason={refundReason}
        setRefundReason={setRefundReason}
        onProcessRefund={handleProcessRefund}
      />
    </div>
  );
};

export default OrdersView;